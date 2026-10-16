import React, { useMemo } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList,
} from "recharts";
import { COL, parseNum } from "@/lib/sheets";
import { parseDate, monthKey, buildRecentMonths, formatKg } from "@/lib/format";

const TEAL = "#40C4C4";
const PIE_COLORS = ["#2ba5ad", "#f59e0b", "#0ea5e9", "#0f172a", "#22c55e", "#a855f7", "#ef4444", "#64748b", "#eab308", "#3cc0c9"];

function Card({ title, badge, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
        {badge && (
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/40">
            {badge}
          </span>
        )}
      </div>
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

  const { months, perBranch, totalWeightWindow, totalCountWindow } = useMemo(() => {
    const range = buildRecentMonths(6);
    const byMonth = {};
    range.forEach((m) => { byMonth[m.key] = { label: m.label.split(" ")[0] + " '" + m.label.split(" ")[1].slice(2), weight: 0, count: 0 }; });
    const branchAgg = {};
    let totalW = 0;
    let totalC = 0;

    pickups.forEach((p) => {
      const d = parseDate(p[COL.D_DATE]);
      const w = parseNum(p[COL.D_WEIGHT]);
      const k = d ? monthKey(d) : null;
      if (k && byMonth[k]) {
        byMonth[k].weight += w;
        byMonth[k].count += 1;
        totalW += w;
        totalC += 1;

        const bn = branchName[p[COL.D_BRANCH]] || p[COL.D_BRANCH] || "Lainnya";
        branchAgg[bn] = branchAgg[bn] || { name: bn, weight: 0, count: 0 };
        branchAgg[bn].weight += w;
        branchAgg[bn].count += 1;
      }
    });

    const months = range.map((m) => ({ ...byMonth[m.key], weight: Math.round(byMonth[m.key].weight) }));
    const perBranch = Object.values(branchAgg).sort((a, b) => b.weight - a.weight);
    return { months, perBranch, totalWeightWindow: Math.round(totalW), totalCountWindow: totalC };
  }, [pickups, branchName]);

  const axisProps = { tick: { fontSize: 10, fill: "#94a3b8" }, stroke: "#cbd5e1" };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Monthly Weight Trend with explicit numbers on points */}
      <Card
        title="Tren Pengambilan Bulanan (Kg)"
        badge={`Total: ${formatKg(totalWeightWindow)} Kg`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={months} margin={{ top: 18, right: 16, left: -4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip
              formatter={(v) => [`${formatKg(v)} Kg`, "Berat Limbah"]}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke={TEAL}
              strokeWidth={2.5}
              dot={{ r: 4, fill: TEAL, strokeWidth: 2, stroke: "#ffffff" }}
              name="Berat (Kg)"
            >
              <LabelList
                dataKey="weight"
                position="top"
                formatter={(v) => (v > 0 ? `${formatKg(v)}` : "")}
                style={{ fontSize: 10, fill: "#0f766e", fontWeight: "600" }}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* 2. Pickup Frequency Counts with explicit numbers on top of bars */}
      <Card
        title="Jumlah Pengambilan (Frekuensi Transaksi)"
        badge={`Total: ${totalCountWindow} Kunjungan`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={months} margin={{ top: 18, right: 16, left: -4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis {...axisProps} allowDecimals={false} />
            <Tooltip
              formatter={(v) => [`${v} Transaksi`, "Jumlah Pengambilan"]}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Bar dataKey="count" fill={TEAL} radius={[4, 4, 0, 0]} name="Pengambilan">
              <LabelList
                dataKey="count"
                position="top"
                formatter={(v) => (v > 0 ? `${v}` : "")}
                style={{ fontSize: 10, fill: "#334155", fontWeight: "700" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* 3. Branch Distribution Pie Chart with percentage & weight values */}
      <Card
        title="Distribusi Berat per Cabang"
        badge={`${perBranch.length} Cabang Aktif`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={perBranch}
              dataKey="weight"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={2}
              label={({ name, percent, value }) =>
                percent > 0.05 ? `${name}: ${formatKg(value)} Kg (${(percent * 100).toFixed(0)}%)` : ""
              }
              labelLine={false}
            >
              {perBranch.map((e, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v, name) => [`${formatKg(v)} Kg`, name]}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* 4. Average Weight per Pickup per Branch with exact values */}
      <Card
        title="Rata-rata Berat per Pengambilan per Cabang (Kg)"
        badge={
          perBranch.length > 0
            ? `Rata-rata Global: ${Math.round(totalWeightWindow / (totalCountWindow || 1))} Kg/rit`
            : null
        }
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={perBranch.map((b) => ({
              name: b.name,
              avg: Math.round((b.weight / (b.count || 1)) * 10) / 10,
              totalWeight: Math.round(b.weight),
              count: b.count,
            }))}
            margin={{ top: 4, right: 36, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis type="number" {...axisProps} />
            <YAxis type="category" dataKey="name" width={75} tick={{ fontSize: 10, fill: "#94a3b8" }} stroke="#cbd5e1" />
            <Tooltip
              formatter={(v, name, item) => [
                `${v} Kg/rit (Total ${formatKg(item.payload.totalWeight)} Kg dari ${item.payload.count}x pickup)`,
                "Rata-rata",
              ]}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Bar dataKey="avg" fill={TEAL} radius={[0, 4, 4, 0]} name="Rata-rata (Kg)">
              <LabelList
                dataKey="avg"
                position="right"
                formatter={(v) => `${v} kg`}
                style={{ fontSize: 10, fill: "#0f766e", fontWeight: "700" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}