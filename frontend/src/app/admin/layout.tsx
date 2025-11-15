import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

interface AdminLayoutProps {
  children?: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-64">
          <main className="flex-1 overflow-y-auto">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}