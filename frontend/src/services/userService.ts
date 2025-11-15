import api from './api';
import API_ROUTES from '../config/apiRoutes';

export interface User {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  avatar?: string;
  role: 'superadmin' | 'admin' | 'agent';
  active: boolean;
  isVerified?: boolean;
  isLocked?: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    _id: string;
    username: string;
    email: string;
  };
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: 'superadmin' | 'admin' | 'agent';
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: 'superadmin' | 'admin' | 'agent';
  active?: boolean;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: {
    superadmin: number;
    admin: number;
    agent: number;
  };
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  active?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Helper para normalizar usuarios
const normalizeUser = (user: any): User => {
  if (!user) return user;
  
  const idValue = user._id || user.id;
  const idString = typeof idValue === 'string' ? idValue : idValue?.toString() || '';
  
  return {
    ...user,
    id: idString,
    _id: idString
  };
};

export const userService = {
  /**
   * Listar usuarios con filtros
   */
  async getAll(filters?: UserFilters) {
    // CRÍTICO: Limpiar filtros vacíos antes de enviar
    const cleanFilters: any = {};
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof UserFilters];
        // Solo incluir si tiene valor (no vacío, no undefined, no null)
        if (value !== '' && value !== undefined && value !== null) {
          cleanFilters[key] = value;
        }
      });
    }
    
    const response = await api.get(API_ROUTES.USERS, { params: cleanFilters });
    
    // El backend devuelve: { success: true, users: [...], pagination: {...} }
    const users = response.data.users || [];
    const pagination = response.data.pagination;
    
    console.log('📊 UserService.getAll - Response:', {
      success: response.data.success,
      sentFilters: cleanFilters,
      usersCount: users.length,
      pagination: pagination
    });
    
    return {
      users: users.map(normalizeUser),
      pagination: pagination
    };
  },

  /**
   * Obtener usuario por ID
   */
  async getById(id: string) {
    const { data } = await api.get(API_ROUTES.USERS_BY_ID(id));
    const user = data.data?.user || data.user;
    
    return {
      ...data,
      user: normalizeUser(user)
    };
  },

  /**
   * Crear usuario
   */
  async create(userData: CreateUserData) {
    const { data } = await api.post(API_ROUTES.USERS, userData);
    const user = data.data?.user || data.user;
    
    return {
      ...data,
      user: normalizeUser(user)
    };
  },

  /**
   * Actualizar usuario
   */
  async update(id: string, userData: UpdateUserData) {
    const { data } = await api.put(API_ROUTES.USERS_BY_ID(id), userData);
    const user = data.data?.user || data.user;
    
    return {
      ...data,
      user: normalizeUser(user)
    };
  },

  /**
   * Eliminar usuario
   */
  async delete(id: string) {
    const { data } = await api.delete(API_ROUTES.USERS_BY_ID(id));
    return data;
  },

  /**
   * Obtener estadísticas de usuarios
   */
  async getStats() {
    const { data } = await api.get(API_ROUTES.USERS_STATS);
    return (data.data || data) as UserStats;
  },

  /**
   * Bloquear/Desbloquear usuario
   */
  async toggleLock(id: string, lock: boolean, reason?: string) {
    const { data } = await api.patch(`${API_ROUTES.USERS_BY_ID(id)}/lock`, {
      lock,
      reason
    });
    const user = data.data?.user || data.user;
    
    return {
      ...data,
      user: normalizeUser(user)
    };
  },

  /**
   * Activar/Desactivar usuario
   */
  async toggleActive(id: string, active: boolean) {
    return this.update(id, { active });
  },

  /**
   * Cambiar rol de usuario
   */
  async changeRole(id: string, role: 'superadmin' | 'admin' | 'agent') {
    return this.update(id, { role });
  },

  /**
   * Obtener logs de auditoría de un usuario
   */
  async getLogs(id: string, page: number = 1, limit: number = 20) {
    const { data } = await api.get(`${API_ROUTES.USERS_BY_ID(id)}/logs`, {
      params: { page, limit }
    });
    return data;
  }
};