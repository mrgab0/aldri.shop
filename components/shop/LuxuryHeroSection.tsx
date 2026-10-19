"use client";

import React from "react";
import Link from "next/link";
import { Truck, Zap, ShieldCheck, Star } from "lucide-react";

interface LuxuryHeroSectionProps {
  siteConfig?: any;
}

export const LuxuryHeroSection: React.FC<LuxuryHeroSectionProps> = ({ siteConfig }) => {
  const logoUrl = siteConfig?.logoUrl || "/logo.png";
  const catalogUrl = "/productos";

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] dark:bg-[#0A0A0C] py-14 md:py-24 lg:py-28 border-b border-[#EAE4DC] dark:border-white/10 transition-colors duration-300 select-none">
      {/* Elementos decorativos laterales de ambiente */}
      <div className="absolute inset-0 flex justify-between items-center opacity-25 dark:opacity-15 pointer-events-none px-4 md:px-12 select-none overflow-hidden">
        {/* Gráfico Izquierdo: Digital Assets / Creative */}
        <div className="w-56 md:w-80 transform -translate-x-8 rotate-[-3deg] hidden sm:block">
          <img
            alt="Digital Assets & Workspace"
            className="rounded-3xl shadow-2xl w-full object-cover aspect-[3/4] border border-white/10"
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80&auto=format"
          />
        </div>
        {/* Gráfico Derecho: Smart Products / Trending */}
        <div className="w-56 md:w-80 transform translate-x-8 rotate-[3deg] hidden sm:block">
          <img
            alt="Trending Tech & Accessories"
            className="rounded-3xl shadow-2xl w-full object-cover aspect-[3/4] border border-white/10"
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80&auto=format"
          />
        </div>
      </div>

      {/* Contenido Central Hero */}
      <div className="relative max-w-4xl mx-auto text-center px-4 z-10">
        
        {/* Logotipo Oficial */}
        <div className="flex justify-center mb-5">
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#F2CA50] via-[#D4AF37] to-[#C5A059] rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-2xl border-2 sm:border-4 border-[#D4AF37] bg-[#0A0A0C] flex items-center justify-center">
              <img src="/logo.png" alt="Aldri Shop Logo Oficial" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Kicker de marca en tipografía dorada con tracking amplio */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <p className="text-[#C5A059] dark:text-[#F2CA50] font-sans tracking-[0.2em] uppercase text-[11px] md:text-xs font-bold">
            {siteConfig?.storeName || "Aldri Shop"} • Premium Digital &amp; Tech Essentials
          </p>
        </div>

        {/* Titular Principal en Playfair Display (Editorial Lujo Stitch) */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-gray-900 dark:text-white leading-[1.15] font-semibold tracking-tight">
          Digital Products &amp; <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2CA50] via-[#D4AF37] to-[#C5A059]">
            Modern Essentials
          </span>
        </h1>

        <p className="text-gray-600 dark:text-zinc-300 text-sm md:text-base font-normal mt-4 mb-9 max-w-xl mx-auto leading-relaxed">
          Descarga plantillas y activos digitales al instante 24/7 y recibe gadgets tecnológicos en tendencia con seguimiento internacional en tiempo real.
        </p>

        {/* Fila de 4 Badges de Valor (Estilo Tarjetas Stitch CRO) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-2xl mx-auto mb-9">
          {/* Badge 1 */}
          <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-[#161619] border border-[#EAE4DC] dark:border-white/10 shadow-sm hover:border-[#D4AF37]/50 transition-all group">
            <div className="w-9 h-9 mb-2 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#D4AF37] border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Zap size={18} />
            </div>
            <span className="text-xs font-bold text-gray-900 dark:text-white text-center leading-snug">
              Descarga<br />Inmediata 24/7
            </span>
          </div>

          {/* Badge 2 */}
          <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-[#161619] border border-[#EAE4DC] dark:border-white/10 shadow-sm hover:border-[#D4AF37]/50 transition-all group">
            <div className="w-9 h-9 mb-2 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#D4AF37] border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Truck size={18} />
            </div>
            <span className="text-xs font-bold text-gray-900 dark:text-white text-center leading-snug">
              Envíos Globales<br />Rastreados
            </span>
          </div>

          {/* Badge 3 */}
          <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-[#161619] border border-[#EAE4DC] dark:border-white/10 shadow-sm hover:border-[#D4AF37]/50 transition-all group">
            <div className="w-9 h-9 mb-2 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#D4AF37] border border-amber-500/20 group-hover:scale-110 transition-transform">
              <ShieldCheck size={18} />
            </div>
            <span className="text-xs font-bold text-gray-900 dark:text-white text-center leading-snug">
              Garantía &amp;<br />Soporte Total
            </span>
          </div>

          {/* Badge 4 */}
          <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-[#161619] border border-[#EAE4DC] dark:border-white/10 shadow-sm hover:border-[#D4AF37]/50 transition-all group">
            <div className="w-9 h-9 mb-2 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#D4AF37] border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Star size={18} fill="#D4AF37" />
            </div>
            <span className="text-xs font-bold text-gray-900 dark:text-white text-center leading-snug">
              5 Estrellas<br />Verificadas
            </span>
          </div>
        </div>

        {/* Botones CTA Principales */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-6">
          <Link
            href={catalogUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-[#F2CA50] via-[#D4AF37] to-[#C5A059] text-black text-sm md:text-base font-extrabold tracking-wider px-8 py-3.5 rounded-full shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            <span>EXPLORAR CATÁLOGO</span>
            <span className="ml-2.5 w-6 h-6 rounded-full bg-black/15 text-black inline-flex items-center justify-center text-xs font-black transition-transform group-hover:translate-x-0.5">
              ›
            </span>
          </Link>

          <Link
            href="/rastreo"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-white text-sm md:text-base font-bold tracking-wide px-7 py-3.5 rounded-full border border-[#EAE4DC] dark:border-white/10 transition-all duration-300 hover:scale-105"
          >
            <span>Rastrear Pedido / Descargas</span>
          </Link>
        </div>

        {/* Prueba social de estrellas */}
        <div className="flex items-center justify-center space-x-1.5 text-xs text-gray-600 dark:text-zinc-400 font-medium">
          <span className="text-[#D4AF37] text-sm">★★★★★</span>
          <span className="font-extrabold text-gray-900 dark:text-white">4.9/5</span>
          <span>• Más de 1,200 clientes satisfechos a nivel global</span>
        </div>

      </div>
    </section>
  );
};
