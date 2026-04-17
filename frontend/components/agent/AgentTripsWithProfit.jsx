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
        {[
          { label: "Total Trips", val: totalStats.totalTrips, icon: FiMapPin, color: "bg-blue-500/20", text: "text-blue-400" },
          { label: "Total Revenue", val: `$${totalStats.totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: "bg-emerald-500/20", text: "text-emerald-400" },
          { label: "My Commission", val: `$${totalStats.totalCommission.toLocaleString()}`, icon: FiTrendingUp, color: "bg-purple-500/20", text: "text-purple-400" },
        ].map((s, i) => (
          <div key={i} className="bg-[#12122a] rounded-xl shadow-sm border border-white/10 p-4 group transition hover:border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{s.label}</p>
                <p className={`text-2xl font-black mt-1 ${s.text}`}>{s.val}</p>
              </div>
              <div className={`p-3 ${s.color} rounded-lg ring-1 ring-white/10 group-hover:scale-110 transition-transform`}>
                <s.icon className={`h-6 w-6 ${s.text}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit border border-white/5">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${
              filter === status
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Trips List */}
      <div className="space-y-4">
        {trips.map((trip) => {
          const profit = calculateTripProfit(trip);
          return (
            <div key={trip.id} className="bg-[#12122a] rounded-2xl shadow-sm border border-white/10 p-6 group hover:border-white/20 transition-all">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">{trip.destination}</h3>
                  <div className="flex items-center space-x-4 mt-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    <span className="flex items-center">
                      <FiCalendar className="mr-1.5 h-3.5 w-3.5" />
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      trip.approvalStatus === "approved" ? "bg-emerald-500/10 text-emerald-400" :
                      trip.approvalStatus === "pending" ? "bg-amber-500/10 text-amber-400" :
                      "bg-red-500/10 text-red-400"
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
                        className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition"
                        title="Approve"
                      >
                        <FiCheck className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleTripAction(trip.id, "reject")}
                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                        title="Reject"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedTrip(trip)}
                    className="p-2 bg-white/5 text-white/30 hover:text-white hover:bg-white/10 rounded-lg transition"
                    title="View Details"
                  >
                    <FiEye className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Profit Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total", val: `$${profit.total.toLocaleString()}`, color: "bg-white/5 text-white" },
                  { label: "Commission (7%)", val: `$${profit.agentCommission.toLocaleString()}`, color: "bg-blue-500/10 text-blue-400" },
                  { label: "Admin (3%)", val: `$${profit.adminCommission.toLocaleString()}`, color: "bg-purple-500/10 text-purple-400" },
                  { label: "Company Profit", val: `$${profit.companyProfit.toLocaleString()}`, color: "bg-emerald-500/10 text-emerald-400" },
                ].map((p, i) => (
                  <div key={i} className={`text-center p-3 rounded-xl border border-white/5 ${p.color}`}>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{p.label}</p>
                    <p className="text-lg font-black">{p.val}</p>
                  </div>
                ))}
              </div>

              {/* Trip Details */}
              <div className="border-t border-white/5 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] font-bold uppercase tracking-widest">
                  <div>
                    <p className="text-white/30 mb-1">Accommodation:</p>
                    <p className="text-white">{trip.accommodation || "Standard Mission Base"}</p>
                  </div>
                  <div>
                    <p className="text-white/30 mb-1">Operational Activities:</p>
                    <p className="text-white">
                      {trip.activities?.join(", ") || "No extra protocols"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trip Details Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0d0d1a] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-white uppercase tracking-widest">Mission <span className="text-purple-400">Analysis</span></h3>
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="p-2 text-white/30 hover:text-white transition"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-black text-white uppercase">{selectedTrip.destination}</h4>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">
                    {new Date(selectedTrip.startDate).toLocaleDateString()} - {new Date(selectedTrip.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-[#12122a] border border-white/10 rounded-2xl p-6">
                  <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">Financial Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-white/50">
                      <span>Subtotal:</span>
                      <span className="font-bold">${calculateTripProfit(selectedTrip).subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-blue-400">
                      <span>Your Commission (7%):</span>
                      <span className="font-bold">${calculateTripProfit(selectedTrip).agentCommission.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-purple-400">
                      <span>Admin Commission (3%):</span>
                      <span className="font-bold">${calculateTripProfit(selectedTrip).adminCommission.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-emerald-400">
                      <span>Company Profit:</span>
                      <span className="font-bold">${calculateTripProfit(selectedTrip).companyProfit.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-white/10 pt-3 flex justify-between text-sm font-black text-white">
                      <span className="uppercase tracking-widest">Total Asset Flow:</span>
                      <span>${calculateTripProfit(selectedTrip).total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {selectedTrip.notes && (
                  <div>
                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Protocol Notes</h4>
                    <p className="text-xs text-white/60 leading-relaxed italic border-l-2 border-purple-500 pl-4">{selectedTrip.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {trips.length === 0 && (
        <div className="text-center py-20 bg-[#12122a] rounded-2xl border border-white/5 border-dashed">
          <FiMapPin className="mx-auto h-12 w-12 text-white/10 mb-4" />
          <h3 className="text-sm font-black text-white uppercase tracking-widest">No Operational Data</h3>
          <p className="mt-2 text-[10px] text-white/20 uppercase font-bold">
            {filter === "all" ? "No missions assigned in the current sector" : `No ${filter} missions recorded`}
          </p>
        </div>
      )}
    </div>
  );
}
