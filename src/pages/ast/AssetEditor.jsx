import { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { limbahinApi } from "@/lib/ast/limbahinApi";
import Brand from "@/components/portal/Brand";
import AssetFiles from "@/components/ast/AssetFiles";
import { buildCombinedPdf } from "@/lib/ast/pdfBuilder";
import { getWorker } from "@/lib/ast/workerSession";
import { ArrowLeft, Loader2, Save } from "lucide-react";

const TYPES = ["Dok Nota", "Dok Aset", "Dok Kendaraan", "Dok Klien", "Dok Perizinan"];

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// See Dashboard.jsx for why `portal` matters — same fix, same reason.
export default function AssetEditor({ portal = false }) {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const base = portal ? '/app/ast' : '/ast';
  const worker = getWorker();

  const [type, setType] = useState("");
  const [referenceInput, setReferenceInput] = useState("");
  const [separate, setSeparate] = useState(false);
  // Whether the combined PDF gets the plain white title page in front. Off = the PDF starts
  // directly with the first file's content, in whatever order the files are currently in — see
  // AssetFiles.jsx's ▲▼ move controls for reordering, which is the only way to control what ends
  // up first now (this used to be a separate per-file "pick a cover image" toggle; simplified to
  // just this one on/off switch per request).
  const [useCoverPage, setUseCoverPage] = useState(true);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit || !worker) return;
    (async () => {
      try {
        const res = await limbahinApi.listRecords(worker.workerId);
        // Same reasoning as Dashboard.jsx — server-side filtering now lives in
        // supabase/functions/limbahin-list-records/index.ts; this is just a second layer.
        const rec = (res.records || []).find(
          (r) => r.id === id && String(r.workerId || "").toLowerCase() === worker.workerId.toLowerCase()
        );
        if (rec) {
          setType(rec.type || "");
          setReferenceInput(rec.reference_id || "");
          setSeparate(!!rec.separate);
        }
      } catch (e) {
        // ignore — fields stay empty
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (!worker) return <Navigate to="/ast/login" replace />;

  const handleSave = async () => {
    setError("");
    if (!type) {
      setError("Please select a type");
      return;
    }
    if (!isEdit && files.length === 0) {
      setError("Please add at least one file");
      return;
    }
    setSaving(true);
    try {
      let pdfBase64 = null;
      const fileNames = files.map((f) => f.file.name);
      if (files.length > 0) {
        const blob = await buildCombinedPdf(
          type,
          files.map((f) => ({ file: f.file, type: f.type, thumbnail: f.thumbnail })),
          useCoverPage
        );
        pdfBase64 = await blobToBase64(blob);
      }
      await limbahinApi.saveRecord({
        workerId: worker.workerId,
        type,
        referenceInput,
        separate,
        fileNames,
        pdfBase64,
        existingId: isEdit ? id : null,
      });
      navigate(base);
    } catch (e) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Translucent cover while saving — building the combined PDF (and uploading it) can take a
          few seconds; without this, the form looked frozen but clickable, and a second click on
          Save could fire the save twice. */}
      {saving && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Saving…</p>
        </div>
      )}

      <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-3xl px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(base)}
            className="text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Brand subtitle="Asset Compiler" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
          {isEdit ? "Edit Asset Record" : "New Asset Record"}
        </h1>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
          </div>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600"
              >
                <option value="">Select type…</option>
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Reference ID{" "}
                <span className="text-slate-400 font-normal">
                  (comma-separated, can be empty)
                </span>
              </label>
              <input
                value={referenceInput}
                onChange={(e) => setReferenceInput(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600"
                placeholder="e.g. AST-001, AST-002"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Separate per reference ID?
              </label>
              <button
                type="button"
                onClick={() => setSeparate(!separate)}
                className={`relative h-6 w-11 rounded-full transition ${
                  separate ? "bg-brand-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
                aria-pressed={separate}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    separate ? "translate-x-5" : ""
                  }`}
                />
              </button>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {separate ? "Each ID becomes its own record" : "One record for all IDs"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Use cover page?
              </label>
              <button
                type="button"
                onClick={() => setUseCoverPage(!useCoverPage)}
                className={`relative h-6 w-11 rounded-full transition ${
                  useCoverPage ? "bg-brand-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
                aria-pressed={useCoverPage}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    useCoverPage ? "translate-x-5" : ""
                  }`}
                />
              </button>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {useCoverPage
                  ? "Adds a plain title page in front"
                  : "Starts directly with the first file below"}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Assets{" "}
                {isEdit && (
                  <span className="text-slate-400 font-normal">
                    (upload to regenerate the PDF)
                  </span>
                )}
              </label>
              <AssetFiles onChange={setFiles} disabled={saving} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Combined PDF is generated and uploaded to Drive on save.
              </p>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving…" : isEdit ? "Update Record" : "Generate & Submit"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
