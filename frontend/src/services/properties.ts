import { Property } from '@/types/property';
import api, { handleApiError } from './api';
import API_ROUTES from '@/config/apiRoutes';

// Función auxiliar para ordenar por fecha de creación
function sortByCreatedDesc(a: Property, b: Property) {
  const da = new Date(a.createdAt ?? 0).getTime();
  const db = new Date(b.createdAt ?? 0).getTime();
  return db - da;
}

/**
 * Obtiene todas las propiedades públicas desde el backend
 */
export async function getPublicProperties(): Promise<Property[]> {
  try {
    // Petición al backend con el parámetro isPublic=true
    const response = await api.get(`${API_ROUTES.PROPERTIES}?isPublic=true`);
    
    // El backend devuelve { success, data, message }
    const properties: Property[] = response.data.data || [];
    
    return properties.sort(sortByCreatedDesc);
  } catch (error) {
    console.error('Error al obtener propiedades públicas:', error);
    throw new Error(handleApiError(error));
  }
}

/**
 * Obtiene las últimas N propiedades públicas
 */
export async function getLastPublicProperties(limit = 6): Promise<Property[]> {
  try {
    const all = await getPublicProperties();
    return all.slice(0, limit);
  } catch (error) {
    console.error('Error al obtener últimas propiedades:', error);
    throw new Error(handleApiError(error));
  }
}

/**
 * Obtiene una propiedad por ID o slug
 */
export async function getPropertyById(idOrSlug: string): Promise<Property | null> {
  try {
    // Primero intentamos buscar por slug
    try {
      const response = await api.get(API_ROUTES.PROPERTIES_SLUG(idOrSlug));
      return response.data.data || null;
    } catch (slugError) {
      // Si falla, intentamos buscar por ID
      const response = await api.get(API_ROUTES.PROPERTIES_BY_ID(idOrSlug));
      return response.data.data || null;
    }
  } catch (error) {
    console.error(`Error al obtener propiedad ${idOrSlug}:`, error);
    return null;
  }
}

/**
 * Obtiene propiedades destacadas
 */
export async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const response = await api.get(API_ROUTES.PROPERTIES_FEATURED);
    const properties: Property[] = response.data.data || [];
    return properties.sort(sortByCreatedDesc);
  } catch (error) {
    console.error('Error al obtener propiedades destacadas:', error);
    throw new Error(handleApiError(error));
  }
}