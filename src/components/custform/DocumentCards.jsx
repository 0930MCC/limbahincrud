import React, { useState } from 'react';
import { FileText, Eye, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DocumentPreviewDialog from './DocumentPreviewDialog';

function formatSentAt(value) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  try {
    return d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return d.toISOString().slice(0, 16).replace('T', ' ');
  }
}

// One group = the cards of one kind of document, with THEIR email button underneath. A group only
// renders when it has at least one document — no card / file means no button.
function DocumentGroup({ title, docs, sendLabel, resendLabel, sentAt, onSend, onPreview }) {
  if (docs.length === 0) return null;
  const sent = formatSentAt(sentAt);

  return (
    <div className="space-y-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>

      {/* Cards sit in a single horizontally-scrolling row. Height is a min-height rather than a
          fixed height — some labels ("Surat Perintah Kerja (SPK)") run to two or three lines and
          a fixed height was clipping them. */}
      <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1">
        {docs.map((doc) => {
          const url = doc.pdfUrl || doc.docUrl;
          return (
            <div
              key={doc.key}
              className="flex shrink-0 snap-start flex-col items-center justify-between gap-2.5 rounded-xl border border-border bg-card p-4 shadow-sm"
              style={{ width: 148, minHeight: 188 }}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </span>
              <span className="line-clamp-3 flex-1 text-center text-[11px] font-bold leading-snug text-foreground">
                {doc.label}
              </span>
              <button
                type="button"
                onClick={() => onPreview({ title: doc.label, url })}
                className="flex w-full shrink-0 items-center justify-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-2 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/10"
              >
                <Eye className="h-3.5 w-3.5" />
                Buka &amp; Unduh
              </button>
            </div>
          );
        })}
      </div>

      <Button type="button" className="w-full" onClick={onSend}>
        <Mail className="mr-1.5 h-4 w-4" />
        {sent ? resendLabel : sendLabel}
      </Button>
      {sent && <p className="text-center text-[11px] text-muted-foreground">Terakhir dikirim: {sent}</p>}
    </div>
  );
}

// Shown under the step tiles on CustForm.jsx once at least one document exists (see
// lib/custform.js#buildDocumentList). The email buttons live HERE, under the documents they send:
//   Penawaran     -> "Kirim Penawaran"      (the quotation PDF)
//   Draf Kontrak  -> "Kirim Draf Kontrak"   (all contract documents of the row, in one email)
// Both open the same confirm-destination dialog (ConfirmEmailDialog) in the parent.
export default function DocumentCards({ documents, quotationSentAt, contractSentAt, onSendQuotation, onSendContract }) {
  const [preview, setPreview] = useState(null); // { title, url } | null
  const list = (documents || []).filter((d) => d.pdfUrl || d.docUrl);
  if (list.length === 0) return null;

  return (
    <div className="mt-6 space-y-6">
      <DocumentGroup
        title="Penawaran"
        docs={list.filter((d) => d.kind === 'quotation')}
        sendLabel="Kirim Penawaran"
        resendLabel="Kirim Ulang Penawaran"
        sentAt={quotationSentAt}
        onSend={onSendQuotation}
        onPreview={setPreview}
      />
      <DocumentGroup
        title="Draf Kontrak"
        docs={list.filter((d) => d.kind === 'contract')}
        sendLabel="Kirim Draf Kontrak"
        resendLabel="Kirim Ulang Draf Kontrak"
        sentAt={contractSentAt}
        onSend={onSendContract}
        onPreview={setPreview}
      />

      <DocumentPreviewDialog
        open={!!preview}
        onClose={() => setPreview(null)}
        title={preview?.title}
        url={preview?.url}
      />
    </div>
  );
}
