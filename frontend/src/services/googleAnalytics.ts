// src/services/googleAnalytics.ts
import ReactGA from 'react-ga4';

const TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || '';

export const initGA = () => {
  if (TRACKING_ID) {
    ReactGA.initialize(TRACKING_ID, {
      gtagOptions: {
        send_page_view: false //Manejo Manual de los datos... 
      }
    });
    console.log('Google Analytics inicializado correctamente');
  } else {
    console.warn('Google Analytics no está configurado. Agrega VITE_GA_TRACKING_ID al archivo .env');
  }
};

// Tracking de páginas
export const logPageView = (path?: string) => {
  const page = path || window.location.pathname + window.location.search;
  ReactGA.send({ hitType: 'pageview', page });
};

// Eventos personalizados
export const logEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({
    category,
    action,
    label
  });
};

// Evento: Ver propiedad
export const logPropertyView = (propertyId: string, propertyTitle: string) => {
  ReactGA.event({
    category: 'Property',
    action: 'View',
    label: `${propertyId} - ${propertyTitle}`
  });
};

// Evento: Contacto
export const logContactSubmit = (propertyId?: string) => {
  ReactGA.event({
    category: 'Contact',
    action: 'Submit',
    label: propertyId ? `Property: ${propertyId}` : 'General Contact'
  });
};

// Evento: Búsqueda
export const logSearch = (searchTerm: string) => {
  ReactGA.event({
    category: 'Search',
    action: 'Submit',
    label: searchTerm
  });
};

// Evento: Filtros aplicados
export const logFilterApplied = (filterType: string, filterValue: string) => {
  ReactGA.event({
    category: 'Filter',
    action: filterType,
    label: filterValue
  });
};

// Evento: Login
export const logLogin = (method: string = 'email') => {
  ReactGA.event({
    category: 'Auth',
    action: 'Login',
    label: method
  });
};

// Evento: Logout
export const logLogout = () => {
  ReactGA.event({
    category: 'Auth',
    action: 'Logout'
  });
};