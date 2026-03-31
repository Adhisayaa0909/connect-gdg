import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add JWT token to request headers if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const normalizeEvent = (event) => ({
  ...event,
  image: event.image
    ? event.image.startsWith("http")
      ? event.image
      : `${API_BASE_URL}${event.image}`
    : "",
});

export const getAllEvents = async () => {
  const response = await api.get("/api/events");
  return response.data.map(normalizeEvent);
};

export const getEventById = async (id) => {
  const response = await api.get(`/api/events/${id}`);
  return normalizeEvent(response.data);
};

export const createEventApi = async (payload) => {
  const response = await api.post("/api/events", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return normalizeEvent(response.data);
};

export const deleteEventApi = async (id) => {
  const response = await api.delete(`/api/events/${id}`);
  return response.data;
};

export const createRegistrationApi = async (payload) => {
  const response = await api.post("/api/register", payload);
  return response.data;
};

export const getRegistrationsByEventApi = async (eventId) => {
  const response = await api.get(`/api/register/${eventId}`);
  return response.data;
};

export default api;
