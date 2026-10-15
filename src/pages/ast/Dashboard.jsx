import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { limbahinApi } from "@/lib/ast/limbahinApi";
import { getWorker, clearWorker } from "@/lib/ast/workerSession";
import Brand from "@/components/portal/Brand";
import { Plus, LogOut, Pencil, Trash2, Loader2, ExternalLink } from "lucide-react";

// `portal`: rendered at /app/ast (inside the office portal shell, WorkerRoute bridges the
// office session automatically) vs standalone /ast (its own shell, field workers on their own
// devices). Navigation used to be hardcoded to the standalone "/ast" paths regardless of which
// one this was, so "New"/"Edit" from inside the portal jumped OUT of it to the standalone page —
// no sidebar/topbar — and Back then landed back on standalone "/ast", still without them. Basing
// every in-app link on `base` keeps it on the same shell it started in.
export default function Dashboard({ portal = false }) {
  const navigate = useNavigate();
  const base = portal ? '/app/ast' : '/ast';
  const worker = getWorker();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (!worker) return;
    (async () => {
      try {
        const res = await limbahinApi.listRecords(worker.workerId);
        // The real fix now lives server-side: supabase/functions/limbahin-list-records/index.ts
        // filters with `.eq("worker_id", workerId)` directly in the query, using the confirmed
        // column name from public.asset_records. This client-side check is just a second layer —
        // harmless once the server filters correctly, and still catches anything the server
        // doesn't (e.g. if that function hasn't been deployed yet).
        const mine = (res.records || []).filter(
          (r) => String(r.workerId || "").toLowerCase() === worker.workerId.toLowerCase()
        );
        setRecords(mine);
      } catch (e) {
        setError("Failed to load records");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!worker) return <Navigate to="/ast/login" replace />;

  const sorted = [...records].sort((a, b) => {
    if (sortBy === "type") return (a.type || "").localeCompare(b.type || "");
    if (sortBy === "reference") return (a.reference_id || "").localeCompare(b.reference_id || "");
    if (sortBy === "oldest") return new Date(a.created_at) - new Date(b.created_at);
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const handleDelete = async (id) => {
    if (!confirm("Delete this asset record? The Drive PDF stays, but the record and its sheet row are removed.")) return;
    try {
      await limbahinApi.deleteRecord(worker.workerId, id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      alert("Delete failed");
    }
  };

  const handleLogout = () => {
    clearWorker();
    navigate("/ast/login");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-5xl px-5 py-4 flex items-center justify-between">
          <Brand subtitle="Asset Compiler" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:inline">
              {worker?.nama || worker?.workerId}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header> */}

      <main className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Asset Records</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {records.length} record{records.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            onClick={() => navigate(`${base}/new`)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition"
          >
            <Plus className="h-4 w-4" /> New Asset Record
          </button>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <label className="text-xs text-slate-500 dark:text-slate-400">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="type">Type</option>
            <option value="reference">Reference</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
          </div>
        ) : error ? (
          <p className="text-red-600 text-sm">{error}</p>
        ) : records.length === 0 ? (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400">
            <p className="text-sm">No asset records yet.</p>
            <button
              onClick={() => navigate(`${base}/new`)}
              className="mt-3 text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline"
            >
              Create your first record
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((r) => (
              <div
                key={r.id}
                className="group flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-brand-400/60 transition"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <TypeBadge type={r.type} />
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                      {r.reference_id || "—"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {new Date(r.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {r.drive_link && (
                    <a
                      href={r.drive_link}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md p-2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                      title="Open PDF"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    onClick={() => navigate(`${base}/edit/${r.id}`)}
                    className="rounded-md p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="rounded-md p-2 text-slate-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function TypeBadge({ type }) {
  const colors = {
    "Dok Nota": "bg-brand-50 text-brand-700 dark:bg-brand-600/15 dark:text-brand-400",
    "Dok Aset": "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
    "Dok Kendaraan": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    "Dok Klien": "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
    "Dok Perizinan": "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
  };
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        colors[type] || "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
      }`}
    >
      {type}
    </span>
  );
}
