import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Download, FileText, ChevronUp, ChevronDown, Search, Loader2 } from 'lucide-react';
import { extractDriveId } from '@/lib/driveLinks';

// Requires `pdfjs-dist` (npm install pdfjs-dist). Loaded lazily (inside the effect below) so pages
// that never open a preview never pay for it.
let pdfjsLibPromise = null;
function loadPdfJs() {
  if (!pdfjsLibPromise) {
    pdfjsLibPromise = import('pdfjs-dist').then((mod) => {
      // Vite-friendly worker setup — resolves the bundled worker file at build time instead of
      // pointing at a CDN, so this keeps working offline / behind a strict CSP.
      mod.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();
      return mod;
    });
  }
  return pdfjsLibPromise;
}

// A Drive "view" link doesn't serve raw PDF bytes — this is Drive's direct-download form, which
// does for files shared "Anyone with the link". Our own generated blob: URLs (the Quotation card)
// are passed straight through untouched.
function toFetchableUrl(url) {
  if (!url) return url;
  if (url.startsWith('blob:') || url.startsWith('data:')) return url;
  const id = extractDriveId(url);
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
}

// Drive's `export=download` form is also what makes the download button work WITHOUT any
// client-side fetch/CORS: it's a plain navigation, and Drive answers it with
// `Content-Disposition: attachment`, so the browser just saves the file under Drive's own name —
// same URL toFetchableUrl() above already uses for pdf.js.
function downloadFilename(title) {
  const base = String(title || 'dokumen').trim().replace(/[\\/:*?"<>|]+/g, '-');
  return base.toLowerCase().endsWith('.pdf') ? base : `${base}.pdf`;
}

function toEmbedUrl(url) {
  const id = extractDriveId(url);
  return id ? `https://drive.google.com/file/d/${id}/preview` : url;
}

// Opened from a document card (see DocumentCards). Shows the PDF full-screen inside the app via
// pdf.js (canvas + a real text layer, so browser-style Ctrl/Cmd+F-alike search works against the
// actual PDF text) with "Buka di tab baru" as an escape hatch. If the file can't be fetched as raw
// bytes client-side — most likely a cross-origin block on a Drive-hosted contract PDF that isn't
// ours to control — this quietly falls back to the previous Drive `/preview` iframe embed, just
// without the search bar (a locally-generated Quotation blob: URL never hits this path).
// Rendered through a portal straight onto <body> — this is a full-screen viewer opened from deep
// inside the page's component tree (DocumentCards, itself inside CustForm's normal layout), and a
// portal is what guarantees `position: fixed` actually covers the ENTIRE viewport no matter what
// an ancestor further up that tree does (a transform/filter/etc. on any ancestor turns it into
// that ancestor's containing block instead of the viewport's, which is what let a sliver of the
// page underneath — e.g. CustFormTopBar's desktop bar — show through above this dialog).
export default function DocumentPreviewDialog({ open, onClose, title, url }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const textLayerRef = useRef(null);
  const [mode, setMode] = useState('loading'); // 'loading' | 'pdfjs' | 'fallback'
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [query, setQuery] = useState('');
  const [pageMatchCounts, setPageMatchCounts] = useState([]); // index 0 = page 1
  const [activeMatch, setActiveMatch] = useState(0); // 0-based index into the flattened match list
  const [searching, setSearching] = useState(false);

  // ---- Load the document (pdf.js path, falling back to the iframe embed on any failure) -------
  useEffect(() => {
    if (!open || !url) return;
    let cancelled = false;
    setMode('loading');
    setPdfDoc(null);
    setNumPages(0);
    setPageNum(1);
    setQuery('');
    setPageMatchCounts([]);
    setActiveMatch(0);

    (async () => {
      try {
        const pdfjsLib = await loadPdfJs();
        const loadingTask = pdfjsLib.getDocument(toFetchableUrl(url));
        const doc = await loadingTask.promise;
        if (cancelled) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setMode('pdfjs');
      } catch (err) {
        console.warn('DocumentPreviewDialog: pdf.js load failed, falling back to iframe embed.', err);
        if (!cancelled) setMode('fallback');
      }
    })();

    return () => { cancelled = true; };
  }, [open, url]);

  // ---- Render the current page onto the canvas + build its text layer --------------------------
  useEffect(() => {
    if (mode !== 'pdfjs' || !pdfDoc || !canvasRef.current) return;
    let cancelled = false;

    (async () => {
      const page = await pdfDoc.getPage(pageNum);
      if (cancelled) return;
      const containerWidth = containerRef.current?.clientWidth || 800;
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = Math.min(2.2, (containerWidth - 32) / baseViewport.width);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      await page.render({ canvasContext: ctx, viewport }).promise;
      if (cancelled) return;

      // Manual text layer: one absolutely-positioned span per text item, matched against `query`.
      const textContent = await page.getTextContent();
      const layer = textLayerRef.current;
      if (!layer) return;
      layer.style.width = `${viewport.width}px`;
      layer.style.height = `${viewport.height}px`;
      layer.innerHTML = '';

      const q = query.trim().toLowerCase();
      let matchCursor = 0;
      // How many matches on earlier pages, so highlighting can tell "the active one" apart.
      const priorMatches = pageMatchCounts.slice(0, pageNum - 1).reduce((a, b) => a + b, 0);

      textContent.items.forEach((item) => {
        if (!item.str) return;
        const tx = pdfjsApplyTransform(item.transform, viewport);
        const span = document.createElement('span');
        span.style.position = 'absolute';
        span.style.left = `${tx.x}px`;
        span.style.top = `${tx.y}px`;
        span.style.fontSize = `${tx.fontSize}px`;
        span.style.transform = `scaleX(${tx.scaleX})`;
        span.style.transformOrigin = '0 0';
        span.style.whiteSpace = 'pre';
        span.style.color = 'transparent';
        span.style.lineHeight = '1';

        if (q && item.str.toLowerCase().includes(q)) {
          const lower = item.str.toLowerCase();
          let html = '';
          let cursor = 0;
          let idx = lower.indexOf(q);
          while (idx !== -1) {
            html += escapeHtml(item.str.slice(cursor, idx));
            const isActive = priorMatches + matchCursor === activeMatch;
            html += `<mark class="${isActive ? 'bg-orange-400' : 'bg-yellow-300'}" style="color:transparent">${escapeHtml(item.str.slice(idx, idx + q.length))}</mark>`;
            matchCursor += 1;
            cursor = idx + q.length;
            idx = lower.indexOf(q, cursor);
          }
          html += escapeHtml(item.str.slice(cursor));
          span.innerHTML = html;
        } else {
          span.textContent = item.str;
        }
        layer.appendChild(span);
      });
    })();

    return () => { cancelled = true; };
  }, [mode, pdfDoc, pageNum, query, activeMatch, pageMatchCounts]);

  // ---- Scan every page for match counts whenever the query changes -----------------------------
  useEffect(() => {
    if (mode !== 'pdfjs' || !pdfDoc) return;
    const q = query.trim().toLowerCase();
    if (!q) {
      setPageMatchCounts(new Array(numPages).fill(0));
      setActiveMatch(0);
      return;
    }
    let cancelled = false;
    setSearching(true);
    (async () => {
      const counts = [];
      for (let p = 1; p <= numPages; p += 1) {
        if (cancelled) return;
        const page = await pdfDoc.getPage(p);
        const content = await page.getTextContent();
        const text = content.items.map((i) => i.str).join(' ').toLowerCase();
        let count = 0;
        let idx = text.indexOf(q);
        while (idx !== -1) { count += 1; idx = text.indexOf(q, idx + q.length); }
        counts.push(count);
      }
      if (cancelled) return;
      setPageMatchCounts(counts);
      setActiveMatch(0);
      // Jump to the first page that actually has a match.
      const firstHit = counts.findIndex((c) => c > 0);
      if (firstHit !== -1) setPageNum(firstHit + 1);
      setSearching(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, mode, pdfDoc, numPages]);

  // Body scroll is locked while open — without it, a touch-scroll on the page underneath can, on
  // some mobile browsers, visibly shift before the portal paints on top of it. OverlayLayer (the
  // step wizards) already does this; this dialog didn't.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const totalMatches = pageMatchCounts.reduce((a, b) => a + b, 0);

  const goToMatch = (delta) => {
    if (totalMatches === 0) return;
    const next = (activeMatch + delta + totalMatches) % totalMatches;
    setActiveMatch(next);
    // Figure out which page that match index falls on.
    let cursor = 0;
    for (let p = 0; p < pageMatchCounts.length; p += 1) {
      if (next < cursor + pageMatchCounts[p]) { setPageNum(p + 1); return; }
      cursor += pageMatchCounts[p];
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-background"
      style={{ top: 0, right: 0, bottom: 0, left: 0, height: '100dvh', minHeight: '100vh' }}
    >
      <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-card px-3 py-2.5 sm:px-4 sm:py-3">
        <FileText className="h-5 w-5 shrink-0 text-primary" />
        <p className="min-w-0 flex-1 truncate font-display text-sm font-bold text-foreground">{title}</p>

        {mode === 'pdfjs' && (
          <div className="flex items-center gap-1 order-3 w-full sm:order-none sm:w-auto">
            <div className="flex flex-1 items-center gap-1.5 rounded-lg border border-border bg-background px-2 py-1">
              <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') goToMatch(e.shiftKey ? -1 : 1);
                }}
                placeholder="Cari kata dalam dokumen..."
                className="w-full min-w-0 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
              />
              {searching && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />}
            </div>
            {query.trim() && !searching && (
              <>
                <span className="shrink-0 text-[11px] text-muted-foreground px-1 tabular-nums">
                  {totalMatches ? `${activeMatch + 1}/${totalMatches}` : '0/0'}
                </span>
                <button
                  type="button"
                  onClick={() => goToMatch(-1)}
                  disabled={!totalMatches}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted disabled:opacity-40"
                  aria-label="Hasil sebelumnya"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => goToMatch(1)}
                  disabled={!totalMatches}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted disabled:opacity-40"
                  aria-label="Hasil berikutnya"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        )}

        <a
          href={toFetchableUrl(url)}
          download={downloadFilename(title)}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/10"
        >
          <Download className="h-3.5 w-3.5" />
          Unduh
        </a>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/5"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Tab Baru
        </a>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {mode === 'pdfjs' && numPages > 1 && (
        <div className="flex shrink-0 items-center justify-center gap-3 border-b border-border bg-muted/30 px-4 py-1.5">
          <button
            type="button"
            onClick={() => setPageNum((p) => Math.max(1, p - 1))}
            disabled={pageNum <= 1}
            className="text-[11px] font-semibold text-primary disabled:opacity-40"
          >
            ← Sebelumnya
          </button>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            Halaman {pageNum} / {numPages}
          </span>
          <button
            type="button"
            onClick={() => setPageNum((p) => Math.min(numPages, p + 1))}
            disabled={pageNum >= numPages}
            className="text-[11px] font-semibold text-primary disabled:opacity-40"
          >
            Berikutnya →
          </button>
        </div>
      )}

      <div ref={containerRef} className="flex-1 overflow-auto bg-muted/30">
        {mode === 'loading' && (
          <div className="flex h-full w-full items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Memuat dokumen...
          </div>
        )}

        {mode === 'pdfjs' && (
          <div className="flex justify-center py-4">
            <div className="relative inline-block shadow-md">
              <canvas ref={canvasRef} className="block" />
              <div ref={textLayerRef} className="absolute inset-0 overflow-hidden" style={{ lineHeight: 1 }} />
            </div>
          </div>
        )}

        {mode === 'fallback' && (
          <iframe title={title} src={toEmbedUrl(url)} className="h-full w-full border-0" />
        )}
      </div>
    </div>,
    document.body
  );
}

// pdf.js text-item transforms are [scaleX, skewX, skewY, scaleY, x, y] in PDF space (origin
// bottom-left); this converts one item's transform into the viewport's screen-space (origin
// top-left) top-left corner + font size, the same math pdf.js's own text layer builder uses.
function pdfjsApplyTransform(itemTransform, viewport) {
  const m = viewport.transform;
  // Combine the page's viewport transform with the item's own transform.
  const a = itemTransform[0] * m[0] + itemTransform[1] * m[2];
  const b = itemTransform[0] * m[1] + itemTransform[1] * m[3];
  const c = itemTransform[2] * m[0] + itemTransform[3] * m[2];
  const d = itemTransform[2] * m[1] + itemTransform[3] * m[3];
  const e = itemTransform[4] * m[0] + itemTransform[5] * m[2] + m[4];
  const f = itemTransform[4] * m[1] + itemTransform[5] * m[3] + m[5];
  const fontSize = Math.hypot(a, b);
  return { x: e, y: f - fontSize, scaleX: fontSize ? Math.hypot(c, d) / fontSize : 1, fontSize };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
