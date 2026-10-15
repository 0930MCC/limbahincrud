import { useCallback, useEffect, useState } from "react";
import FileDropzone from "@/components/ast/FileDropzone";
import FileItem from "@/components/ast/FileItem";
import { generateVideoThumbnail } from "@/lib/ast/videoThumbnail";

function getFileType(file) {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) return "pdf";
  return null;
}

export default function AssetFiles({ onChange, disabled }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    onChange?.(files);
  }, [files, onChange]);

  const addFiles = useCallback(async (incoming) => {
    const valid = incoming
      .map((file) => ({ file, type: getFileType(file) }))
      .filter((f) => f.type);

    const newItems = await Promise.all(
      valid.map(async ({ file, type }) => {
        const item = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          type,
          thumbnail: type === "video" ? null : undefined,
          thumbnailUrl: undefined,
          previewUrl: undefined,
          error: undefined,
        };
        if (type === "image") {
          item.previewUrl = URL.createObjectURL(file);
        } else if (type === "video") {
          try {
            const blob = await generateVideoThumbnail(file);
            item.thumbnail = blob;
            item.thumbnailUrl = URL.createObjectURL(blob);
          } catch (e) {
            item.error = "thumbnail failed";
          }
        }
        return item;
      })
    );

    setFiles((prev) => [...prev, ...newItems]);
  }, []);

  const removeFile = (index) => {
    setFiles((prev) => {
      const next = [...prev];
      const removed = next[index];
      if (removed?.thumbnailUrl) URL.revokeObjectURL(removed.thumbnailUrl);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      next.splice(index, 1);
      return next;
    });
  };

  const moveFile = (index, dir) => {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <FileDropzone onFiles={addFiles} disabled={disabled} />
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Drag ▲▼ to reorder</p>
          {files.map((item, index) => (
            <FileItem
              key={item.id}
              item={item}
              index={index}
              onMove={moveFile}
              onRemove={removeFile}
              canMoveUp={index > 0}
              canMoveDown={index < files.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
