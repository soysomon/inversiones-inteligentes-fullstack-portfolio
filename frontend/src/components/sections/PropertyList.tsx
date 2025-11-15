import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, Eye, Filter, Search, X } from 'lucide-react';
import { propertyService } from '../../services/admin/properties';

interface PropertyListProps {
  onSelectProperty?: (slug: string) => void;
}

type FilterType = 'all' | 'published' | 'draft' | 'sold' | 'reserved';

const PropertyList: React.FC<PropertyListProps> = ({ onSelectProperty }) => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<'price' | 'area' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchCode, setSearchCode] = useState<string>('');

  // Placeholder animado
  const basePlaceholder = "Buscar por código o título...";
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");

  useEffect(() => {
    let typer: ReturnType<typeof setInterval> | null = null;
    let restart: ReturnType<typeof setTimeout> | null = null;

    const speedMs = 35;
    const repeatDelay = 15000;

    const runTyping = () => {
      let i = 0;
      setAnimatedPlaceholder("");
      typer = setInterval(() => {
        i++;
        setAnimatedPlaceholder(basePlaceholder.slice(0, i));
        if (i >= basePlaceholder.length) {
          if (typer) { clearInterval(typer); typer = null; }
          restart = setTimeout(runTyping, repeatDelay);
        }
      }, speedMs);
    };

    runTyping();
    return () => {
      if (typer) clearInterval(typer);
      if (restart) clearTimeout(restart);
    };
  }, []);

  // Cargar propiedades de la API
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await propertyService.getAll({ isPublic: true });
      setProperties(data.items || []);
    } catch (error) {
      console.error('Error cargando propiedades:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: { amount: number; currency: string }): string => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: price.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price.amount);
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      'published': { text: 'En Venta', color: 'bg-blue-50 text-blue-600 border-blue-200' },
      'sold': { text: 'Vendido', color: 'bg-red-50 text-red-600 border-red-200' },
      'reserved': { text: 'Reservado', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
      'draft': { text: 'Borrador', color: 'bg-gray-50 text-gray-600 border-gray-200' }
    };
    return badges[status] || badges['draft'];
  };

  const clearSearch = () => {
    setSearchCode('');
  };

  // Filtrar y ordenar propiedades
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties.filter(property => {
      // Filtrar por estado
      const statusMatch = filter === 'all' || property.status === filter;

      // Filtrar por código o título
      const searchMatch = searchCode === '' ||
        property.propertyCode?.toLowerCase().includes(searchCode.toLowerCase()) ||
        property.title?.toLowerCase().includes(searchCode.toLowerCase()) ||
        property._id?.toLowerCase().includes(searchCode.toLowerCase());

      return statusMatch && searchMatch;
    });

    // Ordenar
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'price':
          comparison = a.price.amount - b.price.amount;
          break;
        case 'area':
          comparison = a.area - b.area;
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [properties, filter, sortBy, sortOrder, searchCode]);

  const handlePropertyClick = (property: any) => {
    if (onSelectProperty) {
      onSelectProperty(property.slug);
    } else {
      navigate(`/propiedades/${property.slug}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-light text-slate-800 mb-4">
                Todas las <span className="font-medium text-blue-600">Propiedades</span>
              </h1>
              <p className="text-lg text-slate-600">
                Explora nuestro catálogo completo de propiedades disponibles
              </p>
            </div>

            {/* Contadores */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{properties.length}</div>
                <div className="text-sm text-slate-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{filteredAndSortedProperties.length}</div>
                <div className="text-sm text-slate-600">Mostradas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtros y ordenamiento */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          {/* Filtros por estado */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Todas', count: properties.length },
              { key: 'published', label: 'Publicadas', count: properties.filter(p => p.status === 'published').length },
              { key: 'reserved', label: 'Reservadas', count: properties.filter(p => p.status === 'reserved').length },
              { key: 'sold', label: 'Vendidas', count: properties.filter(p => p.status === 'sold').length }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as FilterType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === filterOption.key
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200'
                }`}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>

          {/* Búsqueda y Ordenamiento */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Barra de búsqueda */}
            <div className="relative flex-1 lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={animatedPlaceholder || basePlaceholder}
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-slate-400 bg-white"
              />
              {searchCode && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price' | 'area' | 'date')}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="date">Más Recientes</option>
              <option value="price">Precio</option>
              <option value="area">Área</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Indicador de búsqueda activa */}
        {searchCode && (
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
            <Search className="w-4 h-4 text-slate-500" />
            <span>Buscando: "<span className="font-medium text-slate-900">{searchCode}</span>"</span>
            <button
              onClick={clearSearch}
              className="text-slate-600 hover:text-slate-900 font-medium ml-auto"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

        {/* Grid de propiedades */}
        {filteredAndSortedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedProperties.map((property) => {
              const badge = getStatusBadge(property.status);
              return (
                <div
                  key={property._id}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => handlePropertyClick(property)}
                >
                  {/* Imagen */}
                  <div className="relative h-56 overflow-hidden bg-gray-200">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0].url}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Sin imagen
                      </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`${badge.color} px-3 py-1 rounded-full text-xs font-medium border`}>
                        {badge.text}
                      </span>
                    </div>

                    {/* Precio */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-white text-slate-900 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm">
                        {formatPrice(property.price)}
                      </div>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-slate-900 mb-1 line-clamp-2">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-sm text-slate-600 mb-4">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                      <span className="truncate">
                        {property.address.city}, {property.address.state}
                      </span>
                    </div>

                    {/* Detalles */}
                    <div className="flex items-center gap-4 text-xs text-slate-600 mb-5">
                      {property.bedrooms > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Bed className="w-3.5 h-3.5 text-slate-400" />
                          <span>{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Bath className="w-3.5 h-3.5 text-slate-400" />
                          <span>{property.bathrooms}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Maximize className="w-3.5 h-3.5 text-slate-400" />
                        <span>{property.area}m²</span>
                      </div>
                    </div>

                    {/* Código y acción */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-mono">
                        {property.propertyCode || property._id}
                      </span>
                      <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                        Ver más
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No se encontraron propiedades
            </h3>
            <p className="text-slate-600 mb-4">
              {searchCode
                ? `No hay propiedades que coincidan con "${searchCode}"`
                : 'No hay propiedades disponibles en este momento'
              }
            </p>
            {searchCode && (
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Limpiar búsqueda y ver todas las propiedades
              </button>
            )}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `
      }} />
    </div>
  );
};

export default PropertyList;