import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, ChevronDown, Search, Lock, Instagram } from "lucide-react";
import { LOGO_BADGE_PNG } from "@/assets/logoBadgeBase64.js";
import MobileSlimHeader from "@/components/MobileSlimHeader";
import useScrollDirection from "@/lib/useScrollDirection";

// Was a remote base44 URL serving the WRONG mark (a generic 3-arrow recycle icon, not
// LIMBAHIN's actual 4-arrow logo) — replaced with the same local, verified asset every other
// logo instance in the app uses.
const LOGO_SYMBOL = LOGO_BADGE_PNG;

const navItems = [
  { label: "Beranda", to: "/" },
  {
    label: "Layanan",
    children: [
      { label: "Tentang Kami", to: "/tentang" },
      { label: "Jenis Limbah", to: "/layanan/jenis-limbah" },
      { label: "Proses Pelayanan", to: "/layanan/proses-pelayanan" },
      { label: "Mengapa Kami", to: "/layanan/mengapa-kami" },
      { label: "Alur Limbah", to: "/layanan/alur-limbah" },
      { label: "Partner & Klien", to: "/layanan/partner-klien" },
    ],
  },
  { label: "Harga Limbah", to: "/harga-limbah" },
  { label: "Harga Logistik", to: "/harga-logistik", badge: "new" },
  {
    label: "Bantuan",
    children: [
      { label: "Pertanyaan Umum", to: "/bantuan/faq" },
      { label: "Karir", to: "/bantuan/karir" },
      { label: "Artikel", to: "/artikel" },
      { label: "Galeri", to: "/galeri" },
      { label: "Hubungi Kami", to: "/hubungi" },
    ],
  },
];

function DropdownMenu({ children, open }) {
  return open ? (
    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
      {children.map((c) => (
        <Link key={c.to} to={c.to} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#e8f7f8] hover:text-[#2ba5ad] transition-colors">{c.label}</Link>
      ))}
    </div>
  ) : null;
}

function BrandLogo() {
  return (
    <Link to="/" className="flex-shrink-0 flex items-center gap-2">
      <img src={LOGO_SYMBOL} alt="LIMBAHIN" className="h-8 md:h-10 w-auto" />
      <span className="text-lg md:text-xl font-bold text-[#2ba5ad] tracking-tight">LIMBAHIN</span>
    </Link>
  );
}

