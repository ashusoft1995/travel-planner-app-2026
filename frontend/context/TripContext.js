"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { tripsApi, friendlyApiMessage } from "../lib/api";
import { useAuth } from "./AuthContext";

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const { user, hydrated } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user?.email) {
        setTrips([]);
        return;
      }
      const { data: res } = await tripsApi.get("/trips", {
        params: { ownerEmail: user.email },
      });
      const resData = Array.isArray(res?.data) ? res.data : [];
      const mappedTrips = resData.map(t => ({
        ...t,
        ownerEmail: t.owner_email || t.ownerEmail,
        startDate: t.start_date || t.startDate,
        endDate: t.end_date || t.endDate,
        approvalStatus: t.approval_status || t.approvalStatus,
        costBreakdown: t.cost_breakdown || t.costBreakdown,
        agentStatus: t.agent_status || t.agentStatus,
        assignedAgent: t.assigned_agent || t.assignedAgent
      }));
      setTrips(mappedTrips);
    } catch (e) {
      setError(friendlyApiMessage(e));
      setTrips([]);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (!hydrated) return;
    fetchTrips().catch(() => {});
  }, [hydrated, fetchTrips]);

  const addTrip = useCallback(
    async (trip) => {
      const { data: res } = await tripsApi.post("/trips", {
        ...trip,
      });
      const data = res.data || res;
      const newTrip = {
        ...data,
        ownerEmail: data.owner_email || data.ownerEmail,
        startDate: data.start_date || data.startDate,
        endDate: data.end_date || data.endDate,
        approvalStatus: data.approval_status || data.approvalStatus,
        costBreakdown: data.cost_breakdown || data.costBreakdown,
        agentStatus: data.agent_status || data.agentStatus,
        assignedAgent: data.assigned_agent || data.assignedAgent
      };
      setTrips((prev) => [newTrip, ...prev]);
      return newTrip;
    },
    [user?.email]
  );

  const updateTrip = useCallback(async (id, patch) => {
    const { data: res } = await tripsApi.put(`/trips/${id}`, patch);
    const data = res.data || res;
    const updated = {
      ...data,
      ownerEmail: data.owner_email || data.ownerEmail,
      startDate: data.start_date || data.startDate,
      endDate: data.end_date || data.endDate,
      approvalStatus: data.approval_status || data.approvalStatus,
      costBreakdown: data.cost_breakdown || data.costBreakdown,
      agentStatus: data.agent_status || data.agentStatus,
      assignedAgent: data.assigned_agent || data.assignedAgent
    };
    setTrips((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const deleteTrip = useCallback(async (id) => {
    await tripsApi.delete(`/trips/${id}`);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      trips,
      loading,
      error,
      fetchTrips,
      addTrip,
      updateTrip,
      deleteTrip,
    }),
    [trips, loading, error, fetchTrips, addTrip, updateTrip, deleteTrip]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrips() {
  const ctx = useContext(TripContext);
  if (!ctx) {
    throw new Error("useTrips must be used within TripProvider");
  }
  return ctx;
}
