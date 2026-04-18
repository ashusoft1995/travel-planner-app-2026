"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#a855f7", "#7c3aed", "#6366f1", "#4f46e5", "#c084fc"];

export function Sparkline({ data, color = "#a855f7" }) {
  return (
    <div className="h-12 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartCard({ title, subtitle, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#12122a] p-6 shadow-2xl"
    >
      <div className="mb-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-white/40">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-white/20 tracking-tight">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}

export default function DashboardRecharts({ lineData, pieData }) {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <ChartCard
        title="Spending Trajectory"
        subtitle="Historical and projected budget flow by month."
      >
        <div className="h-[300px] w-full">
          {lineData.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white/5 border border-dashed border-white/10">
              <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Awaiting Date Nodes</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData}>
                <defs>
                   <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff30" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff30" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "#1a1a2e",
                    fontSize: "12px",
                    color: "#fff"
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="budget" 
                  stroke="#a855f7" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorBudget)"
                  name="Budget USD"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>

      <ChartCard
        title="Resource Distribution"
        subtitle="Budget allocation across accommodation nodes."
        delay={0.1}
      >
        <div className="h-[300px] w-full">
          {pieData.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white/5 border border-dashed border-white/10">
              <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Awaiting Budget Nodes</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#0d0d1a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "#1a1a2e",
                    fontSize: "12px"
                  }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Budget"]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>
    </div>
  );
}
