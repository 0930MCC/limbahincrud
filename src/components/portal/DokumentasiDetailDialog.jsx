import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { parseDate } from "@/lib/format";
import { COL } from "@/lib/sheets";
import { parseLinkCell } from "@/lib/driveLinks";
import { PlayCircle, Image as ImageIcon, ExternalLink } from "lucide-react";

// A single thumbnail tile. Clicking anywhere on it opens the ORIGINAL link
// (Drive viewer/player) in a new tab — the thumbnail is just a preview.
export function MediaThumb({ preview, kind }) {
  const [failed, setFailed] = useState(false);
  const Icon = kind === "video" ? PlayCircle : ImageIcon;

  return (
    <a
      href={preview.url}
      target="_blank"
      rel="noreferrer"
      className="relative group aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
      title="Buka di tab baru"
    >
      {!failed ? (
        <img
          src={preview.thumbUrl}
          alt={kind === "video" ? "Video preview" : "Photo preview"}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
          loading="lazy"
        />
      ) : (
        <Icon className="w-8 h-8 text-slate-400" />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
        {kind === "video" && !failed && (
          <PlayCircle className="w-9 h-9 text-white/0 group-hover:text-white/90 transition drop-shadow" />
        )}
        <ExternalLink className="w-3.5 h-3.5 text-white/0 group-hover:text-white/90 transition absolute top-1.5 right-1.5" />
      </div>
    </a>
  );
}

export function MediaSection({ title, kind, previews }) {
  if (previews.length === 0) return null;
  return (
    <div className="mt-3">
      <span className="text-[11px] uppercase tracking-wide text-slate-400">{title} ({previews.length})</span>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1.5">
        {previews.map((p, i) => (
          <MediaThumb key={p.url + i} preview={p} kind={kind} />
        ))}
      </div>
    </div>
  );
}

export default function DokumentasiDetailDialog({ item, onClose }) {
  if (!item) return null;

  const date = parseDate(item[COL.DOK_DATE]);
  const photos = parseLinkCell(item[COL.DOK_PHOTO]);
  const videos = parseLinkCell(item[COL.DOK_VIDEO]);

  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">
            {item[COL.DOK_ID] || "Detail Dokumentasi"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-1">
          <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[11px] uppercase tracking-wide text-slate-400">Tanggal Operasional</span>
            <span className="text-sm text-slate-800 dark:text-slate-200">
              {date ? date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : item[COL.DOK_DATE] || "-"}
            </span>
          </div>
          <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
            <span className="text-[11px] uppercase tracking-wide text-slate-400">Description</span>
            <span className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{item[COL.DOK_DESC] || "-"}</span>
          </div>

          <MediaSection title="Video" kind="video" previews={videos} />
          <MediaSection title="Foto" kind="photo" previews={photos} />

          {photos.length === 0 && videos.length === 0 && (
            <div className="text-center py-4 text-xs text-slate-400">Tidak ada foto atau video terlampir.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
