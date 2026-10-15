// Data layer — reads from Supabase Edge Functions (was: Apps Script Web App).
// Every export, and every response shape, is IDENTICAL to the Apps Script
// version, so usePortalData.js and PortalAuth.jsx need NO changes.

// Set these in your .env (Vite: import.meta.env.VITE_..., CRA: process.env.REACT_APP_...)
// Example .env:
//   VITE_SUPABASE_FUNCTIONS_URL=https://<project-ref>.functions.supabase.co
const SUPABASE_FUNCTIONS_URL = "https://cnpdazqpxnkdqdolqueo.functions.supabase.co";
const PORTAL_DATA_URL = `${SUPABASE_FUNCTIONS_URL}/portal-data`;
const AUTH_URL = `${SUPABASE_FUNCTIONS_URL}/auth`;

// ---- COL stays 100% unchanged — same header strings, same table. ----------
export const COL = {
  // 1.User
  U_EMAIL: "Email",
  U_ID: "User ID",
  U_NAME: "Name",
  U_PIC: "PIC",
  U_JABATAN: "Jabatan",
  U_LASTACCESSED: "Last Accessed",
  // 2.Worker
  W_ID: "Worker ID",
  W_NAME: "Nama",
  W_JABATAN: "Jabatan",
  W_EMAIL: "Email",
  W_TEL: "No Tel",
  W_ACTIVE_MOU: "Active MOU",
  W_EXPIRING_MOU: "Expiring Soon MOU",
  W_EXPIRED: "Expired MOU",
  // 3.Branch
  B_ID: "Branch ID",
  B_NAME: "Column 1",
  B_FULLNAME: "ID + NAME",
  B_DAERAH: "Daerah",
  B_SINGKATAN: "Singkatan",
  B_OWNER: "Owner USER ID",
  B_RINCIAN: "Rincian Branch",
  B_STATUS: "Status",
  B_RINCIANPELAYANAN: "Rincian Pelayanan",
  B_GMAP: "GMap Link",
  B_ADDR: "Alamat Lokasi Limbah",
  B_CITY: "Kota/Kabupaten",
  B_JENIS: "Jenis Pelayanan",
  B_FREKUENSI: "Frekuensi Pengambilan",
  B_KODE: "Kode Limbah",
  // 4.MOU
  M_ID: "MOU ID",
  M_BRANCH: "Branch ID",
  M_START: "Date Start",
  M_END: "Date End",
  M_DURASI: "Durasi",
  M_NICK: "Nick Name",
  M_NAME: "Name",
  M_JENIS: "Jenis Customer",
  M_RINCIAN_PELAYANAN: "Rincian Pelayanan",
  M_PAYDATE: "PAY DATE",
  M_PAYAMOUNT: "PAY AMOUNT",
  M_MARKETING: "Marketing",
  M_USERID: "USER ID",
  M_RINCIAN: "Rincian MOU",
  M_EXTENDED: "Is Extended",
  M_KG_KONTRAK: "KG KONTRAK",
  M_KG_PAKET: "USED KG",
  M_KUNJUNGAN_PAKET: "USED KUNJUNGAN",
  M_KG_KUOTA: "Kuota Limbah",
  M_KUNJUNGAN_KUOTA: "Kuota Kunjungan",
  M_LINKMOU: "Link MOU",
  M_UNIT_LIMBAH: "Unit Limbah",
  M_INVOICE: "Invoice",
  M_ALAMATLIMBAH: "Alamat Limbah",
  M_STATUS_EXPIRY: "Status Expiry",
  M_DAERAH: "DAERAH",
  // 5.Data (pickup)
  D_ID: "ID DATA",
  D_MOU: "ID MOU",
  D_BRANCH: "ID BRANCH",
  D_KLIEN: "Nama Klien",
  D_INPUTTYPE: "Input Type",
  D_URUTAN: "Urutan/Nomor",
  D_ITEMCODE: "Item Filter Count",
  D_DEFINISI: "Definisi Item",
  D_WC: "WC",
  D_KENDARAAN: "Kendaraan",
  D_WEIGHT: "Jumlah",
  D_SATUAN: "Satuan Unit",
  D_KEMASAN: "[MUAT] Kemasan",
  D_INTREF: "[MUAT] Internal Reference",
  D_EXTREF: "[MUAT] External Reference",
  D_CATATAN: "Catatan Pelanggan",
  D_FESTRONIK2: "FESTRONIK LANGKAH 2",
  D_FESTRONIK3: "FESTRONIK LANGKAH 3",
  D_USERID: "USER ID",
  D_DATE: "Tanggal Muat",
  // 6.Invoice
  I_ID: "INVOICE ID",
  I_PERIODE: "Periode",
  I_KLIEN: "Nama Klien",
  I_DATE: "Invoice Date",
  I_DPP: "DPP",
  I_GRANDTOTAL: "Grand Total",
  I_INVFILE: "Invoice File Link",
  I_JENIS: "JENIS INVOICE",
  I_PAIDDATE: "Paid Date",
  I_PAIDAMOUNT: "Paid Amount",
  I_ADJUSTMENTAMOUNT1: "Adjustment Amount 1",
  I_ADJUSTMENT: "Adjustment 1",
  I_ADJUSTMENTAMOUNT2: "Adjustment Amount 2",
  I_ADJUSTMENT2: "Adjustment 2",
  I_ADJFILE1: "File Adjustment 1",
  I_ADJFILE2: "File Adjustment 2",
  I_MARKETING: "Marketing",
  I_KOMISI: "Komisi",
  I_STATUS: "Invoice Status",
  I_USERID: "INVOICE USER ID",
  I_SISA: "Final Difference",
  // 7.BA
  BA_ID: "BA ID",
  BA_PERIODE: "PERIODE BA",
  BA_CUSTID: "CUST ID",
  BA_KLIEN: "NAMA KLIEN",
  BA_DATE: "TANGGAL BA",
  BA_FREKUENSI: "FREKUENSI",
  BA_EMAIL: "EMAIL KLIEN",
  BA_FILE: "FILE BA",
  BA_OWNERID: "OWNER ID",
  // 8.Sudah Komisi
  SK_INVID: 'INVOICE ID',
  SK_AMOUNT: 'Periode',
  SK_INVCUSTNAME: 'Nama Klien',
  SK_INVTOTAL: 'Grand Total',
  SK_INVTYPE: 'JENIS INVOICE',
  SK_INVPAIDDATE: 'Paid Date',
  SK_INVPAIDAMOUNT: 'Paid Amount',
  SK_MARKETING: 'Marketing',
  SK_C1AMOUNT: 'Komisi',
  SK_C1DATE: 'C1 Paid Date',
  SK_C1PAIDAMOUNT: 'C1 Paid Amount',
  // 9.Belum Komisi
  BK_MKTID: 'Marketing',
  BK_INVID: 'Invoice ID',
  BK_CAMOUNT: 'Commission',
  // Best-effort guess at the invoice-total column's header on the "Belum Komisi" sheet tab — the
  // "sudah" tab has a confirmed 'Grand Total' column (SK_INVTOTAL above) but nothing on this tab
  // was previously mapped for it. If the header text differs, change it here — BelumKomisiTable
  // shows "-" for any row where this comes back blank, so a wrong guess degrades safely rather
  // than breaking anything.
  BK_INVAMOUNT: 'Grand Total',
  BK_INVTYPE: 'Invoice Type',
  BK_CUSTNAME: 'Cust Name',
  BK_INVDATE: 'Invoice Date',
  BK_LEMBAGA: 'Lembaga',
  // 10.Perizinan
  PZ_NOMOR: "Nomor File",
  PZ_FILEPERUSAHAAN: "File Perusahaan",
  PZ_TGLMULAI: "Tanggal Mulai",
  PZ_TGLEXPIRED: "Tanggal Expired",
  PZ_JENISDOKUMEN: "Jenis Dokumen",
  PZ_LEMBAGA: "Lembaga",
  PZ_KODELIMBAH: "Kode Limbah",
  PZ_TOTALKODE: "Total Kode",
  PZ_LINKDOKUMEN: "Link Dokumen",
  PZ_USERID: "User ID",
  PZ_KLASIFIKASI: "Klasifikasi",
  // 11.Dokumentasi
  DOK_ID: "ID Dokumentasi",
  DOK_DATE: "Tanggal Operasional",
  DOK_OWNER: "Owner ID",
  DOK_DESC: "Description",
  DOK_VIDEO: "Video Links",
  DOK_PHOTO: "Photo Links",
  // 12.Jadwal (new — see supabase/README additions for the `jadwal` table this reads from)
  J_ID: "ID",
  J_DATA: "DATA",
  J_AUTOJADWAL: "AUTO JADWAL",
  J_USER: "USER",
  J_MARKETING: "MARKETING",
  J_REQOLEH: "REQ OLEH",
  J_CUSTID: "CUST ID",
  J_PETUGAS: "Petugas",
  J_KENDARAAN: "Kendaraan",
  J_TANGGAL: "Tanggal",
  J_URUTAN: "URUTAN",
  J_DATE: "Date",
  J_CUSTNAME: "CUST NAME",
  J_CATATAN: "Catatan Manual",
  J_MAPLINK: "CUST MAP LINK",
  J_RESCHEDPROBLEM: "RESCHED PROBLEM",
  J_RESCHEDID: "RESCHED ID",
  // 13.CRM (new — same table group as Jadwal)
  C_ID: "ID REQUEST",
  C_MARKETING: "Marketing",
  C_USER: "User",
  C_TANGGAL: "TANGGAL REQ",
  C_JENIS: "JENIS REQ",
  C_CUSTID: "ID KLIEN",
  C_CUSTDATA: "DATA KLIEN",
  C_REQOLEH: "REQ OLEH",
  C_CATATAN: "CATATAN REQUEST",
  C_PIC: "PIC",
  C_SOLUSI: "SOLUSI",
};

