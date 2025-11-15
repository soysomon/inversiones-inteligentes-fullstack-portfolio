import { useState, FormEvent, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logoinversiones from '../../img/logoInvInt.png';
import gsap from 'gsap';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Referencias para animaciones
  const logoRef = useRef(null);
  const formRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Animación de entrada con GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación del logo
      gsap.from(logoRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });

      // Animación staggered del formulario
      gsap.from([emailRef.current, passwordRef.current, buttonRef.current], {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.3
      });
    });

    return () => ctx.revert();
  }, []);

  // Animaciones de focus en inputs
  const handleFocus = (ref: any) => {
    gsap.to(ref.current, {
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleBlur = (ref: any) => {
    gsap.to(ref.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Animación del botón al hacer submit
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    try {
      await login(email, password);
      
      // Animación de salida exitosa
      gsap.to(formRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          navigate('/admin/dashboard');
        }
      });
    } catch (err: any) {
      // Animación de shake en error
      const tl = gsap.timeline();
      tl.to(formRef.current, { x: -10, duration: 0.1 })
        .to(formRef.current, { x: 10, duration: 0.1 })
        .to(formRef.current, { x: -10, duration: 0.1 })
        .to(formRef.current, { x: 10, duration: 0.1 })
        .to(formRef.current, { x: 0, duration: 0.1 });
      console.error('Error en login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 relative overflow-hidden">
      {/* Orbes sutiles animados de fondo */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md relative z-10" ref={formRef}>
        {/* Logo */}
        <div className="text-center mb-12" ref={logoRef}>
          <img 
            src={logoinversiones} 
            alt="Inversiones Inteligentes" 
            className="h-16 mx-auto drop-shadow-sm"
          />
        </div>

        {/* Formulario */}
        <div className="space-y-6">
          <div ref={emailRef}>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => handleFocus(emailRef)}
              onBlur={() => handleBlur(emailRef)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="correo@ejemplo.com"
              disabled={loading}
            />
          </div>

          <div ref={passwordRef}>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFocus(passwordRef)}
              onBlur={() => handleBlur(passwordRef)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            ref={buttonRef}
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}