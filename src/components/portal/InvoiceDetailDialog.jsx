import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { COL } from "@/lib/sheets";
import { formatRupiah, formatDateShort } from "@/lib/format";
import FileLinkButtons from "./FileLinkButtons";

function Row({ label, value, money }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-[11px] uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-sm text-slate-800 dark:text-slate-200">{money ? formatRupiah(value) : value}</span>
    </div>
  );
}

export default function InvoiceDetailDialog({ invoice, showCommission, onClose }) {
  if (!invoice) return null;
  return (
    <Dialog open={!!invoice} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base,">Detail Invoice</DialogTitle>
        </DialogHeader>
        <div className="mt-1">

          <Row label="Invoice ID" value={invoice[COL.I_ID]} />
          <Row label="Periode" value={invoice[COL.I_PERIODE]} />
          <Row label="Nama Klien" value={invoice[COL.I_KLIEN]} />
          <Row label="Invoice Date" value={formatDateShort(invoice[COL.I_DATE])} />
          <Row label="Jenis Invoice" value={invoice[COL.I_JENIS]} />
          <Row label="DPP" value={invoice[COL.I_DPP]} money />
          <Row label="Grand Total" value={invoice[COL.I_GRANDTOTAL]} money />
          <Row label="Paid Date" value={formatDateShort(invoice[COL.I_PAIDDATE])} />
          <Row label="Paid Amount" value={invoice[COL.I_PAIDAMOUNT]} money />
          {showCommission && <Row label="Allocation" value={invoice[COL.I_KOMISI]} money />}
          <DialogTitle className="text-sm font-semibold text-right">Link Dokumen File</DialogTitle>
          {/* Each field can hold more than one link (multiple invoice files,
              multiple adjustment files, etc). FileLinkButtons renders one
              button per link found instead of collapsing them into one. */}
          <FileLinkButtons label="Dokumen File Invoice" value={invoice[COL.I_INVFILE]} variant="text" />
          <FileLinkButtons label="File Faktur Pajak & Dokumen Pendamping" value={invoice[COL.I_ADJFILE1]} variant="text" />
          <FileLinkButtons label="File Lain (PPH dll)" value={invoice[COL.I_ADJFILE2]} variant="text" />
          <DialogTitle className="text-sm font-semibold text-right">Detil Pembayaran</DialogTitle>
          <Row label="Grand Total" value={invoice[COL.I_GRANDTOTAL]} money />
          <Row label="Paid Amount" value={invoice[COL.I_PAIDAMOUNT]} money />
          <Row label="Paid Amount" value={invoice[COL.I_ADJUSTMENTAMOUNT2]} money />
          <Row label="Selisih" value={invoice[COL.I_SISA]} money />
        </div>
      </DialogContent>
    </Dialog>
  );
}
