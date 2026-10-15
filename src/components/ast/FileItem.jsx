import React from "react";
import { Image as ImageIcon, Video, FileText, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FileItem({ item, index, onMove, onRemove, canMoveUp, canMoveDown }) {
  const { type, file, thumbnail, thumbnailUrl, previewUrl, error } = item;

  return (
    <div className="group flex items-center gap-4 rounded-xl border border-border bg-card p-3 transition-all hover:shadow-sm">
      <div className="flex flex-col gap-1">
        <button
          disabled={!canMoveUp}
          onClick={() => onMove(index, -1)}
          className="text-muted-foreground hover:text-foreground disabled:opacity-20"
          aria-label="Move up"
        >
          ▲
        </button>
        <button
          disabled={!canMoveDown}
          onClick={() => onMove(index, 1)}
          className="text-muted-foreground hover:text-foreground disabled:opacity-20"
          aria-label="Move down"
        >
          ▼
        </button>
      </div>

      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted flex items-center justify-center">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt="" className="h-full w-full object-cover" />
        ) : previewUrl ? (
          <img src={previewUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <TypeIcon type={type} />
        )}
        {type === "video" && thumbnail === null && (
          <Loader2 className="absolute h-4 w-4 animate-spin text-foreground/60" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <TypeBadge type={type} />
          <span className="text-xs text-muted-foreground">{formatSize(file.size)}</span>
          {error && <span className="text-xs text-destructive">{error}</span>}
        </div>
      </div>

      <button
        onClick={() => onRemove(index)}
        className="rounded-md p-2 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
        aria-label="Remove file"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function TypeIcon({ type }) {
  const cls = "h-6 w-6 text-muted-foreground";
  if (type === "image") return <ImageIcon className={cls} />;
  if (type === "video") return <Video className={cls} />;
  return <FileText className={cls} />;
}

function TypeBadge({ type }) {
  const map = {
    image: "bg-chart-2/15 text-chart-2",
    video: "bg-chart-1/15 text-chart-1",
    pdf: "bg-chart-3/15 text-chart-3",
  };
  return (
    <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", map[type] || "bg-muted text-muted-foreground")}>
      {type}
    </span>
  );
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}