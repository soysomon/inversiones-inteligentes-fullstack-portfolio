import { useState, FormEvent, ChangeEvent } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
}

interface FormErrors {
  nombre?: string;
  email?: string;
  telefono?: string;
  mensaje?: string;
}

interface Step {
  id: keyof FormData;
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
  shortLabel: string;
}

const ContactView = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const steps: Step[] = [
    {
      id: 'nombre',
      label: '¿Cuál es tu nombre?',
      placeholder: 'Escribe tu nombre completo',
      type: 'text',
      required: true,
      shortLabel: 'Nombre'
    },
    {
      id: 'email',
      label: '¿Cuál es tu correo electrónico?',
      placeholder: 'tu@email.com',
      type: 'email',
      required: true,
      shortLabel: 'Email'
    },
    {
      id: 'telefono',
      label: '¿Cuál es tu teléfono o WhatsApp?',
      placeholder: '(849) 000-0000',
      type: 'tel',
      required: true,
      shortLabel: 'Teléfono'
    },
    {
      id: 'mensaje',
      label: '¿En qué podemos ayudarte?',
      placeholder: 'Cuéntanos más sobre tu consulta...',
      type: 'textarea',
      required: true,
      shortLabel: 'Mensaje'
    }
  ];

  const currentStepData = steps[currentStep];

  const handleInputChange = (value: string) => {
    setFormData(prev => ({ ...prev, [currentStepData.id]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentStepData.type !== 'textarea') {
      e.preventDefault();
      if (canProceed()) {
        if (currentStep === steps.length - 1) {
          handleSubmit();
        } else {
          handleNext();
        }
      }
    }
  };

  const canProceed = (): boolean => {
    const value = formData[currentStepData.id];
    return Boolean(value && value.trim() !== '');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(`${API_URL}/api/email/send-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tipoConsulta: 'Contacto General' }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
        setTimeout(() => {
          setSubmitStatus('idle');
          setCurrentStep(0);
        }, 3000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 3000);
      }
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  // Pantalla de éxito
  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-4xl font-light text-black mb-4">Mensaje enviado</h2>
          <p className="text-lg text-gray-600">
            Gracias por contactarnos. Te responderemos pronto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="py-20 px-4 border-b border-gray-200">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-light text-black mb-6 tracking-tight">
            Contacto
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Estamos aquí para ayudarte
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          
          {/* Progress Indicators */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              {steps.map((step, index) => {
                const status = getStepStatus(index);
                
                return (
                  <div 
                    key={step.id}
                    className="flex flex-col items-center flex-1 cursor-pointer"
                    onClick={() => index < currentStep && setCurrentStep(index)}
                  >
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-all duration-300 border-2
                      ${status === 'completed' ? 'bg-black border-black' : ''}
                      ${status === 'active' ? 'border-black bg-white' : ''}
                      ${status === 'pending' ? 'border-gray-300 bg-white' : ''}
                    `}>
                      {status === 'completed' ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <span className={`text-sm font-medium ${
                          status === 'active' ? 'text-black' : 'text-gray-400'
                        }`}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs transition-colors duration-300 ${
                      status === 'active' ? 'text-black font-medium' : 
                      status === 'completed' ? 'text-black' : 
                      'text-gray-400'
                    }`}>
                      {step.shortLabel}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-0.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-black transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Form Card */}
          <div className="mb-20">
            {/* Question */}
            <div className="mb-12">
              <h3 className="text-3xl md:text-4xl font-light text-black mb-2">
                {currentStepData.label}
              </h3>
              <p className="text-sm text-gray-500">
                Paso {currentStep + 1} de {steps.length}
              </p>
            </div>

            {/* Input Field */}
            <div className="space-y-8">
              {currentStepData.type === 'textarea' ? (
                <textarea
                  rows={6}
                  value={formData[currentStepData.id]}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange(e.target.value)}
                  placeholder={currentStepData.placeholder}
                  onKeyDown={handleKeyPress}
                  className="w-full px-0 py-4 text-2xl border-0 border-b-2 border-gray-300 focus:border-black focus:outline-none transition-all duration-300 resize-none bg-transparent font-light placeholder:text-gray-400"
                  autoFocus
                />
              ) : (
                <input
                  type={currentStepData.type}
                  value={formData[currentStepData.id]}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e.target.value)}
                  placeholder={currentStepData.placeholder}
                  onKeyDown={handleKeyPress}
                  className="w-full px-0 py-4 text-2xl border-0 border-b-2 border-gray-300 focus:border-black focus:outline-none transition-all duration-300 bg-transparent font-light placeholder:text-gray-400"
                  autoFocus
                />
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-8">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-8 py-4 border border-gray-300 text-black font-light hover:bg-gray-50 transition-all duration-300"
                  >
                    <ArrowLeft className="w-5 h-5 inline mr-2" />
                    Atrás
                  </button>
                )}

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`flex-1 px-8 py-4 font-light transition-all duration-300 ${
                      canProceed()
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continuar
                    <ArrowRight className="w-5 h-5 inline ml-2" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canProceed() || isSubmitting}
                    className={`flex-1 px-8 py-4 font-light transition-all duration-300 ${
                      canProceed() && !isSubmitting
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar'}
                  </button>
                )}
              </div>

              {/* Help Text */}
              <p className="text-sm text-gray-400 text-center pt-4">
                Presiona Enter ↵ para continuar
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 pb-20 border-b border-gray-200">
            <div>
              <h4 className="text-sm font-medium text-black mb-2">Teléfono</h4>
              <a href="tel:+18498827452" className="text-lg text-gray-600 hover:text-black transition-colors">
                (849) 882-7452
              </a>
            </div>
            <div>
              <h4 className="text-sm font-medium text-black mb-2">Email</h4>
              <a href="mailto:info@inversionesinteligentes.com" className="text-lg text-gray-600 hover:text-black transition-colors break-words">
                info@inversionesinteligentes.com
              </a>
            </div>
            <div>
              <h4 className="text-sm font-medium text-black mb-2">Horario</h4>
              <p className="text-lg text-gray-600">Lun - Vie<br />8:00 AM - 6:00 PM</p>
            </div>
          </div>

          {/* Map Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-light text-black mb-8">Ubicación</h2>
            <div className="relative h-[500px] overflow-hidden border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.234567890123!2d-71.22345678901234!3d18.817890123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDQ5JzA0LjQiTiA3McKwMTMnMjQuNSJX!5e0!3m2!1ses!2sdo!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de San Juan de la Maguana"
              />
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-2">Oficina Principal</p>
              <p className="text-lg text-black font-light mb-4">RQ9G+4H San Juan de la Maguana, República Dominicana</p>
              <a
                href="https://www.google.com/maps/place/RQ9G%2B4H+San+Juan+de+la+Maguana/@18.8179,-71.2234,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-black hover:underline"
              >
                Obtener direcciones
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center py-12 border-t border-gray-200">
              <div className="text-5xl font-light text-black mb-2">100+</div>
              <p className="text-sm text-gray-600">Propiedades Gestionadas</p>
            </div>
            <div className="text-center py-12 border-t border-gray-200">
              <div className="text-5xl font-light text-black mb-2">98%</div>
              <p className="text-sm text-gray-600">Satisfacción de Clientes</p>
            </div>
            <div className="text-center py-12 border-t border-gray-200">
              <div className="text-5xl font-light text-black mb-2">24/7</div>
              <p className="text-sm text-gray-600">Soporte Disponible</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactView;