// Google Drive-hosted gallery media. Paste ordinary "Anyone with the link can view"
// share links here — no need to extract the file ID yourself, that's done automatically.
// The file must be shared so anyone with the link can view it, or it won't load.

// Example videos (Drive share links copied straight from "Share" > "Copy link"):
export const driveVideoLinks = [
];

// Example images hosted on Drive (in addition to the local files in src/assets/gallery/):
export const driveImageLinks = [
];

// Extracts the file ID from a Google Drive share link, e.g.
// "https://drive.google.com/file/d/FILE_ID/view?usp=sharing" -> "FILE_ID"
// Also supports the "...?id=FILE_ID" and "/uc?id=FILE_ID" link formats.
export function extractDriveId(url) {
  if (!url) return null;
  const m1 = String(url).match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (m1) return m1[1];
  const m2 = String(url).match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m2) return m2[1];
  return null;
}

export function driveThumbnailUrl(id, width = 800) {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;
}

export function driveImageFullUrl(id) {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;
}

export function drivePreviewUrl(id) {
  return `https://drive.google.com/file/d/${id}/preview`;
}

// Turns the raw link arrays above into gallery items with the same shape as the
// locally-imported images, so they can be merged into a single grid.
export function buildDriveGalleryItems() {
  const videos = driveVideoLinks
    .map((url, i) => {
      const id = extractDriveId(url);
      if (!id) return null;
      return {
        id,
        type: "video",
        title: `Video ${i + 1}`,
        category: "Video",
        thumb: driveThumbnailUrl(id),
        embedUrl: drivePreviewUrl(id),
      };
    })
    .filter(Boolean);

  const images = driveImageLinks
    .map((url, i) => {
      const id = extractDriveId(url);
      if (!id) return null;
      return {
        id,
        type: "image",
        title: `Foto ${i + 1}`,
        category: "Dokumentasi",
        thumb: driveThumbnailUrl(id),
        url: driveImageFullUrl(id),
      };
    })
    .filter(Boolean);

  return [...videos, ...images];
}
