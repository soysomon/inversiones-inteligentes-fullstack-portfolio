import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Share,
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Car,
  Shield,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  X
} from 'lucide-react';
import { propertyService } from '../../services/admin/properties';

const PropertyDetailView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [slug]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      // Usar el nuevo método getBySlug
      const data = await propertyService.getBySlug(slug!);
      setProperty(data);
    } catch (error) {
      console.error('Error cargando propiedad:', error);
      setProperty(null);
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) =>
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: property?.description,
        url: window.location.href,
      });
    }
  };

  const handleContact = (method: 'phone' | 'email') => {
    if (method === 'phone') {
      window.open('tel:+18095550123');
    } else {
      window.open(`mailto:info@inversionesinteligentes.com?subject=Consulta sobre ${property?.title}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Propiedad no encontrada</h1>
          <a href="/propiedades" className="text-blue-600 hover:underline">
            Ver todas las propiedades
          </a>
        </div>
      </div>
    );
  }

  const getPropertyTypeName = (type: string) => {
    const types: any = {
      'apartment': 'Apartamento',
      'house': 'Casa',
      'villa': 'Villa',
      'penthouse': 'Penthouse',
      'land': 'Terreno'
    };
    return types[type] || type;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'published') {
      return {
        text: 'En Venta',
        className: 'bg-blue-50 text-blue-600 border-blue-200'
      };
    } else if (status === 'sold') {
      return {
        text: 'Vendido',
        className: 'bg-red-50 text-red-600 border-red-200'
      };
    } else if (status === 'reserved') {
      return {
        text: 'Reservado',
        className: 'bg-yellow-50 text-yellow-600 border-yellow-200'
      };
    }
    return {
      text: 'Borrador',
      className: 'bg-gray-50 text-gray-600 border-gray-200'
    };
  };

  const badge = getStatusBadge(property.status);

  return (
    <div className="min-h-screen bg-white">


      {/* Image Gallery */}
      <div className="relative">
        <div className="aspect-[16/10] md:aspect-[16/8] relative overflow-hidden">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[currentImageIndex].url}
              alt={property.images[currentImageIndex].alt || property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Sin imágenes</span>
            </div>
          )}

          {/* Navigation Arrows */}
          {property.images && property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Gallery Button */}
          {property.images && property.images.length > 0 && (
            <button
              onClick={() => openGallery(currentImageIndex)}
              className="absolute bottom-4 right-4 bg-white/90 hover:bg-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-colors"
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="font-medium">{property.images.length} fotos</span>
            </button>
          )}

          {/* Image Counter */}
          {property.images && property.images.length > 0 && (
            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {property.images && property.images.length > 1 && (
          <div className="hidden md:flex gap-2 p-4 overflow-x-auto">
            {property.images.map((image: any, index: number) => (
              <button
                key={image.id || index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden border-2 transition-colors ${index === currentImageIndex
                  ? 'border-slate-900'
                  : 'border-transparent hover:border-slate-300'
                  }`}
              >
                <img
                  src={image.url}
                  alt={image.alt || property.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Navigation Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Share className="w-4 h-4" />
              <span className="hidden sm:inline">Compartir</span>
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isFavorite
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'text-slate-700 hover:bg-slate-100'
                }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">
                {isFavorite ? 'Guardado' : 'Guardar'}
              </span>
            </button>
          </div>
        </div>
      </div>


      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`${badge.className} px-3 py-1 rounded-full text-sm font-medium border`}>
                    {badge.text}
                  </span>


                  {/*Corregir */}
                  <span className="text-sm text-slate-400 font-mono">
                    {property.propertyCode || property._id}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-900">
                    {formatPrice(property.price)}
                  </div>
                </div>
              </div>
              

              <h1 className="text-3xl font-bold text-slate-900 mb-3">
                {property.title}
              </h1>

              <div className="flex items-center text-slate-600 mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{property.address.address}, {property.address.city}, {property.address.state}</span>
              </div>

              {/* Property Stats */}
              <div className="flex flex-wrap items-center gap-6 text-slate-700">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-slate-400" />
                    <span className="font-medium">{property.bedrooms}</span>
                    <span className="text-slate-500">habitaciones</span>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-slate-400" />
                    <span className="font-medium">{property.bathrooms}</span>
                    <span className="text-slate-500">baños</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Maximize className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">{property.area}</span>
                  <span className="text-slate-500">m²</span>
                </div>
                {property.parkingSpaces > 0 && (
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-slate-400" />
                    <span className="font-medium">{property.parkingSpaces}</span>
                    <span className="text-slate-500">estacionamientos</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Descripción</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Property Details */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Detalles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Tipo de propiedad</span>
                    <span className="font-medium">{getPropertyTypeName(property.type)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Área</span>
                    <span className="font-medium">{property.area} m²</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Habitaciones</span>
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Baños</span>
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Estacionamientos</span>
                    <span className="font-medium">{property.parkingSpaces || 0}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Fecha de publicación</span>
                    <span className="font-medium">{formatDate(property.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Amenidades</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-2 h-2 bg-slate-400 rounded-full" />
                      <span className="text-slate-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Características</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

      {/* Sidebar - Agent Contact */}
      <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                {/* Agent Profile Section */}
                <div className="relative bg-gradient-to-br from-slate-50 to-white p-8 pb-6">
                  <div className="flex flex-col items-center">
                    <div className="relative group mb-5">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                      <img
                        src={
                          property.createdBy?.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(property.createdBy?.username || "Agente")}&background=3b82f6&color=fff&size=200`
                        }
                        alt={property.createdBy?.username || "Agente"}
                        className="relative w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-slate-900 mb-1 tracking-tight">
                      {property.createdBy?.firstName && property.createdBy?.lastName
                        ? `${property.createdBy.firstName} ${property.createdBy.lastName}`
                        : property.createdBy?.username || 'Agente Inmobiliario'}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">
                      Inversiones Inteligentes
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-blue-700">
                        Verificado
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 pt-6 pb-4 space-y-2.5">
                  <button
                    onClick={() => handleContact('phone')}
                    className="group w-full bg-slate-900 text-white py-3.5 px-4 rounded-2xl font-medium hover:bg-slate-800 transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm hover:shadow active:scale-[0.98]"
                  >
                    <Phone className="w-4.5 h-4.5 group-hover:rotate-12 transition-transform" />
                    Llamar Ahora
                  </button>
                  <button
                    onClick={() => handleContact('email')}
                    className="group w-full bg-slate-50 text-slate-700 py-3.5 px-4 rounded-2xl font-medium hover:bg-slate-100 transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-[0.98]"
                  >
                    <Mail className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
                    Enviar Email
                  </button>
                </div>

                {/* Contact Details */}
                <div className="px-6 pb-6">
                  <div className="bg-slate-50/50 rounded-2xl p-4 space-y-3">
                    <div className="flex items-start gap-3 group cursor-pointer">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 group-hover:bg-slate-100 transition-colors">
                        <Phone className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <p className="text-xs text-slate-500 mb-0.5">Teléfono</p>
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {property.createdBy?.phone || '+1 (809) 555-0123'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 group cursor-pointer">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 group-hover:bg-slate-100 transition-colors">
                        <Mail className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <p className="text-xs text-slate-500 mb-0.5">Email</p>
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {property.createdBy?.email || 'info@inversionesinteligentes.com'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      {isGalleryOpen && property.images && property.images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-6 right-6 z-50 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={property.images[currentImageIndex].url}
              alt={property.images[currentImageIndex].alt || property.title}
              className="max-w-full max-h-full object-contain"
            />

            {/* Gallery Navigation */}
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full">
              {currentImageIndex + 1} de {property.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailView;