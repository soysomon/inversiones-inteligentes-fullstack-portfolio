import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Building, Users, BarChart3, Settings, LogOut } from 'lucide-react';
import logoImage from '../../img/logoInvInt.png';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home, roles: ['all'] },
    { name: 'Propiedades', href: '/admin/propiedades', icon: Building, roles: ['all'] },
    { name: 'Usuarios', href: '/admin/usuarios', icon: Users, roles: ['admin', 'superadmin'] },
    { name: 'Estadísticas', href: '/admin/estadisticas', icon: BarChart3, roles: ['admin', 'superadmin'] },
  ];

  const filteredNavigation = navigation.filter(item => {
    if (item.roles.includes('all')) return true;
    if (user?.role === 'superadmin') return true;
    return item.roles.includes(user?.role || '');
  });

  return (
    <div className="flex flex-col w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0">
      
      {/* Logo */}
      <div className="flex items-center px-6 h-16 border-b border-slate-200">
        <img 
          src={logoImage} 
          alt="Inversiones Inteligentes" 
          className="h-8 w-auto object-contain"
        />
      </div>

      {/* User Info */}
      <div className="px-6 py-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="text-slate-600 text-sm font-light">
              {user?.firstName?.[0] || user?.username?.[0] || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-900 text-sm font-light truncate">
              {user?.fullName || user?.username}
            </p>
            <p className="text-slate-500 text-xs font-light capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href || 
                          location.pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                group flex items-center px-3 py-2.5 text-sm font-light rounded-lg
                transition-all duration-200
                ${isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <item.icon 
                className={`mr-3 h-5 w-5 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                }`}
                strokeWidth={1.5}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={logout}
          className="
            group flex items-center w-full px-3 py-2.5 text-sm font-light 
            text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900
            transition-all duration-200
          "
        >
          <LogOut 
            className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" 
            strokeWidth={1.5}
          />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}