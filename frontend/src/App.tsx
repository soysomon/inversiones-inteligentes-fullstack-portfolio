import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Hero from './components/sections/Hero';
import AboutUs from './components/sections/AboutUs';
import FeaturedProperties from './components/sections/FeaturedProperties';
import Services from './components/sections/Services';
import Locations from './components/sections/Locations';
import ContactForm from './components/sections/ContactForm';
import PropertyList from './components/sections/PropertyList';
import PropertyDetailView from './components/sections/PropertyDetailView';
import ScrollToTop from './components/ScrollToTop'; 
import ContactView from './components/sections/ContactView';

// Admin imports
import LoginPage from './app/login/page';
import AdminLayout from './app/admin/layout';
import DashboardPage from './app/admin/dashboard/page';
import PropiedadesAdminPage from './app/admin/propiedades/page';
import CrearPropiedadPage from './app/admin/crear/page';
import EditarPropiedadPage from './app/admin/editar/page';
import EstadisticasPage from './app/admin/estadisticas/page';

// Usuarios imports
import UsuariosPage from './app/usuarios/page';
import CrearUsuarioPage from './app/usuarios/crear/page';
import EditarUsuarioPage from './app/usuarios/editar/page';

// ✨ Imports para notificaciones
import ToastContainer from './components/ToastContainer';
import { setupAlertInterceptor } from './utils/toast';

// ✨ NUEVO: Import para tracking de Google Analytics
import useGATracking from './hooks/useGATracking';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✨ NUEVO: Hook para tracking automático de páginas
  useGATracking();

  // ✨ Interceptar alert() al montar la app
  useEffect(() => {
    const { restore } = setupAlertInterceptor();
    
    // Cleanup opcional al desmontar
    return () => {
      restore();
    };
  }, []);

  // Funciones de navegación para el sitio público
  const goToHome = () => navigate('/');
  const goToProperties = () => navigate('/propiedades');
  const goToAbout = () => navigate('/quienes-somos');
  const goToContact = () => navigate('/contacto');
  const goToPropertyDetail = (slug: string) => navigate(`/propiedades/${slug}`);

  // Determinar si estamos en admin
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  useEffect(() => {
    // Solo aplicar smooth scroll en rutas públicas
    if (!isAdminRoute && location.pathname === '/') {
      const handleSmoothScroll = (e: Event) => {
        e.preventDefault();
        const target = e.target as HTMLAnchorElement;
        const targetId = target.getAttribute('href');
        
        if (targetId?.startsWith('#')) {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            gsap.to(window, {
              duration: 1,
              scrollTo: { y: targetElement, offsetY: 80 },
              ease: "power2.inOut"
            });
          }
        }
      };

      const internalLinks = document.querySelectorAll('a[href^="#"]');
      internalLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
      });

      return () => {
        internalLinks.forEach(link => {
          link.removeEventListener('click', handleSmoothScroll);
        });
      };
    }
  }, [isAdminRoute, location.pathname]);

  // Homepage Component
  const HomePage = () => (
    <Layout 
      onNavigateToHome={goToHome}
      onNavigateToProperties={goToProperties}
      onNavigateToAbout={goToAbout}
      currentView="home"
    >
      <Hero />
      <Locations />
      <FeaturedProperties 
        onSelectProperty={goToPropertyDetail}
        onExploreProperties={goToProperties}
      />
      <ContactForm />
      
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <button 
            onClick={goToProperties}
            className="bg-slate-900 text-white px-12 py-4 rounded-xl text-lg font-medium hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Explorar Todas las Propiedades
          </button>
        </div>
      </section>
    </Layout>
  );

  // Properties List Component
  const PropertiesPage = () => (
    <Layout 
      onNavigateToHome={goToHome}
      onNavigateToProperties={goToProperties}
      onNavigateToAbout={goToAbout}
      currentView="properties"
    >
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-6 py-3">
          <nav className="flex items-center gap-4 text-sm">
            <button onClick={goToHome} className="text-slate-600 hover:text-slate-900">
              Inicio
            </button>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-medium">Propiedades</span>
          </nav>
        </div>
      </div>
      <PropertyList onSelectProperty={goToPropertyDetail} />
    </Layout>
  );

  // About Page Component
  const AboutPage = () => (
    <Layout 
      onNavigateToHome={goToHome}
      onNavigateToProperties={goToProperties}
      onNavigateToAbout={goToAbout}
      currentView="about"
    >
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-6 py-3">
          <nav className="flex items-center gap-4 text-sm">
            <button onClick={goToHome} className="text-slate-600 hover:text-slate-900">
              Inicio
            </button>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-medium">Quiénes Somos</span>
          </nav>
        </div>
      </div>
      <AboutUs />
    </Layout>
  );

  // Contact Page Component
  const ContactPage = () => (
    <Layout 
      onNavigateToHome={goToHome}
      onNavigateToProperties={goToProperties}
      onNavigateToAbout={goToAbout}
      currentView="contact"
    >
      <ContactView />
    </Layout>
  );

  // Property Detail Component
  const PropertyDetailPage = () => (
    <Layout 
      onNavigateToHome={goToHome}
      onNavigateToProperties={goToProperties}
      onNavigateToAbout={goToAbout}
      currentView="property-detail"
    >
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-6 py-3">
          <nav className="flex items-center gap-4 text-sm">
            <button onClick={goToHome} className="text-slate-600 hover:text-slate-900">
              Inicio
            </button>
            <span className="text-slate-400">/</span>
            <button onClick={goToProperties} className="text-slate-600 hover:text-slate-900">
              Propiedades
            </button>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-medium">Detalle</span>
          </nav>
        </div>
      </div>
      <PropertyDetailView />
    </Layout>
  );

  return (
    <>
      {/* ✨ Contenedor de toasts */}
      <ToastContainer />
      
      <ScrollToTop />
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/propiedades" element={<PropertiesPage />} />
        <Route path="/propiedades/:slug" element={<PropertyDetailPage />} />
        <Route path="/quienes-somos" element={<AboutPage />} />
        <Route path="/contacto" element={<ContactPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin (usa AdminLayout y <Outlet />) */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Dashboard */}
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Propiedades (rutas anidadas) */}
          <Route path="propiedades">
            <Route index element={<PropiedadesAdminPage />} />
            <Route path="crear" element={<CrearPropiedadPage />} />
            <Route path="editar/:id" element={<EditarPropiedadPage />} />
          </Route>

          {/* Usuarios */}
          <Route path="usuarios">
            <Route index element={<UsuariosPage />} />
            <Route path="crear" element={<CrearUsuarioPage />} />
            <Route path="editar/:id" element={<EditarUsuarioPage />} />
          </Route>
          <Route path="estadisticas" element={<EstadisticasPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;