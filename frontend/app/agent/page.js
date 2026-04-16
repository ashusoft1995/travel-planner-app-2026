"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiCalendar,
  FiMessageSquare,
  FiUser,
  FiSettings,
  FiLogOut,
  FiBriefcase,
  FiStar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiTrendingUp,
} from "react-icons/fi";
import AgentDashboardLayout from "../../components/agent/AgentDashboardLayout";
import AgentStats from "../../components/agent/AgentStats";
import AgentTrips from "../../components/agent/AgentTrips";
import AgentTripsWithProfit from "../../components/agent/AgentTripsWithProfit";
import AgentMessages from "../../components/agent/AgentMessages";
import AgentProfile from "../../components/agent/AgentProfile";

export default function AgentDashboard() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalTrips: 0,
    pendingTrips: 0,
    completedTrips: 0,
    totalMessages: 0,
  });

  useEffect(() => {
    if (!user || user.role !== "agent") {
      router.push("/login");
      return;
    }

    // Fetch agent statistics
    fetchAgentStats();
  }, [user, router]);

  const fetchAgentStats = async () => {
    try {
      const response = await fetch(getApiUrl("/agent/stats"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const resJson = await response.json();
        setStats(resJson.data || resJson);
      }
    } catch (error) {
      console.error("Failed to fetch agent stats:", error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user || user.role !== "agent") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: FiTrendingUp },
    { id: "trips", label: "My Trips", icon: FiBriefcase },
    { id: "messages", label: "Messages", icon: FiMessageSquare },
    { id: "profile", label: "Profile", icon: FiUser },
  ];

  return (
    <AgentDashboardLayout user={user} onLogout={handleLogout}>
      <div className="flex flex-col h-full">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center py-4 px-1 border-b-2 font-medium text-sm
                    transition-colors duration-200
                    ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                <AgentStats stats={stats} />
              </motion.div>
            )}

            {activeTab === "trips" && (
              <motion.div
                key="trips"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                <AgentTripsWithProfit />
              </motion.div>
            )}

            {activeTab === "messages" && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                <AgentMessages token={token} user={user} />
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                <AgentProfile user={user} token={token} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AgentDashboardLayout>
  );
}
