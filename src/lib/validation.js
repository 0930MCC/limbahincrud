// Shared field validation for the custform layers. Deliberately permissive — these run on every
// keystroke to drive the "Pilih Data" / "Kirim Email" enabled state, so they only reject input
// that definitely can't work, never input that's merely half-typed.

export { isValidIndoPhone } from './phone';

// Good enough for a form field: something before the @, something after it, and a dot-separated
// TLD of at least two characters. Not RFC 5322 — deliberately so; the real check is whether the
// email actually lands, which only sending can tell us.
export function isValidEmail(raw) {
  const value = String(raw ?? '').trim();
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(value);
}
