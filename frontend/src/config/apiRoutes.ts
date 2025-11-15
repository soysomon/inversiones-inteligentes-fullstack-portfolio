// Base URL del backend (sin /api al final)
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// API Base URL siempre termina en /api
const API_BASE_URL = `${BACKEND_URL}/api`;

const API_ROUTES = {
  // Authentication
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
  ME: `${API_BASE_URL}/auth/me`,
  VERIFY_EMAIL: (token: string) => `${API_BASE_URL}/auth/verify-email/${token}`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: (token: string) => `${API_BASE_URL}/auth/reset-password/${token}`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,

  // Users
  USERS: `${API_BASE_URL}/users`,
  USERS_BY_ID: (id: string) => `${API_BASE_URL}/users/${id}`,
  USERS_STATS: `${API_BASE_URL}/users/stats`,
  USERS_LOGS: (id: string) => `${API_BASE_URL}/users/${id}/logs`,
  USERS_LOCK: (id: string) => `${API_BASE_URL}/users/${id}/lock`,

  // Properties
  PROPERTIES: `${API_BASE_URL}/properties`,
  PROPERTIES_BY_ID: (id: string) => `${API_BASE_URL}/properties/${id}`,
  PROPERTIES_SLUG: (slug: string) => `${API_BASE_URL}/properties/slug/${slug}`,
  PROPERTIES_FEATURED: `${API_BASE_URL}/properties/featured`,
  PROPERTIES_PUBLISH: (id: string) => `${API_BASE_URL}/properties/${id}/publish`,
  PROPERTIES_UNPUBLISH: (id: string) => `${API_BASE_URL}/properties/${id}/unpublish`,

  // Uploads
  UPLOAD_IMAGE: `${API_BASE_URL}/uploads/image`,
  UPLOAD_IMAGES: `${API_BASE_URL}/uploads/images`,
  DELETE_IMAGE: `${API_BASE_URL}/uploads/delete`,
};

export default API_ROUTES;