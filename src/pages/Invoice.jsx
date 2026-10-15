import React, { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { COL } from "@/lib/sheets";
import { useTabData } from "@/lib/usePortalData";
import PageHeader from "@/components/portal/PageHeader";
import InvoiceTable from "@/components/portal/InvoiceTable";
import TabLoader from "@/components/portal/TabLoader";

function isPaid(inv) {
  const s = inv[COL.I_STATUS] || "";
  return /paid|bayar|lunas/i.test(s) && !/not paid|belum/i.test(s);
}

function isIssue(inv) {
  const s = inv[COL.I_STATUS] || "";
  return /issue/i.test(s);
}

export default function Invoice({ office = false }) {
  const { session } = useOutletContext();
  const [tab, setTab] = useState("all");

  const { values, loading, error, sessionExpired, timedOut, reload } = useTabData("invoice", session);
  const rawInvoices = values.invoice || [];
  // Worker portal only — rows with no invoice file uploaded yet are hidden rather than shown as
  // an empty/broken file link. The client-facing view (office=false) still shows every invoice.
  const invoices = useMemo(
    () => (office ? rawInvoices.filter((inv) => String(inv[COL.I_INVFILE] || "").trim() !== "") : rawInvoices),
    [rawInvoices, office]
  );

  const { all, paid, unpaid, issue } = useMemo(() => {
    const p = [], u = [], iss = [];
    invoices.forEach((i) => {
      if (isPaid(i)) p.push(i);
      else if (isIssue(i)) iss.push(i);
      else u.push(i);
    });
    return { all: invoices, paid: p, unpaid: u, issue: iss };
  }, [invoices]);

  const list = tab === "paid" ? paid : tab === "unpaid" ? unpaid : tab === "issue" ? issue : all;

  return (
    <div>
      <PageHeader
        title={office ? "Invoice & Allocation" : "Invoice"}
        subtitle={office ? "Invoice yang Anda tangani beserta allocation" : "Daftar invoice pembayaran layanan"}
      />
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {[
          ["all", `Semua (${all.length})`],
          ["paid", `Paid (${paid.length})`],
          ["unpaid", `Unpaid (${unpaid.length})`],
          ["issue", `Issue (${issue.length})`],
        ].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              tab === k ? "bg-brand-600 text-white" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <TabLoader loading={loading} error={error} sessionExpired={sessionExpired} timedOut={timedOut} reload={reload}>
        <InvoiceTable invoices={list} showCommission={office} />
      </TabLoader>
    </div>
  );
}