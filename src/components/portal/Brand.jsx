import React from "react";

const LOGO = "https://media.base44.com/images/public/user_6a4f746fe44e6001f0846d81/f3713519b_LIMBAHIN-symbolonly.png";

export default function Brand({ size = 28, showText = true, subtitle, textClass = "", logoBg = false }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={LOGO}
        alt="LIMBAHIN"
        style={{ width: size, height: size }}
        className={`object-contain ${logoBg ? "bg-white rounded-lg p-1" : ""}`}
      />
      {showText && (
        <div className="leading-tight">
          <div className={`font-bold tracking-tight text-brand-600 dark:text-brand-400 ${textClass}`}>LIMBAHIN</div>
          {subtitle && <div className="text-[10px] text-slate-400">{subtitle}</div>}
        </div>
      )}
    </div>
  );
}