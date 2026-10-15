import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, ChevronDown, Search, Lock, WebcamIcon, HomeIcon, Instagram } from "lucide-react";
import { LOGO_BADGE_PNG } from "@/assets/logoBadgeBase64.js";
import MobileSlimHeader from "@/components/MobileSlimHeader";

// Shared by both the portal chrome (Sidebar.jsx renders this above the nav) and CustForm.jsx's
// standalone shell — CustForm used to keep its own copy of this exact bar (down to the same
// WhatsApp/email/Instagram links), which had drifted into a genuine bug: its copy imported the
// lucide `Link` *icon* instead of react-router's `Link`, so the "Beranda" link rendered but its
// click did nothing. One component, used from both places, means there's only one place left for
// that kind of drift to happen.
// The bar used to disappear entirely below the md breakpoint (`hidden md:block`) — on mobile
// there was no topbar at all. It now always renders: the full bar on desktop, and on mobile the
// same slim centered-logo strip Navbar.jsx uses (MobileSlimHeader). It never needs scroll-based
// show/hide here (unlike Navbar's): PortalLayout.jsx renders this TopBar OUTSIDE the app's
// scrolling container (the page scrolls inside <main>, not the window), so it's already
// permanently visible with no extra logic needed.
export default function TopBar() {

  return (
    <div className="w-full">
      <MobileSlimHeader />
      <div className="bg-[#1a1a2e] text-white text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <a href="https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%20bersama%20MCC%2C%20saya%20ingin%20konsultasi%0A%5BBTN9%5D" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#3cc0c9] transition-colors">
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
            <Link to="/" className="flex items-center gap-1 hover:text-[#3cc0c9] transition-colors">
              <HomeIcon size={12} /> Beranda
            </Link>
            <img src={LOGO_BADGE_PNG} alt="LIMBAHIN" className="h-5 w-auto object-contain" />
          </div>

        </div>
      </div>
    </div>
  );
}