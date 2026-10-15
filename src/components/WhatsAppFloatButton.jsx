import React, { useEffect, useRef, useState } from "react";
import { X, Megaphone, Headset } from "lucide-react";

// Two CS lines: Marketing/new-customer line (BTN3) catches prospective
// customers, Operational/active-customer line (BTN4) handles existing
// clients' day-to-day / operational requests.
const OPTIONS = [
  {
    code: "BTN3",
    label: "Chat Marketing & Customer Baru",
    sublabel: "Untuk calon pelanggan / penawaran baru",
    icon: Megaphone,
    url: "https://api.whatsapp.com/send?phone=6285128005532&text=Halo%20LIMBAHIN%2C%20saya%20ingin%20konsultasi%20tentang%20layanan%20pengelolaan%20limbah%0A%5BBTN3%5D",
  },
  {
    code: "BTN4",
    label: "Chat Customer Aktif & Operasional",
    sublabel: "Untuk pelanggan aktif / kebutuhan operasional",
    icon: Headset,
    url: "https://api.whatsapp.com/send?phone=6281517005533&text=Halo%20LIMBAHIN%2C%20saya%20pelanggan%20aktif%20dan%20ingin%20menanyakan%20hal%20operasional%0A%5BBTN4%5D",
  },
];

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
      <path d="M16.004 2.667c-7.363 0-13.334 5.97-13.334 13.333 0 2.351.615 4.646 1.784 6.667L2.667 29.333l6.822-1.76a13.27 13.27 0 0 0 6.515 1.76h.006c7.363 0 13.333-5.97 13.333-13.333S23.367 2.667 16.004 2.667Zm0 24.4h-.005a11.04 11.04 0 0 1-5.63-1.54l-.404-.24-4.05 1.046 1.08-3.947-.264-.406a11.02 11.02 0 0 1-1.7-5.913c0-6.106 4.968-11.073 11.078-11.073 2.959 0 5.74 1.153 7.833 3.248a11 11 0 0 1 3.243 7.833c0 6.106-4.968 11.073-11.181 11.073v-.081Zm6.08-8.294c-.333-.167-1.97-.973-2.276-1.083-.306-.111-.528-.167-.75.167-.223.333-.86 1.083-1.055 1.306-.194.222-.389.25-.722.083-.333-.167-1.406-.518-2.678-1.652-.99-.883-1.658-1.974-1.852-2.307-.194-.333-.02-.514.147-.68.15-.15.334-.389.5-.583.167-.194.223-.333.334-.556.111-.222.055-.417-.028-.583-.083-.167-.75-1.806-1.028-2.474-.271-.65-.545-.562-.75-.573-.194-.01-.417-.012-.639-.012s-.583.083-.889.417c-.306.333-1.167 1.14-1.167 2.78s1.195 3.226 1.361 3.448c.167.222 2.352 3.593 5.7 5.04.796.343 1.417.549 1.901.702.799.254 1.526.218 2.101.132.641-.096 1.97-.805 2.247-1.583.278-.778.278-1.445.194-1.583-.083-.14-.306-.223-.639-.39Z" />
    </svg>
  );
}

export default function WhatsAppFloatButton() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={rootRef} className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="mb-1 w-72 max-w-[85vw] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-[#1a1a2e]">
            <p className="text-white text-sm font-semibold">Pilih tujuan chat WhatsApp</p>
            <p className="text-white/50 text-xs">Kami arahkan ke tim yang tepat</p>
          </div>
          <div className="p-2">
            {OPTIONS.map((opt) => (
              <a
                key={opt.code}
                href={opt.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#e8f7f8] transition-colors"
              >
                <span className="w-9 h-9 rounded-full bg-[#e8f7f8] flex items-center justify-center flex-shrink-0">
                  <opt.icon size={17} className="text-[#2ba5ad]" />
                </span>
                <span className="min-w-0">
                  <span className="text-sm font-semibold text-[#1a1a2e]">{opt.label}</span>
                  <span className="block text-xs text-gray-400 mt-0.5">{opt.sublabel}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat via WhatsApp"
        aria-expanded={open}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg shadow-black/20 transition-transform hover:scale-105"
      >
        {open ? <X className="w-6 h-6" /> : <WhatsAppIcon className="w-7 h-7" />}
      </button>
    </div>
  );
}
