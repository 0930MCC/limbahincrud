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

export default function PerizinanDetailDialog({ item, onClose }) {
  if (!item) return null;
  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">{item[COL.PZ_NOMOR] || "Detail Perizinan"}</DialogTitle>
        </DialogHeader>
        <div className="mt-1">
          <Row label="Nomor" value={item[COL.PZ_NOMOR]} />
          <Row label="File Perusahaan" value={item[COL.PZ_FILEPERUSAHAAN]} />
          <Row label="Jenis Dokumen" value={item[COL.PZ_JENISDOKUMEN]} />
          <Row label="Klasifikasi" value={item[COL.PZ_KLASIFIKASI]} />
          <Row label="Lembaga" value={item[COL.PZ_LEMBAGA]} />
          <Row label="Tanggal Mulai" value={formatDateShort(item[COL.PZ_TGLMULAI])} />
          <Row label="Tanggal Expired" value={formatDateShort(item[COL.PZ_TGLEXPIRED])} />
          <Row label="Kode Limbah" value={item[COL.PZ_KODELIMBAH]} />
          <Row label="Total Kode" value={item[COL.PZ_TOTALKODE]} />
          <FileLink label="Link Dokumen" url={item[COL.PZ_LINKDOKUMEN]} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
