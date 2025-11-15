import React, { useEffect, useRef, useState } from 'react';
import { Bed, Bath, Maximize, MapPin, Eye } from 'lucide-react';
import { propertyService } from '../../services/admin/properties';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedPropertiesProps {
  onSelectProperty: (slug: string) => void;
  onExploreProperties: () => void;
}

type FilterType = 'all' | 'house' | 'apartment' | 'land';

interface Property {
  id?: string;
  _id?: string;
  slug: string;
  title: string;
  type: string;
  status: string;
  price: {
    amount: number;
    currency: string;
  };
  images: Array<{ url: string }>;
  address: {
    city: string;
    state: string;
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyCode?: string;
}

const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({ 
  onSelectProperty,
  onExploreProperties 
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await propertyService.getAllPublic({ limit: 6 });
      setProperties(data.items || []);
    } catch (error) {
      console.error('Error cargando propiedades:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    if (filter === 'all') return true;
    return property.type === filter;
  });

  const getPropertyCount = (type: FilterType): number => {
    if (type === 'all') return properties.length;
    return properties.filter(p => p.type === type).length;
  };

  useEffect(() => {
    if (!properties.length) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo('.main-title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );

      gsap.fromTo('.subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 }
      );

      // Cards animation with ScrollTrigger
      ScrollTrigger.batch('.property-card', {
        onEnter: (elements) => {
          gsap.fromTo(elements,
            { opacity: 0, y: 60, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
          );
        },
        start: 'top 85%'
      });

      // CTA animation
      ScrollTrigger.create({
        trigger: '.cta-section',
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo('.cta-section',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [properties]);

  const formatPrice = (price: { amount: number; currency: string }): string => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: price.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price.amount);
  };

  const getTypeName = (type: string): string => {
    const types: Record<string, string> = {
      'house': 'Casa',
      'apartment': 'Apartamento',
      'land': 'Terreno',
      'project': 'Proyecto',
      'commercial': 'Comercial'
    };
    return types[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; className: string }> = {
      'published': {
        text: 'Disponible',
        className: 'bg-blue-50 text-blue-600 border-blue-200'
      },
      'sold': {
        text: 'Vendido',
        className: 'bg-red-50 text-red-600 border-red-200'
      },
      'reserved': {
        text: 'Reservado',
        className: 'bg-yellow-50 text-yellow-600 border-yellow-200'
      }
    };
    return badges[status] || badges.published;
  };

  if (loading) {
    return (
      <section className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 mt-4 text-sm md:text-base">Cargando propiedades...</p>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-3">
            No hay propiedades disponibles
          </h2>
          <p className="text-sm md:text-base text-slate-600">Pronto tendremos nuevas propiedades para ti</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="py-12 md:py-20 relative overflow-hidden bg-slate-50"
    >
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 1200 800" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 md:top-32 left-10 md:left-20 w-32 md:w-40 h-32 md:h-40 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 md:bottom-32 right-10 md:right-20 w-36 md:w-48 h-36 md:h-48 bg-emerald-200/25 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="main-title text-3xl md:text-4xl lg:text-5xl font-light text-slate-800 leading-tight mb-3 md:mb-4 px-4">
            Propiedades <span className="font-medium text-blue-600">Destacadas</span>
          </h1>
          
          <p className="subtitle text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
            Encuentra la oportunidad perfecta para tu inversión inmobiliaria
          </p>
        </div>

        {/* Filter Buttons - Estilo Apple con scroll horizontal en móvil */}
        <div className="mb-8 md:mb-12 overflow-x-auto hide-scrollbar">
          <div className="flex md:justify-center gap-2 md:gap-3 px-4 md:px-0 min-w-max md:min-w-0 pb-2 md:pb-0">
            {[
              { key: 'all' as FilterType, label: 'Todas' },
              { key: 'house' as FilterType, label: 'Casas' },
              { key: 'apartment' as FilterType, label: 'Apartamentos' },
              { key: 'land' as FilterType, label: 'Terrenos' }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`flex-shrink-0 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === filterOption.key
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {filterOption.label}
                <span className={`ml-1.5 text-xs ${filter === filterOption.key ? 'opacity-70' : 'opacity-50'}`}>
                  ({getPropertyCount(filterOption.key)})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid de propiedades - Optimizado para móvil */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto px-4 md:px-0">
          {filteredProperties.map((property) => {
            const badge = getStatusBadge(property.status);
            const propertyId = property.id || property._id || '';
            
            return (
              <div
                key={propertyId}
                className="property-card group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
                onClick={() => onSelectProperty(property.slug)}
              >
                {/* Imagen */}
                <div className="relative h-48 md:h-56 overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0].url}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Sin imagen</span>
                    </div>
                  )}
                  
                  {/* Badge - Más pequeño en móvil */}
                  <div className="absolute top-2 md:top-4 left-2 md:left-4">
                    <span className={`${badge.className} px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium border`}>
                      {badge.text}
                    </span>
                  </div>

                  {/* Precio - Más pequeño en móvil */}
                  <div className="absolute top-2 md:top-4 right-2 md:right-4">
                    <div className="bg-white text-slate-900 px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-semibold shadow-sm">
                      {formatPrice(property.price)}
                    </div>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-medium text-slate-900 mb-1 line-clamp-1">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-xs md:text-sm text-slate-600 mb-3 md:mb-4">
                    <MapPin className="w-3 md:w-3.5 h-3 md:h-3.5 mr-1 md:mr-1.5 flex-shrink-0" />
                    <span className="truncate">
                      {property.address.city}, {property.address.state}
                    </span>
                  </div>
                  
                  {/* Detalles - Compacto en móvil */}
                  <div className="flex items-center gap-3 md:gap-4 text-[11px] md:text-xs text-slate-600 mb-4 md:mb-5">
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-1 md:gap-1.5">
                        <Bed className="w-3 md:w-3.5 h-3 md:h-3.5 text-slate-400" />
                        <span>{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="flex items-center gap-1 md:gap-1.5">
                        <Bath className="w-3 md:w-3.5 h-3 md:h-3.5 text-slate-400" />
                        <span>{property.bathrooms}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 md:gap-1.5">
                      <Maximize className="w-3 md:w-3.5 h-3 md:h-3.5 text-slate-400" />
                      <span>{property.area}m²</span>
                    </div>
                  </div>

                  {/* Código y acción */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] md:text-xs text-slate-400 font-mono truncate mr-2">
                      {property.propertyCode || propertyId}
                    </span>
                    <button className="flex items-center gap-1 md:gap-1.5 text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors flex-shrink-0">
                      <Eye className="w-3 md:w-3.5 h-3 md:h-3.5" />
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA - Optimizado para móvil */}
        <div className="cta-section text-center mt-12 md:mt-20 opacity-0 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl md:text-2xl font-light text-slate-800 mb-2 md:mb-3">
              ¿Necesitas <span className="font-medium">asesoría especializada</span>?
            </h2>
            <p className="text-sm md:text-base text-slate-600 mb-6 md:mb-8 leading-relaxed">
              Nuestros expertos están listos para guiarte en tu decisión de inversión
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button 
                onClick={onExploreProperties}
                className="flex-1 bg-slate-900 text-white px-5 md:px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors active:scale-[0.98] text-sm md:text-base"
              >
                Explorar Propiedades
              </button>
              <button className="flex-1 bg-white text-slate-700 px-5 md:px-6 py-3 rounded-xl font-medium border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-colors active:scale-[0.98] text-sm md:text-base">
                Contactar
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .property-card:hover {
          transform: translateY(-4px);
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 768px) {
          .property-card:hover {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedProperties;