"use client";

import React from "react";
import { Truck, Clock, Zap } from "lucide-react";

interface TrustAnnouncementBarProps {
  phone?: string;
}

export const TrustAnnouncementBar: React.FC<TrustAnnouncementBarProps> = ({
  phone = "+1 (800) ALDRI-SHOP"
}) => {
  return (
    <div className="w-full z-40 relative select-none">
      {/* Barra superior de anuncios estilo Aldri Shop Obsidian Glass */}
      <aside className="bg-[#08080B]/90 backdrop-blur-xl text-zinc-200 text-xs font-semibold py-2 px-4 text-center tracking-widest flex justify-center items-center border-b border-white/10">
        <div className="flex items-center gap-2 uppercase text-[10px] sm:text-[11px] text-[#F2CA50]">
          <span className="inline-block animate-pulse text-[#F2CA50]">⚡</span>
          <span className="tracking-[0.2em] font-extrabold text-white">DESCARGA DIGITAL INMEDIATA 24/7 &bull; <span className="text-[#F2CA50]">ENVÍOS INTERNACIONALES RASTREADOS</span></span>
          <span className="hidden sm:inline-block font-bold text-[#F2CA50]">⚡</span>
        </div>
      </aside>

      {/* Barra de 3 compromisos de servicio / Trust Bar en Cristal */}
      <section className="bg-[#0B0B0E]/75 backdrop-blur-md text-zinc-300 py-2 px-4 text-xs font-bold tracking-wider border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center sm:justify-around items-center gap-y-2 gap-x-6 uppercase text-[9px] sm:text-[10px]">
          <div className="flex items-center space-x-2">
            <Zap className="w-3.5 h-3.5 text-[#F2CA50] shrink-0" />
            <span className="tracking-widest">DESCARGA DIGITAL INSTANTÁNEA</span>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="w-3.5 h-3.5 text-[#F2CA50] shrink-0" />
            <span className="tracking-widest">ENVÍOS CON SEGUIMIENTO EN VIVO</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-[#F2CA50] shrink-0" />
            <span className="tracking-widest">SOPORTE Y ACCESO 24/7 GARANTIZADO</span>
          </div>
        </div>
      </section>
    </div>
  );
};
