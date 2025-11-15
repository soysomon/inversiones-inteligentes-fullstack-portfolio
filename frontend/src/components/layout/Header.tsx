'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Menu, Home, Search, Building, BookOpen, Mail, Phone, ChevronDown, 
  MapPin, DollarSign, X
} from 'lucide-react';
import logoEmpresa from '../../img/logo1.png';
import logoWhite from '../../img/logowhite.png';

interface HeaderProps {
  onNavigateToHome?: () => void;
  onNavigateToProperties?: () => void;
  onNavigateToAbout?: () => void; 
  currentView?: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToHome, onNavigateToProperties, onNavigateToAbout, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [budget, setBudget] = useState<[number, number]>([500000, 5000000]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isStaticRoute = currentView === 'properties' || currentView === 'property-detail';
  
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
  
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClick);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [currentView]);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', maximumFractionDigits: 0 }).format(value);

  const navigation = [
    { name: 'Inicio', href: '/', icon: Home, onClick: onNavigateToHome },
    { name: 'Comprar', href: '/propiedades', icon: Building, onClick: onNavigateToProperties },
    { name: 'Quienes Somos', href: '/quienes-somos', icon: BookOpen, onClick: onNavigateToAbout },
    { name: 'Contacto', href: '/contacto', icon: Mail },
  ];

  const locations = [
    { id: 'san-juan', name: 'San Juan' },
    { id: 'santo-domingo', name: 'Santo Domingo' }
  ];

  const propertyTypes = [
    { id: 'casa', name: 'Casa'},
    { id: 'apartamento', name: 'Apartamento'},
    { id: 'solares', name: 'Solares'}
  ];

  const isStaticRoute = currentView === 'properties' || currentView === 'property-detail';
  
  const headerClasses = `transition-all duration-500 ${
    isStaticRoute 
      ? 'relative bg-white border-b border-slate-200 py-4'
      : scrolled 
        ? 'fixed top-0 left-0 right-0 z-50 py-2 rounded-b-3xl mx-2 shadow-2xl shadow-[#234978]/20' 
        : 'fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md py-4 shadow-sm'
  }`;

  const headerStyle = isStaticRoute 
    ? undefined
    : scrolled ? {
        background: 'linear-gradient(135deg, #234978 0%, #1a3a63 50%, #234978 100%)',
        boxShadow: '0 8px 32px rgba(35, 73, 120, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      } : undefined;

  const textColor = isStaticRoute ? 'text-gray-800' : scrolled ? 'text-white' : 'text-gray-800';
  const hoverBg = isStaticRoute ? 'hover:bg-gray-50' : scrolled ? 'hover:bg-white/10' : 'hover:bg-gray-50';
  const accentColor = isStaticRoute ? 'group-hover:text-blue-600' : scrolled ? 'group-hover:text-[#bdcd2e]' : 'group-hover:text-blue-600';

  return (
    <>
      {!isStaticRoute && (
        <div className={`transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`} />
      )}
      
      <header className={headerClasses} style={headerStyle}>
        {scrolled && !isStaticRoute && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-b-3xl" />
        )}
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center">
              <a 
                href="/" 
                onClick={(e) => {
                  if (onNavigateToHome) {
                    e.preventDefault();
                    onNavigateToHome();
                  }
                }}
                className="group relative"
              >
                <div className={`transition-all duration-300 ${scrolled && !isStaticRoute ? 'scale-90' : 'scale-100'}`}>
                  <img 
                    src={scrolled && !isStaticRoute ? logoWhite : logoEmpresa} 
                    alt="Logo" 
                    className={`transition-all duration-500 ${
                      scrolled && !isStaticRoute ? 'h-9 w-auto' : 'h-12 w-auto'
                    } group-hover:scale-105 filter drop-shadow-sm`}
                  />
                  {scrolled && !isStaticRoute && (
                    <div className="absolute inset-0 bg-[#bdcd2e]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-150" />
                  )}
                </div>
              </a>
            </div>

            {/* Navegación Desktop - Simple para rutas estáticas */}
            {isStaticRoute ? (
              <nav className="hidden md:flex items-center space-x-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      }
                    }}
                    className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </a>
                ))}
                <a
                  href="tel:+18498827452"
                  className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors font-medium"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden xl:inline">(849) 882-7452</span>
                </a>
              </nav>
            ) : (
              /* Barra central completa para rutas no estáticas */
              <div className="hidden lg:flex items-center justify-center flex-1 max-w-4xl mx-8" ref={dropdownRef}>
                <div className={`relative w-full transition-all duration-300 ${
                  isSearchMode ? 'scale-[1.02]' : 'scale-100'
                }`}>
                  
                  <div className={`flex items-center rounded-full border transition-all duration-300 ${
                    scrolled
                      ? 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:border-[#bdcd2e]/30'
                      : 'bg-white shadow-sm border-gray-200 hover:shadow-md hover:border-blue-200'
                  } ${isSearchMode ? (scrolled ? 'shadow-2xl border-[#bdcd2e]/50 bg-white/20' : 'shadow-lg border-blue-300') : ''}`}>
                    
                    {/* Navigation */}
                    <div className={`flex-1 flex items-center transition-all duration-300 ${
                      isSearchMode ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                    }`}>
                      {navigation.map((item, index) => (
                        <div key={item.name} className="flex items-center">
                          <a
                            href={item.href}
                            onClick={(e) => {
                              if (item.onClick) {
                                e.preventDefault();
                                item.onClick();
                              }
                            }}
                            className={`flex items-center px-4 py-3 rounded-full transition-all duration-200 group ${hoverBg} ${textColor}`}
                          >
                            <item.icon className={`w-4 h-4 mr-2 transition-all duration-200 ${
                              scrolled ? `text-white/80 ${accentColor}` : `text-gray-600 ${accentColor}`
                            }`} />
                            <span className={`text-sm font-medium transition-colors ${accentColor}`}>
                              {item.name}
                            </span>
                          </a>
                          {index < navigation.length - 1 && (
                            <div className={`w-px h-6 ${scrolled ? 'bg-white/20' : 'bg-gray-200'}`} />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Search Filters */}
                    <div className={`flex items-center transition-all duration-300 ${
                      isSearchMode ? 'flex-1 opacity-100' : 'opacity-0 w-0 overflow-hidden'
                    }`}>
                      {[
                        { key: 'location', icon: MapPin, label: selectedLocation || 'Ubicación' },
                        { key: 'type', icon: Building, label: selectedType || 'Tipo' },
                        { key: 'budget', icon: DollarSign, label: budget[0] === 500000 && budget[1] === 5000000 ? 'Presupuesto' : formatCurrency(budget[0]) }
                      ].map((filter, index) => (
                        <div key={filter.key} className="flex items-center">
                          <button 
                            onClick={() => setActiveDropdown(activeDropdown === filter.key ? null : filter.key)}
                            className={`flex items-center px-4 py-3 rounded-full transition-all duration-200 group ${hoverBg} ${textColor}`}
                          >
                            <filter.icon className={`w-4 h-4 mr-2 transition-colors ${
                              scrolled ? `text-white/80 ${accentColor}` : `text-gray-600 ${accentColor}`
                            }`} />
                            <span className="text-sm font-medium">{filter.label}</span>
                            <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                              activeDropdown === filter.key ? 'rotate-180' : ''
                            } ${scrolled ? 'text-white/60' : 'text-gray-400'}`} />
                          </button>
                          {index < 2 && <div className={`w-px h-6 ${scrolled ? 'bg-white/20' : 'bg-gray-200'}`} />}
                        </div>
                      ))}
                    </div>
                    
                    {/* Search Button */}
                    <div className="flex items-center">
                      {isSearchMode && (
                        <button
                          onClick={() => setIsSearchMode(false)}
                          className={`mr-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            scrolled ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Cancelar
                        </button>
                      )}
                      <button 
                        onClick={isSearchMode ? () => console.log('Buscar:', { location: selectedLocation, type: selectedType, budget }) : () => setIsSearchMode(true)}
                        className={`p-3 text-white rounded-full transition-all duration-300 hover:scale-110 group mr-2 relative overflow-hidden ${
                          isSearchMode 
                            ? scrolled ? 'bg-[#bdcd2e] hover:bg-[#a8b829] shadow-lg shadow-[#bdcd2e]/30' : 'bg-[#234978] hover:bg-[#1a3a63] shadow-lg shadow-[#234978]/30'
                            : scrolled ? 'bg-[#bdcd2e] hover:bg-[#a8b829] shadow-lg shadow-[#bdcd2e]/30' : 'bg-[#234978] hover:bg-[#1a3a63] shadow-lg shadow-[#234978]/30'
                        }`}
                      >
                        <Search className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 relative z-10" />
                        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      </button>
                    </div>
                  </div>

                  {/* Dropdowns */}
                  {activeDropdown && isSearchMode && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border overflow-hidden z-50 mx-2 sm:mx-0 animate-in slide-in-from-top-2 duration-200">
                      {activeDropdown === 'location' && (
                        <div className="p-4">
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">Ubicación</h3>
                          {locations.map((location) => (
                            <button
                              key={location.id}
                              onClick={() => { setSelectedLocation(location.name); setActiveDropdown(null); }}
                              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 hover:bg-blue-50 group ${
                                selectedLocation === location.name ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:text-blue-600'
                              }`}
                            >
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                                <span className="font-medium">{location.name}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {activeDropdown === 'type' && (
                        <div className="p-4">
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">Tipo</h3>
                          {propertyTypes.map((type) => (
                            <button
                              key={type.id}
                              onClick={() => { setSelectedType(type.name); setActiveDropdown(null); }}
                              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 hover:bg-blue-50 group ${
                                selectedType === type.name ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:text-blue-600'
                              }`}
                            >
                              <div className="flex items-center">
                                <span className="font-medium">{type.name}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {activeDropdown === 'budget' && (
                        <div className="p-6">
                          <h3 className="text-sm font-semibold text-gray-900 mb-4">Presupuesto</h3>
                          <div className="space-y-6">
                            <div className="px-2">
                              <div className="relative">
                                <input
                                  type="range"
                                  min="1000000"
                                  max="50000000"
                                  step="100000"
                                  value={budget[1]}
                                  onChange={(e) => {
                                    const newValue = Number(e.target.value);
                                    setBudget([budget[0], Math.max(newValue, budget[0] + 100000)]);
                                  }}
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider absolute top-0"
                                />
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <div className="text-center">
                                <br/>
                                <div className="text-xs text-gray-500 mb-1">Máximo</div>
                                <div className="font-semibold text-gray-900 text-sm">{formatCurrency(budget[1])}</div>
                              </div>
                            </div>
                            <button
                              onClick={() => setActiveDropdown(null)}
                              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold"
                            >
                              Aplicar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Teléfono Desktop - Solo para rutas no estáticas */}
            {!isStaticRoute && (
              <div className="hidden lg:flex items-center space-x-3">
                <a
                  href="tel:+18498827452"
                  className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-full transition-all duration-200 group ${
                    scrolled ? 'text-white hover:text-[#bdcd2e] hover:bg-white/10' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Phone className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="hidden xl:inline font-medium">(849) 882-7452</span>
                </a>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden relative p-2 rounded-full transition-all duration-200 ${
                isStaticRoute 
                  ? 'hover:bg-gray-100' 
                  : scrolled ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
            >
              {isMenuOpen ? (
                <X className={`w-6 h-6 ${isStaticRoute ? 'text-gray-800' : scrolled ? 'text-white' : 'text-gray-800'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isStaticRoute ? 'text-gray-800' : scrolled ? 'text-white' : 'text-gray-800'}`} />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}>
            <nav className="py-4 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isStaticRoute 
                      ? 'text-gray-800 hover:bg-gray-50' 
                      : scrolled ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    isStaticRoute
                      ? 'bg-gray-100 group-hover:bg-blue-50'
                      : scrolled ? 'bg-white/10 group-hover:bg-[#bdcd2e]/20' : 'bg-gray-100 group-hover:bg-blue-50'
                  }`}>
                    <item.icon className={`w-5 h-5 transition-colors ${
                      isStaticRoute
                        ? 'text-gray-600 group-hover:text-blue-600'
                        : scrolled ? 'text-white group-hover:text-[#bdcd2e]' : 'text-gray-600 group-hover:text-blue-600'
                    }`} />
                  </div>
                  <span className="font-medium">{item.name}</span>
                </a>
              ))}
              
              {/* Teléfono en menú móvil */}
              <a
                href="tel:+18498827452"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isStaticRoute 
                    ? 'text-gray-800 hover:bg-gray-50' 
                    : scrolled ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  isStaticRoute
                    ? 'bg-gray-100 group-hover:bg-blue-50'
                    : scrolled ? 'bg-white/10 group-hover:bg-[#bdcd2e]/20' : 'bg-gray-100 group-hover:bg-blue-50'
                }`}>
                  <Phone className={`w-5 h-5 transition-colors ${
                    isStaticRoute
                      ? 'text-gray-600 group-hover:text-blue-600'
                      : scrolled ? 'text-white group-hover:text-[#bdcd2e]' : 'text-gray-600 group-hover:text-blue-600'
                  }`} />
                </div>
                <span className="font-medium">(849) 882-7452</span>
              </a>
            </nav>
          </div>
        </div>
      </header>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        
        @keyframes in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-in {
          animation: in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Header;