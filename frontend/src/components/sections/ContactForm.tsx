import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  tipoConsulta: string;
  ubicacion: string;
  presupuesto: string;
  mensaje: string;
}

interface Step {
  id: keyof FormData;
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
  shortLabel: string;
  options?: string[];
}

type SubmitStatus = 'idle' | 'success' | 'error';

const ContactForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    tipoConsulta: '',
    ubicacion: '',
    presupuesto: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldError, setFieldError] = useState('');

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
      label: '¿Cuál es tu número de teléfono?',
      placeholder: '(849) 000-0000',
      type: 'tel',
      required: false,
      shortLabel: 'Teléfono'
    },
    {
      id: 'tipoConsulta',
      label: '¿Qué tipo de consulta tienes?',
      placeholder: 'Selecciona una opción',
      type: 'buttons',
      required: true,
      shortLabel: 'Tipo',
      options: [
        'Comprar Propiedad',
        'Inversión Inmobiliaria',
        'Valoración de Propiedad',
        'Asesoría General'
      ]
    },
    {
      id: 'ubicacion',
      label: '¿En qué ubicación estás interesado?',
      placeholder: 'Selecciona ubicación',
      type: 'buttons',
      required: false,
      shortLabel: 'Ubicación',
      options: [
        'Santo Domingo',
        'San Juan de la Maguana',
        'Punta Cana',
        'Otra ubicación'
      ]
    },
    {
      id: 'presupuesto',
      label: '¿Cuál es tu rango de presupuesto?',
      placeholder: 'Selecciona tu presupuesto',
      type: 'budget',
      required: false,
      shortLabel: 'Presupuesto',
      options: [
        'RD$ 500,000 - RD$ 2,000,000',
        'RD$ 2,000,000 - RD$ 5,000,000',
        'RD$ 5,000,000 - RD$ 10,000,000',
        'RD$ 10,000,000 - RD$ 20,000,000',
        'RD$ 20,000,000 - RD$ 50,000,000',
        'Más de RD$ 50,000,000'
      ]
    },
    {
      id: 'mensaje',
      label: '¿Algo más que quieras contarnos?',
      placeholder: 'Cuéntanos más detalles sobre tu consulta...',
      type: 'textarea',
      required: false,
      shortLabel: 'Mensaje'
    }
  ];

  const currentStepData = steps[currentStep];

  const handleInputChange = (value: string) => {
    setFormData(prev => ({ ...prev, [currentStepData.id]: value }));
    setFieldError(''); // Limpiar error al escribir
  };

  const validateCurrentField = (): boolean => {
    const value = formData[currentStepData.id];
    
    // Validar email
    if (currentStepData.id === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setFieldError('Por favor, ingresa un email válido (ejemplo: tu@email.com)');
        return false;
      }
    }
    
    // Validar teléfono (opcional pero si tiene valor debe ser válido)
    if (currentStepData.id === 'telefono' && value && value.trim() !== '') {
      const phoneRegex = /^[\d\s\-\(\)\+]{7,}$/;
      if (!phoneRegex.test(value)) {
        setFieldError('Por favor, ingresa un teléfono válido');
        return false;
      }
    }
    
    setFieldError('');
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentField()) {
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !['textarea', 'select', 'budget', 'buttons'].includes(currentStepData.type)) {
      e.preventDefault();
      if (canProceed() && validateCurrentField()) {
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
    if (currentStepData.required) {
      return value !== '' && value.trim() !== '';
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateCurrentField()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch(`${API_URL}/api/email/send-contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setTimeout(() => {
          setFormData({
            nombre: '',
            email: '',
            telefono: '',
            tipoConsulta: '',
            ubicacion: '',
            presupuesto: '',
            mensaje: ''
          });
          setCurrentStep(0);
          setSubmitStatus('idle');
        }, 3000);
      } else {
        throw new Error(data.error || data.message || 'Error al enviar el formulario');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error al enviar el formulario. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepStatus = (index: number): 'completed' | 'active' | 'pending' => {
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
          <p className="text-lg text-gray-600 mb-2">
            Gracias por contactarnos, {formData.nombre}.
          </p>
          <p className="text-sm text-gray-500">
            Te responderemos en menos de 4 horas
          </p>
        </div>
      </div>
    );
  }

  // Pantalla de error
  if (submitStatus === 'error') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-4xl font-light text-black mb-4">Error al enviar</h2>
          <p className="text-lg text-gray-600 mb-8">
            {errorMessage}
          </p>
          <div className="space-y-4">
            <button
              onClick={() => {
                setSubmitStatus('idle');
                setErrorMessage('');
              }}
              className="w-full px-8 py-4 bg-black text-white hover:bg-gray-800 transition-all duration-300 font-light"
            >
              Intentar nuevamente
            </button>
            <a
              href="https://wa.me/18498827452"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-8 py-4 border border-black text-black hover:bg-gray-50 transition-all duration-300 font-light"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Formulario principal
  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="py-16 px-4 border-b border-gray-200">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-5xl md:text-6xl font-light text-black mb-4 tracking-tight">
            Consulta
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Completa el formulario y nos pondremos en contacto
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          
          {/* Progress Indicators */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              {steps.map((step, index) => {
                const status = getStepStatus(index);
                
                return (
                  <div 
                    key={step.id}
                    className="flex flex-col items-center flex-1 cursor-pointer"
                    onClick={() => index < currentStep && setCurrentStep(index)}
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300 border-2
                      ${status === 'completed' ? 'bg-black border-black' : ''}
                      ${status === 'active' ? 'border-black bg-white' : ''}
                      ${status === 'pending' ? 'border-gray-300 bg-white' : ''}
                    `}>
                      {status === 'completed' ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <span className={`text-xs font-medium ${
                          status === 'active' ? 'text-black' : 'text-gray-400'
                        }`}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs transition-colors duration-300 hidden sm:block ${
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
          <div className="mb-12">
            {/* Question */}
            <div className="mb-10">
              <h3 className="text-3xl md:text-4xl font-light text-black mb-2">
                {currentStepData.label}
              </h3>
              <p className="text-sm text-gray-500">
                Paso {currentStep + 1} de {steps.length}
                {currentStepData.required && <span className="text-red-500 ml-2">*</span>}
              </p>
            </div>

            {/* Input Field */}
            <div className="space-y-8">
              {currentStepData.type === 'buttons' ? (
                <div className="space-y-4">
                  {currentStepData.options?.map((option, index) => {
                    const isSelected = formData[currentStepData.id] === option;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleInputChange(option)}
                        className={`
                          w-full px-6 py-5 text-left rounded-xl transition-all duration-300 border-2
                          ${isSelected 
                            ? 'border-black bg-black text-white shadow-lg scale-[1.02]' 
                            : 'border-gray-200 bg-white text-black hover:border-gray-400 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-light">{option}</span>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                              <Check className="w-4 h-4 text-black" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : currentStepData.type === 'budget' ? (
                <div className="space-y-4">
                  {currentStepData.options?.map((option, index) => {
                    const isSelected = formData[currentStepData.id] === option;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleInputChange(option)}
                        className={`
                          w-full px-6 py-5 text-left rounded-xl transition-all duration-300 border-2
                          ${isSelected 
                            ? 'border-black bg-black text-white shadow-lg scale-[1.02]' 
                            : 'border-gray-200 bg-white text-black hover:border-gray-400 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-light">{option}</span>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                              <Check className="w-4 h-4 text-black" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : currentStepData.type === 'select' ? (
                <select
                  value={formData[currentStepData.id]}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange(e.target.value)}
                  className="w-full px-0 py-4 text-xl border-0 border-b-2 border-gray-300 focus:border-black focus:outline-none transition-all duration-300 bg-transparent font-light text-black appearance-none cursor-pointer"
                  autoFocus
                >
                  <option value="">{currentStepData.placeholder}</option>
                  {currentStepData.options?.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              ) : currentStepData.type === 'textarea' ? (
                <textarea
                  rows={6}
                  value={formData[currentStepData.id]}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange(e.target.value)}
                  placeholder={currentStepData.placeholder}
                  onKeyDown={handleKeyPress}
                  className="w-full px-0 py-4 text-xl border-0 border-b-2 border-gray-300 focus:border-black focus:outline-none transition-all duration-300 resize-none bg-transparent font-light placeholder:text-gray-400"
                  autoFocus
                />
              ) : (
                <input
                  type={currentStepData.type}
                  value={formData[currentStepData.id]}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e.target.value)}
                  placeholder={currentStepData.placeholder}
                  onKeyDown={handleKeyPress}
                  className="w-full px-0 py-4 text-xl border-0 border-b-2 border-gray-300 focus:border-black focus:outline-none transition-all duration-300 bg-transparent font-light placeholder:text-gray-400"
                  autoFocus
                />
              )}

              {/* Error Message */}
              {fieldError && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{fieldError}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
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

              {/* Skip Option for Non-required Fields */}
              {!currentStepData.required && currentStep < steps.length - 1 && ['budget', 'buttons'].includes(currentStepData.type) && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors duration-300 py-2 mt-4"
                >
                  Prefiero no especificar →
                </button>
              )}
              
              {!currentStepData.required && currentStep < steps.length - 1 && !['budget', 'buttons'].includes(currentStepData.type) && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors duration-300 py-2"
                >
                  Saltar este paso →
                </button>
              )}

              {/* Help Text */}
              <p className="text-sm text-gray-400 text-center pt-4">
                Presiona Enter ↵ para continuar
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-gray-200">
            <div>
              <h4 className="text-sm font-medium text-black mb-2">Teléfono</h4>
              <a href="tel:+18498827452" className="text-base text-gray-600 hover:text-black transition-colors">
                (849) 882-7452
              </a>
            </div>
            <div>
              <h4 className="text-sm font-medium text-black mb-2">Email</h4>
              <a href="mailto:info@inversionesinteligentes.com" className="text-base text-gray-600 hover:text-black transition-colors break-words">
                info@inversionesinteligentes.com
              </a>
            </div>
            <div>
              <h4 className="text-sm font-medium text-black mb-2">Horario</h4>
              <p className="text-base text-gray-600">Lun - Vie<br />8:00 AM - 6:00 PM</p>
            </div>
          </div>

          {/* Privacy Notice */}
          <p className="text-xs text-gray-400 text-center mt-8 pb-8">
            Al enviar este formulario, aceptas nuestros términos de privacidad y tratamiento de datos
          </p>
        </div>
      </section>
    </div>
  );
};

export default ContactForm;