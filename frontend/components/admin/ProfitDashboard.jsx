"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiUsers, 
  FiCalendar, 
  FiPieChart, 
  FiBarChart2,
  FiArrowUpRight,
  FiActivity,
  FiShield
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from "recharts";
import dynamic from "next/dynamic";

const Sparkline = dynamic(
  () => import("../dashboard/DashboardRecharts").then(mod => mod.Sparkline),
  { ssr: false }
);

export default function ProfitDashboard() {
  const { user, token } = useAuth();
  const [profitData, setProfitData] = useState({
    totalRevenue: 245000,
    totalProfit: 68400,
    adminCommission: 42000,
    agentCommission: 26400,
    totalTrips: 156,
    monthlyData: [
      { name: 'Jan', revenue: 45000, profit: 12000 },
      { name: 'Feb', revenue: 52000, profit: 15000 },
      { name: 'Mar', revenue: 48000, profit: 11000 },
      { name: 'Apr', revenue: 61000, profit: 18000 },
      { name: 'May', revenue: 55000, profit: 14000 },
      { name: 'Jun', revenue: 67000, profit: 21000 },
    ],
    topAgents: [
      { id: 1, name: "Dawit M.", trips: 24, commission: 8400 },
      { id: 2, name: "Helen K.", trips: 18, commission: 6200 },
      { id: 3, name: "Samson G.", trips: 15, commission: 5100 },
    ],
    recentTransactions: [
      { id: 'tx-1', date: '2026-04-15', customerName: 'John Doe', destination: 'Lalibela', total: 4500, agentName: 'Dawit M.', profit: 850 },
      { id: 'tx-2', date: '2026-04-14', customerName: 'Sarah J.', destination: 'Gondar', total: 3200, agentName: 'Helen K.', profit: 620 },
      { id: 'tx-3', date: '2026-04-14', customerName: 'Mike R.', destination: 'Simien', total: 5800, agentName: 'Dawit M.', profit: 1150 },
    ]
  });
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    // In a real app, you'd fetch from API here
    // fetchProfitData();
  }, [timeRange]);

  const stats = useMemo(() => [
    { label: "Total Revenue", val: `$${profitData.totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10", spark: [10, 15, 8, 22, 18, 30] },
    { label: "Company Profit", val: `$${profitData.totalProfit.toLocaleString()}`, icon: FiTrendingUp, color: "text-purple-400", bg: "bg-purple-500/10", spark: [5, 12, 15, 10, 25, 20] },
    { label: "Admin Commissions", val: `$${profitData.adminCommission.toLocaleString()}`, icon: FiShield, color: "text-blue-400", bg: "bg-blue-500/10", spark: [12, 18, 14, 25, 22, 28] },
    { label: "Total Operations", val: profitData.totalTrips, icon: FiActivity, color: "text-amber-400", bg: "bg-amber-500/10", spark: [20, 25, 22, 30, 28, 35] },
  ], [profitData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-[#0d0d1a] rounded-3xl">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent shadow-lg shadow-purple-500/20"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-[#0d0d1a] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Fiscal <span className="text-purple-400">Telemetry</span></h2>
          <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Real-time revenue & commission oversight</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-purple-500 transition-all uppercase tracking-widest"
          >
            <option value="week">Current Cycle</option>
            <option value="month">Monthly Overview</option>
            <option value="quarter">Quarterly Audit</option>
            <option value="year">Annual Report</option>
          </select>
          <button className="p-2.5 rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/20 hover:bg-purple-500 transition">
            <FiArrowUpRight size={18} />
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-[#12122a] border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all"
          >
            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${s.bg} blur-3xl opacity-30 group-hover:scale-125 transition-transform`} />
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-2xl font-black text-white">{s.val}</p>
              </div>
              <div className={`p-3 rounded-xl ${s.bg} ${s.color} ring-1 ring-white/10`}>
                <s.icon size={20} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400">+12.5%</span>
              <Sparkline 
                data={s.spark.map(v => ({ value: v }))} 
                color="#a855f7" 
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-3xl bg-[#12122a] border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Revenue Growth Protocol</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-purple-500" />
                 <span className="text-[10px] font-bold text-white/40 uppercase">Revenue</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500" />
                 <span className="text-[10px] font-bold text-white/40 uppercase">Profit</span>
               </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitData.monthlyData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorProf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-[#12122a] border border-white/10 shadow-xl flex flex-col">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8">Top Operational Agents</h3>
          <div className="flex-1 space-y-4">
            {profitData.topAgents.map((agent, i) => (
              <div key={agent.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase">{agent.name}</p>
                    <p className="text-[10px] text-white/30 uppercase">{agent.trips} Operations</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-emerald-400">${agent.commission.toLocaleString()}</p>
                  <p className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Commission</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition">
            View All Staff
          </button>
        </div>
      </div>

      {/* Recent Ledger */}
      <div className="p-8 rounded-3xl bg-[#12122a] border border-white/10 shadow-xl">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
          <FiCalendar size={16} className="text-purple-400" /> Operational Ledger
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-black text-white/20 border-b border-white/5">
              <tr>
                <th className="pb-4 px-2">Cycle Date</th>
                <th className="pb-4">Client Entity</th>
                <th className="pb-4">Destination Node</th>
                <th className="pb-4">Total Assets</th>
                <th className="pb-4">Agent Node</th>
                <th className="pb-4 text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {profitData.recentTransactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-5 px-2 text-white/40">{tx.date}</td>
                  <td className="py-5 font-bold text-white uppercase tracking-tight">{tx.customerName}</td>
                  <td className="py-5">
                    <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 font-bold text-[10px] uppercase">{tx.destination}</span>
                  </td>
                  <td className="py-5 font-black text-white">${tx.total.toLocaleString()}</td>
                  <td className="py-5 text-white/50">{tx.agentName}</td>
                  <td className="py-5 text-right font-black text-emerald-400">${tx.profit.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
