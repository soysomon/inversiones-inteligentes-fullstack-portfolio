// src/hooks/useGATracking.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logPageView } from '../services/googleAnalytics';

export const useGATracking = () => {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);
};

export default useGATracking;