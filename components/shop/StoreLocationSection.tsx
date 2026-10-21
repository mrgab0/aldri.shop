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
    <section className="relative w-full min-h-[500px] md:min-h-[540px] bg-[#07070A] border-t border-b border-white/10 overflow-hidden select-none">
      {/* Halo de luz radial de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-amber-500/10 via-[#D4AF37]/15 to-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Overlay esquemático de mapa de red global */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Rutas y conexiones globales */}
          <line stroke="#D4AF37" strokeWidth="2" strokeDasharray="6,6" x1="10%" x2="50%" y1="30%" y2="50%" opacity="0.6" />
          <line stroke="#D4AF37" strokeWidth="2" strokeDasharray="6,6" x1="50%" x2="85%" y1="50%" y2="35%" opacity="0.6" />
          <line stroke="#6366F1" strokeWidth="2" strokeDasharray="6,6" x1="50%" x2="70%" y1="50%" y2="80%" opacity="0.6" />
          <circle cx="10%" cy="30%" r="6" fill="#6366f1" />
          <circle cx="50%" cy="50%" r="10" fill="#F2CA50" />
          <circle cx="85%" cy="35%" r="6" fill="#6366f1" />
          <circle cx="70%" cy="80%" r="6" fill="#6366f1" />
          
          <text fill="#A1A1AA" fontSize="11" fontWeight="700" letterSpacing="1.5" x="12%" y="28%">AMÉRICA LATINA &amp; USA</text>
          <text fill="#A1A1AA" fontSize="11" fontWeight="700" letterSpacing="1.5" x="87%" y="33%">EUROPA &amp; ASIA</text>
          <text fill="#F2CA50" fontSize="13" fontWeight="900" letterSpacing="2" x="52%" y="46%">CENTRO GLOBAL ALDRI SHOP</text>
        </svg>
      </div>

      {/* Pin animado central en Oro Champagne */}
      <div className="absolute left-[50%] md:left-[60%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none">
        <div className="text-[#F2CA50] animate-bounce drop-shadow-[0_0_20px_rgba(242,202,80,0.6)]">
          <MapPin size={46} fill="currentColor" className="text-black" />
        </div>
        <span className="glass-pill text-[#F2CA50] text-[11px] font-black px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(242,202,80,0.25)] border border-amber-400/40 uppercase tracking-widest -mt-1">
          Aldri Shop Global Hub
        </span>
      </div>

      {/* Marca de agua de servicio en cristal */}
      <div className="absolute bottom-4 left-6 z-10 text-[11px] text-zinc-400 font-sans flex items-center gap-2 select-none">
        <span className="font-black text-white text-xs tracking-tight">Red Global de Distribución</span>
        <span className="font-semibold text-zinc-400">&bull; Descargas Digitales Instantáneas &amp; Envíos Rastreados</span>
      </div>

      {/* Tarjeta flotante de información de soporte y logística en Material Glass */}
      <div className="relative md:absolute top-8 left-4 right-4 md:right-auto md:left-12 z-20 max-w-sm w-auto md:w-full glass-panel-luxury p-6 sm:p-8 rounded-3xl text-white">
        <div className="inline-flex items-center gap-1.5 glass-pill text-[#F2CA50] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3.5 border border-amber-400/30">
          <MapPin size={11} className="text-[#F2CA50]" />
          <span>Soporte &amp; Logística Global</span>
        </div>

        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2 font-serif">
          Entrega Inmediata &amp; Tracking
        </h3>
        <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-5 font-normal">
          Descargas instantáneas sin costo de envío. Artículos físicos procesados directamente con guías internacionales oficiales.
        </p>

        <div className="space-y-3.5 pt-4 border-t border-white/10">
          <div>
            <h4 className="text-[10px] font-black text-[#F2CA50] uppercase tracking-widest mb-0.5 flex items-center gap-1.5">
              <Phone size={12} />
              <span>Atención al Cliente</span>
            </h4>
            <a
              href={`tel:${cleanPhone || "+18002537474"}`}
              className="text-xs sm:text-sm text-white hover:text-[#F2CA50] transition-colors font-bold"
            >
              {phone}
            </a>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-[#F2CA50] uppercase tracking-widest mb-0.5 flex items-center gap-1.5">
              <Mail size={12} />
              <span>Correo Electrónico</span>
            </h4>
            <a
              href={`mailto:${email}`}
              className="text-xs sm:text-sm text-white hover:text-[#F2CA50] transition-colors font-bold break-all"
            >
              {email}
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 glass-btn-gold text-black px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer"
          >
            <MessageCircle size={15} className="text-black" />
            <span>Hablar con Soporte 24/7</span>
          </a>
        </div>
      </div>
    </section>
  );
};
