"use client";

import { FiBriefcase, FiClock, FiCheckCircle, FiTrendingUp, FiUsers, FiDollarSign } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AgentStats({ stats = {} }) {
  const statCards = [
    {
      title: "Total Trips",
      value: stats?.totalTrips || 0,
      icon: FiBriefcase,
      color: "bg-blue-500",
      change: "+12%",
      changeType: "increase"
    },
    {
      title: "Pending Trips",
      value: stats.pendingTrips || 0,
      icon: FiClock,
      color: "bg-yellow-500",
      change: "+3%",
      changeType: "increase"
    },
    {
      title: "Completed Trips",
      value: stats.completedTrips || 0,
      icon: FiCheckCircle,
      color: "bg-green-500",
      change: "+18%",
      changeType: "increase"
    },
    {
      title: "Total Messages",
      value: stats.totalMessages || 0,
      icon: FiUsers,
      color: "bg-purple-500",
      change: "+25%",
      changeType: "increase"
    },
    {
      title: "Revenue This Month",
      value: `$${stats.revenueThisMonth || 0}`,
      icon: FiDollarSign,
      color: "bg-emerald-500",
      change: "+8%",
      changeType: "increase"
    },
    {
      title: "Performance Score",
      value: `${stats.performanceScore || 0}%`,
      icon: FiTrendingUp,
      color: "bg-orange-500",
      change: "+5%",
      changeType: "increase"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            {
              action: "New trip assigned",
              details: "Lalibela Cultural Tour - 3 days",
              time: "2 hours ago",
              type: "trip"
            },
            {
              action: "Message received",
              details: "Client asking about hotel recommendations",
              time: "4 hours ago",
              type: "message"
            },
            {
              action: "Trip completed",
              details: "Addis Ababa City Tour - 2 days",
              time: "1 day ago",
              type: "success"
            },
            {
              action: "Payment received",
              details: "Simien Mountains Trek - 5 days",
              time: "2 days ago",
              type: "payment"
            }
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
            >
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'trip' ? 'bg-blue-500' :
                activity.type === 'message' ? 'bg-purple-500' :
                activity.type === 'success' ? 'bg-green-500' :
                'bg-emerald-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.details}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Performance chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
