import React from "react";
import { useOutletContext } from "react-router-dom";
import { useTabData } from "@/lib/usePortalData";
import PageHeader from "@/components/portal/PageHeader";
import PerizinanTable from "@/components/portal/PerizinanTable";
import TabLoader from "@/components/portal/TabLoader";

export default function Perizinan() {
  const { session } = useOutletContext();
  const { values, loading, error, sessionExpired, timedOut, reload } = useTabData("perizinan", session);

  return (
    <div>
      <PageHeader
        title="Perizinan"
        subtitle="Daftar dokumen perizinan terkait layanan Anda"
      />
      <TabLoader loading={loading} error={error} sessionExpired={sessionExpired} timedOut={timedOut} reload={reload}>
        <PerizinanTable items={values.perizinan || []} />
      </TabLoader>
    </div>
  );
}
