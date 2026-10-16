import React, { useMemo } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, LabelList,
} from "recharts";
import { COL, parseNum } from "@/lib/sheets";
import { parseDate, monthKey, buildRecentMonths, formatKg } from "@/lib/format";

const TEAL = "#40C4C4";

function Card({ title, badge, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
        {badge && (
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/40">
            {badge}
          </span>
        )}
      </div>
      <div className="h-48">{children}</div>
    </div>
  );
}

export default function BranchCharts({ pickups }) {
  const { months, totalW, totalC } = useMemo(() => {
    const range = buildRecentMonths(6);
    const byMonth = {};
    range.forEach((m) => {
      byMonth[m.key] = {
        label: m.label.split(" ")[0] + " '" + m.label.split(" ")[1].slice(2),
        weight: 0,
        count: 0,
      };
    });

    let sumW = 0;
    let sumC = 0;

    pickups.forEach((p) => {
      const d = parseDate(p[COL.D_DATE]);
      if (d) {
        const k = monthKey(d);
        if (byMonth[k]) {
          const w = parseNum(p[COL.D_WEIGHT]);
          byMonth[k].weight += w;
          byMonth[k].count += 1;
          sumW += w;
          sumC += 1;
        }
      }
    });

    const months = range.map((m) => ({
      ...byMonth[m.key],
      weight: Math.round(byMonth[m.key].weight),
    }));

    return { months, totalW: Math.round(sumW), totalC: sumC };
  }, [pickups]);

  const axisProps = { tick: { fontSize: 10, fill: "#94a3b8" }, stroke: "#cbd5e1" };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
      <Card
        title="Tren Pengambilan Bulanan (Kg)"
        badge={`Total: ${formatKg(totalW)} Kg`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={months} margin={{ top: 16, right: 14, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip
              formatter={(v) => [`${formatKg(v)} Kg`, "Berat Limbah"]}
              contentStyle={{ fontSize: 11, borderRadius: 8 }}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke={TEAL}
              strokeWidth={2}
              dot={{ r: 3.5, fill: TEAL, strokeWidth: 1.5, stroke: "#ffffff" }}
              name="Berat (Kg)"
            >
              <LabelList
                dataKey="weight"
                position="top"
                formatter={(v) => (v > 0 ? `${formatKg(v)}` : "")}
                style={{ fontSize: 9, fill: "#0f766e", fontWeight: "600" }}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card
        title="Jumlah Kunjungan"
        badge={`Total: ${totalC}x Pickup`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={months} margin={{ top: 16, right: 14, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis {...axisProps} allowDecimals={false} />
            <Tooltip
              formatter={(v) => [`${v} Kunjungan`, "Jumlah"]}
              contentStyle={{ fontSize: 11, borderRadius: 8 }}
            />
            <Bar dataKey="count" fill={TEAL} radius={[4, 4, 0, 0]} name="Kunjungan">
              <LabelList
                dataKey="count"
                position="top"
                formatter={(v) => (v > 0 ? `${v}` : "")}
                style={{ fontSize: 9, fill: "#334155", fontWeight: "700" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}