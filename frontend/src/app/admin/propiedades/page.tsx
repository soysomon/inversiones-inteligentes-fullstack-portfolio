import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/admin/Navbar';
import { propertyService, Property } from '../../../services/admin/properties';
import { Plus, Edit2, Trash2, Eye, Building } from 'lucide-react';

export default function PropiedadesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await propertyService.getAll();
      setProperties(data.items || []);
    } catch (error) {
      console.error('Error cargando propiedades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta propiedad?')) return;

    setDeleting(id);
    try {
      await propertyService.delete(id);
      setProperties(properties.filter(p => (p._id || p.id) !== id));
    } catch (error) {
      console.error('Error eliminando propiedad:', error);
      alert('Error al eliminar la propiedad');
    } finally {
      setDeleting(null);
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar minimalista */}
      <nav className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-light tracking-tight text-slate-900">Propiedades</h1>
          <Link
            to="/admin/propiedades/crear"
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-light text-sm"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Nueva Propiedad
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-slate-200 rounded-full"></div>
              <div className="w-16 h-16 border-2 border-slate-900 border-t-transparent rounded-full animate-spin absolute top-0"></div>
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Building className="h-16 w-16 text-slate-300 mb-4" strokeWidth={1} />
            <h3 className="text-lg font-light text-slate-900 mb-2">No hay propiedades</h3>
            <p className="text-slate-500 text-sm font-light mb-6">Comienza creando tu primera propiedad</p>
            <Link
              to="/admin/propiedades/crear"
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-light text-sm"
            >
              <Plus className="h-4 w-4" strokeWidth={1.5} />
              Crear Propiedad
            </Link>
          </div>
        ) : (
          <>
            {/* Header con contador */}
            <div className="mb-8 pb-6 border-b border-slate-100">
              <p className="text-sm font-light text-slate-500">
                {properties.length} {properties.length === 1 ? 'propiedad' : 'propiedades'}
              </p>
            </div>

            {/* Grid de propiedades */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
              {properties.map((property) => {
                const propertyId = (property.id || property._id || '').toString();
                if (!propertyId) return null;
                
                return (
                  <div key={propertyId} className="bg-white group">
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                      {property.images?.[0] ? (
                        <img
                          src={property.images[0].url}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building className="h-12 w-12 text-slate-300" strokeWidth={1} />
                        </div>
                      )}
                      
                      {/* Status badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`
                          px-2 py-1 rounded text-xs font-light
                          ${property.status === 'published' ? 'bg-emerald-500 text-white' :
                            property.status === 'draft' ? 'bg-slate-500 text-white' :
                            'bg-amber-500 text-white'}
                        `}>
                          {property.status === 'published' ? 'Publicado' :
                           property.status === 'draft' ? 'Borrador' : property.status}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Title */}
                      <h3 className="text-base font-light text-slate-900 mb-2 line-clamp-2 min-h-[3rem]">
                        {property.title}
                      </h3>

                      {/* Location */}
                      <p className="text-sm text-slate-500 font-light mb-4">
                        {property.address.city}, {property.address.state}
                      </p>

                      {/* Price */}
                      <p className="text-2xl font-extralight text-slate-900 tracking-tight mb-4">
                        {formatPrice(property.price.amount, property.price.currency)}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-light mb-6 pb-6 border-b border-slate-100">
                        <span>{property.bedrooms} Hab</span>
                        <span>·</span>
                        <span>{property.bathrooms} Baños</span>
                        <span>·</span>
                        <span>{property.area}m²</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/propiedades/editar/${propertyId}`}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-xs font-light"
                        >
                          <Edit2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                          Editar
                        </Link>
                        
                        <button
                          onClick={() => handleDelete(propertyId)}
                          disabled={deleting === propertyId}
                          className="flex items-center justify-center px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors text-xs disabled:opacity-50"
                        >
                          {deleting === propertyId ? (
                            <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                          )}
                        </button>
                        
                        <a
                          href={`/propiedades/${property.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors text-xs"
                        >
                          <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}