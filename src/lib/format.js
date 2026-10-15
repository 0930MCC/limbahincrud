// Date & number formatting helpers. Enforces English month abbreviations (Dec, May).

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_MAP = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, mei: 4, jun: 5, jul: 6, aug: 7, agu: 7, agustus: 7,
  sep: 8, oct: 9, okt: 9, nov: 10, dec: 11, des: 11, januari: 0, februari: 1, maret: 2,
  april: 3, juni: 5, juli: 6, september: 8, oktober: 9, november: 10, desember: 11,
};

// Parse dates like "Fri, 15 Mar 24", "15 Mar 24", "15-Mar-24", "1 March 2024", "11/03/2024", "2024-03-11", Excel serial
export function parseDate(str) {
  if (!str) return null;
  if (str instanceof Date) return isNaN(str.getTime()) ? null : new Date(str.getFullYear(), str.getMonth(), str.getDate());
  let s = String(str).trim().replace(/^[a-zA-Z]{3},?\s*/, "");

  // dd/mm/yyyy
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (m) {
    let y = parseInt(m[3], 10); if (y < 100) y += 2000;
    return new Date(y, parseInt(m[2], 10) - 1, parseInt(m[1], 10));
  }

  // ISO datetime, e.g. what Apps Script sends when a Date cell is JSON-serialized without
  // explicit formatting: "2025-07-14T17:00:00.000Z". Parsed natively (respecting the offset/Z)
  // and then read back using local calendar fields, so the date doesn't shift by a day.
  if (/^\d{4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{2}/.test(s)) {
    const native = new Date(s);
    if (!isNaN(native.getTime())) return new Date(native.getFullYear(), native.getMonth(), native.getDate());
  }

  // Native JS Date.toString() output, e.g. from a naive `.toString()`/default conversion of a
  // Date cell: "Tue Jul 15 2025 00:00:00 GMT+0700 (Waktu Indonesia Barat)"
  if (/^[A-Za-z]{3}\s[A-Za-z]{3}\s\d{1,2}\s\d{4}\s\d{1,2}:\d{2}:\d{2}\sGMT/.test(s)) {
    const native = new Date(s);
    if (!isNaN(native.getTime())) return new Date(native.getFullYear(), native.getMonth(), native.getDate());
  }

  // dd Mon yy(yy) with spaces or hyphens: "15 Mar 24", "15-Mar-24", "15-Mar-2024"
  m = s.match(/^(\d{1,2})[-\s]([A-Za-z]+)[-\s](\d{2,4})/);
  if (m) {
    const mon = MONTH_MAP[m[2].toLowerCase()];
    if (mon !== undefined) {
      let y = parseInt(m[3], 10); if (y < 100) y += 2000;
      return new Date(y, mon, parseInt(m[1], 10));
    }
  }

  // Mon dd, yyyy or Mon dd yyyy: "March 15, 2024", "Mar 15 2024"
  m = s.match(/^([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{2,4})/);
  if (m) {
    const mon = MONTH_MAP[m[1].toLowerCase()];
    if (mon !== undefined) {
      let y = parseInt(m[3], 10); if (y < 100) y += 2000;
      return new Date(y, mon, parseInt(m[2], 10));
    }
  }

  // Mon-dd-yyyy or Mon-dd-yy: "Mar-15-2024"
  m = s.match(/^([A-Za-z]+)-(\d{1,2})-(\d{2,4})/);
  if (m) {
    const mon = MONTH_MAP[m[1].toLowerCase()];
    if (mon !== undefined) {
      let y = parseInt(m[3], 10); if (y < 100) y += 2000;
      return new Date(y, mon, parseInt(m[2], 10));
    }
  }

  // yyyy-mm-dd or yyyy/mm/dd (ISO, date-only)
  m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (m) {
    return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
  }

  // Excel serial date number (days since 1899-12-30)
  const serial = parseFloat(s);
  if (!isNaN(serial) && serial > 20000 && serial < 80000) {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(epoch.getTime() + serial * 86400000);
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  }

  // Fallback: extract a 4-digit year (e.g. "2027", "ends 2027")
  const yearMatch = s.match(/20(\d{2})/);
  if (yearMatch) {
    const year = parseInt("20" + yearMatch[1], 10);
    const monMatch = s.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
    const month = monMatch ? MONTH_MAP[monMatch[1].toLowerCase()] : 0;
    return new Date(year, month, 1);
  }

  return null;
}

// Formats any raw date value (from either data source — CSV/gviz plain text, or Apps Script's
// ISO/toString() serialization of a Date cell) into one consistent short display, e.g. "15 Jul 25".
// Falls back to the raw value if it can't be parsed at all, so nothing silently disappears.
export function formatDateShort(value) {
  if (!value) return value;
  const d = parseDate(value);
  if (!d) return value;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" });
}

export function monthKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(d) {
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// Build a continuous month range from earliest date to the current month (no skips)
export function buildMonthRange(dates, now = new Date()) {
  const valid = dates.filter(Boolean);
  let start = valid.length ? new Date(Math.min(...valid.map((d) => d.getTime()))) : new Date(now);
  start = new Date(start.getFullYear(), start.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  const out = [];
  const cur = new Date(start);
  while (cur <= end && out.length < 60) {
    out.push({ key: monthKey(cur), label: monthLabel(cur) });
    cur.setMonth(cur.getMonth() + 1);
  }
  return out;
}

// Build a range of the last N months ending at the current month
export function buildRecentMonths(count, now = new Date()) {
  const out = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({ key: monthKey(d), label: monthLabel(d) });
  }
  return out;
}

export function formatKg(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n % 1 === 0 ? String(n) : n.toFixed(1);
}

export function formatRupiah(v) {
  const n = typeof v === "number" ? v : parseFloat(String(v || "").replace(/[^0-9.-]/g, ""));
  if (isNaN(n)) return "-";
  return "Rp " + n.toLocaleString("id-ID");
}

// Parse amount string "1,335,330" → number
export function parseAmount(str) {
  if (!str) return 0;
  const cleaned = str.replace(/[^\d]/g, '');
  return parseInt(cleaned) || 0;
  return str;
}

export function formatAmount2(amount) {
  if (amount == null || amount === "") return "";

  const num = typeof amount === "string"
    ? parseInt(amount.replace(/[^\d-]/g, ""), 10)
    : amount;

  return `Rp ${num.toLocaleString("id-ID")}`;
}
// Format currency
export function formatCurrency(amount) {
  if (!amount) return 'Rp 0';
  return 'Rp ' + amount.toLocaleString('id-ID');
}