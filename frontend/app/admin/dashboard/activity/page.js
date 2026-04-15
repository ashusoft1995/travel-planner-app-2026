"use client";

import { motion } from "framer-motion";
import { FiClock } from "react-icons/fi";
import HistoryTracker from "../../../../components/dashboard/HistoryTracker";

export default function AdminActivityPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
            <FiClock className="text-purple-500" />
            Global Activity <span className="text-white/40">Log</span>
          </h1>
          <p className="text-sm font-medium text-white/50 mt-1 max-w-xl">
            A real-time audit trail of system operations. You can reverse specific edits and deletions directly from this timeline.
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-[#12122a] p-6 lg:p-8"
      >
        <HistoryTracker />
      </motion.div>
    </div>
  );
}
