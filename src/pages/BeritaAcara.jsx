import React from "react";
import { useOutletContext } from "react-router-dom";
import { useTabData } from "@/lib/usePortalData";
import PageHeader from "@/components/portal/PageHeader";
import BeritaAcaraTable from "@/components/portal/BeritaAcaraTable";
import TabLoader from "@/components/portal/TabLoader";

export default function BeritaAcara() {
  const { session } = useOutletContext();
  const { values, loading, error, sessionExpired, timedOut, reload } = useTabData("ba", session);

  return (
    <div>
      <PageHeader
        title="Berita Acara"
        subtitle="Daftar berita acara serah terima limbah B3"
      />
      <TabLoader loading={loading} error={error} sessionExpired={sessionExpired} timedOut={timedOut} reload={reload}>
        <BeritaAcaraTable items={values.ba || []} />
      </TabLoader>
    </div>
  );
}
