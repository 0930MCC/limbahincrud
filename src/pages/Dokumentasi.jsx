import React from "react";
import { useOutletContext } from "react-router-dom";
import { useTabData } from "@/lib/usePortalData";
import PageHeader from "@/components/portal/PageHeader";
import DokumentasiTable from "@/components/portal/DokumentasiTable";
import TabLoader from "@/components/portal/TabLoader";

export default function Dokumentasi() {
  const { session } = useOutletContext();
  const { values, loading, error, sessionExpired, timedOut, reload } = useTabData("dokumentasi", session);

  return (
    <div>
      <PageHeader
        title="File & Dokumen"
        subtitle="Dokumentasi foto & video operasional terkait layanan Anda"
      />
      <TabLoader loading={loading} error={error} sessionExpired={sessionExpired} timedOut={timedOut} reload={reload}>
        <DokumentasiTable items={values.dokumentasi || []} />
      </TabLoader>
    </div>
  );
}
