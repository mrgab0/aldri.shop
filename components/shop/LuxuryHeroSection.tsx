"use client";

import React from "react";
import Link from "next/link";
import { Truck, Zap, ShieldCheck, Star, Sparkles } from "lucide-react";

interface LuxuryHeroSectionProps {
  siteConfig?: any;
}

export const LuxuryHeroSection: React.FC<LuxuryHeroSectionProps> = ({ siteConfig }) => {
  const logoUrl = siteConfig?.logoUrl || "/logo.png";
  const catalogUrl = "/productos";

  return (
    <section className="relative overflow-hidden py-16 md:py-28 lg:py-32 border-b border-white/10 select-none">
      {/* Halo de luz volumétrica central (Efecto Estudio Fotográfico de Lujo) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[400px] md:h-[600px] bg-gradient-to-tr from-amber-500/15 via-[#D4AF37]/20 to-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Gráficos laterales de ambiente en vidrio ahumado flotante */}
      <div className="absolute inset-0 flex justify-between items-center opacity-30 dark:opacity-20 pointer-events-none px-4 md:px-12 select-none overflow-hidden">
        {/* Gráfico Izquierdo: Digital Assets & Cyber Studio */}
        <div className="w-56 md:w-80 transform -translate-x-10 rotate-[-4deg] hidden sm:block">
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-2xl">
            <img
              alt="Digital Assets & Workspace"
              className="rounded-[22px] w-full object-cover aspect-[3/4]"
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80&auto=format"
            />
            <div className="absolute inset-0 rounded-[22px] bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent opacity-80" />
          </div>
        </div>
        {/* Gráfico Derecho: Smart Luxury Hardware & EDC */}
        <div className="w-56 md:w-80 transform translate-x-10 rotate-[4deg] hidden sm:block">
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-[#D4AF37]/30 via-white/5 to-transparent shadow-2xl">
            <img
              alt="Trending Tech & Accessories"
              className="rounded-[22px] w-full object-cover aspect-[3/4]"
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80&auto=format"
            />
            <div className="absolute inset-0 rounded-[22px] bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent opacity-80" />
          </div>
        </div>
      </div>

      {/* Contenido Central Hero */}
      <div className="relative max-w-4xl mx-auto text-center px-4 z-10">
        
        {/* Logotipo Oficial con pedestal de cristal y anillo reflectante */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#F2CA50] via-[#D4AF37] to-[#C5A059] rounded-full blur-xl opacity-50 group-hover:opacity-85 transition duration-700 animate-pulse" />
            <div className="relative w-20 h-20 sm:w-26 sm:h-26 rounded-full overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.4)] border-2 border-amber-300/60 bg-[#0A0A0C]/90 backdrop-blur-xl flex items-center justify-center p-0.5">
              <img src="/logo.png" alt="Aldri Shop Logo Oficial" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
        </div>

        {/* Kicker de marca en cápsula de vidrio esmerilado */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-pill mb-4 border border-amber-400/30 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
          <span className="w-2 h-2 rounded-full bg-[#F2CA50] shadow-[0_0_8px_#F2CA50] animate-pulse" />
          <p className="text-[#F2CA50] font-sans tracking-[0.25em] uppercase text-[11px] md:text-xs font-black">
            {siteConfig?.storeName || "Aldri Shop"} &bull; Premium Digital &amp; Tech Essentials
          </p>
        </div>

        {/* Titular Principal en Playfair Display (Editorial Lujo Stitch Radical) */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] font-bold tracking-tight mb-5 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
          Digital Products &amp; <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2CA50] via-[#D4AF37] to-[#C5A059] drop-shadow-[0_0_35px_rgba(212,175,55,0.35)]">
            Modern Essentials
          </span>
        </h1>

        <p className="text-zinc-300 text-sm md:text-base lg:text-lg font-normal max-w-2xl mx-auto leading-relaxed mb-10 text-balance">
          Descarga plantillas y activos de productividad al instante 24/7 y adquiere gadgets tecnológicos de vanguardia con seguimiento global en vivo.
        </p>

        {/* Fila de 4 Badges de Valor en Losetas de Material Glass */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 max-w-3xl mx-auto mb-10">
          {/* Badge 1: Descarga Inmediata */}
          <div className="glass-card-radical flex flex-col items-center justify-center p-4 rounded-2xl group cursor-default">
            <div className="w-11 h-11 mb-2.5 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#F2CA50] border border-amber-400/30 shadow-[0_0_15px_rgba(242,202,80,0.2)] group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
              <Zap size={20} />
            </div>
            <span className="text-xs font-extrabold text-white text-center leading-snug tracking-wide">
              Descarga<br /><span className="text-[#F2CA50]">Inmediata 24/7</span>
            </span>
          </div>

          {/* Badge 2: Envíos Rastreados */}
          <div className="glass-card-radical flex flex-col items-center justify-center p-4 rounded-2xl group cursor-default">
            <div className="w-11 h-11 mb-2.5 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#F2CA50] border border-amber-400/30 shadow-[0_0_15px_rgba(242,202,80,0.2)] group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
              <Truck size={20} />
            </div>
            <span className="text-xs font-extrabold text-white text-center leading-snug tracking-wide">
              Envíos Globales<br /><span className="text-[#F2CA50]">Rastreados</span>
            </span>
          </div>

          {/* Badge 3: Garantía Total */}
          <div className="glass-card-radical flex flex-col items-center justify-center p-4 rounded-2xl group cursor-default">
            <div className="w-11 h-11 mb-2.5 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#F2CA50] border border-amber-400/30 shadow-[0_0_15px_rgba(242,202,80,0.2)] group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xs font-extrabold text-white text-center leading-snug tracking-wide">
              Garantía &amp;<br /><span className="text-[#F2CA50]">Soporte VIP</span>
            </span>
          </div>

          {/* Badge 4: Calificación 5 Estrellas */}
          <div className="glass-card-radical flex flex-col items-center justify-center p-4 rounded-2xl group cursor-default">
            <div className="w-11 h-11 mb-2.5 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#F2CA50] border border-amber-400/30 shadow-[0_0_15px_rgba(242,202,80,0.2)] group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
              <Star size={20} fill="#F2CA50" />
            </div>
            <span className="text-xs font-extrabold text-white text-center leading-snug tracking-wide">
              5 Estrellas<br /><span className="text-[#F2CA50]">Verificadas</span>
            </span>
          </div>
        </div>

        {/* Botones CTA Principales de Alta Conversión */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link
            href={catalogUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center glass-btn-gold text-xs sm:text-sm font-black tracking-widest uppercase px-9 py-4 rounded-full group cursor-pointer"
          >
            <span>EXPLORAR CATÁLOGO</span>
            <span className="ml-3 w-6 h-6 rounded-full bg-black/20 text-black inline-flex items-center justify-center text-xs font-black transition-transform group-hover:translate-x-1">
              ›
            </span>
          </Link>

          <Link
            href="/rastreo"
            className="w-full sm:w-auto inline-flex items-center justify-center glass-btn-secondary text-xs sm:text-sm font-bold tracking-wider uppercase px-8 py-4 rounded-full cursor-pointer"
          >
            <span>Rastrear Pedido / Descargas</span>
          </Link>
        </div>

        {/* Prueba social de estrellas en cápsula translúcida */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-pill text-xs text-zinc-300 font-medium">
          <span className="text-[#F2CA50] tracking-wider text-sm font-black">★★★★★</span>
          <span className="font-extrabold text-white">4.9/5</span>
          <span className="text-zinc-400">• Más de 1,200 clientes satisfechos a nivel global</span>
        </div>

      </div>
    </section>
  );
};
