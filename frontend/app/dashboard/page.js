"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiDollarSign, 
  FiMap, 
  FiPlusCircle, 
  FiClock, 
  FiBarChart2, 
  FiCalendar,
  FiTrendingUp,
  FiUsers,
  FiMessageSquare,
  FiBell,
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiActivity,
  FiGlobe,
  FiStar,
  FiHeart,
  FiShare2,
  FiBookmark,
  FiSettings,
  FiLogOut
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getApiUrl } from "../../lib/api";
import { UndoProvider } from "../../context/UndoContext";
import UndoPanel from "../../components/common/UndoPanel";
import ResponsiveNav from "../../components/common/ResponsiveNav";

// Dynamic import for charts to avoid SSR issues
const DashboardRecharts = dynamic(
  () => import("../../components/dashboard/DashboardRecharts"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    ),
  }
);

export default function EnhancedUserDashboard() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchUserData();
  }, [user, router]);

  const fetchUserData = async () => {
    try {
      const [tripsResponse, notificationsResponse] = await Promise.all([
        fetch(getApiUrl("/trips"), {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(getApiUrl("/notifications"), {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (tripsResponse.ok) {
        const resJson = await tripsResponse.json();
        setTrips(resJson.data || []);
      }

      if (notificationsResponse.ok) {
        const resJson = await notificationsResponse.json();
        const data = resJson.data || [];
        setNotifications(data.slice(0, 5)); // Show only 5 latest
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      const matchesSearch = trip.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trip.accommodation?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || trip.approvalStatus === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [trips, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
    const upcoming = trips.filter(trip => new Date(trip.startDate) >= new Date()).length;
    const completed = trips.filter(trip => new Date(trip.endDate) < new Date()).length;
    const pending = trips.filter(trip => trip.approvalStatus === "pending").length;

    return {
      totalTrips: trips.length,
      totalBudget,
      upcoming,
      completed,
      pending,
      averageBudget: trips.length > 0 ? Math.round(totalBudget / trips.length) : 0
    };
  }, [trips]);

  const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

  const lineData = useMemo(() => {
    const byMonth = {};
    trips.forEach((t) => {
      if (!t.startDate) return;
      const d = new Date(t.startDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("default", { month: "short", year: "numeric" });
      if (!byMonth[key]) byMonth[key] = { key, label, budget: 0 };
      byMonth[key].budget += Number(t.budget || 0);
    });
    return Object.values(byMonth)
      .sort((a, b) => a.key.localeCompare(b.key))
      .map(({ label, budget }) => ({ month: label, budget }));
  }, [trips]);

  const pieData = useMemo(() => {
    const byAcc = {};
    trips.forEach((t) => {
      const k = t.accommodation?.trim() || "Unspecified";
      byAcc[k] = (byAcc[k] || 0) + Number(t.budget || 0);
    });
    return Object.entries(byAcc).map(([name, value]) => ({ name, value }));
  }, [trips]);

  const upcomingTrips = useMemo(() => {
    return trips
      .filter(trip => new Date(trip.startDate) >= new Date())
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 3);
  }, [trips]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FiBarChart2 },
    { id: "trips", label: "My Trips", icon: FiMap },
    { id: "analytics", label: "Analytics", icon: FiTrendingUp },
    { id: "messages", label: "Messages", icon: FiMessageSquare },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <UndoProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Responsive Navigation */}
        <ResponsiveNav
          user={user}
          onLogout={handleLogout}
          showNotifications={true}
          notificationCount={notifications.length}
          onToggleNotifications={() => setShowNotifications(!showNotifications)}
        />

        {/* Main Content */}
        <main className="pt-20 md:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          {/* Page Title and Search */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Travel Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your trips and explore destinations</p>
            
            {/* Mobile Search */}
            <div className="mt-4 md:hidden">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search trips..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex mb-6">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tab Navigation - Mobile Optimized */}
          <div className="mb-6 md:mb-8">
            <nav className="flex flex-col sm:flex-row sm:space-x-1 md:space-x-8 border-b border-gray-200 sm:border-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-3 px-2 sm:py-4 sm:px-1 border-b-2 sm:border-0 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 sm:bg-blue-50 sm:rounded-lg"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 sm:hover:bg-gray-50 sm:rounded-lg"
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Stats Grid - Mobile Optimized */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {[
                  { label: "Trips", value: stats.totalTrips, icon: FiMap, color: "bg-blue-500" },
                  { label: "Budget", value: `$${stats.totalBudget.toLocaleString()}`, icon: FiDollarSign, color: "bg-green-500" },
                  { label: "Upcoming", value: stats.upcoming, icon: FiCalendar, color: "bg-yellow-500" },
                  { label: "Completed", value: stats.completed, icon: FiCheckCircle, color: "bg-purple-500" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-2 sm:mb-0">
                        <p className="text-xs md:text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-lg md:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-2 md:p-3 rounded-lg ${stat.color} self-start sm:self-auto`}>
                        <stat.icon className="h-4 w-4 md:h-6 md:w-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity - Mobile Optimized */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                {/* Upcoming Trips */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Upcoming Trips</h3>
                  <div className="space-y-3 md:space-y-4">
                    {upcomingTrips.length > 0 ? (
                      upcomingTrips.slice(0, 3).map((trip) => (
                        <div key={trip.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="mb-2 sm:mb-0">
                            <p className="font-medium text-gray-900 text-sm">{trip.destination}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              trip.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                              trip.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {trip.approvalStatus}
                            </span>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <FiEye className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4 text-sm">No upcoming trips</p>
                    )}
                  </div>
                  <div className="mt-3 md:mt-4">
                    <Link href="/trips">
                      <button className="w-full bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
                        View All Trips
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Quick Actions</h3>
                  <div className="space-y-2 md:space-y-3">
                    <Link href="/add-trip">
                      <button className="w-full flex items-center justify-center px-3 py-2 md:px-4 md:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                        <FiPlusCircle className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                        Plan New Trip
                      </button>
                    </Link>
                    <Link href="/contact">
                      <button className="w-full flex items-center justify-center px-3 py-2 md:px-4 md:py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm">
                        <FiMessageSquare className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                        Contact Support
                      </button>
                    </Link>
                    <Link href="/about">
                      <button className="w-full flex items-center justify-center px-3 py-2 md:px-4 md:py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm">
                        <FiGlobe className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                        Explore Destinations
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "trips" && (
            <motion.div
              key="trips"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">My Trips</h2>
                    <div className="flex items-center space-x-3">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <Link href="/add-trip">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                          <FiPlusCircle className="inline mr-2 h-4 w-4" />
                          Add Trip
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {filteredTrips.length > 0 ? (
                    filteredTrips.map((trip) => (
                      <div key={trip.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{trip.destination}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">Budget: ${trip.budget || 0}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              trip.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                              trip.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {trip.approvalStatus}
                            </span>
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <FiEye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <FiEdit className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <FiMap className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No trips found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm || filterStatus !== "all" 
                          ? "Try adjusting your search or filter criteria"
                          : "Get started by planning your first trip"}
                      </p>
                      <Link href="/add-trip">
                        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                          Plan Your First Trip
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Travel Analytics</h2>
                {trips.length > 0 && lineData.length > 0 ? (
                  <DashboardRecharts lineData={lineData} pieData={pieData} pieColors={PIE_COLORS} />
                ) : (
                  <div className="text-center py-12">
                    <FiBarChart2 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
                    <p className="mt-1 text-sm text-gray-500">Plan some trips to see your travel analytics</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "messages" && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Messages</h2>
                <div className="text-center py-12">
                  <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Your messages will appear here</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Undo Panel - Fixed on the right side */}
      <div className="fixed right-4 bottom-4 w-80 max-h-96 overflow-hidden">
        <UndoPanel compact={true} maxItems={5} />
      </div>
    </div>
    </UndoProvider>
  );
}
