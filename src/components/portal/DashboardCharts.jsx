import React, { useMemo } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { COL, parseNum } from "@/lib/sheets";
import { parseDate, monthKey, buildRecentMonths, formatKg } from "@/lib/format";

const TEAL = "#40C4C4";
const PIE_COLORS = ["#2ba5ad", "#f59e0b", "#0ea5e9", "#0f172a", "#22c55e", "#a855f7", "#ef4444", "#64748b", "#eab308", "#3cc0c9"];

function Card({ title, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
      <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">{title}</h3>
      <div className="h-64">{children}</div>
    </div>
  );
}

export default function DashboardCharts({ pickups, branches }) {
  const branchName = useMemo(() => {
    const m = {};
    branches.forEach((b) => { m[b[COL.B_ID]] = b[COL.B_SINGKATAN] || b[COL.B_NAME] || b[COL.B_ID]; });
    return m;
  }, [branches]);

  const { months, perBranch } = useMemo(() => {
    const range = buildRecentMonths(6);
    const byMonth = {};
    range.forEach((m) => { byMonth[m.key] = { label: m.label.split(" ")[0] + " '" + m.label.split(" ")[1].slice(2), weight: 0, count: 0 }; });
    const branchAgg = {};
    pickups.forEach((p) => {
      const d = parseDate(p[COL.D_DATE]);
      const w = parseNum(p[COL.D_WEIGHT]);
      const k = d ? monthKey(d) : null;
      if (k && byMonth[k]) { byMonth[k].weight += w; byMonth[k].count += 1; }
      // Keep the per-branch breakdown in sync with the same last-6-months
      // window as the monthly trend charts above.
      if (k && byMonth[k]) {
        const bn = branchName[p[COL.D_BRANCH]] || p[COL.D_BRANCH] || "Lainnya";
        branchAgg[bn] = branchAgg[bn] || { name: bn, weight: 0, count: 0 };
        branchAgg[bn].weight += w;
        branchAgg[bn].count += 1;
      }
    });
    const months = range.map((m) => ({ ...byMonth[m.key], weight: Math.round(byMonth[m.key].weight) }));
    const perBranch = Object.values(branchAgg).sort((a, b) => b.weight - a.weight);
    return { months, perBranch };
  }, [pickups, branchName]);

  const axisProps = { tick: { fontSize: 10, fill: "#94a3b8" }, stroke: "#cbd5e1" };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card title="Tren Pengambilan Bulanan (Kg)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={months} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Line type="monotone" dataKey="weight" stroke={TEAL} strokeWidth={2.5} dot={{ r: 3, fill: TEAL }} name="Berat (Kg)" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Jumlah Pengambilan">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={months} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis {...axisProps} allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Bar dataKey="count" fill={TEAL} radius={[4, 4, 0, 0]} name="Pengambilan" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Distribusi Berat per Cabang">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={perBranch} dataKey="weight" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
              {perBranch.map((e, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(v) => `${formatKg(v)} Kg`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Rata-rata Berat per Pengambilan per Cabang (Kg)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={perBranch.map((b) => ({ name: b.name, avg: Math.round((b.weight / (b.count || 1)) * 10) / 10 }))} margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis type="number" {...axisProps} />
            <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 10, fill: "#94a3b8" }} stroke="#cbd5e1" />
            <Tooltip formatter={(v) => `${v} Kg`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Bar dataKey="avg" fill={TEAL} radius={[0, 4, 4, 0]} name="Rata-rata (Kg)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}