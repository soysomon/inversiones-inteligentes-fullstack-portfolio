import axios from 'axios';

// Base URL del backend (sin /api)
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const API_URL = `${BACKEND_URL}/api`;

const USE_COOKIES = import.meta.env.PROD; // true en producción

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // IMPORTANTE: Siempre true para enviar cookies
});

// Interceptor para agregar token a cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores y refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el token expiró y no hemos intentado refrescar
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (USE_COOKIES) {
          // PRODUCCIÓN: refreshToken está en cookie HttpOnly
          const { data } = await axios.post(
            `${API_URL}/auth/refresh`,
            {}, // Body vacío, el token viene en cookie
            { withCredentials: true }
          );

          localStorage.setItem('accessToken', data.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        } else {
          // DESARROLLO: refreshToken está en localStorage
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (!refreshToken) {
            throw new Error('No refresh token');
          }

          const { data } = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          localStorage.setItem('accessToken', data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export const handleApiError = (error: any): string => {
  if (error.response) {
    return error.response.data.message || 'Error en el servidor';
  } else if (error.request) {
    return 'No se pudo conectar al servidor';
  } else {
    return error.message || 'Error desconocido';
  }
};