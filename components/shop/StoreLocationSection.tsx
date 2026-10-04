"use client";

import React from "react";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

interface StoreLocationSectionProps {
  phone?: string;
  email?: string;
  whatsappUrl?: string;
}

export const StoreLocationSection: React.FC<StoreLocationSectionProps> = ({
  phone = "+1 (800) ALDRI-SHOP",
  email = "soporte@aldri.shop",
  whatsappUrl = "https://wa.me/?text=Hola!%20Quisiera%20información%20sobre%20aldri.shop"
}) => {
  const cleanPhone = phone.replace(/[^\d+]/g, "");

  return (
    <section className="relative w-full min-h-[480px] md:min-h-[520px] bg-stone-100 dark:bg-[#0B0C10] border-t border-b border-stone-300 dark:border-gray-800 overflow-hidden select-none">
      {/* Overlay esquemático de mapa de red global */}
      <div className="absolute inset-0 opacity-25 dark:opacity-15 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Rutas y conexiones globales */}
          <line stroke="#cbd5e1" strokeWidth="3" strokeDasharray="6,6" x1="10%" x2="50%" y1="30%" y2="50%" />
          <line stroke="#cbd5e1" strokeWidth="3" strokeDasharray="6,6" x1="50%" x2="85%" y1="50%" y2="35%" />
          <line stroke="#cbd5e1" strokeWidth="3" strokeDasharray="6,6" x1="50%" x2="70%" y1="50%" y2="80%" />
          <circle cx="10%" cy="30%" r="8" fill="#6366f1" />
          <circle cx="50%" cy="50%" r="12" fill="#C5A059" />
          <circle cx="85%" cy="35%" r="8" fill="#6366f1" />
          <circle cx="70%" cy="80%" r="8" fill="#6366f1" />
          
          <text fill="#64748b" fontSize="12" fontWeight="700" letterSpacing="1.5" x="12%" y="28%">AMÉRICA</text>
          <text fill="#64748b" fontSize="12" fontWeight="700" letterSpacing="1.5" x="87%" y="33%">EUROPA & ASIA</text>
          <text fill="#475569" fontSize="14" fontWeight="800" letterSpacing="2" x="52%" y="46%">CENTRO GLOBAL ALDRI SHOP</text>
        </svg>
      </div>

      {/* Pin animado central */}
      <div className="absolute left-[50%] md:left-[60%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none">
        <div className="text-indigo-600 dark:text-[#C5A059] animate-bounce drop-shadow-lg">
          <MapPin size={42} fill="currentColor" className="text-white" />
        </div>
        <span className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white text-[11px] font-black px-3.5 py-1 rounded-full shadow-md border-2 border-indigo-600 dark:border-[#C5A059] uppercase tracking-wider -mt-1">
          Aldri Shop Global Hub
        </span>
      </div>

      {/* Marca de agua de servicio */}
      <div className="absolute bottom-3 left-6 z-10 text-[11px] text-stone-600 dark:text-stone-400 font-sans flex items-center gap-2 select-none">
        <span className="font-bold text-stone-900 dark:text-white text-sm tracking-tight">Red Global de Distribución</span>
        <span className="font-medium">• Descargas Digitales Instantáneas &amp; Envíos Rastreados</span>
      </div>

      {/* Tarjeta flotante de información de soporte y logística */}
      <div className="relative md:absolute top-8 left-4 right-4 md:right-auto md:left-12 z-20 max-w-sm w-auto md:w-full bg-white dark:bg-[#12131A] p-6 sm:p-7 shadow-2xl rounded-2xl border border-stone-300 dark:border-gray-800 text-black dark:text-gray-100">
        <div className="inline-flex items-center gap-1.5 bg-stone-100 dark:bg-gray-800 text-indigo-700 dark:text-[#C5A059] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 border border-indigo-500/20">
          <MapPin size={11} />
          <span>Soporte &amp; Logística Global</span>
        </div>

        <h3 className="text-base font-black text-black dark:text-white uppercase tracking-wider mb-2 font-serif">
          Entrega Inmediata &amp; Tracking
        </h3>
        <p className="text-stone-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 font-medium">
          Descargas instantáneas sin costo de envío. Artículos físicos procesados directamente con guías internacionales oficiales.
        </p>

        <div className="space-y-3 pt-3 border-t border-stone-200 dark:border-gray-800">
          <div>
            <h4 className="text-[11px] font-black text-black dark:text-gray-200 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
              <Phone size={12} className="text-indigo-600 dark:text-[#C5A059]" />
              <span>Atención al Cliente</span>
            </h4>
            <a
              href={`tel:${cleanPhone || "+18002537474"}`}
              className="text-xs sm:text-sm text-black dark:text-gray-300 hover:text-indigo-600 dark:hover:text-[#C5A059] transition-colors font-bold"
            >
              {phone}
            </a>
          </div>

          <div>
            <h4 className="text-[11px] font-black text-black dark:text-gray-200 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
              <Mail size={12} className="text-indigo-600 dark:text-[#C5A059]" />
              <span>Correo Electrónico</span>
            </h4>
            <a
              href={`mailto:${email}`}
              className="text-xs sm:text-sm text-black dark:text-gray-300 hover:text-indigo-600 dark:hover:text-[#C5A059] transition-colors font-semibold break-all"
            >
              {email}
            </a>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-stone-100 dark:border-gray-800">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-stone-900 hover:bg-black dark:bg-[#C5A059] dark:hover:bg-[#d8b56f] text-white dark:text-stone-950 py-2.5 px-4 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <MessageCircle size={15} />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
