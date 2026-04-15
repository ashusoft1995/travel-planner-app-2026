import axios from "axios";

const DEFAULT_API_ORIGIN = "http://127.0.0.1:5000";

/**
 * Browser: call Express directly (CORS is enabled on the backend). Most reliable for local dev.
 * Override with NEXT_PUBLIC_API_URL for staging/production.
 * Server (SSR): same default or INTERNAL_API_URL.
 */
export function getApiBase() {
  const explicit =
    typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_URL : "";
  if (typeof window !== "undefined") {
    if (explicit && String(explicit).trim() !== "") {
      return String(explicit).replace(/\/$/, "");
    }
    return DEFAULT_API_ORIGIN;
  }
  return (
    process.env.INTERNAL_API_URL ||
    explicit ||
    DEFAULT_API_ORIGIN
  ).replace(/\/$/, "");
}

export const API_BASE = getApiBase();

export const TOKEN_KEY = "ethiotravel_token";

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export const tripsApi = axios.create({
  baseURL: `${getApiBase()}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

tripsApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const t = localStorage.getItem(TOKEN_KEY);
    if (t) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${t}`;
    }
  }
  return config;
});

export function submitTravelRequestToAdmin(payload) {
  return tripsApi.post("/travel-requests", payload, { timeout: 120000 });
}

export function submitContactMessage(payload) {
  return tripsApi.post("/contact-messages", payload);
}

export function registerAccount(payload) {
  return tripsApi.post("/auth/register", payload);
}

export function loginAccount(payload) {
  return tripsApi.post("/auth/login", payload);
}

export function fetchSessionUser() {
  return tripsApi.get("/auth/me");
}

export function patchSessionUser(payload) {
  return tripsApi.patch("/auth/me", payload);
}

export function fetchAdminTravelRequests() {
  return tripsApi.get("/travel-requests");
}

export function putAdminTravelRequest(id, payload) {
  return tripsApi.put(`/travel-requests/${id}`, payload);
}

export function patchAdminTravelRequest(id, payload) {
  return tripsApi.patch(`/travel-requests/${id}`, payload);
}

export function deleteAdminTravelRequest(id) {
  return tripsApi.delete(`/travel-requests/${id}`);
}

export function searchDestinations(params) {
  return tripsApi.get("/destinations/search", { params, timeout: 12000 });
}

export function fetchNotifications() {
  return tripsApi.get("/notifications");
}

export function markNotificationRead(id) {
  return tripsApi.patch(`/notifications/${id}/read`);
}

export function markAllNotificationsRead() {
  return tripsApi.post("/notifications/read-all");
}

export function postNotification(payload) {
  return tripsApi.post("/notifications", payload);
}

export function fetchMyContactMessages() {
  return tripsApi.get("/contact-messages/mine");
}

export function fetchAdminContactMessages() {
  return tripsApi.get("/contact-messages");
}

export function postAdminContactReply(id, body) {
  return tripsApi.post(`/contact-messages/${id}/replies`, { body });
}

export function patchTripApproval(id, payload) {
  return tripsApi.patch(`/trips/${id}/approval`, payload);
}

export function fetchAnnouncements() {
  return tripsApi.get("/announcements");
}

export function postAnnouncement(payload) {
  return tripsApi.post("/announcements", payload);
}

export function deleteAnnouncement(id) {
  return tripsApi.delete(`/announcements/${id}`);
}

export function fetchActivityLogs() {
  return tripsApi.get("/activity");
}

export function undoActivity(id) {
  return tripsApi.post(`/activity/undo/${id}`);
}

/** User-facing API/network errors — avoids raw status codes and dev URLs in the UI. */
export function friendlyApiMessage(err) {
  if (!err) return "Something went wrong. Please try again.";
  const code = err.code;
  const msg = String(err.message || "");
  if (code === "ECONNABORTED" || /timeout/i.test(msg)) {
    return "That took too long. Check your connection and try again.";
  }
  if (code === "ERR_NETWORK" || msg === "Network Error") {
    return "We couldn’t reach EthioTravel. Check your internet connection and try again shortly.";
  }
  const status = err.response?.status;
  const dataMsg = err.response?.data?.message;
  if (status === 400 && typeof dataMsg === "string" && dataMsg.trim()) {
    return dataMsg.trim();
  }
  if (status === 401 || status === 403) {
    return "Please sign in again, then try once more.";
  }
  if (status === 404) {
    const cfg = err.config || err.response?.config;
    const reqUrl = `${cfg?.baseURL || ""}${cfg?.url || ""}`;
    if (/auth\/(register|login)/.test(reqUrl)) {
      return "Could not reach the account API. Start the backend (port 5000) or set NEXT_PUBLIC_API_URL to your API server.";
    }
    return "We couldn’t find that item. It may have been removed.";
  }
  if (status >= 500) {
    return "Our service is temporarily unavailable. Please try again in a few minutes.";
  }
  if (status >= 400) {
    return typeof dataMsg === "string" && dataMsg.trim() && dataMsg.length < 160
      ? dataMsg.trim()
      : "We couldn’t complete that. Please check your details and try again.";
  }
  return "Something went wrong. Please try again.";
}
