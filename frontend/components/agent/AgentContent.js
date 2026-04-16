"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiCalendar,
  FiBriefcase,
  FiStar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiTrendingUp,
} from "react-icons/fi";
import AgentStats from "../../components/agent/AgentStats";
import AgentTrips from "../../components/agent/AgentTrips";
import AgentTripsWithProfit from "../../components/agent/AgentTripsWithProfit";
import AgentMessages from "../../components/agent/AgentMessages";
import AgentProfile from "../../components/agent/AgentProfile";

export default function AgentContent() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "agent") {
      router.push("/login");
      return;
    }
  }, [user, router]);

  if (!user || user.role !== "agent") return null;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      <div className="container py-8">
         <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agent Dashboard</h1>
            <div className="flex gap-4">
               {/* Nav buttons */}
            </div>
         </motion.div>
         {/* Simple representative layout to avoid breaking previous logic */}
         <AgentStats />
         <div className="mt-8">
            <AgentTripsWithProfit />
         </div>
      </div>
    </main>
  );
}
