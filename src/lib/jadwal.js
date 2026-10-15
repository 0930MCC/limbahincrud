// Derived fields for the Jadwal tab, kept as plain functions here (rather than expecting the
// sheet/Supabase to precompute them) so they stay in lock-step with the exact spreadsheet
// formulas they mirror. If the sheet's own formulas ever change, update these to match.
import { COL } from "@/lib/sheets";
import { parseDate } from "@/lib/format";

// Sheet: =if(G="","", if(F="","LIMBAHIN menjadwalkan","Klien Request Jadwal"))
// G = CUST ID, F = REQ OLEH
export function jadwalSource(row) {
  const custId = String(row?.[COL.J_CUSTID] || "").trim();
  if (!custId) return "";
  const reqOleh = String(row?.[COL.J_REQOLEH] || "").trim();
  return reqOleh ? "Klien Request Jadwal" : "LIMBAHIN menjadwalkan";
}

// Sheet: =if(G="","", concatenate(
//   if(J=today(),"Today", if(today()<J,"Upcoming","Completed")),
//   if(P="","", " - Reschedule to " & if(Q="","[Pending]",Q) & " ")
// ))
// G = CUST ID, J = Tanggal, P = RESCHED PROBLEM, Q = RESCHED ID
export function jadwalStatus(row) {
  const custId = String(row?.[COL.J_CUSTID] || "").trim();
  if (!custId) return "";

  const tanggal = parseDate(row?.[COL.J_TANGGAL]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let base = "Completed";
  if (tanggal) {
    const t = new Date(tanggal.getFullYear(), tanggal.getMonth(), tanggal.getDate());
    if (t.getTime() === today.getTime()) base = "Today";
    else if (today.getTime() < t.getTime()) base = "Upcoming";
  }

  const reschedProblem = String(row?.[COL.J_RESCHEDPROBLEM] || "").trim();
  if (!reschedProblem) return base;
  const reschedId = String(row?.[COL.J_RESCHEDID] || "").trim();
  return `${base} - Reschedule to ${reschedId || "[Pending]"} `;
}

export function jadwalStatusTone(statusLabel) {
  if (statusLabel.startsWith("Today")) return "amber";
  if (statusLabel.startsWith("Upcoming")) return "sky";
  if (statusLabel.startsWith("Completed")) return "emerald";
  return "slate";
}

// Urutan (visit sequence number for the day) roughly maps to a time window — not a hard rule
// ("kecuali diinfokan lebih lanjut" / unless told otherwise), just the usual pattern, shown as a
// hint next to the field rather than trusted as an exact time.
export function urutanTimeHint(urutan) {
  const n = parseInt(String(urutan || "").replace(/[^0-9]/g, ""), 10);
  if (!n) return "";
  return n <= 4 ? "Biasanya sebelum jam 12 siang" : "Biasanya jam 12 siang – 5 sore";
}
