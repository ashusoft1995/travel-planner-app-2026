"use client";

import Link from "next/link";
import { FiCalendar, FiArrowRight, FiMap, FiClock, FiCheck, FiX, FiActivity } from "react-icons/fi";
import { useTrips } from "../../../context/TripContext";
import { motion } from "framer-motion";

export default function DashboardHistoryPage() {
  const { trips } = useTrips();

  const getStatusDisplay = (status) => {
    switch (status) {
      case "approved":
        return { icon: <FiCheck size={10} />, style: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30" };
      case "pending":
        return { icon: <FiClock size={10} />, style: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30" };
      case "rejected":
        return { icon: <FiX size={10} />, style: "bg-red-500/10 text-red-400 ring-1 ring-red-500/30" };
      default:
        return { icon: <FiCheck size={10} />, style: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30" };
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-white/10 bg-[#12122a] shadow-2xl"
    >
      <div className="relative border-b border-white/10 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent px-8 py-8">
        <div className="relative z-10">
          <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-white uppercase tracking-widest">
            <FiActivity className="text-blue-400" />
            Trip <span className="text-blue-400">Ledger</span>
          </h2>
          <p className="mt-2 text-xs font-medium text-white/40 max-w-sm">
            Complete historical audit of your travel itineraries and approval status across the network.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Destination Node</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Temporal Window</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">System Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Budget Flow</th>
              <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {trips.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4 py-8">
                    <div className="h-16 w-16 rounded-3xl bg-white/5 flex items-center justify-center text-white/10">
                        <FiMap size={32} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white/30 uppercase tracking-widest">Empty Data Set</p>
                        <p className="text-[10px] text-white/20 mt-1">No historical itineraries detected in local storage.</p>
                    </div>
                    <Link
                      href="/add-trip"
                      className="mt-4 rounded-xl bg-blue-500/10 border border-blue-500/30 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-blue-400 transition hover:bg-blue-500 dark:hover:text-white"
                    >
                      Initialize Itinerary →
                    </Link>
                  </div>
                </td>
              </tr>
            )}
            {trips.map((t, i) => {
              const status = getStatusDisplay(t.approvalStatus || "approved");
              return (
                <motion.tr 
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-white/[0.03] transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FiMap size={14} />
                         </div>
                         <span className="font-bold text-white tracking-tight">{t.destination}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-black text-white/60 tracking-tighter">{t.startDate}</span>
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-0.5">{t.endDate}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${status.style}`}
                    >
                      {status.icon} {t.approvalStatus || "approved"}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-black text-white">
                    ${Number(t.budget || 0).toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <Link
                      href={`/trips/${t.id}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/40 transition hover:text-white hover:border-white/20"
                    >
                       Analyze 
                    </Link>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
