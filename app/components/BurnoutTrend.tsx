"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BurnoutTrend({ data }: { data: any[] }) {
  return (
    <div className="rounded-3xl p-5 bg-slate-900/80 border border-white/10">
      <p className="text-sm font-semibold text-white">
        Burnout Drift (Last 7 Days)
      </p>
      <p className="text-xs text-slate-400 mb-4">
        Shows how burnout risk is changing over time
      </p>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis domain={[0, 100]} stroke="#94a3b8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="risk"
              stroke="#fbbf24"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
