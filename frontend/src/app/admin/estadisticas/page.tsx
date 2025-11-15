import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Activity,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
  Zap
} from 'lucide-react';
import { getAnalyticsData } from '../../../services/analyticsDataService';

interface AnalyticsData {
  totalPageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: string;
  bounceRate: number;
  topPages: { page: string; views: number; }[];
  deviceStats: { device: string; percentage: number; }[];
  locations: { country: string; users: number; }[];
  recentActivity: { action: string; time: string; }[];
  comparison: {
    pageViewsChange: number;
    usersChange: number;
    durationChange: number;
    bounceRateChange: number;
  };
}

export default function EstadisticasPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState(7);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadAnalytics();
    
    // Auto-refresh cada 30 segundos
    const interval = setInterval(() => {
      loadAnalytics();
    }, 30000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(false); // No mostrar loading en refresh
    setError(null);
    
    try {
      const analyticsData = await getAnalyticsData(timeRange);
      setData(analyticsData);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error cargando analytics:', err);
      setError('Error al cargar datos de Google Analytics. Verifica tu configuración.');
      setLoading(true);
    }
  };

  const statCards = [
    {
      name: 'Usuarios Activos',
      value: data?.uniqueVisitors.toLocaleString() || '0',
      change: data?.comparison.usersChange || 0,
      icon: Users,
      color: 'green',
      description: 'Últimos 30 minutos',
      realtime: true
    },
    {
      name: 'Vistas de Página',
      value: data?.totalPageViews.toLocaleString() || '0',
      change: data?.comparison.pageViewsChange || 0,
      icon: Eye,
      color: 'blue',
      description: 'Últimos 30 minutos',
      realtime: true
    },
    {
      name: 'Tiempo Promedio',
      value: data?.avgSessionDuration || '0:00',
      change: data?.comparison.durationChange || 0,
      icon: Activity,
      color: 'purple',
      description: 'Por sesión'
    },
    {
      name: 'Tasa de Rebote',
      value: `${data?.bounceRate.toFixed(1) || '0'}%`,
      change: data?.comparison.bounceRateChange || 0,
      icon: TrendingUp,
      color: 'orange',
      description: 'Abandonan rápido'
    },
  ];

  if (error && loading) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <h1 className="text-2xl font-light tracking-tight text-slate-900">Estadísticas en Tiempo Real</h1>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <p className="text-red-800 mb-4">{error}</p>
            <p className="text-sm text-red-600 mb-6">
              Verifica que:
              <br />• El Service Account tenga acceso a Google Analytics
              <br />• Las credenciales en el archivo .env sean correctas
              <br />• El Property ID sea el correcto (508535776)
            </p>
            <button
              onClick={loadAnalytics}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-screen">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-gray-200 rounded-full"></div>
            <div className="w-16 h-16 border-2 border-black border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-10 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-emerald-500" />
            <h1 className="text-2xl font-light tracking-tight text-slate-900">
              Estadísticas en Tiempo Real
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Refresh Button */}
            <button
              onClick={loadAnalytics}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
              title="Actualizar datos"
            >
              <RefreshCw className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {/* Time Range Selector */}
            <div className="flex gap-2">
              {[
                { label: '7 días', value: 7 },
                { label: '30 días', value: 30 },
                { label: '90 días', value: 90 },
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`
                    px-4 py-2 text-sm font-light rounded-lg transition-all
                    ${timeRange === range.value
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }
                  `}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-px bg-slate-200 border border-slate-200 mb-12">
          {statCards.map((stat) => {
            const colors = {
              blue: 'text-blue-500',
              green: 'text-emerald-500',
              purple: 'text-violet-500',
              orange: 'text-orange-500',
            };

            const changeColor = stat.change >= 0 ? 'text-emerald-600' : 'text-red-600';
            const ChangeIcon = stat.change >= 0 ? TrendingUp : TrendingUp;

            return (
              <div key={stat.name} className="bg-white p-8 relative">
                {stat.realtime && (
                  <div className="absolute top-4 right-4">
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      En vivo
                    </span>
                  </div>
                )}
                
                <div className="flex flex-col h-full">
                  <stat.icon 
                    className={`w-6 h-6 ${colors[stat.color as keyof typeof colors]} mb-6`} 
                    strokeWidth={1.5} 
                  />
                  
                  <div className="mt-auto">
                    <div className="text-4xl font-extralight text-slate-900 tracking-tight mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-slate-800 mb-2">
                      {stat.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {stat.description}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          {/* Top Pages - SOLO WEB PÚBLICA */}
          <div className="border border-slate-200 bg-white">
            <div className="px-8 py-6 border-b border-slate-100">
              <h2 className="text-lg font-light text-slate-900">Páginas Más Visitadas</h2>
              <p className="text-xs text-slate-400 mt-1">Sitio web público</p>
            </div>
            <div className="p-8">
              {data && data.topPages && data.topPages.length > 0 ? (
                <div className="space-y-4">
                  {data.topPages.map((page, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-slate-600 text-xs font-light">{idx + 1}</span>
                        </div>
                        <span className="text-sm text-slate-600 font-light truncate">
                          {page.page === '/' ? 'Inicio' : page.page}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 ml-2">
                        {page.views.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm mb-2">No hay datos disponibles</p>
                  <p className="text-slate-300 text-xs">Espera a que lleguen visitantes al sitio</p>
                </div>
              )}
            </div>
          </div>

          {/* Device Stats */}
          <div className="border border-slate-200 bg-white">
            <div className="px-8 py-6 border-b border-slate-100">
              <h2 className="text-lg font-light text-slate-900">Dispositivos</h2>
              <p className="text-xs text-slate-400 mt-1">Distribución por tipo</p>
            </div>
            <div className="p-8">
              {data && data.deviceStats && data.deviceStats.length > 0 ? (
                <div className="space-y-6">
                  {data.deviceStats.map((device, idx) => {
                    const icons: Record<string, any> = {
                      mobile: Smartphone,
                      desktop: Monitor,
                      tablet: Smartphone,
                    };
                    const Icon = icons[device.device.toLowerCase()] || Monitor;

                    return (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
                            <span className="text-sm text-slate-600 font-light capitalize">
                              {device.device === 'mobile' ? 'Móvil' : device.device === 'desktop' ? 'Escritorio' : device.device}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-slate-900">
                            {device.percentage}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-slate-900 rounded-full transition-all duration-500"
                            style={{ width: `${device.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">No hay datos disponibles</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Locations */}
          <div className="border border-slate-200 bg-white">
            <div className="px-8 py-6 border-b border-slate-100">
              <h2 className="text-lg font-light text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                Ubicaciones
              </h2>
              <p className="text-xs text-slate-400 mt-1">Países con más visitas</p>
            </div>
            <div className="p-8">
              {data && data.locations && data.locations.length > 0 ? (
                <div className="space-y-4">
                  {data.locations.map((location, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-light">
                        {location.country}
                      </span>
                      <span className="text-sm font-medium text-slate-900">
                        {location.users.toLocaleString()} usuarios
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">No hay datos disponibles</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="border border-slate-200 bg-white">
            <div className="px-8 py-6 border-b border-slate-100">
              <h2 className="text-lg font-light text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                Actividad Reciente
              </h2>
              <p className="text-xs text-slate-400 mt-1">Eventos del sitio</p>
            </div>
            <div className="p-8">
              {data && data.recentActivity && data.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {data.recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-600 font-light truncate">
                          {activity.action}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">No hay actividad reciente</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-light">
              ✅ Datos en tiempo real desde Google Analytics 4 • Solo sitio web público
            </p>
            <p className="text-xs text-slate-400 font-light">
              Última actualización: {lastUpdate.toLocaleString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}