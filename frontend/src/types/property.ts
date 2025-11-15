export type Currency = 'USD' | 'DOP';

export interface PropertyImage {
  id: string;
  url: string;
  alt?: string;
}

export interface PropertyAddress {
  address: string;
  city?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Property {
  id: string;               // único (para la URL)
  slug?: string;            // opcional (URL legible)
  title: string;
  description?: string;
  address: PropertyAddress;
  price: { amount: number; currency: Currency };
  images: PropertyImage[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;            // m²
  isPublic: boolean;        // para filtrar “públicas”
  createdAt?: string;       // ordenar “últimas 6”
}