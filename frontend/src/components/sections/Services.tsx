'use client';

import { Home, Key, Building, TrendingUp, MapPin, Shield, Calculator, Users } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Home,
      title: 'Venta de Propiedades',
      description: 'Asesoramos en la venta de casas, apartamentos, villas y propiedades comerciales con el mejor precio del mercado.',
      features: ['Valoración gratuita', 'Marketing digital', 'Negociación experta']
    },
    {
      icon: Key,
      title: 'Alquiler de Inmuebles',
      description: 'Gestión completa de alquileres residenciales y comerciales con contratos seguros y inquilinos verificados.',
      features: ['Selección de inquilinos', 'Contratos legales', 'Gestión de pagos']
    },
    {
      icon: Building,
      title: 'Inversiones Comerciales',
      description: 'Oportunidades de inversión en edificios, locales comerciales y proyectos de desarrollo inmobiliario.',
      features: ['Análisis de ROI', 'Proyectos exclusivos', 'Financiamiento']
    },
    {
      icon: TrendingUp,
      title: 'Asesoría de Inversión',
      description: 'Consultoría especializada para maximizar el retorno de inversión en el mercado inmobiliario dominicano.',
      features: ['Análisis de mercado', 'Estrategias personalizadas', 'Seguimiento continuo']
    },
    {
      icon: MapPin,
      title: 'Desarrollo de Proyectos',
      description: 'Participamos en el desarrollo de proyectos inmobiliarios desde la planificación hasta la comercialización.',
      features: ['Planificación integral', 'Permisos y licencias', 'Comercialización']
    },
    {
      icon: Calculator,
      title: 'Valoraciones',
      description: 'Tasaciones profesionales y valoraciones de mercado para propiedades residenciales y comerciales.',
      features: ['Valuación certificada', 'Informes detallados', 'Base legal sólida']
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Nuestros <span className="text-gradient">Servicios</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Ofrecemos un portafolio completo de servicios inmobiliarios para satisfacer todas tus necesidades de inversión
          </p>
          <div className="inline-block px-6 py-2 bg-accent/10 text-accent rounded-full font-medium">
            Servicios Profesionales • Cobertura Nacional • Asesoría Experta
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="card-modern p-8 text-center group hover:shadow-2xl transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                {service.title}
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <div className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center justify-center text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button className="w-full bg-gray-50 hover:bg-primary hover:text-white text-gray-700 font-medium py-3 rounded-lg transition-all duration-300">
                Más Información
              </button>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <div className="card-modern p-8 lg:p-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mr-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900">¿Necesitas Asesoría Personalizada?</h3>
                <p className="text-gray-600">Nuestro equipo de expertos está listo para ayudarte</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-gray-600">Atención Disponible</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">+5 Años</div>
                <div className="text-sm text-gray-600">de Experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-gray-600">Garantizado</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Contactar Ahora
              </button>
              <button className="btn-accent">
                Agendar Cita
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;