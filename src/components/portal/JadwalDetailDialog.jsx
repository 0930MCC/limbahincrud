import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { COL } from "@/lib/sheets";
import { formatDateShort } from "@/lib/format";
import { jadwalSource, jadwalStatus, urutanTimeHint } from "@/lib/jadwal";
import { ExternalLink } from "lucide-react";

function Row({ label, value, hint }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-[11px] uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-sm text-slate-800 dark:text-slate-200">{value}</span>
      {hint && <span className="text-[11px] text-slate-400 mt-0.5">{hint}</span>}
    </div>
  );
}

// role: "client" hides Marketing/Petugas/Kendaraan — internal ops detail the client doesn't need
// to see. "office" (worker mode) sees everything.
export default function JadwalDetailDialog({ item, role, onClose }) {
  if (!item) return null;
  const mapLink = item[COL.J_MAPLINK];

  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">{item[COL.J_CUSTNAME] || item[COL.J_ID] || "Detail Jadwal"}</DialogTitle>
        </DialogHeader>
        <div className="mt-1">
          <Row label="ID Jadwal" value={item[COL.J_ID]} />
          <Row label="Cust ID" value={item[COL.J_CUSTID]} />
          <Row label="Nama Klien" value={item[COL.J_CUSTNAME]} />
          <Row label="Tanggal" value={formatDateShort(item[COL.J_TANGGAL])} />
          <Row label="Urutan" value={item[COL.J_URUTAN]} hint={urutanTimeHint(item[COL.J_URUTAN])} />
          <Row label="Sumber" value={jadwalSource(item)} />
          <Row label="Status" value={jadwalStatus(item)} />
          <Row label="Diminta Oleh" value={item[COL.J_REQOLEH]} />
          <Row label="Catatan Manual" value={item[COL.J_CATATAN]} />
          {role !== "client" && <Row label="Marketing" value={item[COL.J_MARKETING]} />}
          {role !== "client" && <Row label="Petugas" value={item[COL.J_PETUGAS]} />}
          {role !== "client" && <Row label="Kendaraan" value={item[COL.J_KENDARAAN]} />}
          <Row label="Rescheduled — Alasan" value={item[COL.J_RESCHEDPROBLEM]} />
          <Row label="Rescheduled — Ke Jadwal" value={item[COL.J_RESCHEDID]} />
          {mapLink && /^https?:\/\//.test(mapLink) && (
            <div className="flex flex-col py-1.5">
              <span className="text-[11px] uppercase tracking-wide text-slate-400">Lokasi (Map)</span>
              <a href={mapLink} target="_blank" rel="noreferrer" className="text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                Buka di Google Maps <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
