import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { COL } from "@/lib/sheets";
import { parseDate } from "@/lib/format";
import { ExternalLink } from "lucide-react";

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-[11px] uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-sm text-slate-800 dark:text-slate-200">{value}</span>
    </div>
  );
}

export default function PickupDetailDialog({ pickup, onClose }) {
  if (!pickup) return null;
  const d = parseDate(pickup[COL.D_DATE]);
  const dateStr = d ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : pickup[COL.D_DATE];
  const weight = `${pickup[COL.D_WEIGHT] || "-"} ${pickup[COL.D_SATUAN] || ""}`.trim();
  const link = pickup[COL.D_FESTRONIK2];
  const link2 = pickup[COL.D_FESTRONIK3];

  return (
    <Dialog open={!!pickup} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Detail Pengambilan</DialogTitle>
        </DialogHeader>
        <div className="mt-1">
          <Row label="Nama Klien" value={pickup[COL.D_KLIEN]} />
          <Row label="Input Type" value={pickup[COL.D_INPUTTYPE]} />
          <Row label="Urutan/Nomor" value={pickup[COL.D_URUTAN]} />
          <Row label="Item Code" value={pickup[COL.D_ITEMCODE]} />
          <Row label="Definisi Item" value={pickup[COL.D_DEFINISI]} />
          <Row label="WC" value={pickup[COL.D_WC]} />
          <Row label="Kendaraan" value={pickup[COL.D_KENDARAAN]} />
          <Row label="Tanggal & Jumlah" value={`${dateStr} — ${weight}`} />
          <Row label="[MUAT] Kemasan" value={pickup[COL.D_KEMASAN]} />
          <Row label="[MUAT] Internal Reference" value={pickup[COL.D_INTREF]} />
          <Row label="[MUAT] External Reference" value={pickup[COL.D_EXTREF]} />
          <Row label="Catatan Pelanggan" value={pickup[COL.D_CATATAN]} />
          <DialogTitle className="text-sm font-semibold text-right">Link Dokumen File</DialogTitle>
          {/* <FileLink label="Dokumen File Festronik" url={pickup[COL.D_FESTRONIK2]} /> */}


          {link && /^https?:\/\//.test(link) && (
            <div className="flex flex-col py-1.5">
              <span className="text-[11px] uppercase tracking-wide text-slate-400">Link Document</span>
              <a href={link} target="_blank" rel="noreferrer" className="text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                Festronik<ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
          {link2 && /^https?:\/\//.test(link2) && (
            <div className="flex flex-col py-1.5">
              <span className="text-[11px] uppercase tracking-wide text-slate-400">Link Document</span>
              <a href={link2} target="_blank" rel="noreferrer" className="text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                Festronik Final <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}