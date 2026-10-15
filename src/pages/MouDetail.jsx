import React, { useMemo } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { COL, parseNum } from "@/lib/sheets";
import { formatKg, formatRupiah, formatDateShort } from "@/lib/format";
import { useTabData } from "@/lib/usePortalData";
import StatCard from "@/components/portal/StatCard";
import PickupTable from "@/components/portal/PickupTable";
import { EmptyState } from "@/components/portal/Loader";
import TabLoader from "@/components/portal/TabLoader";
import { Scale, Truck, Package, ArrowLeft } from "lucide-react";

export default function MouDetail({ office = false }) {
  // @ts-ignore
  const { session } = useOutletContext();
  const { mouId } = useParams();
  const navigate = useNavigate();
  const id = decodeURIComponent(mouId);

  const { values, loading, error, sessionExpired, timedOut, reload } = useTabData(["mou", "data"], session);
  const mous = values.mou || [];
  const allPickups = values.data || [];

  const mou = mous.find((m) => m[COL.M_ID] === id);
  const pickups = useMemo(() => allPickups.filter((p) => p[COL.D_MOU] === id), [allPickups, id]);
  const totalWeight = pickups.reduce((s, p) => s + parseNum(p[COL.D_WEIGHT]), 0);


  return (
    <div>
      <button onClick={() => navigate(office ? "/app/service" : "/app/mou")} className="flex items-center gap-1 text-sm text-slate-400 hover:text-brand-500 mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </button>

      <TabLoader loading={loading} error={error} sessionExpired={sessionExpired} timedOut={timedOut} reload={reload}>
        {!mou ? (
          <EmptyState label="Service tidak ditemukan." />
        ) : (
          <>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-5">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{mou[COL.M_NICK] || mou[COL.M_NAME]}</h1>
              <p className="text-sm text-slate-400 mt-0.5">{mou[COL.M_NAME]}</p>
              <div className="grid sm:grid-cols-2 gap-2 mt-4 text-sm">
                <Info label="MOU ID" value={mou[COL.M_ID]} />
                <Info label="Jenis Customer" value={mou[COL.M_JENIS]} />
                <Info label="Mulai" value={formatDateShort(mou[COL.M_START])} />
                <Info label="Berakhir" value={formatDateShort(mou[COL.M_END])} />
                <Info label="Durasi" value={mou[COL.M_DURASI]} />
                <Info label="Is Extended" value={mou[COL.M_EXTENDED]} />
                <Info label="Alamat" value={mou[COL.M_ALAMATLIMBAH]} />
                <Info label="Rincian Pelayanan" value={mou[COL.M_RINCIAN_PELAYANAN]} />
                <Info label="Pembayaran" value={mou[COL.M_PAYAMOUNT] ? formatRupiah(mou[COL.M_PAYAMOUNT]) : ""} />
                <LinkList label="Link Dokumen" value={mou[COL.M_LINKMOU]} />
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              <StatCard label="Total Pengambilan" value={pickups.length} icon={Truck} accent="green" sub={undefined} />
              <StatCard label="Total Berat" value={`${formatKg(Math.round(totalWeight))} Kg`} icon={Scale} sub={undefined} />
                         {mou[COL.M_KG_KUOTA] !== "-" && (
  <StatCard label="Sisa Kuota Limbah" value={`${mou[COL.M_KG_PAKET] || 0} / ${mou[COL.M_KG_KUOTA] || 0} ${mou[COL.M_UNIT_LIMBAH]}`} icon={Package} accent="amber" sub={undefined} />
)}
{mou[COL.M_KUNJUNGAN_KUOTA]  !== "-" && (
              <StatCard label="Sisa Kuota Kunjungan" value={`${mou[COL.M_KUNJUNGAN_PAKET] || 0} / ${mou[COL.M_KUNJUNGAN_KUOTA] || 0} rit`} icon={Package} accent="slate" sub={undefined} />
)}
           
              {/* <StatCard label="Sisa Kuota Limbah" value={`${mou[COL.M_KG_PAKET] || 0} / ${mou[COL.M_KG_KUOTA] || 0} kg`} icon={Package} accent="amber" sub={undefined} />
              <StatCard label="Sisa Kuota Kunjungan" value={`${mou[COL.M_KUNJUNGAN_PAKET] || 0} / ${mou[COL.M_KUNJUNGAN_KUOTA] || 0} rit`} icon={Package} accent="slate" sub={undefined} /> */}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <PickupTable pickups={pickups} title="Rincian Pengambilan Service" />
            </div>
          </>
        )}
      </TabLoader>
    </div>
  );
}



function Info({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col">
      <span className="text-[11px] uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-slate-700 dark:text-slate-300">{value}</span>
    </div>
  );
}

