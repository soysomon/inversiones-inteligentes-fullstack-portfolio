import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, Building, Filter, X, Bed, Bath, Hash, ChevronDown, AlertCircle } from 'lucide-react';
import { propertyService } from '../../services/admin/properties';

interface SearchData {
  tipo: string;
  ciudad: string;
  precioMin: number;
  precioMax: number;
  habitaciones: number;
  banos: number;
  codigo: string;
}

const DropdownPortal = ({ 
  children, 
  isOpen, 
  coords 
}: { 
  children: React.ReactNode; 
  isOpen: boolean; 
  coords: { top: number; left: number; width: number } 
}) => {
  const portalRoot = document.getElementById('dropdown-portal');
  
  if (!isOpen || !portalRoot) return null;

  return createPortal(
    <div 
      style={{
        position: 'absolute',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        width: `${coords.width}px`,
        pointerEvents: 'auto'
      }}
    >
      {children}
    </div>,
    portalRoot
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopSidebar, setShowDesktopSidebar] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const [showTipoDropdown, setShowTipoDropdown] = useState(false);
  const [showCiudadDropdown, setShowCiudadDropdown] = useState(false);
  
  const tipoButtonRef = useRef<HTMLButtonElement>(null);
  const ciudadButtonRef = useRef<HTMLButtonElement>(null);
  const tipoDropdownRef = useRef<HTMLDivElement>(null);
  const ciudadDropdownRef = useRef<HTMLDivElement>(null);
  const [tipoCoords, setTipoCoords] = useState({ top: 0, left: 0, width: 0 });
  const [ciudadCoords, setCiudadCoords] = useState({ top: 0, left: 0, width: 0 });

  const [currentTipoIndex, setCurrentTipoIndex] = useState(0);
  const [currentCiudadIndex, setCurrentCiudadIndex] = useState(0);
  const [userInteractedTipo, setUserInteractedTipo] = useState(false);
  const [userInteractedCiudad, setUserInteractedCiudad] = useState(false);

  const [filters, setFilters] = useState<SearchData>({
    tipo: '',
    ciudad: '',
    precioMin: 500000,
    precioMax: 50000000,
    habitaciones: 0,
    banos: 0,
    codigo: ''
  });

  const tipos = useMemo(() => [
    { value: '', label: 'Todos' },
    { value: 'house', label: 'Casa' },
    { value: 'apartment', label: 'Apartamento' },
    { value: 'land', label: 'Terreno' },
  ], []);

  const ciudades = useMemo(() => [
    { value: '', label: 'Todas' },
    { value: 'Santo Domingo', label: 'Santo Domingo' },
    { value: 'San Juan', label: 'San Juan' },
    { value: 'Punta Cana', label: 'Punta Cana' },
  ], []);

  const formatPrice = useCallback((val: number) => `RD$ ${(val / 1000000).toFixed(1)}M`, []);

  const currentTipo = useMemo(() => 
    tipos.find(t => t.value === filters.tipo) || tipos[currentTipoIndex], 
    [filters.tipo, tipos, currentTipoIndex]
  );

  const currentCiudad = useMemo(() => 
    ciudades.find(c => c.value === filters.ciudad) || ciudades[currentCiudadIndex], 
    [filters.ciudad, ciudades, currentCiudadIndex]
  );

  const hasFilters = filters.habitaciones > 0 || filters.banos > 0 || filters.precioMin > 500000 || filters.precioMax < 50000000;

  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    
    const clickedInTipo = tipoButtonRef.current?.contains(target) || tipoDropdownRef.current?.contains(target);
    const clickedInCiudad = ciudadButtonRef.current?.contains(target) || ciudadDropdownRef.current?.contains(target);
    
    if (!clickedInTipo && !clickedInCiudad) {
      setShowTipoDropdown(false);
      setShowCiudadDropdown(false);
    }
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    if (!document.getElementById('dropdown-portal')) {
      const portalRoot = document.createElement('div');
      portalRoot.id = 'dropdown-portal';
      portalRoot.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
      document.body.appendChild(portalRoot);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    const updatePositions = () => {
      if (showTipoDropdown && tipoButtonRef.current) {
        const rect = tipoButtonRef.current.getBoundingClientRect();
        setTipoCoords({
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width
        });
      }
      if (showCiudadDropdown && ciudadButtonRef.current) {
        const rect = ciudadButtonRef.current.getBoundingClientRect();
        setCiudadCoords({
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width
        });
      }
    };

    updatePositions();
    
    if (showTipoDropdown || showCiudadDropdown) {
      window.addEventListener('scroll', updatePositions, true);
      window.addEventListener('resize', updatePositions);

      return () => {
        window.removeEventListener('scroll', updatePositions, true);
        window.removeEventListener('resize', updatePositions);
      };
    }
  }, [showTipoDropdown, showCiudadDropdown]);

  useEffect(() => {
    if (!userInteractedTipo && tipos.length > 0) {
      const interval = setInterval(() => {
        setCurrentTipoIndex(prev => (prev + 1) % tipos.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [userInteractedTipo, tipos.length]);

  useEffect(() => {
    if (!userInteractedCiudad && ciudades.length > 0) {
      const interval = setInterval(() => {
        setCurrentCiudadIndex(prev => (prev + 1) % ciudades.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [userInteractedCiudad, ciudades.length]);

  useEffect(() => {
    if (!userInteractedTipo) {
      setFilters(prev => ({ ...prev, tipo: tipos[currentTipoIndex].value }));
    }
  }, [currentTipoIndex, userInteractedTipo, tipos]);

  useEffect(() => {
    if (!userInteractedCiudad) {
      setFilters(prev => ({ ...prev, ciudad: ciudades[currentCiudadIndex].value }));
    }
  }, [currentCiudadIndex, userInteractedCiudad, ciudades]);

  useEffect(() => {
    if (filters.precioMin > filters.precioMax) {
      setFilters(prev => ({ ...prev, precioMin: filters.precioMax }));
    }
  }, [filters.precioMin, filters.precioMax]);

  const handleSearch = useCallback(async () => {
    try {
      setIsSearching(true);
      setError(null);

      if (filters.codigo.trim()) {
        try {
          const result = await propertyService.getAll({
            q: filters.codigo.trim()
          });

          if (result.items && result.items.length === 1) {
            const property = result.items[0];
            navigate(`/propiedades/${property.slug || property.id}`);
            return;
          }
          
          if (result.items && result.items.length > 1) {
            navigate(`/propiedades?q=${encodeURIComponent(filters.codigo.trim())}`);
            return;
          }
          
          setError(`No se encontró ninguna propiedad con el código "${filters.codigo.trim()}"`);
          setIsSearching(false);
          return;
          
        } catch (err) {
          console.error('Error buscando por código:', err);
          navigate(`/propiedades?q=${encodeURIComponent(filters.codigo.trim())}`);
          return;
        }
      }

      const params: any = {};

      if (filters.tipo) params.type = filters.tipo;
      if (filters.ciudad) params.city = filters.ciudad;
      if (filters.habitaciones > 0) params.bedrooms = filters.habitaciones;
      if (filters.banos > 0) params.bathrooms = filters.banos;
      if (filters.precioMin > 500000) params.minPrice = filters.precioMin;
      if (filters.precioMax < 50000000) params.maxPrice = filters.precioMax;

      const queryString = new URLSearchParams(params).toString();
      navigate(`/propiedades${queryString ? '?' + queryString : ''}`);

    } catch (error) {
      console.error('Error en búsqueda:', error);
      setError('Ocurrió un error al buscar propiedades. Intenta de nuevo.');
    } finally {
      setIsSearching(false);
      if (isMobile) setShowMobileFilters(false);
      else setShowDesktopSidebar(false);
    }
  }, [filters, navigate, isMobile]);

  const updateFilter = useCallback((key: keyof SearchData, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));

    if (key === 'tipo') {
      setUserInteractedTipo(true);
      setShowTipoDropdown(false);
    }
    if (key === 'ciudad') {
      setUserInteractedCiudad(true);
      setShowCiudadDropdown(false);
    }
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      tipo: '',
      ciudad: '',
      precioMin: 500000,
      precioMax: 50000000,
      habitaciones: 0,
      banos: 0,
      codigo: ''
    });
    setUserInteractedTipo(false);
    setUserInteractedCiudad(false);
    setCurrentTipoIndex(0);
    setCurrentCiudadIndex(0);
    setError(null);
  }, []);

  return (
    <section className="relative h-[75vh] min-h-[600px] max-h-[800px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
          alt="Propiedad de lujo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/50"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-8 lg:mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="relative mb-6">
            <div className="text-4xl sm:text-5xl lg:text-7xl font-light text-white mb-3 leading-tight tracking-tight">
              Encuentra tu hogar
            </div>

            <div className="relative inline-block">
              <span className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-white relative">
                PERFECTO
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shine"></span>
              </span>
            </div>
          </h1>

          <p className="text-lg sm:text-xl text-white/90 font-light mb-6">
            Las mejores propiedades en República Dominicana
          </p>

          <div className="flex flex-wrap justify-center items-center gap-6 text-white/80 text-sm font-medium">
            <span className="animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
              Propiedades verificadas
            </span>
            <span className="animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>•</span>
            <span className="animate-fade-in" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>
              Asesoría personalizada
            </span>
            <span className="animate-fade-in" style={{ animationDelay: '1.1s', animationFillMode: 'both' }}>•</span>
            <span className="animate-fade-in" style={{ animationDelay: '1.3s', animationFillMode: 'both' }}>
              Más de 10 años de experiencia
            </span>
          </div>
        </div>

        <div className={`transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm flex-1">{error}</span>
              <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {isMobile ? (
            <button
              onClick={() => setShowMobileFilters(true)}
              className="w-full bg-white rounded-2xl shadow-2xl p-4 flex items-center justify-between hover:shadow-3xl transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <Search className="w-5 h-5 text-gray-400" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">Buscar propiedades</div>
                  <div className="text-xs text-gray-500">
                    {filters.codigo || `${currentTipo.label} • ${currentCiudad.label}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {hasFilters && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
                <Filter className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          ) : (
            <div className="bg-white rounded-2xl shadow-2xl p-2 backdrop-blur-sm bg-white/95">
              <div className="flex flex-col lg:flex-row gap-1">

                <div className="flex-1 flex items-center p-3 hover:bg-gray-50 rounded-xl transition-all duration-200 group relative">
                  <Hash className="w-5 h-5 text-orange-600 mr-2 group-hover:scale-110 transition-transform" />
                  <div className="flex-1">
                    <div className="text-[10px] text-gray-400 mb-0.5 uppercase tracking-wide font-medium">Código</div>
                    <input
                      type="text"
                      placeholder="INV-2025-0001"
                      value={filters.codigo}
                      onChange={(e) => updateFilter('codigo', e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full text-sm bg-transparent border-none outline-none placeholder:text-gray-400 focus:ring-0"
                    />
                  </div>
                  {filters.codigo && (
                    <button
                      onClick={() => updateFilter('codigo', '')}
                      className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  )}
                </div>

                <div className="hidden lg:block w-px bg-gray-200"></div>

                <div className="flex-1 relative">
                  <button
                    ref={tipoButtonRef}
                    onClick={() => {
                      setShowTipoDropdown(!showTipoDropdown);
                      setShowCiudadDropdown(false);
                    }}
                    className="w-full p-3 hover:bg-gray-50 rounded-xl transition text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Home className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-xs text-gray-500">TIPO</div>
                          <div className="text-sm font-medium text-gray-900">{currentTipo.label}</div>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showTipoDropdown ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {!userInteractedTipo && filters.tipo === '' && (
                    <div className="absolute -bottom-2 left-0 right-0 flex justify-center space-x-1">
                      {tipos.slice(0, 5).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                            i === currentTipoIndex ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="hidden lg:block w-px bg-gray-200"></div>

                <div className="flex-1 relative">
                  <button
                    ref={ciudadButtonRef}
                    onClick={() => {
                      setShowCiudadDropdown(!showCiudadDropdown);
                      setShowTipoDropdown(false);
                    }}
                    className="w-full p-3 hover:bg-gray-50 rounded-xl transition text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="text-xs text-gray-500">UBICACIÓN</div>
                          <div className="text-sm font-medium text-gray-900">{currentCiudad.label}</div>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showCiudadDropdown ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {!userInteractedCiudad && filters.ciudad === '' && (
                    <div className="absolute -bottom-2 left-0 right-0 flex justify-center space-x-1">
                      {ciudades.slice(0, 5).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                            i === currentCiudadIndex ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowDesktopSidebar(!showDesktopSidebar)}
                    className="relative p-3 hover:bg-gray-50 rounded-xl transition border border-gray-200"
                  >
                    <Filter className="w-5 h-5 text-gray-600" />
                    {hasFilters && <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></div>}
                  </button>

                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="relative bg-gradient-to-r from-[#234978] to-[#1a3a63] text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 flex items-center space-x-2 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    {isSearching ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Buscar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-6 lg:mt-8">
            <div className="flex items-center space-x-6 text-white/80 text-sm">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>500+ Propiedades</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>2 Ubicaciones Premium</span>
              </div>
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>10+ Años</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DropdownPortal isOpen={showTipoDropdown} coords={tipoCoords}>
        <div 
          ref={tipoDropdownRef}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-80 overflow-y-auto custom-scrollbar animate-dropdown-in"
        >
          {tipos.map((tipo, index) => (
            <button
              key={tipo.value}
              onClick={() => updateFilter('tipo', tipo.value)}
              style={{ animationDelay: `${index * 30}ms` }}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center justify-between ${
                filters.tipo === tipo.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  filters.tipo === tipo.value ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
                <span>{tipo.label}</span>
              </div>
              {filters.tipo === tipo.value && <div className="text-blue-600">✓</div>}
            </button>
          ))}
        </div>
      </DropdownPortal>

      <DropdownPortal isOpen={showCiudadDropdown} coords={ciudadCoords}>
        <div 
          ref={ciudadDropdownRef}
          className="bg-white rounded-xl shadow-xl border border-gray-200 max-h-80 overflow-y-auto custom-scrollbar animate-dropdown-in"
        >
          {ciudades.map((ciudad, index) => (
            <button
              key={ciudad.value}
              onClick={() => updateFilter('ciudad', ciudad.value)}
              style={{ animationDelay: `${index * 30}ms` }}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition flex items-center justify-between ${
                filters.ciudad === ciudad.value ? 'bg-green-50 text-green-700' : 'text-gray-700'
              }`}
            >
              <span className="font-medium">{ciudad.label}</span>
              {filters.ciudad === ciudad.value && <div className="w-2 h-2 bg-green-600 rounded-full"></div>}
            </button>
          ))}
        </div>
      </DropdownPortal>

      {!isMobile && showDesktopSidebar && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-40">
          <div className="p-6 space-y-6 overflow-y-auto h-full custom-scrollbar">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filtros Avanzados</h2>
              <button onClick={() => setShowDesktopSidebar(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Rango de Precio</label>
              <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-purple-700">{formatPrice(filters.precioMin)}</span>
                  <span className="text-purple-700">{formatPrice(filters.precioMax)}</span>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Mínimo</label>
                  <input
                    type="range"
                    min="500000"
                    max={filters.precioMax}
                    step="500000"
                    value={filters.precioMin}
                    onChange={(e) => updateFilter('precioMin', parseInt(e.target.value))}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Máximo</label>
                  <input
                    type="range"
                    min={filters.precioMin}
                    max="100000000"
                    step="500000"
                    value={filters.precioMax}
                    onChange={(e) => updateFilter('precioMax', parseInt(e.target.value))}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Habitaciones</label>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                <button
                  onClick={() => updateFilter('habitaciones', Math.max(0, filters.habitaciones - 1))}
                  className="w-10 h-10 rounded-full bg-white border-2 flex items-center justify-center hover:bg-gray-100"
                >
                  <span className="text-xl">−</span>
                </button>
                <div className="flex items-center space-x-2">
                  <Bed className="w-5 h-5 text-gray-400" />
                  <span className="text-2xl font-semibold">{filters.habitaciones || '∞'}</span>
                </div>
                <button
                  onClick={() => updateFilter('habitaciones', filters.habitaciones + 1)}
                  className="w-10 h-10 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center hover:bg-blue-50"
                >
                  <span className="text-xl text-blue-600">+</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Baños</label>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                <button
                  onClick={() => updateFilter('banos', Math.max(0, filters.banos - 1))}
                  className="w-10 h-10 rounded-full bg-white border-2 flex items-center justify-center hover:bg-gray-100"
                >
                  <span className="text-xl">−</span>
                </button>
                <div className="flex items-center space-x-2">
                  <Bath className="w-5 h-5 text-gray-400" />
                  <span className="text-2xl font-semibold">{filters.banos || '∞'}</span>
                </div>
                <button
                  onClick={() => updateFilter('banos', filters.banos + 1)}
                  className="w-10 h-10 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center hover:bg-blue-50"
                >
                  <span className="text-xl text-blue-600">+</span>
                </button>
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="w-full bg-gray-50 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      )}

      {isMobile && showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="sticky top-0 bg-white border-b px-4 py-4 flex items-center justify-between backdrop-blur-sm bg-white/95 z-10">
            <button
              onClick={() => setShowMobileFilters(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Filtros de búsqueda</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 font-medium"
            >
              Limpiar
            </button>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-140px)] p-4 space-y-6 custom-scrollbar">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Código</label>
              <input
                type="text"
                placeholder="INV-2025-0001"
                value={filters.codigo}
                onChange={(e) => updateFilter('codigo', e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <div className="grid grid-cols-2 gap-2">
                {tipos.map(t => (
                  <button
                    key={t.value}
                    onClick={() => updateFilter('tipo', t.value)}
                    className={`p-3 rounded-xl border-2 font-medium transition ${
                      filters.tipo === t.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
              <div className="space-y-2">
                {ciudades.map(c => (
                  <button
                    key={c.value}
                    onClick={() => updateFilter('ciudad', c.value)}
                    className={`w-full p-3 rounded-xl border-2 text-left flex justify-between ${
                      filters.ciudad === c.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-medium">{c.label}</span>
                    {filters.ciudad === c.value && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rango de Precio</label>
              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <div className="flex justify-between text-sm font-semibold text-gray-900">
                  <span className="text-purple-700">{formatPrice(filters.precioMin)}</span>
                  <span className="text-purple-700">{formatPrice(filters.precioMax)}</span>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Precio Mínimo</label>
                  <input
                    type="range"
                    min="500000"
                    max={filters.precioMax}
                    step="500000"
                    value={filters.precioMin}
                    onChange={(e) => updateFilter('precioMin', parseInt(e.target.value))}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none slider-thumb"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Precio Máximo</label>
                  <input
                    type="range"
                    min={filters.precioMin}
                    max="100000000"
                    step="500000"
                    value={filters.precioMax}
                    onChange={(e) => updateFilter('precioMax', parseInt(e.target.value))}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none slider-thumb"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Habitaciones</label>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                <button
                  onClick={() => updateFilter('habitaciones', Math.max(0, filters.habitaciones - 1))}
                  className="w-10 h-10 rounded-full bg-white border-2 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl">−</span>
                </button>
                <div className="flex items-center space-x-2">
                  <Bed className="w-5 h-5 text-gray-400" />
                  <span className="text-2xl font-semibold">{filters.habitaciones || '∞'}</span>
                </div>
                <button
                  onClick={() => updateFilter('habitaciones', filters.habitaciones + 1)}
                  className="w-10 h-10 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center hover:bg-blue-50 transition-colors"
                >
                  <span className="text-xl text-blue-600">+</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Baños</label>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                <button
                  onClick={() => updateFilter('banos', Math.max(0, filters.banos - 1))}
                  className="w-10 h-10 rounded-full bg-white border-2 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl">−</span>
                </button>
                <div className="flex items-center space-x-2">
                  <Bath className="w-5 h-5 text-gray-400" />
                  <span className="text-2xl font-semibold">{filters.banos || '∞'}</span>
                </div>
                <button
                  onClick={() => updateFilter('banos', filters.banos + 1)}
                  className="w-10 h-10 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center hover:bg-blue-50 transition-colors"
                >
                  <span className="text-xl text-blue-600">+</span>
                </button>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t p-4">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Buscar Propiedades</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {!isMobile && showDesktopSidebar && (
        <div 
          className="fixed inset-0 bg-black/20 z-30" 
          onClick={() => setShowDesktopSidebar(false)}
        />
      )}

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); opacity: 0.6; }
          50% { opacity: 1; }
          100% { transform: translateX(200%) skewX(-12deg); opacity: 0.6; }
        }
        .animate-shine { animation: shine 3s ease-in-out infinite; }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }

        @keyframes dropdown-in {
          from { opacity: 0; transform: translateY(-12px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-dropdown-in { animation: dropdown-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }

        .slider-thumb {
          background: linear-gradient(90deg, #c084fc 0%, #9333ea 100%);
          height: 8px;
          border-radius: 999px;
          outline: none;
        }
        
        .slider-thumb::-webkit-slider-track {
          width: 100%;
          height: 8px;
          background: linear-gradient(90deg, #e9d5ff 0%, #c084fc 100%);
          border-radius: 999px;
        }
        
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
          border: 3px solid #ffffff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(147, 51, 234, 0.3);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 16px rgba(147, 51, 234, 0.5), 0 0 0 6px rgba(147, 51, 234, 0.15);
        }
        
        .slider-thumb::-moz-range-track {
          width: 100%;
          height: 8px;
          background: linear-gradient(90deg, #e9d5ff 0%, #c084fc 100%);
          border-radius: 999px;
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
          border: 3px solid #ffffff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(147, 51, 234, 0.3);
        }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgb(243 244 246); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgb(209 213 219); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgb(156 163 175); }

        @media (max-width: 1024px) {
          .animate-shine { animation-duration: 4s; }
        }
      `}</style>
    </section>
  );
};

export default Hero;