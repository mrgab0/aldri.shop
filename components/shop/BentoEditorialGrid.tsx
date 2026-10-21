"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface BentoProduct {
  _id?: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  images?: string[];
  category?: string;
}

interface BentoEditorialGridProps {
  products?: BentoProduct[];
}

export function BentoEditorialGrid({ products = [] }: BentoEditorialGridProps) {
  const t = useTranslations("Index");

  // Fallbacks elegantes para activos digitales y dropshipping
  const p0 = products[0] || {
    name: "Sistema Notion Pro: Ultimate Creator OS",
    slug: "sistema-notion-pro-ultimate-creator-os",
    price: 29,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=85&auto=format",
  };
  const p1 = products[1] || {
    name: "Pack LUTs Cinematográficos 8K",
    slug: "pack-luts-cinematograficos-8k",
    price: 19,
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=85&auto=format",
  };
  const p2 = products[2] || {
    name: "Organizador EDC de Titanio",
    slug: "organizador-edc-de-titanio",
    price: 34,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=85&auto=format",
  };
  const p3 = products[3] || {
    name: "Estación de Carga 3-en-1 Rápida",
    slug: "estacion-de-carga-3-en-1-rapida",
    price: 45,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=700&q=85&auto=format",
  };

  const getImg = (p: BentoProduct) => {
    if (p.image) return p.image;
    if (p.images && p.images.length > 0) return p.images[0];
    return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80&auto=format";
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-20">
      {/* Encabezado Editorial Stitch Radical */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill mb-3 border border-amber-400/30 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
          <Sparkles size={14} className="text-[#F2CA50] animate-pulse" />
          <span className="text-[#F2CA50] text-xs font-black uppercase tracking-[0.25em]">
            Colección Curada 2026
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          Activos Digitales &amp; Gadgets en Tendencia
        </h2>
        <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto mt-4 font-normal leading-relaxed">
          Selección de herramientas digitales de alta demanda con descarga inmediata 24/7 y productos de hardware con tracking verificado en vivo.
        </p>
      </div>

      {/* Bento Grid Editorial Stitch Radical Glass */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 auto-rows-auto md:auto-rows-[320px]">
        {/* 1. Elemento Principal Grande (8 cols x 2 rows) */}
        <div className="md:col-span-8 md:row-span-2 relative group overflow-hidden rounded-[28px] glass-card-radical min-h-[440px] md:min-h-full">
          <img
            src={getImg(p0)}
            alt={p0.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-black/50 to-transparent transition-opacity duration-300" />
          
          <div className="absolute top-6 left-6">
            <span className="glass-btn-gold text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xl inline-block">
              Colección Estrella
            </span>
          </div>

          <div className="absolute bottom-0 left-0 p-6 sm:p-10 w-full text-white">
            <h3 className="text-2xl sm:text-4xl font-serif font-bold mb-3 drop-shadow-lg text-white">
              {p0.name}
            </h3>
            <p className="text-2xl sm:text-3xl font-sans font-black text-[#F2CA50] mb-6 drop-shadow-[0_0_15px_rgba(242,202,80,0.4)]">
              ${p0.price} <span className="text-xs text-zinc-300 font-sans tracking-widest uppercase font-bold">USD</span>
            </p>
            <Link
              href={`/productos/${p0.slug}`}
              className="inline-flex items-center gap-2.5 glass-btn-gold text-xs font-black uppercase tracking-widest px-7 py-3.5 rounded-xl cursor-pointer"
            >
              <span>Ver Detalles</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* 2. Tarjeta Mediana Superior Derecha (4 cols x 1 row) */}
        <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden rounded-[28px] glass-card-radical min-h-[290px]">
          <img
            src={getImg(p1)}
            alt={p1.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060608]/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

          <div className="absolute bottom-0 left-0 right-0 p-5 glass-panel-luxury border-t border-white/10 flex justify-between items-center">
            <div>
              <h4 className="font-serif font-bold text-white text-sm line-clamp-1">
                {p1.name}
              </h4>
              <p className="text-xs font-extrabold text-[#F2CA50] mt-0.5">
                ${p1.price} USD
              </p>
            </div>
            <Link
              href={`/productos/${p1.slug}`}
              className="p-2.5 rounded-xl glass-btn-gold flex items-center justify-center cursor-pointer"
              title="Ver producto"
            >
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* 3. Tarjeta Mediana Inferior Derecha (4 cols x 1 row) */}
        <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden rounded-[28px] glass-card-radical min-h-[290px]">
          <img
            src={getImg(p2)}
            alt={p2.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060608]/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

          <div className="absolute bottom-0 left-0 right-0 p-5 glass-panel-luxury border-t border-white/10 flex justify-between items-center">
            <div>
              <h4 className="font-serif font-bold text-white text-sm line-clamp-1">
                {p2.name}
              </h4>
              <p className="text-xs font-extrabold text-[#F2CA50] mt-0.5">
                ${p2.price} USD
              </p>
            </div>
            <Link
              href={`/productos/${p2.slug}`}
              className="p-2.5 rounded-xl glass-btn-gold flex items-center justify-center cursor-pointer"
              title="Ver producto"
            >
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* 4. Tarjeta Ancha Inferior Izquierda (6 cols x 1 row) */}
        <div className="md:col-span-6 md:row-span-1 relative group overflow-hidden rounded-[28px] glass-card-radical min-h-[270px]">
          <img
            src={getImg(p3)}
            alt={p3.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex justify-between items-end">
            <div>
              <span className="text-[#F2CA50] text-[10px] font-black uppercase tracking-widest block mb-1">
                Destacado Aldri Shop
              </span>
              <h4 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1">
                {p3.name}
              </h4>
              <p className="text-lg font-sans font-black text-[#F2CA50]">
                ${p3.price} USD
              </p>
            </div>
            <Link
              href={`/productos/${p3.slug}`}
              className="px-5 py-2.5 rounded-xl glass-btn-gold text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              Ver Producto
            </Link>
          </div>
        </div>

        {/* 5. Tarjeta Editorial de Pedidos Especiales (6 cols x 1 row) */}
        <div className="md:col-span-6 md:row-span-1 glass-card-radical rounded-[28px] p-6 sm:p-8 flex flex-col justify-center items-center text-center border-amber-400/40 shadow-[0_0_35px_rgba(212,175,55,0.15)] min-h-[270px] relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-3 text-[#F2CA50] border border-amber-400/30 shadow-[0_0_15px_rgba(242,202,80,0.25)]">
            <Sparkles size={22} className="text-[#F2CA50]" />
          </div>
          
          <h4 className="text-2xl font-serif font-bold text-white mb-2">
            Licencias Empresariales &amp; Pedidos a Medida
          </h4>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-md mb-5 leading-relaxed font-normal">
            ¿Necesitas licencias comerciales por volumen para tu agencia o asesoría sobre especificaciones de hardware? Te atendemos de inmediato.
          </p>

          <a
            href="https://wa.me/13467392730?text=Hola%2C%20me%20gustar%C3%ADa%20cotizar%20licencias%20o%20productos%20de%20Aldri%20Shop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 glass-btn-gold px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider cursor-pointer"
          >
            <MessageCircle size={15} className="text-black" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
