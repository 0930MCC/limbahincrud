import React from 'react';
import { Link } from 'react-router-dom';
import { LOGO_BADGE_PNG } from '@/assets/logoBadgeBase64.js';

// The one mobile-only "just the logo, centered, tap to go Beranda" strip — used by both the
// marketing Navbar and the portal/CustForm TopBar, so there's a single place to change it instead
// of two copies drifting apart (which is exactly how the marketing one ended up on the wrong,
// 3-arrow logo while the portal one had already been fixed to the real 4-arrow mark).
export default function MobileSlimHeader({ className = '' }) {
  return (
    <Link
      to="/"
      aria-label="LIMBAHIN — Beranda"
      className={`flex md:hidden items-center justify-center bg-[#1a1a2e] py-2 ${className}`}
    >
      <img src={LOGO_BADGE_PNG} alt="LIMBAHIN" className="h-6 w-auto object-contain" />
    </Link>
  );
}
