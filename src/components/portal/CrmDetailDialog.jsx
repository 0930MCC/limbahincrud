import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { COL } from "@/lib/sheets";
import { formatDateShort } from "@/lib/format";

function Row({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-[11px] uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-sm text-slate-800 dark:text-slate-200">{value}</span>
    </div>
  );
}

// role: "client" hides Marketing — same reasoning as JadwalDetailDialog.
export default function CrmDetailDialog({ item, role, onClose }) {
  if (!item) return null;
  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">{item[COL.C_ID] || "Detail Request"}</DialogTitle>
        </DialogHeader>
        <div className="mt-1">
          <Row label="ID Request" value={item[COL.C_ID]} />
          <Row label="Tanggal Request" value={formatDateShort(item[COL.C_TANGGAL])} />
          <Row label="Jenis Request" value={item[COL.C_JENIS]} />
          <Row label="ID Klien" value={item[COL.C_CUSTID]} />
          <Row label="Data Klien" value={item[COL.C_CUSTDATA]} />
          <Row label="Diminta Oleh" value={item[COL.C_REQOLEH]} />
          {role !== "client" && <Row label="Marketing" value={item[COL.C_MARKETING]} />}
          <Row label="Catatan Request" value={item[COL.C_CATATAN]} />
          <Row label="PIC" value={item[COL.C_PIC]} />
          <Row label="Solusi" value={item[COL.C_SOLUSI]} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
