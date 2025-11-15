import toast from 'react-hot-toast';

// Estilos tipo Apple/iOS
const baseStyle = {
  borderRadius: '16px',
  padding: '16px 24px',
  fontSize: '15px',
  fontWeight: '500',
  maxWidth: '450px',
  backdropFilter: 'blur(10px)',
};

const toastConfig = {
  success: {
    style: {
      ...baseStyle,
      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      color: '#fff',
      boxShadow: '0 20px 50px rgba(16, 185, 129, 0.35), 0 0 0 1px rgba(16, 185, 129, 0.2)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10B981',
    },
  },
  error: {
    style: {
      ...baseStyle,
      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      color: '#fff',
      boxShadow: '0 20px 50px rgba(239, 68, 68, 0.35), 0 0 0 1px rgba(239, 68, 68, 0.2)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#EF4444',
    },
  },
  info: {
    style: {
      ...baseStyle,
      background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      color: '#fff',
      boxShadow: '0 20px 50px rgba(59, 130, 246, 0.35), 0 0 0 1px rgba(59, 130, 246, 0.2)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#3B82F6',
    },
  },
  warning: {
    style: {
      ...baseStyle,
      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      color: '#fff',
      boxShadow: '0 20px 50px rgba(245, 158, 11, 0.35), 0 0 0 1px rgba(245, 158, 11, 0.2)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#F59E0B',
    },
  },
};

// Funciones principales
export const showSuccess = (message: string, duration = 3000) => {
  toast.success(message, {
    ...toastConfig.success,
    duration,
  });
};

export const showError = (message: string, duration = 4000) => {
  toast.error(message, {
    ...toastConfig.error,
    duration,
  });
};

export const showInfo = (message: string, duration = 3500) => {
  toast(message, {
    icon: 'ℹ️',
    ...toastConfig.info,
    duration,
  });
};

export const showWarning = (message: string, duration = 3500) => {
  toast(message, {
    icon: '⚠️',
    ...toastConfig.warning,
    duration,
  });
};

// Para operaciones async con loading automático
export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      style: baseStyle,
      success: toastConfig.success,
      error: toastConfig.error,
      loading: {
        style: {
          ...baseStyle,
          background: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
          color: '#fff',
          boxShadow: '0 20px 50px rgba(100, 116, 139, 0.25)',
        },
      },
    }
  );
};

// Interceptar alert() y confirm() globales
export const setupAlertInterceptor = () => {
  const originalAlert = window.alert;
  const originalConfirm = window.confirm;

  // Reemplazar alert() con detección inteligente
  window.alert = function(message?: string) {
    const msg = String(message || '').toLowerCase();
    const displayMessage = message || 'Notificación';
    
    // Detectar tipo por palabras clave
    if (msg.includes('éxito') || msg.includes('exitosamente') || msg.includes('correctamente') || msg.includes('creado') || msg.includes('actualizado') || msg.includes('eliminado') || msg.includes('guardado')) {
      showSuccess(displayMessage);
    } else if (msg.includes('error') || msg.includes('fallo') || msg.includes('falló') || msg.includes('incorrecto') || msg.includes('inválido')) {
      showError(displayMessage);
    } else if (msg.includes('advertencia') || msg.includes('cuidado') || msg.includes('atención')) {
      showWarning(displayMessage);
    } else if (msg.includes('bloqueado') || msg.includes('desbloqueado')) {
      showInfo(displayMessage);
    } else {
      showInfo(displayMessage);
    }
  };

  // Para confirm() mostrar warning pero mantener funcionalidad nativa
  window.confirm = function(message?: string): boolean {
    return originalConfirm.call(window, message);
  };

  return {
    restore: () => {
      window.alert = originalAlert;
      window.confirm = originalConfirm;
    },
  };
};

// Export default para uso directo
export default {
  success: showSuccess,
  error: showError,
  info: showInfo,
  warning: showWarning,
  promise: showPromise,
};