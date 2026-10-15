import React from "react";
import { FileText, ExternalLink, Paperclip } from "lucide-react";

// A single sheet cell can sometimes hold more than one URL (separated by a
// comma, newline, semicolon or space) when there's more than one document
// for the same slot. This splits that into a clean list of real links.
export function splitLinks(value) {
  if (!value) return [];
  return String(value)
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter((s) => /^https?:\/\//i.test(s));
}

// Renders one button per link — never a single button standing in for
// several documents. `variant="text"` is the labelled row used in detail
// dialogs; `variant="icon"` is the compact icon-only version used inline in
// table rows / cards.
export default function FileLinkButtons({ label, value, variant = "text", onOpen }) {
  const links = splitLinks(value);
  if (links.length === 0) return null;

  const handleClick = (e, url) => {
    e.stopPropagation();
    if (onOpen) onOpen(url);
  };

  if (variant === "icon") {
    return (
      <span className="inline-flex items-center gap-1">
        {links.map((url, i) => (
          <a
            key={url + i}
            href={url}
            target="_blank"
            rel="noreferrer"
            title={links.length > 1 ? `${label} ${i + 1}` : label}
            onClick={(e) => handleClick(e, url)}
            className="inline-flex items-center justify-center w-6 h-6 rounded-md border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-brand-600 hover:border-brand-400 dark:hover:text-brand-400 transition"
          >
            <Paperclip className="w-3 h-3" />
          </a>
        ))}
      </span>
    );
  }

  return (
    <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-[11px] uppercase tracking-wide text-slate-400">{label}</span>
      <div className="flex flex-col gap-1 mt-0.5">
        {links.map((url, i) => (
          <a
            key={url + i}
            href={url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => handleClick(e, url)}
            className="text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            {links.length > 1 ? `Buka File ${i + 1}` : "Buka File"}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ))}
      </div>
    </div>
  );
}
