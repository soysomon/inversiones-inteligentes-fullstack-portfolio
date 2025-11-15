import { useState, FormEvent } from 'react';
import { propertyService, CreatePropertyData } from '../../services/admin/properties';
import { X, Image as ImageIcon, Star } from 'lucide-react';

interface PropertyFormProps {
  initialData?: Partial<CreatePropertyData>;
  onSuccess: () => void;
  isEditing?: boolean;
}

export default function PropertyForm({ initialData, onSuccess, isEditing }: PropertyFormProps) {
  const [formData, setFormData] = useState<CreatePropertyData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || { amount: 0, currency: 'USD' },
    address: initialData?.address || {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'República Dominicana',
    },
    images: initialData?.images || [],
    bedrooms: initialData?.bedrooms || 0,
    bathrooms: initialData?.bathrooms || 0,
    parkingSpaces: initialData?.parkingSpaces || 0,
    area: initialData?.area || 0,
    type: initialData?.type || 'apartment',
    status: initialData?.status || 'draft',
    isPublic: initialData?.isPublic ?? false,
    features: initialData?.features || [],
    amenities: initialData?.amenities || [],
  });

  // Estado para mostrar el precio con formato
  const [displayPrice, setDisplayPrice] = useState(
    formData.price.amount > 0 
      ? new Intl.NumberFormat('en-US').format(formData.price.amount)
      : ''
  );

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Manejador del precio con formato automático
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    const numericValue = Number(value) || 0;
    
    // Formatear con comas
    const formatted = numericValue > 0 
      ? new Intl.NumberFormat('en-US').format(numericValue)
      : '';
    
    setDisplayPrice(formatted);
    setFormData({
      ...formData,
      price: { ...formData.price, amount: numericValue }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const result = await propertyService.uploadImages(files);
      
      setFormData(prev => ({
        ...prev,
        images: [
          ...prev.images,
          ...result.images.map((img: any, index: number) => ({
            url: img.url,
            alt: img.alt || '',
            isPrincipal: prev.images.length === 0 && index === 0,
          }))
        ]
      }));
    } catch (err) {
      setError('Error subiendo imágenes');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const setPrincipalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrincipal: i === index
      }))
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isEditing && initialData) {
        await propertyService.update((initialData as any)._id, formData);
      } else {
        await propertyService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error guardando propiedad');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border-l-2 border-red-500 text-red-700 px-4 py-3 text-sm font-light">
          {error}
        </div>
      )}

      {/* SECCIÓN: Información Básica */}
      <div className="space-y-6">
        <h3 className="text-sm font-medium text-slate-500 tracking-wide uppercase pb-4 border-b border-slate-100">
          Información Básica
        </h3>

        {/* Título */}
        <div>
          <label className="block text-sm font-light text-slate-700 mb-2">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-light text-slate-900 placeholder:text-slate-400"
            placeholder="Apartamento moderno en el centro"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-light text-slate-700 mb-2">
            Descripción <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-light text-slate-900 placeholder:text-slate-400 resize-none"
            placeholder="Describe las características principales de la propiedad..."
          />
        </div>
      </div>

      {/* SECCIÓN: Precio */}
      <div className="space-y-6">
        <h3 className="text-sm font-medium text-slate-500 tracking-wide uppercase pb-4 border-b border-slate-100">
          Precio
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-light text-slate-700 mb-2">
              Monto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={displayPrice}
              onChange={handlePriceChange}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-light text-slate-900 text-2xl placeholder:text-slate-400"
              placeholder="0"
            />
            <p className="text-xs font-light text-slate-500 mt-2">
              {formData.price.amount > 0 && (
                <>Formato: {new Intl.NumberFormat('es-DO', {
                  style: 'currency',
                  currency: formData.price.currency || 'USD',
                }).format(formData.price.amount)}</>
              )}
            </p>
          </div>
          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">
              Moneda
            </label>
            <select
              value={formData.price.currency}
              onChange={(e) => setFormData({
                ...formData,
                price: {...formData.price, currency: e.target.value}
              })}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-light text-slate-900"
            >
              <option value="USD">USD</option>
              <option value="DOP">DOP</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECCIÓN: Ubicación */}
      <div className="space-y-6">
        <h3 className="text-sm font-medium text-slate-500 tracking-wide uppercase pb-4 border-b border-slate-100">
          Ubicación
        </h3>

        <div>
          <label className="block text-sm font-light text-slate-700 mb-2">
            Dirección <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.address.address}
            onChange={(e) => setFormData({
              ...formData,
              address: {...formData.address, address: e.target.value}
            })}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-light text-slate-900 placeholder:text-slate-400"
            placeholder="Calle Principal #123"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">
              Ciudad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.address.city}
              onChange={(e) => setFormData({
                ...formData,
                address: {...formData.address, city: e.target.value}
              })}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-light text-slate-900 placeholder:text-slate-400"
              placeholder="Santo Domingo"
            />
          </div>
          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">
              Provincia <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.address.state}
              onChange={(e) => setFormData({
                ...formData,
                address: {...formData.address, state: e.target.value}
              })}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-light text-slate-900 placeholder:text-slate-400"
              placeholder="Distrito Nacional"
            />
          </div>
          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">
              Código Postal
            </label>
            <input
              type="text"
              value={formData.address.zipCode}
              onChange={(e) => setFormData({
                ...formData,
                address: {...formData.address, zipCode: e.target.value}
              })}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-light text-slate-900 placeholder:text-slate-400"
              placeholder="10000"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN: Características */}
      <div className="space-y-6">
        <h3 className="text-sm font-medium text-slate-500 tracking-wide uppercase pb-4 border-b border-slate-100">
          Características
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">
              Habitaciones <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.bedrooms}
              onChange={(e) => setFormData({...formData, bedrooms: Number(e.target.value)})}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-light text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">
              Baños <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.bathrooms}
              onChange={(e) => setFormData({...formData, bathrooms: Number(e.target.value)})}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-light text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">
              Parqueos
            </label>
            <input
              type="number"
              min="0"
              value={formData.parkingSpaces}
              onChange={(e) => setFormData({...formData, parkingSpaces: Number(e.target.value)})}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-light text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">
              Área (m²) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.area}
              onChange={(e) => setFormData({...formData, area: Number(e.target.value)})}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-light text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN: Tipo y Estado */}
      <div className="space-y-6">
        <h3 className="text-sm font-medium text-slate-500 tracking-wide uppercase pb-4 border-b border-slate-100">
          Clasificación
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-light text-slate-900"
            >
              <option value="apartment">Apartamento</option>
              <option value="house">Casa</option>
              <option value="villa">Villa</option>
              <option value="penthouse">Penthouse</option>
              <option value="land">Terreno</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">
              Estado <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-light text-slate-900"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="sold">Vendido</option>
              <option value="reserved">Reservado</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center cursor-pointer w-full px-4 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                className="w-4 h-4 text-slate-900 rounded focus:ring-slate-900 focus:ring-2"
              />
              <span className="ml-3 text-sm font-light text-slate-700">
                Visible al público
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* SECCIÓN: Imágenes */}
      <div className="space-y-6">
        <h3 className="text-sm font-medium text-slate-500 tracking-wide uppercase pb-4 border-b border-slate-100">
          Galería <span className="text-red-500">*</span>
        </h3>

        <div>
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-slate-900 hover:bg-slate-50 transition-all group">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-slate-300 group-hover:text-slate-900 transition-colors mb-3" strokeWidth={1} />
              <span className="text-sm font-light text-slate-600 group-hover:text-slate-900 transition-colors">
                {uploading ? 'Subiendo imágenes...' : 'Click para seleccionar imágenes'}
              </span>
              <p className="text-xs font-light text-slate-400 mt-2">
                PNG, JPG o WEBP (máx. 5MB cada una)
              </p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group aspect-square">
                <img
                  src={image.url}
                  alt={image.alt || 'Propiedad'}
                  className="w-full h-full object-cover rounded-lg border border-slate-200"
                />
                
                {/* Overlay con acciones */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPrincipalImage(index)}
                    className={`p-2 rounded-lg transition-colors ${
                      image.isPrincipal
                        ? 'bg-amber-500 text-white'
                        : 'bg-white/90 text-slate-900 hover:bg-white'
                    }`}
                    title={image.isPrincipal ? 'Imagen principal' : 'Hacer principal'}
                  >
                    <Star className="h-4 w-4" fill={image.isPrincipal ? 'currentColor' : 'none'} strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="Eliminar imagen"
                  >
                    <X className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>

                {/* Badge de principal */}
                {image.isPrincipal && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-xs font-light rounded">
                    Principal
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {formData.images.length > 0 && (
          <p className="text-xs font-light text-slate-500">
            {formData.images.length} {formData.images.length === 1 ? 'imagen' : 'imágenes'} seleccionada{formData.images.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-end gap-3 pt-8 border-t border-slate-100">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors font-light text-sm"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting || formData.images.length === 0}
          className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-light text-sm"
        >
          {submitting ? 'Guardando...' : isEditing ? 'Actualizar Propiedad' : 'Crear Propiedad'}
        </button>
      </div>
    </form>
  );
}