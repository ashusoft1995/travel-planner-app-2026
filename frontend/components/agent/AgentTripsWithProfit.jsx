"use client";

import { useState, useEffect } from "react";
import { FiCalendar, FiMapPin, FiDollarSign, FiUsers, FiCheck, FiX, FiEye, FiTrendingUp, FiPieChart } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function AgentTripsWithProfit() {
  const { user, token } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, [filter]);

  const fetchTrips = async () => {
    try {
      const response = await fetch(`/api/trips?agent=${user.id}&status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const resJson = await response.json();
        setTrips(resJson.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch trips");
    } finally {
      setLoading(false);
    }
  };

  const handleTripAction = async (tripId, action) => {
    try {
      const response = await fetch(`/api/trips/${tripId}/${action}`, {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        toast.success(`Trip ${action} successfully`);
        fetchTrips();
      }
    } catch (error) {
      toast.error(`Failed to ${action} trip`);
    }
  };

  const calculateTripProfit = (trip) => {
    const costBreakdown = trip.costBreakdown || {};
    return {
      subtotal: costBreakdown.subtotal || 0,
      agentCommission: costBreakdown.agentCommission || 0,
      adminCommission: costBreakdown.adminCommission || 0,
      companyProfit: costBreakdown.companyProfit || 0,
      total: costBreakdown.total || trip.budget || 0
    };
  };

  const totalStats = trips.reduce((acc, trip) => {
    const profit = calculateTripProfit(trip);
    acc.totalRevenue += profit.total;
    acc.totalCommission += profit.agentCommission;
    acc.totalTrips += 1;
    return acc;
  }, { totalRevenue: 0, totalCommission: 0, totalTrips: 0 });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trips</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.totalTrips}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiMapPin className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalStats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FiDollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Commission</p>
              <p className="text-2xl font-bold text-blue-600">${totalStats.totalCommission.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiTrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === status
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        {trips.map((trip) => {
          const profit = calculateTripProfit(trip);
          return (
            <div key={trip.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{trip.destination}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center">
                      <FiCalendar className="mr-1 h-4 w-4" />
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trip.approvalStatus === "approved" ? "bg-green-100 text-green-800" :
                      trip.approvalStatus === "pending" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {trip.approvalStatus}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {trip.approvalStatus === "pending" && (
                    <>
                      <button
                        onClick={() => handleTripAction(trip.id, "approve")}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Approve"
                      >
                        <FiCheck className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleTripAction(trip.id, "reject")}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Reject"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedTrip(trip)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                    title="View Details"
                  >
                    <FiEye className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Profit Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Total</p>
                  <p className="text-lg font-bold text-gray-900">${profit.total.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600">My Commission (7%)</p>
                  <p className="text-lg font-bold text-blue-600">${profit.agentCommission.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-600">Admin Commission (3%)</p>
                  <p className="text-lg font-bold text-purple-600">${profit.adminCommission.toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600">Company Profit</p>
                  <p className="text-lg font-bold text-green-600">${profit.companyProfit.toLocaleString()}</p>
                </div>
              </div>

              {/* Trip Details */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Accommodation:</p>
                    <p className="font-medium text-gray-900">{trip.accommodation || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Activities:</p>
                    <p className="font-medium text-gray-900">
                      {trip.activities?.join(", ") || "No activities"}
                    </p>
                  </div>
                  {trip.notes && (
                    <div className="md:col-span-2">
                      <p className="text-gray-600">Notes:</p>
                      <p className="font-medium text-gray-900">{trip.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trip Details Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Trip Details</h3>
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedTrip.destination}</h4>
                  <p className="text-gray-600">
                    {new Date(selectedTrip.startDate).toLocaleDateString()} - {new Date(selectedTrip.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Profit Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${calculateTripProfit(selectedTrip).subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                      <span>Your Commission (7%):</span>
                      <span>${calculateTripProfit(selectedTrip).agentCommission.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-purple-600">
                      <span>Admin Commission (3%):</span>
                      <span>${calculateTripProfit(selectedTrip).adminCommission.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Company Profit:</span>
                      <span>${calculateTripProfit(selectedTrip).companyProfit.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${calculateTripProfit(selectedTrip).total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {selectedTrip.notes && (
                  <div>
                    <h4 className="font-semibold text-gray-900">Notes</h4>
                    <p className="text-gray-600">{selectedTrip.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {trips.length === 0 && (
        <div className="text-center py-12">
          <FiMapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No trips found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === "all" ? "No trips assigned to you yet" : `No ${filter} trips found`}
          </p>
        </div>
      )}
    </div>
  );
}
