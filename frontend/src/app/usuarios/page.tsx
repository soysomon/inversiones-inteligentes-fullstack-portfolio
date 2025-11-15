import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface User {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatar?: string;
  role: 'superadmin' | 'admin' | 'agent';
  active: boolean;
  isLocked?: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface Filters {
  role: string;
  active: string;
  search: string;
}

export default function UsuariosPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    role: '',
    active: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [filters, pagination.page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });

      setUsers(response.users || []);
      if (response.pagination) {
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total,
          pages: response.pagination.pages
        }));
      }
    } catch (error: any) {
      console.error('Error cargando usuarios:', error);
      alert(error.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await userService.delete(userId);
      alert('Usuario eliminado exitosamente');
      loadUsers();
    } catch (error: any) {
      console.error('Error eliminando usuario:', error);
      alert(error.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  const handleToggleLock = async (userId: string, currentlyLocked: boolean) => {
    try {
      await userService.toggleLock(userId, !currentlyLocked);
      alert(currentlyLocked ? 'Usuario desbloqueado' : 'Usuario bloqueado');
      loadUsers();
    } catch (error: any) {
      console.error('Error cambiando estado:', error);
      alert(error.response?.data?.message || 'Error al cambiar estado del usuario');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      case 'admin': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'agent': return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin': return 'Super Admin';
      case 'admin': return 'Administrador';
      case 'agent': return 'Agente';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Usuarios
              </h1>
              <p className="text-gray-500 mt-2 text-sm">Gestiona los usuarios del sistema de forma centralizada</p>
            </div>
            
            {currentUser?.role === 'superadmin' && (
              <Link
                to="/admin/usuarios/crear"
                className="group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-200"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nuevo Usuario
              </Link>
            )}
          </div>

          {/* Search and Filters Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100/50 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative group">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, email o username..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200/50 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                  />
                </div>

                {/* Filters Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center px-6 py-3.5 rounded-2xl font-medium transition-all ${
                    showFilters 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200/50'
                  }`}
                >
                  <FunnelIcon className="h-5 w-5 mr-2" />
                  Filtros
                </button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                      Rol
                    </label>
                    <select
                      value={filters.role}
                      onChange={(e) => handleFilterChange('role', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm appearance-none cursor-pointer"
                    >
                      <option value="">Todos los roles</option>
                      <option value="superadmin">Super Admin</option>
                      <option value="admin">Administrador</option>
                      <option value="agent">Agente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                      Estado
                    </label>
                    <select
                      value={filters.active}
                      onChange={(e) => handleFilterChange('active', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm appearance-none cursor-pointer"
                    >
                      <option value="">Todos</option>
                      <option value="true">Activos</option>
                      <option value="false">Inactivos</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100/50 hover:shadow-xl hover:shadow-gray-300/50 transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  {/* Avatar and User Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.fullName || user.username}
                          className="h-14 w-14 rounded-2xl object-cover shadow-lg shadow-blue-500/30"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user.fullName || user.username
                            )}&background=3b82f6&color=fff&size=200`;
                          }}
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
                          {user.firstName?.[0] || user.username[0].toUpperCase()}
                        </div>
                      )}
                      {user.active && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {user.fullName || user.username}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${getRoleBadgeColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                    
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                      user.active 
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' 
                        : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
                    }`}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                    
                    {user.isLocked && (
                      <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-600/20">
                        Bloqueado
                      </span>
                    )}
                  </div>

                  {/* Last Login */}
                  <div className="hidden lg:block text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Último Login</p>
                    <p className="text-sm text-gray-900 font-medium mt-1">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('es-ES') : 'Nunca'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:pl-6 sm:border-l border-gray-100">
                    {currentUser?.role === 'superadmin' && (
                      <button
                        onClick={() => navigate(`/admin/usuarios/editar/${user._id}`)}
                        className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110 transition-all duration-200"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    )}

                    {currentUser?.role === 'superadmin' && currentUser._id !== user._id && (
                      <button
                        onClick={() => handleToggleLock(user._id, user.isLocked || false)}
                        className="p-2.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 hover:scale-110 transition-all duration-200"
                        title={user.isLocked ? 'Desbloquear' : 'Bloquear'}
                      >
                        {user.isLocked ? (
                          <LockOpenIcon className="h-5 w-5" />
                        ) : (
                          <LockClosedIcon className="h-5 w-5" />
                        )}
                      </button>
                    )}

                    {currentUser?.role === 'superadmin' && currentUser._id !== user._id && (
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110 transition-all duration-200"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100/50 p-16 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron usuarios</h3>
              <p className="text-sm text-gray-500">Intenta ajustar los filtros de búsqueda</p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100/50 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Mostrando <span className="font-semibold text-gray-900">{((pagination.page - 1) * pagination.limit) + 1}</span> - <span className="font-semibold text-gray-900">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> de <span className="font-semibold text-gray-900">{pagination.total}</span> usuarios
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-5 py-2.5 rounded-xl font-medium bg-white border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 hover:scale-105 transition-all duration-200 shadow-sm"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.pages}
                  className="px-5 py-2.5 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-200 shadow-sm"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}