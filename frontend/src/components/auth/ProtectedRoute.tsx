import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'superadmin' | 'admin' | 'agent';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar rol si es requerido
  if (requiredRole && user) {
    const hasPermission = 
      user.role === 'superadmin' || 
      (requiredRole === 'admin' && (user.role === 'admin' || user.role === 'superadmin')) ||
      (requiredRole === 'agent' && (user.role === 'agent' || user.role === 'admin' || user.role === 'superadmin'));

    if (!hasPermission) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <>{children}</>;
}