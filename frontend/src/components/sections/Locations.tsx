import { useEffect, useRef } from 'react';
import { MapPin, TrendingUp, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Locations = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sanJuanRef = useRef<HTMLDivElement>(null);
  const santoDomingoRef = useRef<HTMLDivElement>(null);
  const puntaCanaRef = useRef<HTMLDivElement>(null);

  const locations = [
    {
      name: 'San Juan de la Maguana',
      subtitle: 'Mercado emergente con gran potencial.',
      image: 'https://ext.same-assets.com/1372240668/2912103473.jpeg',
      properties: '45+',
      growth: '+24%',
      population: '232K',
      featured: true,
      ref: sanJuanRef
    },
    {
      name: 'Santo Domingo',
      subtitle: 'Increíblemente estable. Asombrosamente rentable.',
      image: 'https://ext.same-assets.com/1372240668/1102342223.jpeg',
      properties: '150+',
      growth: '+18%',
      population: '3.2M',
      featured: false,
      ref: santoDomingoRef
    },
    {
      name: 'Punta Cana',
      subtitle: 'Paraíso turístico con alta rentabilidad.',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
      properties: '85+',
      growth: '+32%',
      population: '100K',
      featured: false,
      ref: puntaCanaRef
    }
  ];

  useEffect(() => {
    // Hero title animation
    const titleChars = titleRef.current?.querySelectorAll('.char');
    if (titleChars) {
      gsap.fromTo(titleChars,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          stagger: 0.03,
          ease: 'power3.out'
        }
      );
    }

    // Location cards animations
    locations.forEach((location) => {
      const el = location.ref.current;
      if (!el) return;

      const chars = el.querySelectorAll('.location-char');
      
      gsap.fromTo(chars,
        { opacity: 0, y: 30, rotateX: -90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.6,
          stagger: 0.02,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char: string, i: number) => (
      <span key={i} className="char inline-block" style={{ display: 'inline-block' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const splitLocationText = (text: string) => {
    return text.split('').map((char: string, i: number) => (
      <span key={i} className="location-char inline-block" style={{ display: 'inline-block' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <>
      {/* Hero Header */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm rounded-full mb-6 md:mb-8">
            <MapPin size={14} />
            <span className="font-medium">Nuestras Ubicaciones</span>
          </div>
          
          <h1 ref={titleRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 md:mb-6 tracking-tight leading-tight">
            {splitText('Tres mercados.')}
            <br />
            <span className="font-semibold">{splitText('Infinitas posibilidades.')}</span>
          </h1>
        </div>
      </section>

      {/* Location Cards - Responsive Stack */}
      <section className="py-6 md:py-0">
        <div className="flex flex-col lg:flex-row gap-2 md:gap-1 px-2 md:px-1">
          {locations.map((location, index) => (
            <div
              key={location.name}
              ref={location.ref}
              className="relative w-full lg:w-1/3 h-[500px] sm:h-[600px] lg:h-[80vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 py-8 group cursor-pointer overflow-hidden rounded-lg sm:rounded-sm"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
              </div>

              {/* Featured Badge */}
              {location.featured && (
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-12 lg:left-12 z-20">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-medium rounded-full border border-white/30">
                    <TrendingUp size={12} />
                    Principal
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 max-w-sm sm:max-w-md lg:max-w-lg w-full">
                
                {/* Title with GSAP Animation */}
                <div className="text-white mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-light mb-2 sm:mb-3 tracking-tight leading-tight">
                    {location.name === 'San Juan de la Maguana' ? (
                      <>
                        {splitLocationText('San Juan ')}
                        <span className="font-semibold">{splitLocationText('de la Maguana')}</span>
                      </>
                    ) : location.name === 'Santo Domingo' ? (
                      <>
                        {splitLocationText('Santo ')}
                        <span className="font-semibold">{splitLocationText('Domingo')}</span>
                      </>
                    ) : (
                      <>
                        {splitLocationText('Punta ')}
                        <span className="font-semibold">{splitLocationText('Cana')}</span>
                      </>
                    )}
                  </h2>
                  <p className="text-xs sm:text-sm lg:text-base font-light opacity-90 px-2">
                    {location.subtitle}
                  </p>
                </div>

                {/* Button */}
                <button className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium text-sm transition-all duration-300 mb-6 sm:mb-8 lg:mb-10 shadow-lg active:scale-95">
                  Más información
                </button>

                {/* Stats */}
                <div className="flex justify-center gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
                  {[
                    { value: location.properties, label: 'Propiedades' },
                    { value: location.growth, label: 'Crecimiento' },
                    { value: location.population, label: 'Habitantes' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-lg sm:text-xl lg:text-2xl font-light text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-[9px] sm:text-[10px] lg:text-xs text-white/70 font-medium uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Text */}
                <p className="text-[#87ceeb] text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 px-2">
                  Diseñado para inversiones inteligentes.
                </p>
                <p className="text-white/80 text-[10px] sm:text-xs px-2">
                  Las mejores oportunidades ya están disponibles.*
                </p>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-6">
          <h3 className="text-2xl sm:text-3xl font-light text-gray-900 mb-3 sm:mb-4 tracking-tight">
            ¿Listo para <span className="font-semibold">invertir?</span>
          </h3>
          <p className="text-gray-600 mb-6 sm:mb-8 font-light text-base sm:text-lg px-4">
            Descubre todas nuestras oportunidades de inversión.
          </p>
          
          <button className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium text-sm sm:text-base transition-all duration-300 shadow-lg active:scale-95">
            <MapPin size={18} />
            <span>Ver todas nuestras propiedades</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </>
  );
};

export default Locations;