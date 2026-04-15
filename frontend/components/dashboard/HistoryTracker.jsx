"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiRotateCcw, 
  FiTrash2, 
  FiEdit3, 
  FiPlusCircle, 
  FiClock, 
  FiAlertCircle,
  FiCheckCircle
} from "react-icons/fi";
import toast from "react-hot-toast";
import { fetchActivityLogs, undoActivity, friendlyApiMessage } from "../../lib/api";

const TYPE_CONFIG = {
  create: { icon: FiPlusCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  update: { icon: FiEdit3, color: "text-blue-400", bg: "bg-blue-500/10" },
  delete: { icon: FiTrash2, color: "text-red-400", bg: "bg-red-500/10" },
  undo: { icon: FiRotateCcw, color: "text-purple-400", bg: "bg-purple-500/10" },
};

export default function HistoryTracker() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [undoing, setUndoing] = useState(null);

  const load = async () => {
    try {
      const { data } = await fetchActivityLogs();
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  const handleUndo = async (logId) => {
    setUndoing(logId);
    const loadingToast = toast.loading("Reversing action…");
    try {
      await undoActivity(logId);
      toast.success("Action undone successfully", { id: loadingToast });
      load(); // Refresh list
    } catch (e) {
      toast.error(friendlyApiMessage(e), { id: loadingToast });
    } finally {
      setUndoing(null);
    }
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-white/20">
        <FiClock size={32} className="animate-pulse mb-4" />
        <p className="text-xs font-black uppercase tracking-widest">Scanning History…</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-white/10 border border-dashed border-white/5 rounded-3xl">
        <FiAlertCircle size={32} className="mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-center">No recent activity detected in the timeline.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {logs.map((log) => {
          const cfg = TYPE_CONFIG[log.type] || TYPE_CONFIG.update;
          const Icon = cfg.icon;
          const canUndo = (log.type === "delete" || log.type === "update") && log.snapshot;

          return (
            <motion.div
              layout
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:border-white/10 hover:bg-white/[0.07]"
            >
              <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cfg.bg} ${cfg.color}`}>
                <Icon size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-white leading-tight">
                    {log.message}
                  </p>
                  <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-white/30">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <p className="mt-1 text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                  {log.targetType.replace('-', ' ')} • {log.userEmail || 'System'}
                </p>

                {canUndo && (
                  <button
                    onClick={() => handleUndo(log.id)}
                    disabled={undoing === log.id}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-purple-400 transition hover:bg-purple-500/20 hover:text-purple-300 disabled:opacity-50"
                  >
                    <FiRotateCcw size={12} className={undoing === log.id ? "animate-spin" : ""} />
                    {undoing === log.id ? "Working…" : "Undo Action"}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
