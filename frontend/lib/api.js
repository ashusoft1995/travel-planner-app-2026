import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://travel-planner-backend-f9gd.onrender.com';

// -----------------------------------------------------------------------------
// AXIOS INSTANCES
// -----------------------------------------------------------------------------

/** Main axios instance for auth and general user operations */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

/** Specialized instance for trip-related operations (legacy /api prefix) */
const tripsApi = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Add token to all requests via interceptors
const addTokenInterceptor = (config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
};

api.interceptors.request.use(addTokenInterceptor);
tripsApi.interceptors.request.use(addTokenInterceptor);

// -----------------------------------------------------------------------------
// TOKEN HELPERS
// -----------------------------------------------------------------------------

export const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const setStoredToken = (token) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const authHeaders = () => {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// -----------------------------------------------------------------------------
// AUTH & USER APIs
// -----------------------------------------------------------------------------

export const loginAccount = (data) => api.post('/api/login', data);
export const registerAccount = (data) => api.post('/api/users', data); // Backend uses /api/users for signup
export const fetchSessionUser = () => api.get('/api/me');
export const patchSessionUser = (data) => api.put('/api/me', data); // Check backend if this exists

// -----------------------------------------------------------------------------
// NOTIFICATIONS & ANNOUNCEMENTS
// -----------------------------------------------------------------------------

export const fetchNotifications = (params = {}) => api.get('/api/notifications', { params });
export const markNotificationRead = (id) => api.put(`/api/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.put('/api/notifications/read-all'); // Simulation if needed

export const fetchAnnouncements = () => api.get('/api/announcements');
export const postAnnouncement = (data) => api.post('/api/announcements', data);
export const deleteAnnouncement = (id) => api.delete(`/api/announcements/${id}`);

// -----------------------------------------------------------------------------
// ADMIN & DASHBOARD APIs
// -----------------------------------------------------------------------------

export const fetchAdminTravelRequests = () => api.get('/api/travel-requests');
export const putAdminTravelRequest = (id, data) => api.put(`/api/travel-requests/${id}`, data);
export const patchAdminTravelRequest = (id, data) => api.patch(`/api/travel-requests/${id}`, data);
export const deleteAdminTravelRequest = (id) => api.delete(`/api/travel-requests/${id}`);

export const fetchAdminContactMessages = () => api.get('/api/contact-messages');
export const postAdminContactReply = (id, data) => api.post(`/api/contact-messages/${id}/reply`, data);

export const fetchActivityLogs = () => api.get('/api/activity-logs');
export const undoActivity = (id) => api.post(`/api/activity-logs/${id}/undo`);

// -----------------------------------------------------------------------------
// TRIPS & DESTINATIONS APIs
// -----------------------------------------------------------------------------

export const searchDestinations = (q) => api.get('/api/destinations', { params: { q } });
export const patchTripApproval = (id, data) => api.patch(`/api/trips/${id}/approval`, data);
export const postNotification = (data) => api.post('/api/notifications', data);

export const fetchMyContactMessages = () => api.get('/api/contact-messages/me');
export const submitContactMessage = (data) => api.post('/api/contact-messages', data);
export const submitTravelRequestToAdmin = (data) => api.post('/api/travel-requests', data);

// -----------------------------------------------------------------------------
// UTILITIES
// -----------------------------------------------------------------------------

export const getApiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

export const friendlyApiMessage = (error) => {
  return error.response?.data?.message || error.message || 'An error occurred';
};

export { api, tripsApi };
export default api;