"use client";

import React from "react";
import { Truck, Clock, MapPin, Phone } from "lucide-react";

interface TrustAnnouncementBarProps {
  phone?: string;
}

export const TrustAnnouncementBar: React.FC<TrustAnnouncementBarProps> = ({
  phone = "+1 (800) ALDRI-SHOP"
}) => {
  const cleanPhone = phone.replace(/[^\d+]/g, "");

  return (
    <div className="w-full z-40 relative">
      {/* Barra superior de anuncios estilo Aldri Shop */}
      <aside className="bg-[#0E0E10] text-[#e5e1e4] text-xs font-medium py-1.5 px-4 text-center tracking-widest flex justify-center items-center border-b border-white/5">
        <div className="flex items-center gap-2 font-semibold uppercase text-[11px] sm:text-xs text-[#E5C378]">
          <span className="inline-block animate-pulse text-[#F2CA50]">⚡</span>
          <span>DESCARGA DIGITAL INMEDIATA 24/7 &bull; ENVÍOS INTERNACIONALES CON SEGUIMIENTO EN VIVO</span>
          <span className="hidden sm:inline-block font-bold text-[#F2CA50]">⚡</span>
        </div>
      </aside>

      {/* Barra de 3 compromisos de servicio / Trust Bar */}
      <section className="bg-[#121215] text-[#e5e1e4] py-2 px-4 text-xs font-semibold tracking-wider border-b border-white/5 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center sm:justify-around items-center gap-y-2 gap-x-6 uppercase text-[10px] sm:text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="text-[#D4AF37] shrink-0 text-sm">⚡</span>
            <span className="tracking-widest">DESCARGA DIGITAL INSTANTÁNEA</span>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="tracking-widest">ENVÍOS CON SEGUIMIENTO EN VIVO</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="tracking-widest">SOPORTE Y ACCESO 24/7 GARANTIZADO</span>
          </div>
        </div>
      </section>
    </div>
  );
};
