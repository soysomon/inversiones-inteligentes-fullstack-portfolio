import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que hace scroll al tope cuando cambia la ruta
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll instantáneo al tope
    window.scrollTo(0, 0);

  }, [pathname]);

  return null;
}