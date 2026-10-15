import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Building2, Truck, Scale, FileText } from "lucide-react";
import { COL, parseNum } from "@/lib/sheets";
import { parseDate, formatKg } from "@/lib/format";
import { useTabData } from "@/lib/usePortalData";
import StatCard from "@/components/portal/StatCard";
import DashboardCharts from "@/components/portal/DashboardCharts";
import PickupTable from "@/components/portal/PickupTable";
import PageHeader from "@/components/portal/PageHeader";
import WaButton from "@/components/portal/WaButton";
import TabLoader from "@/components/portal/TabLoader";

export default function Dashboard() {
  const { session } = useOutletContext();
  const { values, loading, error, sessionExpired, timedOut, reload } = useTabData(["branch", "mou", "data"], session);
  const branches = values.branch || [];
  const mous = values.mou || [];
  const pickups = values.data || [];

  const totalWeight = useMemo(() => pickups.reduce((s, p) => s + parseNum(p[COL.D_WEIGHT]), 0), [pickups]);
  const activeMou = useMemo(() => {
    const now = new Date();
    return mous.filter((m) => { const d = parseDate(m[COL.M_END]); return d && d >= now; }).length;
  }, [mous]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Ringkasan aktivitas pengelolaan limbah B3"
        action={<WaButton code="BTN10" label="Request Pengambilan" message="Halo, saya ingin request pengambilan limbah B3." />}
      />
      <TabLoader loading={loading} error={error} sessionExpired={sessionExpired} timedOut={timedOut} reload={reload}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard label="Branch" value={branches.length} sub="Lokasi layanan" icon={Building2} />
          <StatCard label="Total Pengambilan" value={pickups.length} sub="Seluruh transaksi" icon={Truck} accent="green" />
          <StatCard label="Total Berat" value={`${formatKg(Math.round(totalWeight))} Kg`} sub="Akumulasi limbah" icon={Scale} />
          <StatCard label="MOU Aktif" value={activeMou} sub={`${mous.length - activeMou} tidak aktif`} icon={FileText} accent="amber" />
        </div>
        <div className="mb-6">
          <DashboardCharts pickups={pickups} branches={branches} />
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <PickupTable pickups={pickups} />
        </div>
      </TabLoader>
    </div>
  );
}