export function colLetterToIndex(letter) {
  let n = 0;
  for (const ch of String(letter).toUpperCase()) {
    if (ch < "A" || ch > "Z") continue;
    n = n * 26 + (ch.charCodeAt(0) - 64);
  }
  return n - 1;
}

export function getColByLetter(row, letter) {
  if (!row) return "";
  const idx = colLetterToIndex(letter);
  const values = Object.values(row);
  return values[idx] !== undefined ? values[idx] : "";
}

const cache = {};

export function clearCache() {
  Object.keys(cache).forEach((k) => delete cache[k]);
}

export function invalidateTab(name, token) {
  delete cache[name + "::" + (token || "")];
}

export async function loadTab(name, token) {
  const cacheKey = name + "::" + (token || "");
  if (cache[cacheKey]) return cache[cacheKey];

  const promise = fetchEdgeFunction(name, token);
  cache[cacheKey] = promise;
  return promise;
}

async function fetchEdgeFunction(name, token) {
  if (!PORTAL_DATA_URL) {
    throw new Error("Supabase Functions URL belum dikonfigurasi. Set VITE_SUPABASE_FUNCTIONS_URL.");
  }
  if (!token) {
    throw sessionExpiredError();
  }
  const url = `${PORTAL_DATA_URL}?tab=${encodeURIComponent(name)}&token=${encodeURIComponent(token)}`;
  return fetch(url)
    .then(async (r) => {
      if (!r.ok) {
        // Read the body (if any) so an expired/invalid session can be told apart from a
        // genuine server failure — the two need different messages and different buttons.
        let msg = "";
        try { const j = await r.clone().json(); msg = (j && (j.error || j.message)) || ""; } catch { /* not JSON */ }
        if (isSessionProblem(r.status, msg)) throw sessionExpiredError();
        throw new Error("Gagal memuat data dari server");
      }
      return r.json();
    })
    .then((data) => {
      if (data && data.error) {
        if (isSessionProblem(200, String(data.error))) throw sessionExpiredError();
        throw new Error(data.error);
      }
      return Array.isArray(data) ? data.map(stringifyRow) : data;
    })
    .catch((e) => { delete cache[name + "::" + (token || "")]; throw e; });
}

