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
      <aside className="bg-stone-900 dark:bg-stone-950 text-white text-xs md:text-sm font-medium py-2 px-4 text-center tracking-wide flex justify-center items-center border-b border-white/10">
        <div className="flex items-center gap-2 font-semibold">
          <span className="inline-block animate-pulse text-[#E6C98B]">⚡</span>
          <span>DESCARGA DIGITAL INMEDIATA 24/7 &bull; ENVÍOS INTERNACIONALES CON SEGUIMIENTO</span>
          <span className="hidden sm:inline-block transition-transform group-hover:translate-x-1 font-bold text-[#E6C98B]">→</span>
        </div>
      </aside>

      {/* Barra de 3 compromisos de servicio / Trust Bar */}
      <section className="bg-stone-800 dark:bg-[#12131A] text-white py-2.5 px-4 text-xs font-semibold tracking-wider border-t border-black/10 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center sm:justify-around items-center gap-y-2 gap-x-6 uppercase text-[11px] sm:text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-[#E6C98B] shrink-0 text-sm">⚡</span>
            <span className="tracking-wide">DESCARGA DIGITAL INSTANTÁNEA</span>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-[#E6C98B] shrink-0" />
            <span className="tracking-wide">ENVÍOS CON SEGUIMIENTO EN VIVO</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#E6C98B] shrink-0" />
            <span className="tracking-wide">SOPORTE Y ACCESO 24/7 GARANTIZADO</span>
          </div>
        </div>
      </section>
    </div>
  );
};
