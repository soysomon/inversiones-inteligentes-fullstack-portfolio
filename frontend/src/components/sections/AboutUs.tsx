import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface VisibilityState {
  hero?: boolean;
  stats?: boolean;
  about?: boolean;
  vision?: boolean;
  values?: boolean;
}

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, delay = 0, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) {
      const startTimeout = setTimeout(() => setHasStarted(true), delay);
      return () => clearTimeout(startTimeout);
    }

    if (hasStarted && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, hasStarted, speed, text]);

  return <span>{displayText}<span className="animate-pulse">|</span></span>;
};

const QuienesSomos = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState<VisibilityState>({});
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    Object.values(sectionsRef.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Efecto para manejar animaciones GSAP si está disponible
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gsap && isVisible.hero) {
      const gsap = (window as any).gsap;
      
      // Animar header badge si existe
      gsap.fromTo('.header-badge', 
        { opacity: 0, y: -20 }, 
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2 }
      );
    }
  }, [isVisible.hero]);

  interface AnimatedCounterProps {
    end: number;
    suffix?: string;
    duration?: number;
  }

  const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ end, suffix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
      // Solo animar una vez cuando la sección es visible por primera vez
      if (!isVisible.stats || hasAnimated) {
        // Si ya se animó, mantener el valor final
        if (hasAnimated && count !== end) {
          setCount(end);
        }
        return;
      }
      
      setHasAnimated(true);
      let startTime: number;
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(end * easeOutQuart);
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end); // Asegurar que termine en el valor exacto
        }
      };

      requestAnimationFrame(animate);
    }, [isVisible.stats, end, duration, hasAnimated, count]);

    return <span>{count}{suffix}</span>;
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section 
        ref={el => {
          if (el) sectionsRef.current.hero = el;
        }}
        id="hero"
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        {/* Architectural grid background */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
          <div className="absolute top-20 left-20 w-32 h-32 border border-gray-300/30 rotate-12" />
          <div className="absolute top-40 right-32 w-24 h-48 border border-gray-300/20 -rotate-6" />
          <div className="absolute bottom-32 left-1/4 w-48 h-24 border border-gray-300/25 rotate-3" />
        </div>
        
        <div 
          className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        />
        
        <div className="max-w-6xl mx-auto px-8 text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Header badge que GSAP está buscando */}
            <div className="header-badge opacity-0 mb-4">
              <span className="text-sm font-mono text-gray-500 tracking-widest">INVERSIONES INTELIGENTES</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-light text-gray-900 mb-8 tracking-tight leading-none">
              {isVisible.hero ? (
                <>
                  <TypewriterText text="Quiénes" delay={500} speed={100} />
                  <br />
                  <span className="font-medium">
                    <TypewriterText text="Somos" delay={1800} speed={120} />
                  </span>
                </>
              ) : (
                <>
                  Quiénes
                  <br />
                  <span className="font-medium">Somos</span>
                </>
              )}
            </h1>
            <div className={`transition-all duration-800 delay-[2800ms] ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed mb-16">
                Más de cinco años creando confianza a través de soluciones inmobiliarias inteligentes
              </p>
            </div>
          </div>

          {/* Large Hero Image */}
          <div 
            className={`transition-all duration-1200 delay-[3200ms] ${isVisible.hero ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
          >
            <div className="relative mx-auto max-w-6xl">
              {/* Blueprint-style corner marks */}
              <div className="absolute -top-6 -left-6 w-8 h-8 border-l-2 border-t-2 border-gray-300/40 z-10 animate-pulse" />
              <div className="absolute -top-6 -right-6 w-8 h-8 border-r-2 border-t-2 border-gray-300/40 z-10 animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-8 h-8 border-l-2 border-b-2 border-gray-300/40 z-10 animate-pulse" />
              <div className="absolute -bottom-6 -right-6 w-8 h-8 border-r-2 border-b-2 border-gray-300/40 z-10 animate-pulse" />
              
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src="https://ext.same-assets.com/1372240668/1102342223.jpeg"
                  alt="Inversiones Inteligentes Team"
                  className="w-full h-[75vh] object-cover transform hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                
                {/* Technical annotation lines */}
                <div className="absolute top-6 right-6 text-white/70 text-sm font-mono">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-px bg-white/50" />
                    <span className="tracking-widest">EQUIPO 2024</span>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-1/4 left-6 text-white/50 text-xs font-mono animate-pulse">
                  <div className="flex flex-col items-start space-y-1">
                    <div className="w-16 h-px bg-white/40" />
                    <span>INVERSIONES</span>
                    <span>INTELIGENTES</span>
                  </div>
                </div>
                
                <div className="absolute bottom-6 left-6 text-white/60 text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-px bg-white/50" />
                    <span>EST. 2019</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-px h-16 bg-gray-300 relative">
            <div 
              className="w-px bg-gray-600 absolute top-0 transition-all duration-1000"
              style={{ height: `${Math.min(scrollY / 10, 100)}%` }}
            />
          </div>
        </div>
      </section>

      {/* Stats Section - ESPACIADO REDUCIDO: py-32 → py-16 */}
      <section 
        ref={el => {
          if (el) sectionsRef.current.stats = el;
        }}
        id="stats"
        className="py-16 relative"
      >
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
            {[
              { number: 5, label: 'Años de experiencia', suffix: '+' },
              { number: 500, label: 'Propiedades vendidas', suffix: '+' },
              { number: 1000, label: 'Clientes satisfechos', suffix: '+' },
              { number: 95, label: 'Tasa de satisfacción', suffix: '%' }
            ].map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-700 ${
                  isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="text-5xl md:text-6xl font-light text-gray-900 mb-4">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-gray-500 font-light text-lg tracking-wide uppercase text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - ESPACIADO REDUCIDO: py-32 → py-20 */}
      <section 
        ref={el => {
          if (el) sectionsRef.current.about = el;
        }}
        id="about"
        className="py-20 bg-gray-50/30 relative"
      >
        {/* Blueprint elements */}
        <div className="absolute top-32 left-8 opacity-10">
          <div className="w-16 h-16 border border-gray-400 rotate-45" />
          <div className="absolute top-2 left-2 w-12 h-12 border border-gray-300" />
        </div>
        <div className="absolute bottom-40 right-12 opacity-[0.06]">
          <div className="w-20 h-2 bg-gray-400 mb-1" />
          <div className="w-16 h-2 bg-gray-300 mb-1" />
          <div className="w-12 h-2 bg-gray-400" />
        </div>
        
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div 
              className={`space-y-8 transition-all duration-800 ${
                isVisible.about ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight overflow-hidden">
                {isVisible.about ? (
                  <>
                    <div className="animate-slide-up">
                      <TypewriterText text="Creando confianza" delay={200} speed={60} />
                    </div>
                    <br />
                    <span className="font-medium">
                      <div className="animate-slide-up delay-[2000ms]">
                        <TypewriterText text="desde 2019" delay={2200} speed={80} />
                      </div>
                    </span>
                  </>
                ) : (
                  <>
                    Creando confianza
                    <br />
                    <span className="font-medium">desde 2019</span>
                  </>
                )}
              </h2>
              
              <div className={`space-y-6 text-lg text-gray-600 font-light leading-relaxed transition-all duration-600 delay-[3500ms] ${isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p>
                  Somos una empresa dedicada al sector inmobiliario con más de 5 años de experiencia 
                  brindando confianza, calidad y soluciones estratégicas a nuestros clientes.
                </p>
                <p>
                  Nos especializamos en ofrecer asesoría experta y personalizada para quienes buscan 
                  invertir, comprar o vender propiedades, tanto a nivel local como nacional e internacional.
                </p>
              </div>

              <div className={`pt-8 transition-all duration-500 delay-[4000ms] ${isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-px bg-gray-300 animate-expand-width" />
                  <div className="w-2 h-2 border border-gray-300 rotate-45 animate-spin-slow" />
                </div>
                <p className="text-gray-500 font-light italic">
                  "Proveer soluciones inmobiliarias confiables y de alta calidad"
                </p>
              </div>
            </div>

            <div 
              className={`transition-all duration-800 delay-200 ${
                isVisible.about ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
            >
              <div className="relative">
                {/* Technical frame */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-l border-t border-gray-300/50" />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-r border-t border-gray-300/50" />
                
                <div className="aspect-[4/5] overflow-hidden rounded-2xl">
                  <img
                    src="https://ext.same-assets.com/1372240668/1102342223.jpeg"
                    alt="Equipo profesional"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                
                {/* Blueprint notation */}
                <div className="absolute bottom-4 left-4 text-white/70 text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-px bg-white/50" />
                    <span>OFICINAS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission - ESPACIADO REDUCIDO: py-32 → py-20 */}
      <section 
        ref={el => {
          if (el) sectionsRef.current.vision = el;
        }}
        id="vision"
        className="py-20 relative"
      >
        {/* Architectural background elements */}
        <div className="absolute top-20 right-20 opacity-[0.03]">
          <div className="w-32 h-32 border border-gray-400 rotate-12">
            <div className="w-full h-px bg-gray-400 mt-8" />
            <div className="w-full h-px bg-gray-400 mt-8" />
            <div className="w-px h-full bg-gray-400 absolute top-0 left-8" />
            <div className="w-px h-full bg-gray-400 absolute top-0 right-8" />
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20">
            <div 
              className={`transition-all duration-800 ${
                isVisible.vision ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="space-y-8">
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-px bg-gray-300" />
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <div className="text-xs font-mono text-gray-400 tracking-widest">01</div>
                  </div>
                  <h3 className="text-3xl font-light text-gray-900 mb-6">Visión</h3>
                </div>
                <p className="text-lg text-gray-600 font-light leading-relaxed">
                  Ser la empresa inmobiliaria líder en la creación de valor y en soluciones inteligentes 
                  a nivel nacional. Aspiramos a redefinir el estándar del sector inmobiliario a través 
                  de la innovación tecnológica y la excelencia en el servicio.
                </p>
              </div>
            </div>

            <div 
              className={`transition-all duration-800 delay-200 ${
                isVisible.vision ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="space-y-8">
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-px bg-gray-300" />
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <div className="text-xs font-mono text-gray-400 tracking-widest">02</div>
                  </div>
                  <h3 className="text-3xl font-light text-gray-900 mb-6">Misión</h3>
                </div>
                <p className="text-lg text-gray-600 font-light leading-relaxed">
                  Proveer soluciones inmobiliarias confiables y de alta calidad, ofreciendo asesoría 
                  experta y personalizada a clientes locales, nacionales e internacionales. Nos 
                  comprometemos a superar las expectativas mediante un servicio excepcional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values - ESPACIADO REDUCIDO: py-32 → py-20 */}
      <section 
        ref={el => {
          if (el) sectionsRef.current.values = el;
        }}
        id="values"
        className="py-20 bg-gray-50/30 relative overflow-hidden"
      >
        {/* Blueprint grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]">
          <div style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} className="w-full h-full" />
        </div>
        
        {/* Floating architectural elements */}
        <div className="absolute top-40 left-16 opacity-[0.04]">
          <div className="w-24 h-24 border border-gray-400 -rotate-12">
            <div className="w-4 h-4 border border-gray-300 absolute top-2 left-2" />
            <div className="w-4 h-4 border border-gray-300 absolute bottom-2 right-2" />
          </div>
        </div>
        <div className="absolute bottom-32 right-20 opacity-[0.04]">
          <div className="w-16 h-32 border border-gray-400 rotate-6">
            <div className="w-full h-px bg-gray-300 mt-4" />
            <div className="w-full h-px bg-gray-300 mt-4" />
            <div className="w-full h-px bg-gray-300 mt-4" />
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-8 relative">
          <div 
            className={`text-center mb-20 transition-all duration-800 ${
              isVisible.values ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 overflow-hidden">
              {isVisible.values ? (
                <TypewriterText text="Nuestros valores" delay={300} speed={70} />
              ) : (
                "Nuestros valores"
              )}
            </h2>
            <div className={`flex items-center justify-center space-x-3 transition-all duration-500 delay-[2000ms] ${isVisible.values ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <div className="w-16 h-px bg-gray-300 animate-expand-width" />
              <div className="w-1 h-1 bg-gray-300 rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-gray-300 rounded-full animate-pulse delay-100" />
              <div className="w-1 h-1 bg-gray-300 rounded-full animate-pulse delay-200" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: 'Integridad', description: 'Actuamos con honestidad y transparencia en todas nuestras operaciones y relaciones.', number: '01' },
              { title: 'Excelencia', description: 'Buscamos la excelencia en cada aspecto de nuestro servicio, desde la atención al cliente hasta la ejecución.', number: '02' },
              { title: 'Calidad', description: 'Nos comprometemos a ofrecer productos y servicios de la más alta calidad.', number: '03' },
              { title: 'Innovación', description: 'Nos adaptamos y anticipamos a las tendencias del mercado inmobiliario.', number: '04' }
            ].map((value, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-700 ${
                  isVisible.values ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } relative`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Technical number */}
                <div className="absolute top-0 right-0 text-xs font-mono text-gray-300 tracking-widest">
                  {value.number}
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-8 h-px bg-gray-300" />
                    <div className="w-1 h-1 border border-gray-300 rotate-45" />
                    <div className="w-8 h-px bg-gray-300" />
                  </div>
                  <h4 className="text-xl font-light text-gray-900">{value.title}</h4>
                  <p className="text-gray-600 font-light leading-relaxed text-sm">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - ESPACIADO REDUCIDO: py-32 → py-20 */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="space-y-8">
            <h3 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
              ¿Listo para tu próxima
              <br />
              <span className="font-medium">inversión inmobiliaria?</span>
            </h3>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-16 h-px bg-gray-300" />
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
            </div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              Contáctanos hoy y descubre cómo podemos ayudarte a encontrar la propiedad perfecta
            </p>
            
            <div className="pt-8 space-y-4">
              <button className="bg-gray-900 hover:bg-gray-800 text-white font-light px-8 py-4 rounded-full transition-all duration-300 hover:scale-105">
                Ver propiedades
              </button>
              <div className="block">
                <Link to="/contacto">
                  <button className="text-gray-600 hover:text-gray-900 font-light px-8 py-4 transition-colors duration-300">
                    Contactar
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes expand-width {
          from {
            width: 0;
          }
          to {
            width: 4rem;
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(45deg);
          }
          to {
            transform: rotate(405deg);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-expand-width {
          animation: expand-width 1s ease-out 0.5s both;
        }
        
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        
        .delay-100 {
          animation-delay: 100ms;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-\[2000ms\] {
          animation-delay: 2000ms;
        }
        
        .delay-\[2200ms\] {
          transition-delay: 2200ms;
        }
        
        .delay-\[2800ms\] {
          transition-delay: 2800ms;
        }
        
        .delay-\[3200ms\] {
          transition-delay: 3200ms;
        }
        
        .delay-\[3500ms\] {
          transition-delay: 3500ms;
        }
        
        .delay-\[4000ms\] {
          transition-delay: 4000ms;
        }
      `}</style>
    </div>
  );
};

export default QuienesSomos;