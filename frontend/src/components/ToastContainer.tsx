import { Toaster } from 'react-hot-toast';

export default function ToastContainer() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={12}
      containerClassName=""
      containerStyle={{
        top: 80,
        right: 20,
      }}
      toastOptions={{
        // Configuración global por defecto
        duration: 3500,
        style: {
          background: '#fff',
          color: '#1F2937',
          borderRadius: '16px',
          padding: '16px 24px',
          fontSize: '15px',
          fontWeight: '500',
          maxWidth: '450px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        },
        // Animaciones suaves tipo iOS
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10B981',
            secondary: '#fff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#EF4444',
            secondary: '#fff',
          },
        },
        loading: {
          duration: Infinity,
        },
      }}
    />
  );
}