import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { limbahinApi } from "@/lib/ast/limbahinApi";
import { getWorker, saveWorker } from "@/lib/ast/workerSession";
import Brand from "@/components/portal/Brand";
import { Loader2, LogIn } from "lucide-react";

// NOTE: the original asset-records export of this page was corrupted (its
// file contained a copy of App.jsx instead of a login form), so this was
// rebuilt from scratch against the existing lib/ast/limbahinApi.login and
// lib/ast/workerSession helpers, themed to match the rest of this app.
// `embedded` renders the same form inside the office portal shell (see components/ast/WorkerRoute
// in portal mode) instead of as a standalone full-page login: it skips the "already signed in ->
// redirect to /ast" behaviour and calls `onSuccess` rather than navigating, so the office user
// stays exactly where they were in the portal.
export default function WorkerLogin({ embedded = false, onSuccess }) {
  const navigate = useNavigate();
  const existing = getWorker();
  const [workerId, setWorkerId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (existing && !embedded) return <Navigate to="/ast" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workerId.trim() || !password) {
      setError("Please enter your Worker ID and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await limbahinApi.login(workerId.trim(), password);
      saveWorker(res.worker || res);
      if (embedded) onSuccess?.();
      else navigate("/ast");
    } catch (err) {
      setError(err.message || "Login failed. Check your Worker ID and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Brand size={40} subtitle="Asset Compiler" />
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">Worker Login</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Sign in with your Worker ID to manage asset records.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                Worker ID
              </label>
              <input
                autoFocus
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600"
                placeholder="e.g. W-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
