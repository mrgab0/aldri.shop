"use client";

import React, { useState } from "react";
import { Truck, Clock, Zap, Copy, Check, Sparkles } from "lucide-react";

interface TrustAnnouncementBarProps {
  phone?: string;
}

export const TrustAnnouncementBar: React.FC<TrustAnnouncementBarProps> = ({
  phone = "+1 (800) ALDRI-SHOP"
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCoupon = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("ALDRI10");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full z-40 relative select-none">
      {/* Barra superior de anuncios estilo Aldri Shop Obsidian Glass con Cupón Activo */}
      <aside className="bg-[#08080B]/95 backdrop-blur-xl text-zinc-200 text-xs font-semibold py-2 px-3 text-center tracking-widest flex justify-center items-center border-b border-white/10">
        <div className="flex flex-wrap items-center justify-center gap-2 uppercase text-[10px] sm:text-[11px] text-[#F2CA50]">
          <span className="flex items-center gap-1.5 font-extrabold text-white">
            <Sparkles size={13} className="text-[#F2CA50] animate-pulse" />
            <span>10% OFF EN TU PRIMERA ORDEN:</span>
          </span>
          <button
            onClick={handleCopyCoupon}
            className="inline-flex items-center gap-1.5 bg-[#F2CA50]/15 hover:bg-[#F2CA50]/25 text-[#F2CA50] border border-[#F2CA50]/40 px-2.5 py-0.5 rounded-full font-mono font-black text-[10px] sm:text-xs transition-all cursor-pointer shadow-sm active:scale-95"
            title="Copiar código de descuento"
          >
            <span>ALDRI10</span>
            {copied ? (
              <span className="flex items-center gap-0.5 text-emerald-400 font-sans font-bold">
                <Check size={11} /> ¡Copiado!
              </span>
            ) : (
              <Copy size={11} className="opacity-80" />
            )}
          </button>
          <span className="hidden md:inline-block text-zinc-400 text-[10px]">&bull; ENTREGA DIGITAL INMEDIATA 24/7</span>
        </div>
      </aside>

      {/* Barra de 3 compromisos de servicio / Trust Bar en Cristal */}
      <section className="bg-amber-50/90 dark:bg-[#0B0B0E]/75 backdrop-blur-md text-zinc-800 dark:text-zinc-300 py-2 px-4 text-xs font-bold tracking-wider border-b border-black/5 dark:border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center sm:justify-around items-center gap-y-2 gap-x-6 uppercase text-[9px] sm:text-[10px]">
          <div className="flex items-center space-x-2">
            <Zap className="w-3.5 h-3.5 text-[#714B00] dark:text-[#F2CA50] shrink-0" />
            <span className="tracking-widest">DESCARGA DIGITAL INSTANTÁNEA</span>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="w-3.5 h-3.5 text-[#714B00] dark:text-[#F2CA50] shrink-0" />
            <span className="tracking-widest">ENVÍOS CON SEGUIMIENTO EN VIVO</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-[#714B00] dark:text-[#F2CA50] shrink-0" />
            <span className="tracking-widest">GARANTÍA Y SOPORTE HUMANO 24/7</span>
          </div>
        </div>
      </section>
    </div>
  );
};
