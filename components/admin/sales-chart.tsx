"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts"

const data = [
  { day: "السبت", sales: 42 },
  { day: "الأحد", sales: 68 },
  { day: "الاثنين", sales: 51 },
  { day: "الثلاثاء", sales: 89 },
  { day: "الأربعاء", sales: 74 },
  { day: "الخميس", sales: 112 },
  { day: "الجمعة", sales: 96 },
]

export function SalesChart() {
  return (
    <div className="h-64 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7CA3C4" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#7CA3C4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEE3D8" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9C8F84" }} axisLine={false} tickLine={false} reversed />
          <Tooltip
            contentStyle={{ direction: "rtl", borderRadius: 8, border: "1px solid #EEE3D8", fontSize: 12 }}
            formatter={(value) => [`${value} د.ب`, "المبيعات"]}
          />
          <Area type="monotone" dataKey="sales" stroke="#7CA3C4" strokeWidth={2} fill="url(#salesGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
