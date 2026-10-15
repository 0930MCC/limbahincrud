// Reads query parameters in a way that works under BOTH router modes.
//
// This app uses HashRouter (see App.jsx), so a link like
//   https://site.com/#/custform?id=A1B2C3&rate=r15
// keeps its query string inside `window.location.hash`, and `window.location.search` is EMPTY.
// The Customer Form was originally built as a standalone app on BrowserRouter, where the
// opposite is true. Rather than making every caller care, this reads the hash first and falls
// back to `search`, so the same code works whichever router is in use and whichever shape of
// link the customer was sent.
export function getAppSearchParams() {
  const hash = window.location.hash || '';
  const qIndex = hash.indexOf('?');
  if (qIndex !== -1) return new URLSearchParams(hash.slice(qIndex + 1));
  return new URLSearchParams(window.location.search);
}

export function getAppSearchParam(name) {
  return getAppSearchParams().get(name) || '';
}

// The current query string, for building a replacement URL to navigate() to.
export function getAppSearchString() {
  return getAppSearchParams().toString();
}
