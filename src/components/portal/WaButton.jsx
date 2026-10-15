import React from "react";
import { MessageCircle } from "lucide-react";

const WA_PHONE = "6281517005533";

export default function WaButton({ label, message, phone = WA_PHONE, code }) {
  const fullMessage = code ? `${message}\n[${code}]` : message;
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(fullMessage)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium transition shrink-0 shadow-sm shadow-brand-600/20"
    >
      <MessageCircle className="w-3.5 h-3.5" /> {label}
    </a>
  );
}