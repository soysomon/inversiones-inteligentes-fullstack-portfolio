import { showSuccess, showError, showInfo, showWarning, showPromise } from '../utils/toast';

/**
 * Hook para usar notificaciones en componentes
 * @example
 * const notify = useNotification();
 * notify.success('Usuario creado exitosamente');
 * notify.error('Error al crear usuario');
 */
export const useNotification = () => {
  return {
    success: showSuccess,
    error: showError,
    info: showInfo,
    warning: showWarning,
    promise: showPromise,
  };
};

export default useNotification;