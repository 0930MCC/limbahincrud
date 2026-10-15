import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, ExternalLink, Instagram, Facebook, Youtube, Linkedin } from "lucide-react";

// Was a remote base44 URL serving the WRONG mark (generic 3-arrow recycle icon instead of
// LIMBAHIN's real 4-arrow logo) — now the same local, verified asset every other logo
// instance in the app uses.
import { LOGO_BADGE_PNG as LOGO_SYMBOL } from "@/assets/logoBadgeBase64.js";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={LOGO_SYMBOL} alt="LIMBAHIN" className="h-10 w-auto" />
              <span className="text-xl font-bold text-[#3cc0c9] tracking-tight">LIMBAHIN</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Pengelolaan limbah B3 dan jasa logistik yang berizin dan terpercaya. Dikelola oleh PT. Media Cahaya Cerah.
            </p>
            <div className="flex flex-col gap-2">
              <a href="https://linktr.ee/mediacahayacerah" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#3cc0c9] text-sm hover:underline">
                <ExternalLink size={14} /> Data & Kelengkapan
              </a>
              <a href="https://www.instagram.com/limbahin_mcc" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#3cc0c9] text-sm hover:underline">
                <Instagram size={14} /> @limbahin_mcc
              </a>
              <a href="https://www.facebook.com/profile.php?id=61593783071940" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#3cc0c9] text-sm hover:underline">
                <Facebook size={14} /> Facebook
              </a>
              <a href="https://www.youtube.com/@limbahin_mcc" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#3cc0c9] text-sm hover:underline">
                <Youtube size={14} /> YouTube
              </a>
              <a href="https://id.linkedin.com/company/mediacahayacerah" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#3cc0c9] text-sm hover:underline">
                <Linkedin size={14} /> LinkedIn
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Layanan</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/tentang" className="hover:text-[#3cc0c9] transition-colors">Tentang Kami</Link></li>
              <li><Link to="/layanan/jenis-limbah" className="hover:text-[#3cc0c9] transition-colors">Jenis Limbah</Link></li>
              <li><Link to="/layanan/proses-pelayanan" className="hover:text-[#3cc0c9] transition-colors">Proses Pelayanan</Link></li>
              <li><Link to="/layanan/proses-pelayanan#pendaftaran-form" className="hover:text-[#3cc0c9] transition-colors font-semibold">Daftar Sekarang</Link></li>
              <li><Link to="/layanan/alur-limbah" className="hover:text-[#3cc0c9] transition-colors">Alur Limbah</Link></li>
              <li><Link to="/layanan/partner-klien" className="hover:text-[#3cc0c9] transition-colors">Partner & Klien</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Harga</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/harga-limbah" className="hover:text-[#3cc0c9] transition-colors">Harga Limbah</Link></li>
              <li><Link to="/harga-logistik" className="hover:text-[#3cc0c9] transition-colors">Harga Logistik <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase ml-1">NEW</span></Link></li>
            </ul>
            <h4 className="font-semibold text-white mb-4 mt-6 text-sm uppercase tracking-wider">Bantuan</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/bantuan/faq" className="hover:text-[#3cc0c9] transition-colors">Pertanyaan Umum</Link></li>
              <li><Link to="/bantuan/karir" className="hover:text-[#3cc0c9] transition-colors">Karir</Link></li>
              <li><Link to="/artikel" className="hover:text-[#3cc0c9] transition-colors">Artikel</Link></li>
              <li><Link to="/artikel/perizinan" className="hover:text-[#3cc0c9] transition-colors">Artikel Perizinan</Link></li>
              <li><Link to="/artikel/regulasi" className="hover:text-[#3cc0c9] transition-colors">Artikel Regulasi</Link></li>
              <li><Link to="/hubungi" className="hover:text-[#3cc0c9] transition-colors">Hubungi Kami</Link></li>
              <li><Link to="/galeri" className="hover:text-[#3cc0c9] transition-colors">Galeri</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Kontak</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <Phone size={14} className="text-[#3cc0c9] mt-0.5 flex-shrink-0" />
                <div>
                  <a href="https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%2C%20saya%20ingin%20konsultasi%0A%5BBTN5%5D" target="_blank" rel="noopener noreferrer" className="hover:text-white block">0815 1700 5533</a>
                  <span className="text-gray-500 text-xs">CS WA Operational & Finance</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={14} className="text-[#3cc0c9] mt-0.5 flex-shrink-0" />
                <div>
                  <a href="https://api.whatsapp.com/send?phone=6285128005532&text=Halo%20LIMBAHIN%2C%20saya%20ingin%20konsultasi%0A%5BBTN6%5D" target="_blank" rel="noopener noreferrer" className="hover:text-white block">0851 2800 5532</a>
                  <span className="text-gray-500 text-xs">CS WA Marketing & Customer Baru</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={14} className="text-[#3cc0c9] mt-0.5 flex-shrink-0" />
                <div>
                  <a href="https://api.whatsapp.com/send?phone=6282220001820&text=Halo%20Kelvin%2C%20saya%20ingin%20konsultasi%20tentang%20layanan%20LIMBAHIN%0A%5BBTN7%5D" target="_blank" rel="noopener noreferrer" className="hover:text-white block">Kelvin (Manager) — 0822 2000 1820</a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={14} className="text-[#3cc0c9] mt-0.5 flex-shrink-0" />
                <div>
                  <a href="https://api.whatsapp.com/send?phone=6287772102188&text=Halo%2C%20saya%20ingin%20konsultasi%20tentang%20layanan%20LIMBAHIN%0A%5BBTN8%5D" target="_blank" rel="noopener noreferrer" className="hover:text-white block">0877 7210 2188</a>
                  <span className="text-gray-500 text-xs">Emergency Contact</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={14} className="text-[#3cc0c9] mt-0.5 flex-shrink-0" />
                <a href="mailto:cs@mediacahayacerah.com" className="hover:text-white">cs@mediacahayacerah.com</a>
              </li>
              <li className="flex items-start gap-2">
                <Instagram size={14} className="text-[#3cc0c9] mt-0.5 flex-shrink-0" />
                <a href="https://www.instagram.com/limbahin_mcc" target="_blank" rel="noopener noreferrer" className="hover:text-white">@limbahin_mcc</a>
              </li>
              <li className="flex items-start gap-2">
                <ExternalLink size={14} className="text-[#3cc0c9] mt-0.5 flex-shrink-0" />
                <a href="https://linktr.ee/mediacahayacerah" target="_blank" rel="noopener noreferrer" className="hover:text-white">linktr.ee/mediacahayacerah</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-[#3cc0c9] mt-0.5 flex-shrink-0" />
                <span>Ruko Premium Icon City Blok B23, Jln. Boulevard Raya Deltamas No.189, Cikarang Pusat 17530</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={14} className="text-[#3cc0c9] mt-0.5 flex-shrink-0" />
                <span>Senin - Jumat | 09:00 - 17:00 WIB</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-xs">© {new Date().getFullYear()} LIMBAHIN — Dikelola oleh PT. Media Cahaya Cerah. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}