// The server rejects a stale token with 401/403 or an "Unauthorized / invalid session" message.
// Either one means the same thing for the user: log out and log in again.
export const SESSION_EXPIRED = "SESSION_EXPIRED";
function isSessionProblem(status, message) {
  if (status === 401 || status === 403) return true;
  return /unauthori[sz]ed|not authori[sz]ed|invalid (token|session)|session (expired|not found|invalid)|token (expired|invalid)|sesi|kedaluwarsa|please log in/i.test(message || "");
}
function sessionExpiredError() {
  const e = new Error("Sesi Anda telah berakhir.");
  e.code = SESSION_EXPIRED;
  return e;
}

// Same normalization as before — jsonb round-trips most types cleanly, but
// this keeps behavior identical for anything relying on string coercion.
function stringifyRow(row) {
  if (!row || typeof row !== "object") return row;
  const out = {};
  for (const k in row) {
    const v = row[k];
    out[k] = v === null || v === undefined ? "" : String(v);
  }
  return out;
}

// ----------------------------------------------------------------------------
// AUTH
// ----------------------------------------------------------------------------

// Returns { success, token, role, profile } on success, or throws on failure.
export async function login(tab, identifier, password) {
  if (!AUTH_URL) {
    throw new Error("URL belum dikonfigurasi");
  }

  let res;
  try {
    res = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "login", tab, identifier, password }),
    });
  } catch (networkErr) {
    throw new Error("Gagal menghubungi server: " + networkErr.message);
  }

  const rawText = await res.text();

  let data;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch (parseErr) {
    console.error("Login response was not JSON:", rawText);
    throw new Error(`Server tidak mengembalikan JSON (status ${res.status}).`);
  }

  if (!res.ok) {
    const serverMsg = (data && data.error) || rawText || "(tidak ada detail dari server)";
    const err = new Error(`Gagal menghubungi server (status ${res.status}): ${serverMsg}`);
    err.status = res.status;
    if (data && data.locked) {
      err.locked = true;
      err.remainingSeconds = data.remainingSeconds || 0;
    }
    throw err;
  }

  if (!data || data.error) {
    const err = new Error((data && data.error) || "Kredensial tidak valid.");
    if (data && data.locked) {
      err.locked = true;
      err.remainingSeconds = data.remainingSeconds || 0;
    }
    throw err;
  }

  return data; // { success, token, role, profile }
}

// Fire-and-forget, same as before.
export async function recordLogin(token, role, id) {
  if (!AUTH_URL || !token || !id) return;
  const tab = role === "office" ? "worker" : "user";
  try {
    await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "recordLogin", tab, id, token }),
    });
  } catch (e) {
    console.warn("recordLogin: gagal mencatat last accessed", e);
  }
}

export function parseNum(v) {
  if (v === undefined || v === null) return 0;
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ""));
  return isNaN(n) ? 0 : n;
}
