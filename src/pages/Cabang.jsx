import React, { useMemo, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { COL } from "@/lib/sheets";
import { useTabData } from "@/lib/usePortalData";
import PageHeader from "@/components/portal/PageHeader";
import WaButton from "@/components/portal/WaButton";
import ClearableInput from "@/components/portal/ClearableInput";
import { EmptyState } from "@/components/portal/Loader";
import TabLoader from "@/components/portal/TabLoader";
import { MapPin, ChevronRight, Building2, Search } from "lucide-react";

export default function Cabang() {
  const { session } = useOutletContext();
  const navigate = useNavigate();
  const { values, loading, error, sessionExpired, timedOut, reload } = useTabData("branch", session);
  const branches = values.branch || [];
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return branches;
    const q = search.trim().toLowerCase();
    return branches.filter((b) =>
      String(b[COL.B_ID] || "").toLowerCase().includes(q) ||
      String(b[COL.B_NAME] || "").toLowerCase().includes(q) ||
      String(b[COL.B_FULLNAME] || "").toLowerCase().includes(q) ||
      String(b[COL.B_SINGKATAN] || "").toLowerCase().includes(q) ||
      String(b[COL.B_DAERAH] || "").toLowerCase().includes(q)
    );
  }, [branches, search]);

  return (
    <div>
      <PageHeader
        title="Cabang"
        subtitle="Pilih lokasi untuk melihat detail pengambilan"
        action={<WaButton code="BTN12" label="Penambahan Cabang" message="Halo, saya ingin menambah cabang lokasi limbah." />}
      />
      <div className="mb-4">
        <ClearableInput
          icon={Search}
          value={search}
          onChange={setSearch}
          placeholder="Cari nama cabang..."
          className="w-full sm:w-72"
        />
      </div>
      <TabLoader loading={loading} error={error} sessionExpired={sessionExpired} timedOut={timedOut} reload={reload}>
        {branches.length === 0 ? (
          <EmptyState label="Belum ada cabang terdaftar." />
        ) : filtered.length === 0 ? (
          <EmptyState label={`Tidak ada hasil untuk "${search}".`} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((b) => (
              <button
                key={b[COL.B_ID]}
                onClick={() => navigate(`/app/cabang/${encodeURIComponent(b[COL.B_ID])}`)}
                className="text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-brand-400 hover:shadow-sm transition group flex flex-col"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-600/10 text-brand-500 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500" />
                </div>
                <div className="mt-3 font-semibold text-sm text-slate-900 dark:text-slate-100">
                  {b[COL.B_ID]} - {b[COL.B_SINGKATAN] || b[COL.B_NAME]}
                </div>
                {/* Fixed-height block (2 lines) so a short name and a name
                    that wraps to 2 lines don't change the card's height. */}
                <div className="text-xs text-slate-400 mt-0.5 line-clamp-2 min-h-[2.4em] leading-snug">
                  {b[COL.B_NAME]}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-2.5">
                  <MapPin className="w-3 h-3 flex-shrink-0" /> {b[COL.B_DAERAH]}
                </div>
              </button>
            ))}
          </div>
        )}
      </TabLoader>
    </div>
  );
}
