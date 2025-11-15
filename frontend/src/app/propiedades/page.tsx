'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import PropertyCard from '@/components/features/PropertyCard';
import AdvancedSearch from '@/components/features/AdvancedSearch';
import PropertyFilters from '@/components/features/PropertyFilters';
import { Search, SlidersHorizontal, Grid, List, ArrowUpDown } from 'lucide-react';

// Sample property data - in real app this would come from API
const sampleProperties = [
  {
    id: '1',
    code: 'INV-001',
    title: 'Exclusivo Apartamento en Piantini',
    location: 'Piantini, Santo Domingo D.N.',
    price: { amount: 185000, currency: 'USD', type: 'venta' },
    image: 'https://ext.same-assets.com/1372240668/2912103473.jpeg',
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    area: 120,
    featured: true,
    status: 'disponible',
    propertyType: 'apartamento',
    city: 'santo-domingo',
    sector: 'piantini',
    description: 'Hermoso apartamento en una de las zonas más exclusivas de la capital.',
    amenities: ['Piscina', 'Gimnasio', 'Seguridad 24/7', 'Parqueo'],
    images: ['https://ext.same-assets.com/1372240668/2912103473.jpeg']
  },
  {
    id: '2',
    code: 'INV-002',
    title: 'Casa Moderna en Santiago',
    location: 'Santiago, República Dominicana',
    price: { amount: 8500000, currency: 'DOP', type: 'venta' },
    image: 'https://ext.same-assets.com/1372240668/1277113279.jpeg',
    bedrooms: 4,
    bathrooms: 3,
    parking: 3,
    area: 250,
    featured: true,
    status: 'disponible',
    propertyType: 'casa',
    city: 'santiago',
    sector: 'bella-vista',
    description: 'Amplia casa moderna con excelente ubicación en Santiago.',
    amenities: ['Jardín', 'Terraza', 'Garage', 'Área de BBQ'],
    images: ['https://ext.same-assets.com/1372240668/1277113279.jpeg']
  },
  {
    id: '3',
    code: 'INV-003',
    title: 'Apartamento Amueblado Zona Colonial',
    location: 'Zona Colonial, Santo Domingo D.N.',
    price: { amount: 1200, currency: 'USD', type: 'alquiler' },
    image: 'https://ext.same-assets.com/1372240668/333477989.jpeg',
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    area: 85,
    featured: true,
    status: 'disponible',
    propertyType: 'apartamento',
    city: 'santo-domingo',
    sector: 'zona-colonial',
    description: 'Acogedor apartamento amueblado en el corazón histórico.',
    amenities: ['Amueblado', 'Aires Acondicionados', 'Internet', 'Cable'],
    images: ['https://ext.same-assets.com/1372240668/333477989.jpeg']
  },
  {
    id: '4',
    code: 'INV-004',
    title: 'Villa de Lujo en Casa de Campo',
    location: 'La Romana, República Dominicana',
    price: { amount: 750000, currency: 'USD', type: 'venta' },
    image: 'https://ext.same-assets.com/1372240668/3565354099.jpeg',
    bedrooms: 5,
    bathrooms: 4,
    parking: 4,
    area: 400,
    featured: true,
    status: 'disponible',
    propertyType: 'villa',
    city: 'la-romana',
    sector: 'casa-de-campo',
    description: 'Lujosa villa con vista al mar en exclusivo resort.',
    amenities: ['Vista al Mar', 'Piscina Privada', 'Campo de Golf', 'Playa'],
    images: ['https://ext.same-assets.com/1372240668/3565354099.jpeg']
  },
  {
    id: '5',
    code: 'INV-005',
    title: 'Penthouse Moderno en Naco',
    location: 'Naco, Santo Domingo D.N.',
    price: { amount: 320000, currency: 'USD', type: 'venta' },
    image: 'https://ext.same-assets.com/1372240668/1102342223.jpeg',
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    area: 180,
    featured: false,
    status: 'disponible',
    propertyType: 'penthouse',
    city: 'santo-domingo',
    sector: 'naco',
    description: 'Impresionante penthouse con terraza y vista panorámica.',
    amenities: ['Terraza', 'Vista Panorámica', 'Ascensor', 'Portero'],
    images: ['https://ext.same-assets.com/1372240668/1102342223.jpeg']
  },
  {
    id: '6',
    code: 'INV-006',
    title: 'Local Comercial en Santiago Centro',
    location: 'Centro, Santiago',
    price: { amount: 2500, currency: 'USD', type: 'alquiler' },
    image: 'https://ext.same-assets.com/1372240668/177958794.jpeg',
    bedrooms: 0,
    bathrooms: 2,
    parking: 0,
    area: 150,
    featured: false,
    status: 'disponible',
    propertyType: 'local',
    city: 'santiago',
    sector: 'centro',
    description: 'Excelente local comercial en zona de alto tráfico.',
    amenities: ['Aire Acondicionado', 'Vitrina', 'Baños', 'Estacionamiento Público'],
    images: ['https://ext.same-assets.com/1372240668/177958794.jpeg']
  }
];

