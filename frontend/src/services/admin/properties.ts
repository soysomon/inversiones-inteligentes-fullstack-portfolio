import api from '../api';
import API_ROUTES from '../../config/apiRoutes';

export interface Property {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  price: {
    amount: number;
    currency: string;
  };
  address: {
    address: string;
    city: string;
    state: string;
    zipCode?: string;
    country: string;
  };
  images: {
    id: string;
    url: string;
    alt?: string;
    isPrincipal: boolean;
  }[];
  bedrooms: number;
  bathrooms: number;
  parkingSpaces?: number;
  area: number;
  type: string;
  status: string;
  isPublic: boolean;
  features?: string[];
  amenities?: string[];
  slug: string;
  propertyCode?: string;
  views?: number;
  contactCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyData {
  title: string;
  description: string;
  price: {
    amount: number;
    currency: string;
  };
  address: {
    address: string;
    city: string;
    state: string;
    zipCode?: string;
    country: string;
  };
  images: {
    url: string;
    alt?: string;
    isPrincipal: boolean;
  }[];
  bedrooms: number;
  bathrooms: number;
  parkingSpaces?: number;
  area: number;
  type: string;
  status: string;
  isPublic: boolean;
  features?: string[];
  amenities?: string[];
}

// ✅ Helper para normalizar propiedades
const normalizeProperty = (property: any): Property => {
  if (!property) return property;
  
  // Obtener el ID correcto (puede venir como _id o id)
  const idValue = property._id || property.id;
  const idString = typeof idValue === 'string' ? idValue : idValue?.toString() || '';
  
  return {
    ...property,
    id: idString,
    _id: idString
  };
};

export const propertyService = {
  // Listar propiedades
  async getAll(params?: any) {
    const { data } = await api.get('/properties', { params });
    
    // ✅ Normalizar todas las propiedades
    return {
      ...data,
      items: (data.items || []).map(normalizeProperty)
    };
  },

  // ✅ NUEVO: Obtener propiedades públicas (incluye vendidas y reservadas)
  async getAllPublic(params?: any) {
    const { data } = await api.get('/properties', { 
      params: {
        ...params,
        public: 'true', // Solo públicas
        // NO filtramos por status para mostrar todas
      }
    });
    
    return {
      ...data,
      items: (data.items || []).map(normalizeProperty)
    };
  },

  // Obtener una propiedad por ID
  async getById(id: string) {
    const { data } = await api.get(`/properties/${id}`);
    // ✅ Normalizar la propiedad
    return normalizeProperty(data);
  },

  // Obtener una propiedad por SLUG
  async getBySlug(slug: string) {
    const { data } = await api.get(`/properties/slug/${slug}`);
    // ✅ Normalizar la propiedad
    return normalizeProperty(data);
  },

  // Crear propiedad
  async create(propertyData: CreatePropertyData) {
    const { data } = await api.post('/properties', propertyData);
    // ✅ Normalizar la propiedad creada
    return {
      ...data,
      property: normalizeProperty(data.property)
    };
  },

  // Actualizar propiedad
  async update(id: string, propertyData: Partial<CreatePropertyData>) {
    const { data } = await api.put(`/properties/${id}`, propertyData);
    // ✅ Normalizar la propiedad actualizada
    return {
      ...data,
      property: normalizeProperty(data.property)
    };
  },

  // Eliminar propiedad
  async delete(id: string) {
    const { data } = await api.delete(`/properties/${id}`);
    return data;
  },

  // Subir imágenes
  async uploadImages(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const { data } = await api.post('/uploads/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};