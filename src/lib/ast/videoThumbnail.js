export function generateVideoThumbnail(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(file);
    video.src = url;

    const cleanup = () => URL.revokeObjectURL(url);

    video.onloadeddata = () => {
      try {
        video.currentTime = Math.min(1, (video.duration || 2) / 2);
      } catch (e) {
        /* ignore */
      }
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        const w = video.videoWidth || 640;
        const h = video.videoHeight || 360;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(video, 0, 0, w, h);
        canvas.toBlob(
          (blob) => {
            cleanup();
            if (blob) resolve(blob);
            else reject(new Error("Thumbnail generation failed"));
          },
          "image/jpeg",
          0.92
        );
      } catch (e) {
        cleanup();
        reject(e);
      }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("Could not read video file"));
    };
  });
}