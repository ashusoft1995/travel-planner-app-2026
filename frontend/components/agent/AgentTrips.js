"use client";

import { useState, useEffect } from "react";
import {
  FiBriefcase,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiCheck,
  FiX,
  FiClock,
  FiEye,
  FiMessageSquare,
  FiFilter,
  FiSearch,
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function AgentTrips({ token }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, [token]);

  const fetchTrips = async () => {
    try {
      const response = await fetch("/api/trips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      }
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTripAction = async (tripId, action) => {
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          agentStatus: action,
          agentNote: action === "approved" ? "Trip approved by agent" : "Trip rejected by agent",
        }),
      });

      if (response.ok) {
        fetchTrips(); // Refresh trips
        setShowDetails(false);
      }
    } catch (error) {
      console.error("Failed to update trip:", error);
    }
  };

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = trip.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.ownerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || trip.agentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return FiClock;
      case "approved": return FiCheck;
      case "rejected": return FiX;
      case "completed": return FiCheckCircle;
      default: return FiClock;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Trips</h2>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTrips.map((trip, index) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{trip.destination}</h3>
                  <p className="text-sm text-gray-500">{trip.ownerEmail}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.agentStatus || 'pending')}`}>
                  {(() => {
                    const Icon = getStatusIcon(trip.agentStatus || 'pending');
                    return <Icon className="w-3 h-3 mr-1" />;
                  })()}
                  {trip.agentStatus || 'Pending'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <FiCalendar className="mr-2 h-4 w-4" />
                  {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiMapPin className="mr-2 h-4 w-4" />
                  {trip.destination}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiDollarSign className="mr-2 h-4 w-4" />
                  Budget: ${trip.budget || 'Not specified'}
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedTrip(trip);
                    setShowDetails(true);
                  }}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <FiEye className="inline mr-1 h-4 w-4" />
                  View Details
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <FiMessageSquare className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trip Details Modal */}
      {showDetails && selectedTrip && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowDetails(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-lg max-w-2xl w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Trip Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Destination</h4>
                  <p className="text-lg text-gray-900">{selectedTrip.destination}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Start Date</h4>
                    <p className="text-gray-900">{new Date(selectedTrip.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">End Date</h4>
                    <p className="text-gray-900">{new Date(selectedTrip.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Client Email</h4>
                  <p className="text-gray-900">{selectedTrip.ownerEmail}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Budget</h4>
                  <p className="text-gray-900">${selectedTrip.budget || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Accommodation</h4>
                  <p className="text-gray-900">{selectedTrip.accommodation || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Activities</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(selectedTrip.activities || []).map((activity, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                  <p className="text-gray-900">{selectedTrip.notes || 'No notes provided'}</p>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                {(selectedTrip.agentStatus === 'pending' || !selectedTrip.agentStatus) && (
                  <>
                    <button
                      onClick={() => handleTripAction(selectedTrip.id, 'approved')}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors"
                    >
                      <FiCheck className="inline mr-2 h-4 w-4" />
                      Approve Trip
                    </button>
                    <button
                      onClick={() => handleTripAction(selectedTrip.id, 'rejected')}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition-colors"
                    >
                      <FiX className="inline mr-2 h-4 w-4" />
                      Reject Trip
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {filteredTrips.length === 0 && (
        <div className="text-center py-12">
          <FiBriefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No trips found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "You haven't been assigned any trips yet"}
          </p>
        </div>
      )}
    </div>
  );
}
