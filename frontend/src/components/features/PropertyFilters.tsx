interface Filters {
    operacion: string;
    tipoPropiedad: string;
    ciudad: string;
    sector: string;
    precioMin: string;
    precioMax: string;
    habitaciones: string;
    banos: string;
    estacionamientos: string;
    areaMin: string;
    areaMax: string;
  }
  
  interface PropertyFiltersProps {
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
    onClose: () => void;
  }
  
  export default function PropertyFilters({ filters, onFiltersChange, onClose }: PropertyFiltersProps) {
    const handleChange = (field: keyof Filters, value: string) => {
      onFiltersChange({
        ...filters,
        [field]: value
      });
    };
  
    const clearFilters = () => {
      onFiltersChange({
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
    };
  
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Filtros Avanzados</h3>
          <div className="flex space-x-2">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Limpiar
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Operación
            </label>
            <select
              value={filters.operacion}
              onChange={(e) => handleChange('operacion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Todas</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Propiedad
            </label>
            <select
              value={filters.tipoPropiedad}
              onChange={(e) => handleChange('tipoPropiedad', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Todos</option>
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="villa">Villa</option>
              <option value="penthouse">Penthouse</option>
              <option value="local">Local Comercial</option>
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad
            </label>
            <select
              value={filters.ciudad}
              onChange={(e) => handleChange('ciudad', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Todas</option>
              <option value="santo-domingo">Santo Domingo</option>
              <option value="santiago">San Jaun de la Maguana</option>
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Habitaciones
            </label>
            <select
              value={filters.habitaciones}
              onChange={(e) => handleChange('habitaciones', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Cualquiera</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
        </div>
      </div>
    );
  }