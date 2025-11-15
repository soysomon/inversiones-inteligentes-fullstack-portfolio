import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropertyForm from '../../../components/admin/PropertyForm';
import { propertyService, Property } from '../../../services/admin/properties';
import { ArrowLeft } from 'lucide-react';

export default function EditarPropiedadPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

  const loadProperty = async () => {
    try {
      const data = await propertyService.getById(id!);
      setProperty(data);
    } catch (error) {
      console.error('Error cargando propiedad:', error);
      alert('Error cargando la propiedad');
      navigate('/admin/propiedades');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    navigate('/admin/propiedades');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-screen">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-slate-200 rounded-full"></div>
            <div className="w-16 h-16 border-2 border-slate-900 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <h1 className="text-2xl font-light tracking-tight text-slate-900">Editar Propiedad</h1>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="text-slate-500 font-light">Propiedad no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar minimalista */}
      <nav className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/propiedades')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <h1 className="text-2xl font-light tracking-tight text-slate-900">Editar Propiedad</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Property Info Header - Estilo Apple */}
        <div className="mb-8 pb-8 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-extralight text-slate-900 tracking-tight mb-2">
                {property.title}
              </h2>
              <p className="text-sm font-light text-slate-500">
                {property.address.city}, {property.address.state}
              </p>
            </div>
            
            {/* Precio destacado - Estilo Tesla */}
            <div className="text-right">
              <div className="text-4xl font-extralight text-slate-900 tracking-tight">
                {new Intl.NumberFormat('es-DO', {
                  style: 'currency',
                  currency: property.price.currency || 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(property.price.amount)}
              </div>
              <div className="text-xs font-light text-slate-500 mt-1">
                {property.price.currency || 'USD'}
              </div>
            </div>
          </div>

          {/* Stats en línea - Minimalista */}
          <div className="flex items-center gap-6 mt-6 text-sm font-light text-slate-600">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Habitaciones:</span>
              <span className="text-slate-900">{property.bedrooms}</span>
            </div>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Baños:</span>
              <span className="text-slate-900">{property.bathrooms}</span>
            </div>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Área:</span>
              <span className="text-slate-900">{property.area}m²</span>
            </div>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Estado:</span>
              <span className={`
                px-2 py-0.5 rounded text-xs
                ${property.status === 'published' ? 'bg-emerald-500 text-white' :
                  property.status === 'draft' ? 'bg-slate-500 text-white' :
                  'bg-amber-500 text-white'}
              `}>
                {property.status === 'published' ? 'Publicado' :
                 property.status === 'draft' ? 'Borrador' : property.status}
              </span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="p-8">
            <h3 className="text-lg font-light text-slate-900 mb-6 pb-6 border-b border-slate-100">
              Información de la propiedad
            </h3>
            <PropertyForm 
              initialData={property} 
              onSuccess={handleSuccess} 
              isEditing 
            />
          </div>
        </div>
      </div>
    </div>
  );
}