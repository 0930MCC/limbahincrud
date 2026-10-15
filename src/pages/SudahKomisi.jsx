import React, { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { COL } from "@/lib/sheets";
import { useTabData } from "@/lib/usePortalData";
import PageHeader from "@/components/portal/PageHeader";
import SudahKomisiTable from "@/components/portal/SudahKomisiTable";
import TabLoader from "@/components/portal/TabLoader";

// function isPaid(inv) {
//     const s = inv[COL.I_STATUS] || "";
//     return /paid|bayar|lunas/i.test(s) && !/not paid|belum/i.test(s);
// }

// function isIssue(inv) {
//     const s = inv[COL.I_STATUS] || "";
//     return /issue/i.test(s);
// }

export default function SudahKomisi({ office = false }) {
    const { session } = useOutletContext();
    const [tab, setTab] = useState("all");

    const { values, loading, error, sessionExpired, timedOut, reload } = useTabData("c1sudahtrf", session);
    const sudahkomisis = values.c1sudahtrf || [];

    const { all, paid, unpaid, issue } = useMemo(() => {
        const p = [], u = [], iss = [];
        // sudahkomisis.forEach((i) => {
        //     if (isPaid(i)) p.push(i);
        //     else if (isIssue(i)) iss.push(i);
        //     else u.push(i);
        // });
        return { all: sudahkomisis, paid: p, unpaid: u, issue: iss };
    }, [sudahkomisis]);

    const list = tab === "paid" ? paid : tab === "unpaid" ? unpaid : tab === "issue" ? issue : all;

    return (
        <div>
            <PageHeader
                title={office ? "Komisi Sudah Transfer" : "Invoice"}
                subtitle={office ? "Daftar komisi yang sudah di transfer" : "-"} action={undefined} />

            {/* <div className="flex gap-1.5 mb-3 flex-wrap">
                {[
                    ["all", `Semua (${all.length})`],
                    ["paid", `Paid (${paid.length})`],
                    ["unpaid", `Unpaid (${unpaid.length})`],
                    ["issue", `Issue (${issue.length})`],
                ].map(([k, l]) => (
                    <button
                        key={k}
                        onClick={() => setTab(k)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${tab === k ? "bg-brand-600 text-white" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500"
                            }`}
                    >
                        {l}
                    </button>
                ))}
            </div> */}
            <TabLoader loading={loading} error={error} sessionExpired={sessionExpired} timedOut={timedOut} reload={reload}>
                <SudahKomisiTable sudahkomisis={list} showCommission={office} />
            </TabLoader>
        </div>
    );
}

