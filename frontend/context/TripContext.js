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
      setTrips(Array.isArray(res?.data) ? res.data : []);
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
      const newTrip = res?.data || res;
      setTrips((prev) => [newTrip, ...prev]);
      return newTrip;
    },
    [user?.email]
  );

  const updateTrip = useCallback(async (id, patch) => {
    const { data: res } = await tripsApi.put(`/trips/${id}`, patch);
    const updated = res?.data || res;
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
