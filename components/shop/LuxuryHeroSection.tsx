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
    <section className="relative overflow-hidden bg-white dark:bg-[#0F1015] py-12 md:py-20 lg:py-24 border-b border-stone-200 dark:border-gray-800 transition-colors duration-300 select-none">
      {/* Elementos decorativos laterales de ambiente */}
      <div className="absolute inset-0 flex justify-between items-center opacity-30 dark:opacity-20 pointer-events-none px-4 md:px-12 select-none overflow-hidden">
        {/* Gráfico Izquierdo: Digital Assets / Creative */}
        <div className="w-56 md:w-80 transform -translate-x-10 rotate-[-4deg] hidden sm:block">
          <img
            alt="Digital Assets & Workspace"
            className="rounded-3xl shadow-2xl w-full object-cover aspect-[3/4]"
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80&auto=format"
          />
        </div>
        {/* Gráfico Derecho: Smart Products / Trending */}
        <div className="w-56 md:w-80 transform translate-x-10 rotate-[4deg] hidden sm:block">
          <img
            alt="Trending Tech & Accessories"
            className="rounded-3xl shadow-2xl w-full object-cover aspect-[3/4]"
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80&auto=format"
          />
        </div>
      </div>

      {/* Contenido Central Hero */}
      <div className="relative max-w-4xl mx-auto text-center px-4 z-10">
        
        {/* Logotipo Oficial */}
        <div className="flex justify-center mb-4">
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#C5A059] via-indigo-600 to-[#C5A059] rounded-full blur opacity-35 group-hover:opacity-65 transition duration-500" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-xl border-2 sm:border-4 border-[#C5A059] bg-stone-900 flex items-center justify-center text-white font-serif font-black text-2xl">
              <span className="text-[#E6C98B]">A</span>
              <span className="text-indigo-400">S</span>
            </div>
          </div>
        </div>

        {/* Kicker de marca en tipografía dorada con tracking amplio */}
        <p className="text-[#C5A059] dark:text-[#E6C98B] font-serif tracking-[0.25em] uppercase text-xs md:text-sm font-semibold mb-2">
          {siteConfig?.storeName || "Aldri Shop"}
        </p>

        {/* Titular Principal */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-luxury-serif text-stone-900 dark:text-white leading-tight font-normal">
          Digital Products &amp; <br className="hidden sm:block" />Dropshipping Essentials <br />
          <span className="font-script-custom text-indigo-700 dark:text-[#C5A059] text-6xl md:text-8xl lg:text-9xl block -mt-2 md:-mt-4">
            elevate your lifestyle ♡
          </span>
        </h1>

        <p className="text-stone-700 dark:text-gray-300 text-sm md:text-base font-medium mt-3 mb-8 max-w-xl mx-auto">
          Descarga archivos digitales al instante y recibe productos en tendencia directamente en tu puerta con seguimiento en tiempo real.
        </p>

        {/* Fila de 4 Badges de Valor */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8 text-black dark:text-white">
          {/* Badge 1 */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-[#181922] border border-stone-300 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 mb-2 rounded-full bg-stone-100 dark:bg-gray-800 flex items-center justify-center text-indigo-600 dark:text-[#C5A059] border border-stone-200 dark:border-gray-700 shadow-sm">
              <Zap size={18} />
            </div>
            <span className="text-xs font-black text-black dark:text-white text-center leading-snug">
              Descarga<br />Inmediata 24/7
            </span>
          </div>

          {/* Badge 2 */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-[#181922] border border-stone-300 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 mb-2 rounded-full bg-stone-100 dark:bg-gray-800 flex items-center justify-center text-indigo-600 dark:text-[#C5A059] border border-stone-200 dark:border-gray-700 shadow-sm">
              <Truck size={18} />
            </div>
            <span className="text-xs font-black text-black dark:text-white text-center leading-snug">
              Dropshipping<br />Rastreado
            </span>
          </div>

          {/* Badge 3 */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-[#181922] border border-stone-300 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 mb-2 rounded-full bg-stone-100 dark:bg-gray-800 flex items-center justify-center text-indigo-600 dark:text-[#C5A059] border border-stone-200 dark:border-gray-700 shadow-sm">
              <ShieldCheck size={18} />
            </div>
            <span className="text-xs font-black text-black dark:text-white text-center leading-snug">
              Garantía &amp;<br />Soporte Total
            </span>
          </div>

          {/* Badge 4 */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-[#181922] border border-stone-300 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 mb-2 rounded-full bg-stone-100 dark:bg-gray-800 flex items-center justify-center text-[#C5A059] border border-stone-200 dark:border-gray-700 shadow-sm">
              <Star size={18} fill="#C5A059" />
            </div>
            <span className="text-xs font-black text-black dark:text-white text-center leading-snug">
              5 Estrellas<br />Verificadas
            </span>
          </div>
        </div>

        {/* Botón CTA Principal */}
        <div className="mb-4">
          <Link
            href={catalogUrl}
            className="inline-flex items-center justify-center bg-stone-900 hover:bg-black dark:bg-[#C5A059] dark:hover:bg-[#d8b56f] text-white dark:text-stone-950 text-sm md:text-base font-bold tracking-wider px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            <span>EXPLORAR CATÁLOGO</span>
            <span className="ml-2.5 w-6 h-6 rounded-full bg-white text-stone-900 dark:bg-stone-900 dark:text-[#C5A059] inline-flex items-center justify-center text-xs font-black transition-transform group-hover:translate-x-0.5">
              ›
            </span>
          </Link>
        </div>

        {/* Prueba social de estrellas */}
        <div className="flex items-center justify-center space-x-1 text-xs sm:text-sm text-black dark:text-gray-300 font-medium">
          <span className="text-amber-500 text-sm">★★★★★</span>
          <span className="font-extrabold text-black dark:text-white ml-1">4.9/5</span>
          <span>Basado en más de 1,200 clientes satisfechos</span>
        </div>

      </div>
    </section>
  );
};
