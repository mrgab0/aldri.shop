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
    <section className="container mx-auto px-4 sm:px-6 py-14 sm:py-20 relative z-20">
      {/* Encabezado Editorial Stitch */}
      <div className="text-center mb-10 sm:mb-14">
        <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.25em] inline-flex items-center gap-1.5 mb-2">
          <Sparkles size={13} className="text-[#D4AF37]" />
          Colección Curada
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">
          Activos Digitales &amp; Gadgets en Tendencia
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400 max-w-xl mx-auto mt-3 font-normal">
          Selección de herramientas digitales de alta demanda con descarga inmediata y productos físicos con tracking verificado.
        </p>
      </div>

      {/* Bento Grid Editorial Stitch CRO */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 auto-rows-auto md:auto-rows-[310px]">
        {/* 1. Elemento Principal Grande (8 cols x 2 rows) */}
        <div className="md:col-span-8 md:row-span-2 relative group overflow-hidden rounded-3xl bg-white dark:bg-[#161619] shadow-xl border border-[#EAE4DC] dark:border-white/10 hover:border-[#D4AF37]/60 transition-all duration-500 min-h-[420px] md:min-h-full">
          <img
            src={getImg(p0)}
            alt={p0.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300" />
          
          <div className="absolute top-5 left-5">
            <span className="bg-gradient-to-r from-[#F2CA50] via-[#D4AF37] to-[#C5A059] text-black text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
              Colección Estrella
            </span>
          </div>

          <div className="absolute bottom-0 left-0 p-6 sm:p-10 w-full text-white">
            <h3 className="text-2xl sm:text-4xl font-serif font-bold mb-2 drop-shadow-md text-white">
              {p0.name}
            </h3>
            <p className="text-xl sm:text-2xl font-sans font-bold text-[#F2CA50] mb-5">
              ${p0.price} <span className="text-xs text-zinc-300 font-sans tracking-normal uppercase font-semibold">USD</span>
            </p>
            <Link
              href={`/productos/${p0.slug}`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F2CA50] via-[#D4AF37] to-[#C5A059] text-black font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              <span>Ver Detalles</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 2. Tarjeta Mediana Superior Derecha (4 cols x 1 row) */}
        <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden rounded-3xl bg-white dark:bg-[#161619] shadow-md border border-[#EAE4DC] dark:border-white/10 hover:border-[#D4AF37]/60 transition-all min-h-[280px]">
          <img
            src={getImg(p1)}
            alt={p1.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

          <div className="absolute bottom-0 left-0 right-0 p-5 bg-white/95 dark:bg-[#161619]/95 backdrop-blur-md border-t border-[#EAE4DC] dark:border-white/10 flex justify-between items-center">
            <div>
              <h4 className="font-serif font-bold text-gray-900 dark:text-white text-sm line-clamp-1">
                {p1.name}
              </h4>
              <p className="text-xs font-bold text-[#D4AF37]">
                ${p1.price} USD
              </p>
            </div>
            <Link
              href={`/productos/${p1.slug}`}
              className="p-2.5 rounded-xl bg-[#0A0A0C] text-[#F2CA50] dark:bg-white/10 dark:text-white hover:bg-[#D4AF37] hover:text-black transition-colors"
              title="Ver producto"
            >
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* 3. Tarjeta Mediana Inferior Derecha (4 cols x 1 row) */}
        <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden rounded-3xl bg-white dark:bg-[#161619] shadow-md border border-[#EAE4DC] dark:border-white/10 hover:border-[#D4AF37]/60 transition-all min-h-[280px]">
          <img
            src={getImg(p2)}
            alt={p2.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

          <div className="absolute bottom-0 left-0 right-0 p-5 bg-white/95 dark:bg-[#161619]/95 backdrop-blur-md border-t border-[#EAE4DC] dark:border-white/10 flex justify-between items-center">
            <div>
              <h4 className="font-serif font-bold text-gray-900 dark:text-white text-sm line-clamp-1">
                {p2.name}
              </h4>
              <p className="text-xs font-bold text-[#D4AF37]">
                ${p2.price} USD
              </p>
            </div>
            <Link
              href={`/productos/${p2.slug}`}
              className="p-2.5 rounded-xl bg-[#0A0A0C] text-[#F2CA50] dark:bg-white/10 dark:text-white hover:bg-[#D4AF37] hover:text-black transition-colors"
              title="Ver producto"
            >
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* 4. Tarjeta Ancha Inferior Izquierda (6 cols x 1 row) */}
        <div className="md:col-span-6 md:row-span-1 relative group overflow-hidden rounded-3xl bg-white dark:bg-[#161619] shadow-md border border-[#EAE4DC] dark:border-white/10 hover:border-[#D4AF37]/60 transition-all min-h-[260px]">
          <img
            src={getImg(p3)}
            alt={p3.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex justify-between items-end">
            <div>
              <span className="text-[#F2CA50] text-[10px] font-bold uppercase tracking-widest block mb-1">
                Destacado Aldri Shop
              </span>
              <h4 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1">
                {p3.name}
              </h4>
              <p className="text-lg font-sans font-bold text-[#F2CA50]">
                ${p3.price} USD
              </p>
            </div>
            <Link
              href={`/productos/${p3.slug}`}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F2CA50] to-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-md"
            >
              Ver Producto
            </Link>
          </div>
        </div>

        {/* 5. Tarjeta Editorial de Pedidos Especiales (6 cols x 1 row) */}
        <div className="md:col-span-6 md:row-span-1 bg-white dark:bg-[#161619] rounded-3xl p-6 sm:p-8 flex flex-col justify-center items-center text-center shadow-md border border-dashed border-[#D4AF37]/60 min-h-[260px] relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-3 text-[#D4AF37] border border-amber-500/20 shadow-sm">
            <Sparkles size={22} className="text-[#D4AF37]" />
          </div>
          
          <h4 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
            Licencias Empresariales &amp; Pedidos a Medida
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 max-w-md mb-5 leading-relaxed font-normal">
            ¿Necesitas licencias comerciales por volumen para tu agencia o asesoría sobre especificaciones de hardware? Te atendemos de inmediato.
          </p>

          <a
            href="https://wa.me/13467392730?text=Hola%2C%20me%20gustar%C3%ADa%20cotizar%20licencias%20o%20productos%20de%20Aldri%20Shop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F2CA50] via-[#D4AF37] to-[#C5A059] text-black px-6 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105 active:scale-95"
          >
            <MessageCircle size={15} className="text-black" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
