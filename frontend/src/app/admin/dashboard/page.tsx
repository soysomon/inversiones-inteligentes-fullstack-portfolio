import { useState, useEffect } from 'react';
import { Building, Users, Eye, Phone, Plus, ArrowRight } from 'lucide-react';
import api from '../../../services/api';

interface Stats {
  totalProperties: number;
  publishedProperties: number;
  totalUsers: number;
  totalViews: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    publishedProperties: 0,
    totalUsers: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Llamadas a tu API real usando axios
      const [propertiesRes, usersRes] = await Promise.all([
        api.get('/properties'),
        api.get('/users/stats').catch(() => ({ 
          data: { 
            success: true, 
            stats: { total: 0, active: 0, inactive: 0 } 
          } 
        }))
      ]);

      // Estructura según tu propertyController.js -> exports.list
      // Devuelve: { items, total, page, pages }
      const properties = propertiesRes.data.items || [];
      const totalProperties = propertiesRes.data.total || 0;
      const publishedCount = properties.filter((p: any) => p.status === 'published').length;

      // Estructura según tu userController.js -> exports.getUserStats
      // Devuelve: { success, stats: { total, active, inactive, byRole } }
      const userStats = usersRes.data.stats || {};
      const totalUsers = userStats.total || 0;

      setStats({
        totalProperties,
        publishedProperties: publishedCount,
        totalUsers,
        totalViews: 0, // Implementar cuando tengas analytics o contactCount
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      // En caso de error, mantener valores en 0
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Propiedades',
      value: stats.totalProperties,
      icon: Building,
      subtitle: `${stats.publishedProperties} publicadas`,
      accentColor: 'blue', // Azul Apple
    },
    {
      name: 'Publicadas',
      value: stats.publishedProperties,
      icon: Eye,
      subtitle: 'En el mercado',
      accentColor: 'green', // Verde éxito
    },
    {
      name: 'Usuarios',
      value: stats.totalUsers,
      icon: Users,
      subtitle: 'Activos en sistema',
      accentColor: 'purple', // Púrpura premium
    },
    {
      name: 'Contactos',
      value: stats.totalViews,
      icon: Phone,
      subtitle: 'Este mes',
      accentColor: 'orange', // Naranja cálido
    },
  ];

  const quickActions = [
    {
      title: 'Nueva Propiedad',
      description: 'Agregar propiedad al sistema',
      href: '/admin/propiedades/crear',
      icon: Plus,
    },
    {
      title: 'Ver Propiedades',
      description: 'Gestionar listado completo',
      href: '/admin/propiedades',
      icon: Building,
    },
    {
      title: 'Usuarios',
      description: 'Administrar permisos',
      href: '/admin/usuarios',
      icon: Users,
    },
  ];

  if (loading) {
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
      {/* Navbar minimalista */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-light tracking-tight text-slate-900">Dashboard</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats - Grid horizontal en fila */}
        <div className="grid grid-cols-4 gap-px bg-slate-200 border border-slate-200 mb-16">
          {statCards.map((stat, idx) => {
            // Definir colores sutiles por tipo
            const colors = {
              blue: {
                icon: 'text-blue-500 group-hover:text-blue-600',
                border: 'group-hover:border-l-blue-500',
                bg: 'group-hover:bg-blue-50/30'
              },
              green: {
                icon: 'text-emerald-500 group-hover:text-emerald-600',
                border: 'group-hover:border-l-emerald-500',
                bg: 'group-hover:bg-emerald-50/30'
              },
              purple: {
                icon: 'text-violet-500 group-hover:text-violet-600',
                border: 'group-hover:border-l-violet-500',
                bg: 'group-hover:bg-violet-50/30'
              },
              orange: {
                icon: 'text-orange-500 group-hover:text-orange-600',
                border: 'group-hover:border-l-orange-500',
                bg: 'group-hover:bg-orange-50/30'
              }
            };

            const colorScheme = colors[stat.accentColor as keyof typeof colors];

            return (
              <div 
                key={stat.name}
                className={`group bg-white p-8 border-l-2 border-l-transparent transition-all duration-300 ${colorScheme.border} ${colorScheme.bg}`}
              >
                <div className="flex flex-col h-full">
                  <stat.icon 
                    className={`w-6 h-6 transition-colors mb-6 ${colorScheme.icon}`} 
                    strokeWidth={1.5} 
                  />
                  
                  <div className="mt-auto">
                    <div className="text-5xl font-extralight text-slate-900 tracking-tight mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-slate-800 mb-1">
                      {stat.name}
                    </div>
                    <div className="text-xs text-slate-500 font-light">
                      {stat.subtitle}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions - Grid horizontal en fila */}
        <div className="mt-20">
          <h2 className="text-sm font-medium text-slate-500 tracking-wide uppercase mb-8">
            Acciones
          </h2>
          
          <div className="grid grid-cols-3 gap-px bg-slate-200 border border-slate-200">
            {quickActions.map((action) => (
              <a
                key={action.title}
                href={action.href}
                className="group bg-white p-8 hover:bg-indigo-50/30 transition-all duration-300"
              >
                <div className="flex flex-col h-full">
                  <action.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors mb-6" strokeWidth={1.5} />
                  
                  <div className="mt-auto">
                    <h3 className="text-lg font-light text-slate-900 mb-1 flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                      {action.title}
                      <ArrowRight 
                        className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300 opacity-0 group-hover:opacity-100" 
                        strokeWidth={1.5} 
                      />
                    </h3>
                    <p className="text-xs text-slate-500 font-light">
                      {action.description}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer minimalista */}
        <div className="mt-20 pt-8 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-light">
            Última actualización: {new Date().toLocaleString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit',
              day: 'numeric',
              month: 'long'
            })}
          </p>
        </div>
      </div>
    </div>
  );
}