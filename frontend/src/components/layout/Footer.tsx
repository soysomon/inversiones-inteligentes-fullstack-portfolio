import React from "react";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { motion } from "framer-motion";
import logoEmpresa from '../../img/logo1.png';

/**
 * Footer Minimalista - Inversiones Inteligentes
 */

const footerData = {
  propiedades: [
    { label: "Casas Premium", href: "/propiedades/casas-premium" },
    { label: "Apartamentos", href: "/propiedades/apartamentos" },
    { label: "Locales Comerciales", href: "/propiedades/comerciales" },
    { label: "Terrenos", href: "/propiedades/terrenos" }
  ],
  servicios: [
    { label: "Compra y Venta", href: "/servicios/compra-venta" },
    { label: "Inversión", href: "/servicios/inversion" },
    { label: "Evaluación", href: "/servicios/evaluacion" },
    { label: "Financiamiento", href: "/servicios/financiamiento" }
  ],
  ubicaciones: [
    { label: "Santo Domingo", href: "/ubicaciones/santo-domingo" },
    { label: "San Juan de la Maguana", href: "/ubicaciones/san-juan" },
  ],
  empresa: [
    { label: "Acerca de nosotros", href: "/empresa/acerca" },
    { label: "Nuestro equipo", href: "/empresa/equipo" },
    { label: "Testimonios", href: "/empresa/testimonios" },
    { label: "Blog", href: "/empresa/blog" }
  ],
  soporte: [
    { label: "Contacto", href: "/contacto" },
    { label: "Preguntas frecuentes", href: "/soporte/faq" },
    { label: "Guías de compra", href: "/soporte/guias" },
    { label: "Calculadora hipoteca", href: "/soporte/calculadora" }
  ],
  legal: [
    { label: "Privacidad", href: "/legal/privacidad" },
    { label: "Términos de uso", href: "/legal/terminos" },
    { label: "Políticas", href: "/legal/politicas" }
  ]
};

export default function MinimalFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 relative overflow-hidden">
      {/* Animated Blueprint Background */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Grid Pattern */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-blue-900"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Animated Blueprint Lines */}
          <motion.path
            d="M 100 100 L 300 100 L 300 200 L 250 200 L 250 250 L 300 250 L 300 300 L 100 300 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-blue-600"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "loop", ease: "linear" }}
          />
          
          <motion.path
            d="M 400 150 L 600 150 L 600 250 L 550 250 L 550 300 L 650 300 L 650 350 L 400 350 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-blue-600"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "loop", ease: "linear", delay: 2 }}
          />

          <motion.path
            d="M 750 120 L 950 120 L 950 180 L 900 180 L 900 220 L 950 220 L 950 280 L 750 280 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-blue-600"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 12, repeat: Infinity, repeatType: "loop", ease: "linear", delay: 4 }}
          />

          {/* Animated Measurement Lines */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "loop", delay: 1 }}
          >
            <line x1="100" y1="80" x2="300" y2="80" stroke="currentColor" strokeWidth="0.8" className="text-blue-500" />
            <line x1="100" y1="75" x2="100" y2="85" stroke="currentColor" strokeWidth="0.8" className="text-blue-500" />
            <line x1="300" y1="75" x2="300" y2="85" stroke="currentColor" strokeWidth="0.8" className="text-blue-500" />
          </motion.g>

          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "loop", delay: 3 }}
          >
            <line x1="80" y1="100" x2="80" y2="300" stroke="currentColor" strokeWidth="0.8" className="text-blue-500" />
            <line x1="75" y1="100" x2="85" y2="100" stroke="currentColor" strokeWidth="0.8" className="text-blue-500" />
            <line x1="75" y1="300" x2="85" y2="300" stroke="currentColor" strokeWidth="0.8" className="text-blue-500" />
          </motion.g>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Main Navigation Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-medium text-gray-900 mb-4">Propiedades</h3>
            <ul className="space-y-3">
              {footerData.propiedades.map((item, index) => (
                <motion.li 
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-medium text-gray-900 mb-4">Servicios</h3>
            <ul className="space-y-3">
              {footerData.servicios.map((item, index) => (
                <motion.li 
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-medium text-gray-900 mb-4">Ubicaciones</h3>
            <ul className="space-y-3">
              {footerData.ubicaciones.map((item, index) => (
                <motion.li 
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-medium text-gray-900 mb-4">Empresa</h3>
            <ul className="space-y-3">
              {footerData.empresa.map((item, index) => (
                <motion.li 
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-medium text-gray-900 mb-4">Soporte</h3>
            <ul className="space-y-3">
              {footerData.soporte.map((item, index) => (
                <motion.li 
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-medium text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerData.legal.map((item, index) => (
                <motion.li 
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Contact Information */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          {/* Company Brand Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.img 
                src={logoEmpresa} 
                alt="Inversiones Inteligentes" 
                className="h-12 w-auto"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Inversiones Inteligentes</h2>
                <p className="text-sm text-gray-600">Construyendo tu patrimonio inmobiliario</p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Phone className="w-4 h-4 text-gray-500" />
              <a href="tel:+18498827452" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                +1 (849) 882-7452
              </a>
            </motion.div>
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Mail className="w-4 h-4 text-gray-500" />
              <a href="mailto:info@inversionesinteligentes.com" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                info@inversionesinteligentes.com
              </a>
            </motion.div>
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Santo Domingo, RD</span>
              <br></br>
              <span className="text-sm text-gray-600">San Juan de la Maguana, RD</span>

            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-500">
                © {new Date().getFullYear()} Inversiones Inteligentes. Todos los derechos reservados.
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <a 
                href="/legal/privacidad" 
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Privacidad
              </a>
              <a 
                href="/legal/terminos" 
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Términos
              </a>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <select className="text-sm text-gray-500 bg-transparent border-none outline-none cursor-pointer">
                  <option>República Dominicana</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Find a realtor link */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            <a href="/agentes" className="text-blue-600 hover:text-blue-700 transition-colors">
              Encuentra un agente
            </a> cerca de ti.
          </p>
        </div>
      </div>
    </footer>
  );
}