import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { handleApiError } from '../services/api';
import { logLogin, logLogout } from '../services/googleAnalytics';
import { showSuccess, showError } from '../utils/toast';

interface User {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'superadmin' | 'admin' | 'agent';
  avatar?: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isAgent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay sesión al cargar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');
      
      // Si hay usuario guardado, cargarlo inmediatamente
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Error parsing saved user:', e);
          localStorage.removeItem('user');
        }
      }
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Verificar que el token siga siendo válido
      const { data } = await api.get('/auth/me');
      setUser(data.data.user);
      
      // Actualizar usuario guardado
      localStorage.setItem('user', JSON.stringify(data.data.user));
    } catch (error) {
      console.error('Error verificando auth:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      // Verificar respuesta exitosa
      if (!data.success || !data.data) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Guardar tokens
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      
      // Guardar usuario en localStorage para persistencia
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      // Guardar usuario en estado
      setUser(data.data.user);
      
      // Track del login exitoso en Google Analytics
      logLogin('email');
      
      // ✅ Mostrar mensaje de éxito con tu sistema de toasts
      showSuccess('¡Bienvenido!');
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Error en login:', error);
      
      const errorCode = error.response?.data?.code;
      const errorMessage = error.response?.data?.message;
      
      let userMessage = 'Error al iniciar sesión';
      
      // ✅ Mensajes específicos según el código de error del backend
      switch (errorCode) {
        case 'INVALID_CREDENTIALS':
          userMessage = 'Credenciales incorrectas';
          break;
        
        case 'ACCOUNT_LOCKED':
          userMessage = errorMessage || 'Tu cuenta está bloqueada temporalmente';
          break;
        
        case 'ACCOUNT_INACTIVE':
          userMessage = 'Tu cuenta ha sido desactivada. Contacta al administrador.';
          break;
        
        case 'MULTIPLE_ATTEMPTS':
          userMessage = errorMessage || 'Demasiados intentos fallidos';
          break;
        
        case 'MISSING_IDENTIFIER':
          userMessage = 'Ingresa tu email';
          break;
        
        case 'MISSING_PASSWORD':
          userMessage = 'Ingresa tu contraseña';
          break;
        
        default:
          // Si no hay código específico, usar el mensaje del backend
          if (errorMessage) {
            userMessage = errorMessage;
          } else {
            // Fallback a mensaje genérico
            userMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
          }
      }
      
      // ✅ Mostrar error con tu sistema de toasts
      showError(userMessage);
      
      return Promise.reject(new Error(userMessage));
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Track del logout en Google Analytics
      logLogout();
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      
      // ✅ Mostrar mensaje con tu sistema de toasts
      showSuccess('Sesión cerrada');
      
      window.location.href = '/login';
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
    isSuperAdmin: user?.role === 'superadmin',
    isAgent: user?.role === 'agent',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};