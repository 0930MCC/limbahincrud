import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, MapPin, AlertTriangle, Info, MessageCircle } from "lucide-react";
import QuotationForm from "@/components/home/QuotationForm";
import Seo from "@/components/Seo";
import CitySearchSelect from "@/components/home/CitySearchSelect";
import { indonesianCities } from "@/data/indonesianCities";
import {
  vehicleTypes,
  estimateRoadDistanceKm,
  estimateCost,
  formatRupiah,
} from "@/utils/logisticsCalc";

const wilayahRates = [
  { no: 1, wilayah: "JABODETABEK + Kab. Bekasi", rates: [650000, 750000, 950000, 1050000, 1300000] },
  { no: 2, wilayah: "Kab. Tangerang, Kab Bogor, Karawang", rates: [650000, 750000, 950000, 1050000, 1300000] },
  { no: 3, wilayah: "Serang, Subang, Cilegon, Bandung, Indramayu", rates: [800000, 900000, 1150000, 1250000, 1550000] },
  { no: 4, wilayah: "Kabupaten Bandung, Sumedang, Majalengka", rates: [1200000, 1350000, 1600000, 1800000, 2200000] },
  { no: 5, wilayah: "Cirebon, Kabupaten Cirebon, Kuningan", rates: [1600000, 1750000, 2100000, 2350000, 2850000] },
  { no: 6, wilayah: "Brebes, Tegal, Pemalang", rates: [2800000, 3050000, 3500000, 4000000, 4800000] },
  { no: 7, wilayah: "Pekalongan, Batang", rates: [3200000, 3450000, 4000000, 4550000, 5450000] },
  { no: 8, wilayah: "Semarang, Kendal, Demak", rates: [3600000, 3900000, 4450000, 5100000, 6100000] },
  { no: 9, wilayah: "Salatiga, Solo (Surakarta), Boyolali", rates: [4400000, 4750000, 5400000, 6200000, 7400000] },
  { no: 10, wilayah: "Yogyakarta, Klaten, Magelang", rates: [4800000, 5150000, 5900000, 6750000, 8050000] },
  { no: 11, wilayah: "Madiun, Ngawi", rates: [5600000, 6000000, 6850000, 7850000, 9350000] },
  { no: 12, wilayah: "Kediri, Nganjuk", rates: [6000000, 6450000, 7300000, 8400000, 10000000] },
  { no: 13, wilayah: "Surabaya, Sidoarjo", rates: [6400000, 6850000, 7800000, 8950000, 10650000] },
  { no: 14, wilayah: "Malang, Pasuruan", rates: [6800000, 7300000, 8250000, 9500000, 11300000] },
  { no: 15, wilayah: "Lampung", rates: [7200000, 7450000, 8000000, 8550000, 9450000] },
  { no: 16, wilayah: "Palembang", rates: [8800000, 9150000, 9900000, 10750000, 12050000] },
  { no: 17, wilayah: "Medan", rates: [15600000, 16400000, 17950000, 20100000, 23100000] },
];

const columnHeaders = ["CDE 2 Ton", "CDE-LONG 3.5 Ton", "CDD 5 Ton", "DT 7 Ton", "FUSO 10 Ton"];

