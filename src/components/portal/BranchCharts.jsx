import React, { useMemo } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { COL, parseNum } from "@/lib/sheets";
import { parseDate, monthKey, buildRecentMonths } from "@/lib/format";

const TEAL = "#40C4C4";

function Card({ title, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
      <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">{title}</h3>
      <div className="h-48">{children}</div>
    </div>
  );
}

export default function BranchCharts({ pickups }) {
  const months = useMemo(() => {
    const range = buildRecentMonths(6);
    const byMonth = {};
    range.forEach((m) => {
      byMonth[m.key] = {
        label: m.label.split(" ")[0] + " '" + m.label.split(" ")[1].slice(2),
        weight: 0,
        count: 0,
      };
    });
    pickups.forEach((p) => {
      const d = parseDate(p[COL.D_DATE]);
      if (d) {
        const k = monthKey(d);
        if (byMonth[k]) {
          byMonth[k].weight += parseNum(p[COL.D_WEIGHT]);
          byMonth[k].count += 1;
        }
      }
    });
    return range.map((m) => ({
      ...byMonth[m.key],
      weight: Math.round(byMonth[m.key].weight),
    }));
  }, [pickups]);

  const axisProps = { tick: { fontSize: 10, fill: "#94a3b8" }, stroke: "#cbd5e1" };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
      <Card title="Tren Pengambilan Bulanan (Kg)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={months} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Line type="monotone" dataKey="weight" stroke={TEAL} strokeWidth={2} dot={{ r: 3, fill: TEAL }} name="Berat (Kg)" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Jumlah Kunjungan">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={months} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="label" {...axisProps} />
            <YAxis {...axisProps} allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Bar dataKey="count" fill={TEAL} radius={[4, 4, 0, 0]} name="Kunjungan" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}