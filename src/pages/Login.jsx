import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePortalAuth } from "@/lib/PortalAuth";
import ClearableInput from "@/components/portal/ClearableInput";
import Brand from "@/components/portal/Brand";
import TopBar from "@/components/portal/TopBar";
import { User, Lock, UserCircle, Building2, ArrowRight, Loader2, MapPin, FileText, Phone, Briefcase, ShieldAlert, MessageCircle } from "lucide-react";

const WA_PHONE = "6281517005533";
const TRIAL_WA_MESSAGE = "Halo LIMBAHIN, saya ingin bertanya soal akses akun trial ke Portal Klien.";
const TRIAL_WA_LINK = `https://api.whatsapp.com/send?phone=${WA_PHONE}&text=${encodeURIComponent(TRIAL_WA_MESSAGE)}`;

export default function Login() {
  const { session, login } = usePortalAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("client");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Signup fields
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suCompanyName, setSuCompanyName] = useState("");
  const [suAlamatLimbah, setSuAlamatLimbah] = useState("");
  const [suAlamatDokumen, setSuAlamatDokumen] = useState("");
  const [suNoTelp, setSuNoTelp] = useState("");
  const [suPenjab, setSuPenjab] = useState("");
  const [suJabatan, setSuJabatan] = useState("");

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Lockout countdown: separate from `error` so it can render as its own
  // distinct notice (amber, with a live timer) instead of a generic red
  // "wrong password" message.
  const [lockSeconds, setLockSeconds] = useState(0);
  const lockIntervalRef = useRef(null);

  useEffect(() => {
    if (session) navigate(session.role === "office" ? "/app/service" : "/app/limbahb3/dashboard", { replace: true });
  }, [session, navigate]);

  useEffect(() => {
    if (lockSeconds <= 0) {
      if (lockIntervalRef.current) clearInterval(lockIntervalRef.current);
      return;
    }
    lockIntervalRef.current = setInterval(() => {
      setLockSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(lockIntervalRef.current);
  }, [lockSeconds > 0]);

  const formatCountdown = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const s = await login({ identifier, password, role });
      navigate(s.role === "office" ? "/app/service" : "/app/limbahb3/dashboard", { replace: true });
    } catch (err) {
      if (err.locked) {
        setLockSeconds(err.remainingSeconds || 0);
        setError("");
      } else {
        setError(err.message || "Terjadi kesalahan.");
      }
    } finally {
      setBusy(false);
    }
  };

  const submitSignup = (e) => {
    e.preventDefault();
    const msg = `*Pendaftaran Akun Baru LIMBAHIN*\n\nEmail: ${suEmail}\nPassword: ${suPassword}\nNama Perusahaan/Instansi: ${suCompanyName}\nAlamat Lokasi Limbah: ${suAlamatLimbah}\nAlamat Dokumen: ${suAlamatDokumen}\nNo. Telp WhatsApp: ${suNoTelp}\nPenanggung Jawab Utama: ${suPenjab}\nJabatan: ${suJabatan}\n\n[BTN34]`;
    window.open(`https://api.whatsapp.com/send?phone=${WA_PHONE}&text=${encodeURIComponent(msg)}`, "_blank");
  };

  const roleBtn = (r, label, Icon) => (
    <button
      type="button"
      onClick={() => setRole(r)}
      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium border transition ${
        role === r
          ? "border-brand-600 bg-brand-50 dark:bg-brand-600/10 text-brand-700 dark:text-brand-400"
          : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300"
      }`}
    >
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  );

  const inputField = (label, value, setter, icon, placeholder, isPassword = false) => (
    <div>
      <label className="text-[10px] font-medium text-slate-600 dark:text-slate-400">{label}</label>
      <div className="mt-1">
        <ClearableInput value={value} onChange={setter} icon={icon} isPassword={isPassword} placeholder={placeholder} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <TopBar />
      <div className="flex-1 grid md:grid-cols-2">
        {/* Left panel */}
        <div className="relative hidden md:flex flex-col justify-between p-10 text-white bg-gradient-to-br from-brand-500 via-brand-700 to-[#1a1a2e]">
          <Brand size={30} textClass="text-base text-white" logoBg />
          <div className="max-w-md">
            <h1 className="text-2xl font-bold leading-tight">Portal Klien Pengelolaan Limbah B3</h1>
            <p className="mt-3 text-xs text-white/80 leading-relaxed">
              Pantau transaksi pengambilan limbah, invoice, dan MOU Anda secara real-time. Profesional, transparan, dan terpadu.
            </p>
          </div>
          <div className="text-[10px] text-white/60">© 2026 PT. Media Cahaya Cerah</div>
        </div>

        {/* Right form */}
        <div className="flex items-center justify-center p-5 md:p-8">
          <div className="w-full max-w-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {mode === "login" ? "Masuk ke Akun Anda" : "Daftar Akun Baru"}
            </h2>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              {mode === "login" ? "Masuk ke portal untuk mengelola data limbah B3." : "Isi formulir, lalu kirim via WhatsApp untuk verifikasi."}
            </p>

            {/* Mode tabs */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-4">
              {["login", "signup"].map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(""); }}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition ${
                    mode === m ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm" : "text-slate-500"
                  }`}
                >
                  {m === "login" ? "Masuk" : "Daftar"}
                </button>
              ))}
            </div>

            {mode === "login" ? (
              <form onSubmit={submitLogin} className="space-y-3">
                <div className="flex gap-2">
                  {roleBtn("client", "Client", UserCircle)}
                  {roleBtn("office", "Office", Building2)}
                </div>
                <div>
                  <label className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                    {role === "office" ? "Worker ID atau Email" : "Email atau User ID"}
                  </label>
                  <div className="mt-1">
                    <ClearableInput
                      value={identifier}
                      onChange={setIdentifier}
                      icon={User}
                      placeholder={role === "office" ? "MCC-888" : "User ID / Email"}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-slate-600 dark:text-slate-400">Password</label>
                  <div className="mt-1">
                    <ClearableInput value={password} onChange={setPassword} icon={Lock} isPassword placeholder="••••••••" />
                  </div>
                </div>

                {lockSeconds > 0 ? (
                  <div className="flex items-start gap-2 text-[10px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg px-3 py-2.5">
                    <ShieldAlert className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">Terlalu banyak percobaan gagal</div>
                      <div className="mt-0.5">
                        Akun ini sementara dikunci untuk keamanan. Coba lagi dalam{" "}
                        <span className="font-semibold tabular-nums">{formatCountdown(lockSeconds)}</span>.
                      </div>
                    </div>
                  </div>
                ) : (
                  error && <div className="text-[10px] text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={busy || lockSeconds > 0}
                  className="w-full h-10 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
                >
                  {busy ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : lockSeconds > 0 ? (
                    `Coba lagi dalam ${formatCountdown(lockSeconds)}`
                  ) : (
                    <>Masuk <ArrowRight className="w-3.5 h-3.5" /></>
                  )}
                </button>
                <a
                  href={TRIAL_WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-10 rounded-lg border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-400 text-xs font-semibold flex items-center justify-center gap-2 transition hover:bg-brand-50 dark:hover:bg-brand-500/10"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Chat untuk Akses Akun Trial
                </a>
              </form>
            ) : (
              <form onSubmit={submitSignup} className="space-y-2.5">
                {inputField("Email", suEmail, setSuEmail, User, "email@perusahaan.com")}
                {inputField("Password", suPassword, setSuPassword, Lock, "••••••••", true)}
                {inputField("Nama Perusahaan/Instansi", suCompanyName, setSuCompanyName, Building2, "PT. Contoh Sejahtera")}
                {inputField("Alamat Lokasi Limbah", suAlamatLimbah, setSuAlamatLimbah, MapPin, "Jl. Contoh No. 123, Kota")}
                {inputField("Alamat Dokumen", suAlamatDokumen, setSuAlamatDokumen, FileText, "Alamat korespondensi")}
                {inputField("No. Telp (WhatsApp)", suNoTelp, setSuNoTelp, Phone, "0812-3456-7890")}
                {inputField("Penanggung Jawab Utama", suPenjab, setSuPenjab, User, "Nama lengkap PJ")}
                {inputField("Jabatan", suJabatan, setSuJabatan, Briefcase, "Manager / Direktur")}
                <button
                  type="submit"
                  className="w-full h-10 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition mt-2"
                >
                  Kirim via WhatsApp <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-1">
                  Data Anda akan dikirim ke CS WhatsApp (0815 1700 5533) untuk verifikasi pendaftaran.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
