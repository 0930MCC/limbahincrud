// URL price modifier.
//
// Current rule (?rate=, replaces the old ?param=): must start with a literal lowercase "r",
// followed by a signed number, optionally followed by any letters (the letters are just
// obfuscation/noise and are ignored). The leading "r" is what makes a value "valid" at all — the
// digits after it are what actually become the percent. Examples:
//   ?rate=r15askdhakds   -> valid, +15%  (multiplier 1.15)
//   ?rate=r0aksjdad      -> valid, +0%   (multiplier 1.00, normal price)
//   ?rate=r-26qaz        -> valid, -26%  (multiplier 0.74)
//   ?rate=0aksda         -> INVALID (no leading "r")
//   ?rate=m20kas         -> INVALID (wrong letter — must be "r", not any letter)
//   ?rate= (missing)     -> INVALID
//
// No bounds are enforced on the number itself — any signed integer after the "r" is accepted, per
// explicit instruction, so e.g. ?rate=r-500xyz produces a (negative) multiplier of -4.00. That's
// intentional: this is an internal/CS-controlled link parameter, not user-facing input.
export function parseRatePercent(raw) {
  if (raw == null) return null;
  const str = String(raw).trim();
  if (!str.startsWith('r')) return null; // the "r" prefix is mandatory
  const match = str.slice(1).match(/^(-?\d+)/);
  if (!match) return null;
  return Number(match[1]);
}

export function percentToMultiplier(percent) {
  return 1 + percent / 100;
}

// Convenience: parse straight to a multiplier, or null if the rate string is invalid (missing,
// no "r" prefix, or no number right after the "r").
export function parseRateMultiplier(raw) {
  const percent = parseRatePercent(raw);
  if (percent == null) return null;
  return percentToMultiplier(percent);
}

// ⚠️ DEPRECATED names — kept as aliases only so nothing importing the old ?param= functions
// breaks while everything gets migrated over to ?rate=. Prefer parseRatePercent/
// parseRateMultiplier in new code; these will be removed once CustForm.jsx is the only caller.
export const parseParamPercent = parseRatePercent;
export const parseParamMultiplier = parseRateMultiplier;
