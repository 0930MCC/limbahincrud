# Rekapan (Executive Summary & Historical Analytics)

A dedicated, comprehensive summary report module for the LIMBAHIN client portal. It aggregates all available operational pickups, service contracts (MOUs), branch activity, and billing invoices into unified Monthly and Yearly executive summaries with explicit date coverage boundaries.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Key Architecture Decisions:**
> - **Sidebar Placement**: Adding **"Rekapan"** under the Client Portal navigation with an analytics icon (`BarChart3` / `FileSpreadsheet`), positioned directly between Dashboard and Pelayanan for immediate executive access.
> - **Dynamic Date Range Boundaries**: For the Yearly report, the system will dynamically detect the earliest and latest recorded activity dates (from pickup logs and invoices) rather than assuming calendar Jan 1 – Dec 31. This ensures partial years are explicitly labeled (e.g., `12 Feb 2024 s/d 28 Okt 2024 · 9 Bulan`).
> - **Multi-Entity Cross-Aggregation**: Unifies physical operations (Kg waste collected, pickup trip frequency, waste categories) with financial compliance (billed DPP, Grand Total, paid collections, and outstanding dues).

- **Confirmed Decision 1**: Provide two switchable view modes — **Bulanan (Monthly)** and **Tahunan (Yearly)**.
- **Confirmed Decision 2**: Explicitly print the effective date span (`dari tanggal X s/d tanggal Y`) on yearly summaries to reflect partial-year contract or operational data.
- **Confirmed Decision 3**: Provide instant metric breakdowns across branches and waste categories, backed by exportable/printable views.

---

## 1. Overview & Core Concept

- **What It Does**: Provides client executives and branch managers with an end-to-end historical digest of their hazardous waste (Limbah B3) management. Users can toggle between monthly trends and annual recaps, viewing total tonnage, collection frequency, branch volume rankings, and payment statuses.
- **Target Audience**: Corporate environmental officers, branch operational heads, and finance controllers overseeing multi-branch compliance.
- **Key Value**: Eliminates the need to manually cross-reference separate Invoice, Berita Acara, and Pickup tabs. Delivers instant audit-ready numbers with exact date ranges for environmental compliance and fiscal reporting.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Entry**: User clicks **"Rekapan"** in the sidebar.
2. **View Selection**: A clean segmented switch at the top allows toggling between **"Ringkasan Bulanan"** (Monthly) and **"Ringkasan Tahunan"** (Yearly).
3. **Yearly View**:
   - The user selects or views the desired year.
   - An informative period banner clearly displays the exact recorded bounds: e.g. `Periode Tercatat: 15 Jan 2024 s/d 28 Okt 2024 (Total 287 Hari)`.
   - Four top-line KPI cards show: Cumulative Weight (Kg / Ton), Total Pickups (Rit), Total Invoiced Amount (Rp), and Payment Settlement Ratio (Paid vs. Outstanding).
   - A structured summary table breaks down totals by month and by branch.
4. **Monthly View**:
   - Month-by-month card/table cards with collapsible details showing branch distribution, waste types collected, invoice ID links, and payment status badges.

### Visual Identity & Theme
- **Theme Tokens**: Fully compliant with the existing Tailwind dark/light theme (`dark:bg-slate-900`, `dark:border-slate-800`, `dark:text-slate-100`).
- **Accent Budget**: Cyan / Brand accent (`bg-brand-600`, `border-brand-500`, `text-brand-600`) reserved strictly for active view states and key metrics.
- **Tabular Figures**: Every metric, weight count, and currency figure uses `font-mono tabular-nums` for crisp vertical alignment and zero visual jitter.
- **Zero-Pill Discipline**: Metadata (branch names, date ranges, contract counts) are displayed as quiet, unboxed text separated by typographic markers (`·`, `/`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Date Range Detection Strategy**
  - *Chosen Approach*: Scan all timestamps in `D_DATE` (pickups) and `I_DATE` (invoices) for each year group to derive `minDate` and `maxDate`.
  - *Why*: In environmental waste services, clients often sign contracts mid-year or operate in seasonal waves. Showing standard "Jan - Dec" misleads audits when services only ran from March to November.
- **Decision 2: Comprehensive Multi-Tab Synthesis**
  - *Chosen Approach*: Query `["branch", "mou", "data", "invoice", "ba"]` in a single pass via `useTabData`.
  - *Why*: Existing caching via `useTabData` already deduplicates and memoizes requests, ensuring sub-100ms instant view switches without separate backend roundtrips.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Client Portal Layout                            │
│  ┌───────────────────────┐   ┌──────────────────────────────────────┐  │
│  │   Sidebar Navigation  │   │          Rekapan Route               │  │
│  │   • Dashboard         │   │          (/app/rekapan)              │  │
│  │   • Rekapan (NEW) ────┼──►│                                      │  │
│  │   • Pelayanan         │   │   useTabData(["branch", "mou",       │  │
│  │   • Dokumen           │   │               "data", "invoice"])    │  │
│  └───────────────────────┘   └──────────────────┬───────────────────┘  │
└─────────────────────────────────────────────────┼──────────────────────┘
                                                  │
                                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Data Aggregation & Grouping Engine                   │
│                                                                        │
│  • Parse dates via parseDate() across Pickups (D_DATE) & Invoices     │
│  • Compute Yearly coverage bounds: [minDate, maxDate] per year         │
│  • Aggregate metrics:                                                  │
│    - Total Weight (Kg & Ton)                                           │
│    - Total Rit / Pengambilan count                                     │
│    - Total Invoice Grand Total, DPP, Paid Amount, Final Difference     │
│    - Breakdown by Branch ID / Branch Name                              │
│    - Breakdown by Waste Type (Item code / definisi)                    │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                  ┌────────────────┴────────────────┐
                  ▼                                 ▼
   ┌─────────────────────────────┐   ┌─────────────────────────────┐
   │        Monthly View         │   │         Yearly View         │
   │  • Month selection/filter   │   │  • Year selection           │
   │  • Monthly trend cards      │   │  • "Dari ... s/d ..." badge │
   │  • Operations & Billing     │   │  • Annual executive rollups │
   │    side-by-side breakdown   │   │  • Branch ranking table     │
   └─────────────────────────────┘   └─────────────────────────────┘
```

### File Changes Planned:
1. `/src/pages/Rekapan.jsx`: Create the new summary page with complete monthly & yearly aggregation, partial-year date span detection, KPI cards, and responsive data tables.
2. `/src/components/portal/Sidebar.jsx`: Add the "Rekapan" navigation item under B3 client navigation.
3. `/src/App.jsx`: Register the `/app/rekapan` route inside `PortalLayout`.
