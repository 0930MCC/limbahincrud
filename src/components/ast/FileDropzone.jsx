import React, { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FileDropzone({ onFiles, disabled }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length) onFiles(dropped);
  };

  const handleChange = (e) => {
    if (e.target.files.length) onFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all cursor-pointer",
        dragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-foreground/30 hover:bg-muted/50",
        disabled && "opacity-60 pointer-events-none"
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <UploadCloud className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">
          Drop files here or click to browse
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Images, videos, and PDFs · multiple files allowed
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*,application/pdf"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}