export default function HargaLogistik() {
  const [originName, setOriginName] = useState("");
  const [destName, setDestName] = useState("");
  const [vehicleId, setVehicleId] = useState(vehicleTypes[0].id);

  const cityByName = useMemo(() => {
    const map = new Map();
    indonesianCities.forEach((c) => map.set(c.name, c));
    return map;
  }, []);

  const selectedVehicle = vehicleTypes.find((v) => v.id === vehicleId) || vehicleTypes[0];

  const result = useMemo(() => {
    const origin = cityByName.get(originName);
    const dest = cityByName.get(destName);
    if (!origin || !dest || originName === destName) return null;
    const distanceKm = estimateRoadDistanceKm(origin, dest);
    const cost = estimateCost(distanceKm, selectedVehicle);
    return { distanceKm, cost };
  }, [originName, destName, selectedVehicle, cityByName]);

  const waMessage = result
    ? `Halo, saya ingin tanya harga & penawaran (quotation) logistik untuk rute ${originName} - ${destName}, menggunakan ${selectedVehicle.label}. Estimasi jarak ${Math.round(result.distanceKm)} km dengan estimasi biaya ${formatRupiah(result.cost)}. Mohon info harga final ya.`
    : `Halo, saya ingin tanya harga & penawaran (quotation) untuk kebutuhan logistik/pengangkutan barang saya.`;
  const waUrl = `https://api.whatsapp.com/send?phone=6281517005533&text=${encodeURIComponent(waMessage + "\n\n[BTN38]")}`;

  const schemaLogistics = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Jasa Ekspedisi & Logistik Truk LIMBAHIN",
    "provider": {
      "@type": "Organization",
      "name": "LIMBAHIN — PT Media Cahaya Cerah",
      "url": "https://www.mediacahayacerah.com"
    },
    "description": "Kalkulator tarif sewa truk dan logistik pengangkutan CDE, CDD, Fuso rute Jabodetabek, Jawa Barat, Jawa Tengah, Jawa Timur, dan Sumatera.",
    "areaServed": ["Jabodetabek", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Sumatera"]
  };

  return (
    <>
      <Seo
        title="Tarif Sewa Truk & Harga Logistik Pengangkutan Barang"
        description="Kalkulator tarif sewa truk logistik CDE, CDD, Fuso rute Jabodetabek, Jawa Barat, Jawa Tengah, Jawa Timur & Sumatera. Estimasi biaya transparan dan armada terawat."
        path="/harga-logistik"
        jsonLd={schemaLogistics}
      />
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#162930] to-[#0e2229] py-20">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "36px 36px" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#3cc0c9] text-sm font-semibold uppercase tracking-wider">Layanan Baru</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">Harga Logistik</h1>
            <p className="text-white/65 text-base max-w-xl mx-auto">
              Layanan transportasi dan logistik untuk kebutuhan pengangkutan barang Anda, kini tersedia bersama LIMBAHIN.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-16 md:py-20 bg-[#f7fafb]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#2ba5ad] mb-4">
              <Calculator className="text-white" size={26} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e]">Kalkulator Estimasi Biaya</h2>
            <p className="text-gray-500 text-sm mt-2">
              Pilih titik jemput, titik antar, dan jenis kendaraan untuk menghitung estimasi biaya.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-[#1a1a2e] mb-1.5">
                  <MapPin size={14} className="text-[#2ba5ad]" /> Titik Jemput
                </label>
                <CitySearchSelect
                  cities={indonesianCities}
                  value={originName}
                  onChange={setOriginName}
                  placeholder="Cari & pilih kota jemput"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-[#1a1a2e] mb-1.5">
                  <MapPin size={14} className="text-[#2ba5ad]" /> Titik Antar
                </label>
                <CitySearchSelect
                  cities={indonesianCities}
                  value={destName}
                  onChange={setDestName}
                  placeholder="Cari & pilih kota antar"
                />
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-[#1a1a2e] mb-3">Jenis Kendaraan</p>
              <div className="flex flex-wrap gap-2">
                {vehicleTypes.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVehicleId(v.id)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      vehicleId === v.id
                        ? "bg-[#2ba5ad] text-white border-[#2ba5ad] shadow-md shadow-[#2ba5ad]/20"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#2ba5ad] hover:text-[#2ba5ad]"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-[#1a1a2e] text-white p-6 grid grid-cols-3 divide-x divide-white/10 text-center mb-6">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-white/50 mb-1">Jarak Estimasi</p>
                <p className="text-lg font-bold text-[#3cc0c9]">
                  {result ? `${Math.round(result.distanceKm)} km` : "–"}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-white/50 mb-1">Kendaraan</p>
                <p className="text-sm md:text-base font-bold">{selectedVehicle.label}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-white/50 mb-1">Estimasi Biaya</p>
                <p className="text-lg font-bold text-[#3cc0c9]">
                  {result ? formatRupiah(result.cost) : "–"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg p-3.5 mb-3">
              <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Harga <strong>belum termasuk biaya penyebrangan kapal</strong> jika ada.
              </p>
            </div>
            <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3.5">
              <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                Harga ini hanya <strong>estimasi</strong> berdasarkan jarak antar kota. Hubungi CS kami untuk harga final.
              </p>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5a] text-white text-sm font-semibold py-3.5 rounded-xl transition-all shadow-md shadow-[#25D366]/20"
            >
              <MessageCircle size={18} /> Tanya Harga & Quotation via WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* Rate table */}
      {/* <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e]">Biaya Transport per Wilayah</h2>
            <p className="text-gray-500 text-sm mt-2">Biaya per ritase, untuk titik awal atau titik akhir di area JABODETABEK.</p>
          </motion.div>

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="bg-[#7de0e6] text-[#0e2229]">
                  <th className="px-4 py-3 text-left font-semibold">No</th>
                  <th className="px-4 py-3 text-left font-semibold">Wilayah</th>
                  {columnHeaders.map((h) => (
                    <th key={h} className="px-4 py-3 text-right font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {wilayahRates.map((row, i) => (
                  <tr key={row.no} className={i % 2 === 1 ? "bg-[#eafbfc]" : "bg-white"}>
                    <td className="px-4 py-3 text-gray-400">{row.no}</td>
                    <td className="px-4 py-3 font-semibold text-[#1a1a2e]">{row.wilayah}</td>
                    {row.rates.map((r, idx) => (
                      <td key={idx} className="px-4 py-3 text-right text-gray-600 whitespace-nowrap">
                        {r.toLocaleString("id-ID")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 space-y-1">
            <p className="text-xs text-gray-400">*Biaya per ritase, untuk titik awal atau titik akhir di area JABODETABEK.</p>
            <p className="text-xs text-gray-400">*Untuk opsi kendaraan lain silahkan hubungi CS kami.</p>
          </div>
        </div>
      </section> */}

      <QuotationForm />
    </>
  );
}
