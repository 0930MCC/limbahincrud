import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { COL } from "@/lib/sheets";
import { formatDateShort } from "@/lib/format";
import { ExternalLink } from "lucide-react";

function Row({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-[11px] uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-sm text-slate-800 dark:text-slate-200">{value}</span>
    </div>
  );
}

function FileLink({ label, url }) {
  if (!url || !/^https?:\/\//.test(url)) return null;
  return (
    <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-[11px] uppercase tracking-wide text-slate-400">{label}</span>
      <a href={url} target="_blank" rel="noreferrer" className="text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
        Buka File <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

export default function BeritaAcaraDetailDialog({ item, onClose }) {
  if (!item) return null;
  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">{item[COL.BA_ID] || "Detail Berita Acara"}</DialogTitle>
        </DialogHeader>
        <div className="mt-1">
          <Row label="BA ID" value={item[COL.BA_ID]} />
          <Row label="Periode BA" value={item[COL.BA_PERIODE]} />
          <Row label="Nama Klien" value={item[COL.BA_KLIEN]} />
          <Row label="Tanggal BA" value={formatDateShort(item[COL.BA_DATE])} />
          <Row label="Frekuensi" value={item[COL.BA_FREKUENSI]} />
          <Row label="Email Klien" value={item[COL.BA_EMAIL]} />
          <FileLink label="File BA" url={item[COL.BA_FILE]} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
