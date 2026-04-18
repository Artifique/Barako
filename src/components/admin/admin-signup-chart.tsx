"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import type { SignupsByMonth } from "@/services/admin-stats.service";

export function AdminSignupChart({ data }: { data: SignupsByMonth[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
        <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 10 }} />
        <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: "#1a2e35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
          labelStyle={{ color: "#e5e7eb" }}
        />
        <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
