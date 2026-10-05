"use client";

import React from "react";
import Link from "next/link";
import { Download, Sparkles, ArrowRight, ShieldCheck, Globe, Truck, MessageCircle } from "lucide-react";

export function DeliveryShowcaseBanners() {
  return (
    <section className="py-14 sm:py-20 relative z-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Grilla de 2 Banners Grandes Paralelos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* BANNER 1: Descargas Digitales Instantáneas & Licencias */}
          <div className="group relative rounded-3xl overflow-hidden min-h-[420px] sm:min-h-[480px] flex flex-col justify-between p-8 sm:p-10 text-white shadow-2xl border border-white/10">
            {/* Imagen de Fondo con Overlay Oscuro Gradiente */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80"
                alt="Descargas Digitales Aldri Shop"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/40" />
            </div>

            {/* Badges Superiores */}
            <div className="relative z-10 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/90 text-white px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-md">
                <Download size={13} />
                <span>Descarga Inmediata</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/30">
                <Sparkles size={12} />
                <span>Acceso 24/7 / Licencias</span>
              </span>
            </div>

            {/* Texto y Llamado a la Acción Inferior */}
            <div className="relative z-10 space-y-4 max-w-lg">
              <div className="space-y-2">
                <span className="text-[#E6C98B] text-xs font-black uppercase tracking-[0.2em] block">
                  Catálogo Digital Premium
                </span>
                <h3 className="font-serif font-black text-3xl sm:text-4xl leading-tight tracking-tight text-white">
                  Archivos & Licencias Listos al Instante
                </h3>
                <p className="text-sm text-gray-200 font-medium leading-relaxed">
                  Plantillas Notion Pro, LUTs cinematográficos y licencias oficiales con entrega automatizada por correo electrónico inmediatamente tras tu compra.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/productos"
                  className="inline-flex items-center gap-2 bg-white text-stone-900 hover:bg-[#163422] hover:text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-xl active:scale-95"
                >
                  <span>Ver Catálogo Digital</span>
                  <ArrowRight size={14} />
                </Link>

                <Link
                  href="/rastreo"
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300 border border-white/30"
                >
                  <span>Mis Compras</span>
                </Link>
              </div>
            </div>
          </div>

          {/* BANNER 2: Dropshipping Global & Gadgets Seleccionados */}
          <div className="group relative rounded-3xl overflow-hidden min-h-[420px] sm:min-h-[480px] flex flex-col justify-between p-8 sm:p-10 text-white shadow-2xl border border-white/10">
            {/* Imagen de Fondo con Overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80"
                alt="Dropshipping Gadgets Aldri Shop"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/40" />
            </div>

            {/* Badges Superiores */}
            <div className="relative z-10 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-[#163422] text-white px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-md border border-[#D4AF37]/50">
                <Truck size={13} className="text-[#D4AF37]" />
                <span>Dropshipping Global</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/30">
                <Globe size={12} />
                <span>Tracking Internacional</span>
              </span>
            </div>

            {/* Texto y Llamado a la Acción Inferior */}
            <div className="relative z-10 space-y-4 max-w-lg">
              <div className="space-y-2">
                <span className="text-[#E6C98B] text-xs font-black uppercase tracking-[0.2em] block">
                  Gadgets & Hardware Curado
                </span>
                <h3 className="font-serif font-black text-3xl sm:text-4xl leading-tight tracking-tight text-white">
                  Envíos Verificados con Seguimiento 17Track
                </h3>
                <p className="text-sm text-gray-200 font-medium leading-relaxed">
                  Conectamos con proveedores internacionales certificados para despachar tecnología y accesorios EDC directo a tu dirección con código de rastreo en vivo.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://wa.me/13467392730?text=Hola%20Aldri%20Shop,%20deseo%20informaci%C3%B3n%20sobre%20un%20producto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-xl active:scale-95"
                >
                  <MessageCircle size={15} />
                  <span>Soporte por WhatsApp</span>
                </a>

                <Link
                  href="/rastreo"
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300 border border-white/30"
                >
                  <span>Rastrear Envío</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
