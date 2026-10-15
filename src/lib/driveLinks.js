// Helpers for the "Video Links" / "Photo Links" columns on 11.Dokumentasi.
// Each cell can hold multiple links separated by commas (or newlines/
// semicolons, just in case). For each link we try to recognize it as a
// Google Drive share link and turn it into a thumbnail image URL — Drive's
// thumbnail endpoint works for both photos and videos (it returns a poster
// frame for videos), so the same helper covers both columns. Clicking a
// thumbnail always opens the ORIGINAL link (e.g. the Drive viewer/player),
// never the thumbnail URL itself.

const DRIVE_ID_PATTERNS = [
  /\/d\/([a-zA-Z0-9_-]{10,})/,     // .../file/d/FILE_ID/view
  /[?&]id=([a-zA-Z0-9_-]{10,})/,   // .../open?id=FILE_ID or .../uc?id=FILE_ID
];

export function extractDriveId(url) {
  const s = String(url || "");
  for (const re of DRIVE_ID_PATTERNS) {
    const m = s.match(re);
    if (m) return m[1];
  }
  return null;
}

// Splits a cell that may contain multiple links into a clean array.
export function splitLinks(value) {
  return String(value || "")
    .split(/[,\n;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Returns { url, thumbUrl, isDrive } for a single link.
export function toPreview(url) {
  const id = extractDriveId(url);
  if (id) {
    return { url, thumbUrl: `https://drive.google.com/thumbnail?id=${id}&sz=w500`, isDrive: true };
  }
  // Not a recognizable Drive link — fall back to using the URL itself as the
  // image source. Works for direct image links; for anything else the <img>
  // simply fails to load and the caller shows a generic fallback icon.
  return { url, thumbUrl: url, isDrive: false };
}

// Convenience: splits + maps a raw cell value straight into preview objects.
export function parseLinkCell(value) {
  return splitLinks(value).map(toPreview);
}
