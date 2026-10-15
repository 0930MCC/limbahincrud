import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";

// Text input with a clear button (far right) and, for passwords, an obscure toggle to its left.
export default function ClearableInput({ value, onChange, type = "text", isPassword = false, icon: Icon, className = "", ...props }) {
  const [show, setShow] = useState(false);
  const inputType = isPassword ? (show ? "text" : "password") : type;
  const rightPad = isPassword ? "pr-16" : "pr-9";

  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
      <input
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm ${Icon ? "pl-9" : "pl-3"} ${rightPad} outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition ${className}`}
        {...props}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {isPassword && (
          <button type="button" tabIndex={-1} onClick={() => setShow((s) => !s)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        {value && (
          <button type="button" tabIndex={-1} onClick={() => onChange("")} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}