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
  FiShield,
  FiRefreshCw
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { tripsApi, friendlyApiMessage } from "../../lib/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import dynamic from "next/dynamic";

const Sparkline = dynamic(
  () => import("../dashboard/DashboardRecharts").then(mod => mod.Sparkline),
  { ssr: false }
);

export default function ProfitDashboard() {
  const { token } = useAuth();
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");

  const profitData = {
    totalRevenue: 245000,
    totalProfit: 68400,
    adminCommission: 42000,
    agentCommission: 26400,
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
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await tripsApi.get("/stats");
      setStatsData(response.data?.data);
    } catch (error) {
      toast.error(friendlyApiMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const kpis = useMemo(() => [
    { label: "Total Revenue", val: `$${profitData.totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10", spark: [10, 15, 8, 22, 18, 30] },
    { label: "Net Earnings", val: `$${profitData.totalProfit.toLocaleString()}`, icon: FiTrendingUp, color: "text-purple-400", bg: "bg-purple-500/10", spark: [5, 12, 15, 10, 25, 20] },
    { label: "Traveler Nodes", val: statsData?.travelers || "0", icon: FiUsers, color: "text-blue-400", bg: "bg-blue-500/10", spark: [12, 18, 14, 25, 22, 28] },
    { label: "Global Trips", val: statsData?.trips || "0", icon: FiActivity, color: "text-amber-400", bg: "bg-amber-500/10", spark: [20, 25, 22, 30, 28, 35] },
    { label: "Destinations", val: statsData?.destinations || "0", icon: FiMap, color: "text-indigo-400", bg: "bg-indigo-500/10", spark: [15, 10, 20, 18, 25, 22] },
  ], [statsData, profitData]);

  if (loading && !statsData) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent shadow-lg shadow-purple-500/20" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Calibrating Fiscal Sensors...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white flex items-center gap-2">
            <FiBarChart2 className="text-purple-500" />
            Fiscal <span className="text-purple-400">Telemetry</span>
          </h2>
          <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">Real-time revenue & commission oversight</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white outline-none focus:border-purple-500 transition-all uppercase tracking-widest"
          >
            <option value="week">Current Cycle</option>
            <option value="month">Monthly Overview</option>
            <option value="quarter">Quarterly Audit</option>
            <option value="year">Annual Report</option>
          </select>
          <button 
            onClick={fetchStats}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-purple-600 transition shadow-lg"
          >
            <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── KPI GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[2rem] bg-[#12122a] border border-white/10 relative overflow-hidden group hover:border-purple-500/30 transition-all"
          >
            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${kpi.bg} blur-3xl opacity-30 group-hover:scale-125 transition-transform`} />
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{kpi.label}</p>
                <p className="text-2xl font-black text-white tracking-tight">{kpi.val}</p>
              </div>
              <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color} ring-1 ring-white/10 shadow-lg`}>
                <kpi.icon size={18} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20 uppercase">+12.5%</span>
              <div className="h-6 w-16">
                <Sparkline 
                  data={kpi.spark.map(v => ({ value: v }))} 
                  color={kpi.label === "Total Revenue" ? "#10b981" : "#a855f7"} 
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── CHARTS ── */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-[#12122a] border border-white/10 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-50" />
           <div className="flex items-center justify-between mb-8">
            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Revenue Growth Protocol</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                 <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Revenue</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                 <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Profit</span>
               </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
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
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }} />
                <YAxis stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d0d1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorProf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-[#12122a] border border-white/10 shadow-xl flex flex-col">
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
            <FiAward className="text-amber-400" /> Operational Elite
          </h3>
          <div className="flex-1 space-y-4">
            {profitData.topAgents.map((agent) => (
              <div key={agent.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-purple-400 border border-purple-500/20 flex items-center justify-center font-black text-xs">
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-white uppercase tracking-tight">{agent.name}</p>
                    <p className="text-[9px] text-white/20 uppercase font-bold">{agent.trips} Operations</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-black text-emerald-400">${agent.commission.toLocaleString()}</p>
                  <p className="text-[8px] text-white/10 uppercase font-black tracking-widest">Commission</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white hover:bg-white/10 transition">
            Staff Analytics
          </button>
        </div>
      </div>

      {/* ── LEDGER ── */}
      <div className="p-8 rounded-[2.5rem] bg-[#12122a] border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
            <FiCalendar size={14} className="text-purple-400" /> Operational Ledger
          </h3>
          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Showing last 3 transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[9px] uppercase font-black text-white/20 border-b border-white/5">
              <tr>
                <th className="pb-4 px-2 tracking-widest">Cycle Date</th>
                <th className="pb-4 tracking-widest">Client Entity</th>
                <th className="pb-4 tracking-widest">Node</th>
                <th className="pb-4 tracking-widest">Assets</th>
                <th className="pb-4 tracking-widest">Agent</th>
                <th className="pb-4 text-right tracking-widest">Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {profitData.recentTransactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-5 px-2 text-[10px] text-white/30 font-bold">{tx.date}</td>
                  <td className="py-5 font-black text-white uppercase tracking-tight text-[11px]">{tx.customerName}</td>
                  <td className="py-5">
                    <span className="px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-400 font-black text-[9px] uppercase border border-purple-500/20">{tx.destination}</span>
                  </td>
                  <td className="py-5 font-black text-white/60 text-[11px]">${tx.total.toLocaleString()}</td>
                  <td className="py-5 text-[10px] text-white/30 font-black uppercase">{tx.agentName}</td>
                  <td className="py-5 text-right font-black text-emerald-400 text-[11px]">${tx.profit.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