export default function PropiedadesPage() {
  const [properties, setProperties] = useState(sampleProperties);
  const [filteredProperties, setFilteredProperties] = useState(sampleProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    operacion: '',
    tipoPropiedad: '',
    ciudad: '',
    sector: '',
    precioMin: '',
    precioMax: '',
    habitaciones: '',
    banos: '',
    estacionamientos: '',
    areaMin: '',
    areaMax: ''
  });

  const itemsPerPage = 9;

  // Filter and search logic
  useEffect(() => {
    let filtered = [...properties];

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.operacion) {
      filtered = filtered.filter(property => property.price.type === filters.operacion);
    }
    if (filters.tipoPropiedad) {
      filtered = filtered.filter(property => property.propertyType === filters.tipoPropiedad);
    }
    if (filters.ciudad) {
      filtered = filtered.filter(property => property.city === filters.ciudad);
    }
    if (filters.sector) {
      filtered = filtered.filter(property => property.sector === filters.sector);
    }
    if (filters.habitaciones) {
      filtered = filtered.filter(property => property.bedrooms >= parseInt(filters.habitaciones));
    }
    if (filters.banos) {
      filtered = filtered.filter(property => property.bathrooms >= parseInt(filters.banos));
    }
    if (filters.precioMin || filters.precioMax) {
      filtered = filtered.filter(property => {
        const price = property.price.amount;
        const min = filters.precioMin ? parseInt(filters.precioMin) : 0;
        const max = filters.precioMax ? parseInt(filters.precioMax) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price.amount - b.price.amount);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price.amount - a.price.amount);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'area':
        filtered.sort((a, b) => (b.area || 0) - (a.area || 0));
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProperties(filtered);
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy, properties]);

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen pt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Propiedades Disponibles
            </h1>
            <p className="text-gray-600 mb-6">
              Encuentra tu propiedad ideal entre nuestra selección exclusiva
            </p>

            {/* Quick Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por código, título o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    showFilters
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filtros</span>
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mb-8">
              <PropertyFilters
                filters={filters}
                onFiltersChange={handleFilterChange}
                onClose={() => setShowFilters(false)}
              />
            </div>
          )}

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="mb-4 sm:mb-0">
              <p className="text-gray-600">
                Mostrando {displayedProperties.length} de {filteredProperties.length} propiedades
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="featured">Destacadas</option>
                  <option value="price-low">Precio: Menor a Mayor</option>
                  <option value="price-high">Precio: Mayor a Menor</option>
                  <option value="newest">Más Recientes</option>
                  <option value="area">Mayor Área</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Properties Grid/List */}
          {displayedProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron propiedades</h3>
              <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
            </div>
          ) : (
            <div className={`${
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            } mb-8`}>
              {displayedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mb-12">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      currentPage === pageNum
                        ? 'bg-primary text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