// Splits a comma-separated cell of URLs (e.g. multiple Mekari eSign links)
// and renders each as its own "File 1", "File 2", ... link that opens in a new tab.
function LinkList({ label, value }) {
  const urls = (value || "")
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);

  if (urls.length === 0) return null;

  return (
    <div className="flex flex-col">
      <span className="text-[11px] uppercase tracking-wide text-slate-400">{label}</span>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-0.5">
        {urls.map((url, i) => (
          <a
            key={url + i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-300"
          >
            File {i + 1}
          </a>
        ))}
      </div>
    </div>
  );
}


// import React, { useMemo } from "react";
// import { useOutletContext, useParams, useNavigate } from "react-router-dom";
// import { COL, parseNum } from "@/lib/sheets";
// import { formatKg, formatRupiah, formatDateShort } from "@/lib/format";
// import { useTabData } from "@/lib/usePortalData";
// import StatCard from "@/components/portal/StatCard";
// import PickupTable from "@/components/portal/PickupTable";
// import { EmptyState } from "@/components/portal/Loader";
// import TabLoader from "@/components/portal/TabLoader";
// import { Scale, Truck, Package, ArrowLeft } from "lucide-react";

// export default function MouDetail({ office = false }) {
//   // @ts-ignore
//   const { session } = useOutletContext();
//   const { mouId } = useParams();
//   const navigate = useNavigate();
//   const id = decodeURIComponent(mouId);

//   const { values, loading, error, timedOut, reload } = useTabData(["mou", "data"], session);
//   const mous = values.mou || [];
//   const allPickups = values.data || [];

//   const mou = mous.find((m) => m[COL.M_ID] === id);
//   const pickups = useMemo(() => allPickups.filter((p) => p[COL.D_MOU] === id), [allPickups, id]);
//   const totalWeight = pickups.reduce((s, p) => s + parseNum(p[COL.D_WEIGHT]), 0);

  
//   return (
//     <div>
//       <button onClick={() => navigate(office ? "/app/service" : "/app/mou")} className="flex items-center gap-1 text-sm text-slate-400 hover:text-brand-500 mb-4">
//         <ArrowLeft className="w-4 h-4" /> Kembali
//       </button>

//       <TabLoader loading={loading} error={error} sessionExpired={sessionExpired} timedOut={timedOut} reload={reload}>
//         {!mou ? (
//           <EmptyState label="Service tidak ditemukan." />
//         ) : (
//           <>
//             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-5">
//               <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{mou[COL.M_NICK] || mou[COL.M_NAME]}</h1>
//               <p className="text-sm text-slate-400 mt-0.5">{mou[COL.M_NAME]}</p>
//               <div className="grid sm:grid-cols-2 gap-2 mt-4 text-sm">
//                 <Info label="MOU ID" value={mou[COL.M_ID]} />
//                 <Info label="Jenis Customer" value={mou[COL.M_JENIS]} />
//                 <Info label="Mulai" value={formatDateShort(mou[COL.M_START])} />
//                 <Info label="Berakhir" value={formatDateShort(mou[COL.M_END])} />
//                 <Info label="Durasi" value={mou[COL.M_DURASI]} />
//                 <Info label="Is Extended" value={mou[COL.M_EXTENDED]} />
//                 <Info label="Alamat" value={mou[COL.M_ALAMATLIMBAH]} />
//                 <Info label="Rincian Pelayanan" value={mou[COL.M_RINCIAN_PELAYANAN]} />
//                 <Info label="Pembayaran" value={mou[COL.M_PAYAMOUNT] ? formatRupiah(mou[COL.M_PAYAMOUNT]) : ""} />
//                 <Info label="Link Dokumen" value={mou[COL.M_LINKMOU]} />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
//               <StatCard label="Total Pengambilan" value={pickups.length} icon={Truck} accent="green" sub={undefined} />
//               <StatCard label="Total Berat" value={`${formatKg(Math.round(totalWeight))} Kg`} icon={Scale} sub={undefined} />
//               <StatCard label="Sisa Kuota Limbah" value={`${mou[COL.M_KG_PAKET] || 0} / ${mou[COL.M_KG_KUOTA] || 0} kg`} icon={Package} accent="amber" sub={undefined} />
//               <StatCard label="Sisa Kuota Kunjungan" value={`${mou[COL.M_KUNJUNGAN_PAKET] || 0} / ${mou[COL.M_KUNJUNGAN_KUOTA] || 0} rit`} icon={Package} accent="slate" sub={undefined} />
//             </div>

//             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
//               <PickupTable pickups={pickups} title="Rincian Pengambilan Service" />
//             </div>
//           </>
//         )}
//       </TabLoader>
//     </div>
//   );
// }

// function Info({ label, value }) {
//   if (!value) return null;
//   return (
//     <div className="flex flex-col">
//       <span className="text-[11px] uppercase tracking-wide text-slate-400">{label}</span>
//       <span className="text-slate-700 dark:text-slate-300">{value}</span>
//     </div>
//   );
// }