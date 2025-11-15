import api from './api';
import API_ROUTES from '../config/apiRoutes';

export interface User {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: {
    admin: number;
    user: number;
  };
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
   * Listar usuarios
   */
  async getAll(params?: any) {
    const { data } = await api.get(API_ROUTES.USERS, { params });
    
    return {
      ...data,
      items: (data.items || data).map(normalizeUser)
    };
  },

  /**
   * Obtener usuario por ID
   */
  async getById(id: string) {
    const { data } = await api.get(API_ROUTES.USERS_BY_ID(id));
    return normalizeUser(data);
  },

  /**
   * Crear usuario
   */
  async create(userData: CreateUserData) {
    const { data } = await api.post(API_ROUTES.USERS, userData);
    return {
      ...data,
      user: normalizeUser(data.user)
    };
  },

  /**
   * Actualizar usuario
   */
  async update(id: string, userData: UpdateUserData) {
    const { data } = await api.put(API_ROUTES.USERS_BY_ID(id), userData);
    return {
      ...data,
      user: normalizeUser(data.user)
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
    return data as UserStats;
  },

  /**
   * Activar/Desactivar usuario
   */
  async toggleActive(id: string, isActive: boolean) {
    return this.update(id, { isActive });
  },

  /**
   * Cambiar rol de usuario
   */
  async changeRole(id: string, role: 'admin' | 'user') {
    return this.update(id, { role });
  },
};