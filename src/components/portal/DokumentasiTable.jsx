import React, { useState, useMemo } from "react";
import { parseDate } from "@/lib/format";
import { COL } from "@/lib/sheets";
import { splitLinks, parseLinkCell } from "@/lib/driveLinks";
import DokumentasiDetailDialog from "./DokumentasiDetailDialog";
import TableToolbar from "./TableToolbar";
import { EmptyState } from "./Loader";
import { ChevronRight, Minimize2, Video, Image as ImageIcon, FileText } from "lucide-react";

const INITIAL_LIMIT = 10;
const PAGE_SIZE = 20;

// Small square preview of the first media file (photo or video poster frame),
// with a "+N" badge overlay if there are more files attached to this entry.
function MediaPreview({ item }) {
  const [failed, setFailed] = useState(false);
  const photos = parseLinkCell(item[COL.DOK_PHOTO]);
  const videos = parseLinkCell(item[COL.DOK_VIDEO]);
  const all = [...photos, ...videos];
  const total = all.length;
  const first = all[0];
  const extra = total - 1;

  if (!first) {
    return (
      <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
        <FileText className="w-5 h-5 text-slate-300" />
      </div>
    );
  }

  const isVideoFirst = photos.length === 0;

  return (
    <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex-shrink-0">
      {!failed ? (
        <img
          src={first.thumbUrl}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {isVideoFirst ? <Video className="w-5 h-5 text-slate-400" /> : <ImageIcon className="w-5 h-5 text-slate-400" />}
        </div>
      )}
      {isVideoFirst && !failed && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <Video className="w-4 h-4 text-white drop-shadow" />
        </div>
      )}
      {extra > 0 && (
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
          <span className="text-white text-[11px] font-semibold">+{extra}</span>
        </div>
      )}
    </div>
  );
}

export default function DokumentasiTable({ items }) {
  const [limit, setLimit] = useState(INITIAL_LIMIT);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ dir: "desc" });

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.trim().toLowerCase();
    return items.filter((it) =>
      String(it[COL.DOK_DESC] || "").toLowerCase().includes(q) ||
      String(it[COL.DOK_ID] || "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sort?.dir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      const da = parseDate(a[COL.DOK_DATE]);
      const db = parseDate(b[COL.DOK_DATE]);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return dir * (da.getTime() - db.getTime());
    });
    return arr;
  }, [filtered, sort]);

  const shown = sorted.slice(0, limit);

  const toggleSort = () => {
    setSort((s) => ({ dir: s?.dir === "asc" ? "desc" : "asc" }));
  };

  if (items.length === 0) return <EmptyState label="Belum ada file & dokumen." />;

  return (
    <div>
      <TableToolbar
        shownCount={sorted.length}
        totalCount={items.length}
        itemLabel="dokumen"
        search={search}
        onSearchChange={(v) => { setSearch(v); setLimit(INITIAL_LIMIT); }}
        searchPlaceholder="Cari ID / deskripsi..."
        sorts={[
          {
            key: "date",
            label: "Urut: Tanggal",
            active: true,
            direction: sort?.dir || "desc",
            onClick: toggleSort,
          },
        ]}
      />
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {shown.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">Tidak ada hasil untuk "{search}"</div>
        ) : shown.map((item, i) => {
          const date = parseDate(item[COL.DOK_DATE]);
          const videoCount = splitLinks(item[COL.DOK_VIDEO]).length;
          const photoCount = splitLinks(item[COL.DOK_PHOTO]).length;
          return (
            <button
              key={(item[COL.DOK_ID] || i) + "-" + i}
              onClick={() => setSelected(item)}
              className="w-full text-left flex items-center gap-3 px-3 py-2.5 hover:bg-brand-50/50 dark:hover:bg-brand-600/5 transition"
            >
              <MediaPreview item={item} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {item[COL.DOK_ID] || "-"}
                  </span>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {date ? date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }) : item[COL.DOK_DATE] || "-"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-normal break-words line-clamp-2 mt-0.5">
                  {item[COL.DOK_DESC] || "-"}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                  {photoCount > 0 && (
                    <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> {photoCount}</span>
                  )}
                  {videoCount > 0 && (
                    <span className="flex items-center gap-1"><Video className="w-3 h-3" /> {videoCount}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
            </button>
          );
        })}
      </div>
      <div className="flex justify-center gap-2 mt-3">
        {limit < sorted.length && (
          <button
            onClick={() => setLimit((l) => l + PAGE_SIZE)}
            className="px-4 py-1.5 text-xs font-medium rounded-lg border border-brand-600 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-600/10 transition"
          >
            Muat {Math.min(PAGE_SIZE, sorted.length - limit)} lagi
          </button>
        )}
        {limit > INITIAL_LIMIT && (
          <button
            onClick={() => setLimit(INITIAL_LIMIT)}
            className="px-4 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1"
          >
            <Minimize2 className="w-3 h-3" /> Ciutkan
          </button>
        )}
      </div>
      <DokumentasiDetailDialog item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
