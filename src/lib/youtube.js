// Pulls the 11-char video id out of any of the common YouTube URL shapes (watch?v=, youtu.be/,
// embed/, with or without a trailing ?si=... share param) so we only ever need to store/paste the
// link the person actually shares, not a pre-built embed URL.
export function extractYouTubeId(url) {
  if (!url) return null;
  const m = String(url).match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

export function youTubeEmbedUrl(url) {
  const id = extractYouTubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
