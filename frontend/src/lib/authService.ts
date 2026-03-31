/**
 * Authentication Service
 * Handles JWT token storage and retrieval
 */

export const getAuthToken = (): string | null => {
  return localStorage.getItem("adminToken");
};

export const setAuthToken = (token: string) => {
  localStorage.setItem("adminToken", token);
};

export const clearAuthToken = () => {
  localStorage.removeItem("adminToken");
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