function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.find(query, false, false, true);
  };

  return (
    <div className="relative">
      {open ? (
        <form onSubmit={handleSearch} className="flex items-center gap-1">
          <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari di halaman..." className="w-32 md:w-40 px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2ba5ad]/30 focus:border-[#2ba5ad]" />
          <button type="submit" className="p-1.5 text-[#2ba5ad] hover:bg-[#e8f7f8] rounded-lg"><Search size={16} /></button>
          <button type="button" onClick={() => { setOpen(false); setQuery(""); }} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X size={16} /></button>
        </form>
      ) : (
        <button onClick={() => setOpen(true)} className="p-2 text-gray-600 hover:text-[#2ba5ad] hover:bg-[#e8f7f8] rounded-lg transition-colors"><Search size={18} /></button>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [desktopDropdown, setDesktopDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  // Mobile-only slim header (see below): visible at the top of the page and while scrolling up,
  // hidden while scrolling down.
  const slimVisible = useScrollDirection();
  const [mobileSearch, setMobileSearch] = useState(false);
  const [mobileQuery, setMobileQuery] = useState("");
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setMobileDropdown(null); setDesktopDropdown(null); setMobileSearch(false); }, [location]);

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDesktopDropdown(null); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (item) => item.to ? location.pathname === item.to : item.children?.some((c) => location.pathname === c.to);

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (!mobileQuery.trim()) return;
    window.find(mobileQuery, false, false, true);
    setMobileSearch(false);
    setMobileQuery("");
  };

  return (
    <>
      <div className="bg-[#1a1a2e] text-white text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <a href="https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%20bersama%20MCC%2C%20saya%20ingin%20konsultasi%0A%5BBTN1%5D" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#3cc0c9] transition-colors">
              <Phone size={12} /> 0815 1700 5533 (CS WA Operational & Finance)
            </a>
            <span className="text-white/30">|</span>
            <a href="mailto:cs@mediacahayacerah.com" className="hover:text-[#3cc0c9] transition-colors">cs@mediacahayacerah.com</a>
            <span className="text-white/30">|</span>
            <a href="https://www.instagram.com/limbahin_mcc" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#3cc0c9] transition-colors">
              <Instagram size={12} /> limbahin_mcc
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/50 hidden lg:inline">Senin - Jumat | 09:00 - 17:00 WIB</span>
            <Link to="/login" className="flex items-center gap-1 hover:text-[#3cc0c9] transition-colors">
              <Lock size={12} /> Daftar/Masuk
            </Link>
            <img src={LOGO_SYMBOL} alt="LIMBAHIN" className="h-5 w-auto" />
          </div>
        </div>
      </div>

      {/* Sticky wrapper: the mobile slim logo strip collapses/reveals with scroll direction
          (max-height transition rather than `fixed`, so it never overlaps the nav below it —
          they share one sticky container and push down together), while the nav itself always
          stays visible. */}
      <div className="sticky top-0 z-50">
        <div className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${slimVisible ? "max-h-12" : "max-h-0"}`}>
          <MobileSlimHeader />
        </div>
        <nav className={`transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white shadow-sm"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-[70px]" ref={dropdownRef}>
          <BrandLogo />

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.to ? (
                  <Link to={item.to} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item) ? "text-[#2ba5ad] bg-[#e8f7f8]" : "text-gray-700 hover:text-[#2ba5ad] hover:bg-gray-50"}`}>
                    {item.label}
                    {item.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">{item.badge}</span>}
                  </Link>
                ) : (
                  <button onClick={() => setDesktopDropdown(desktopDropdown === item.label ? null : item.label)} className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item) ? "text-[#2ba5ad] bg-[#e8f7f8]" : "text-gray-700 hover:text-[#2ba5ad] hover:bg-gray-50"}`}>
                    {item.label}
                    <ChevronDown size={14} className={`transition-transform ${desktopDropdown === item.label ? "rotate-180" : ""}`} />
                  </button>
                )}
                {item.children && <DropdownMenu children={item.children} open={desktopDropdown === item.label} />}
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <SearchBar />
            <a href="https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%20bersama%20MCC%2C%20perkenalkan%20nama%3A%20%20%20dari%3A%20%20%20kami%20ingin%20konsultasi%20tentang%3A%0A%5BBTN2%5D" target="_blank" rel="noopener noreferrer" className="bg-[#2ba5ad] hover:bg-[#239198] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md">
              Konsultasi Gratis
            </a>
          </div>

          <div className="flex md:hidden items-center gap-1">
            <button onClick={() => setMobileSearch(!mobileSearch)} className="p-2 text-gray-700">{mobileSearch ? <X size={22} /> : <Search size={22} />}</button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-gray-700">{mobileOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>

        {mobileSearch && (
          <div className="md:hidden bg-white border-t px-4 py-3">
            <form onSubmit={handleMobileSearch} className="flex items-center gap-2">
              <input type="text" value={mobileQuery} onChange={(e) => setMobileQuery(e.target.value)} placeholder="Cari di halaman..." className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2ba5ad]/30 focus:border-[#2ba5ad]" />
              <button type="submit" className="bg-[#2ba5ad] text-white p-2.5 rounded-lg"><Search size={18} /></button>
            </form>
          </div>
        )}

        {mobileOpen && (
          <div className="md:hidden bg-white border-t max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.to ? (
                    <Link to={item.to} className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(item) ? "bg-[#e8f7f8] text-[#2ba5ad]" : "text-gray-700 hover:bg-gray-50"}`}>
                      {item.label}
                      {item.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">{item.badge}</span>}
                    </Link>
                  ) : (
                    <>
                      <button onClick={() => setMobileDropdown(mobileDropdown === item.label ? null : item.label)} className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        {item.label}
                        <ChevronDown size={14} className={`transition-transform ${mobileDropdown === item.label ? "rotate-180" : ""}`} />
                      </button>
                      {mobileDropdown === item.label && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.children.map((c) => (
                            <Link key={c.to} to={c.to} className="block px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-[#e8f7f8] hover:text-[#2ba5ad]">{c.label}</Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
              <a href="https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%20bersama%20MCC%2C%20perkenalkan%20nama%3A%20%20%20dari%3A%20%20%20kami%20ingin%20konsultasi%20tentang%3A%0A%5BBTN2%5D" target="_blank" rel="noopener noreferrer" className="block mt-3 text-center bg-[#2ba5ad] text-white px-5 py-3 rounded-lg text-sm font-semibold">Konsultasi Gratis</a>
              <Link to="/login" className="flex items-center justify-center gap-2 mt-3 text-center border border-gray-200 text-gray-700 px-5 py-3 rounded-lg text-sm font-semibold"><Lock size={15} /> Daftar/Masuk</Link>
            </div>
          </div>
        )}
      </nav>
      </div>
    </>
  );
}