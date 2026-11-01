"use client";

import Link from 'next/link';
import React from 'react';
import { useCart } from "@/components/shop/Cart/CartContext";
import { useTranslations, useLocale } from "next-intl";
import { ShoppingBag, Sparkles } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  nameEn?: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  categoryEn?: string;
  badge?: string;
  badgeEn?: string;
  image: string;
  secondaryImage?: string;
  productType?: 'digital' | 'dropship';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  nameEn,
  slug,
  price,
  compareAtPrice,
  category,
  categoryEn,
  badge,
  badgeEn,
  image,
  secondaryImage,
  productType = 'digital'
}) => {
  const { addToCart } = useCart();
  const t = useTranslations("common");
  const locale = useLocale();
  const isEn = locale === 'en';

  const displayName = (isEn && nameEn) ? nameEn : name;
  const displayCategory = (isEn && categoryEn) ? categoryEn : category;
  const displayBadge = (isEn && badgeEn) ? badgeEn : badge;

  const optimizeImageUrl = (url: string) => {
    if (!url) return "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&q=80&auto=format";
    if (url.includes("ik.imagekit.io") && !url.includes("tr=")) {
      return url.includes("?") ? `${url}&tr=w-400,q-80,f-auto` : `${url}?tr=w-400,q-80,f-auto`;
    }
    if (url.includes("images.unsplash.com") && !url.includes("w=")) {
      return `${url}${url.includes("?") ? "&" : "?"}w=400&q=80&auto=format`;
    }
    return url;
  };

  const optimizedMainImage = optimizeImageUrl(image);
  const optimizedSecondaryImage = secondaryImage ? optimizeImageUrl(secondaryImage) : undefined;

  return (
    <div className="group relative glass-card-radical rounded-3xl overflow-hidden flex flex-col justify-between select-none">
      <Link
        href={`/productos/${slug}`}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        className="block relative select-none"
      >
        {/* Contenedor de Imagen con Pedestal de Estudio en Cristal */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-[#121218]/70 to-[#07070A]/90 p-3 flex items-center justify-center border-b border-white/10">
          <img
            src={optimizedMainImage}
            alt={name}
            loading="lazy"
            decoding="async"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className={`w-full h-full object-contain select-none pointer-events-none transform group-hover:scale-110 transition-all duration-700 ease-out drop-shadow-md ${
              optimizedSecondaryImage ? 'group-hover:opacity-0' : ''
            }`}
          />
          {optimizedSecondaryImage && (
            <img
              src={optimizedSecondaryImage}
              alt={`${name} - alternativa`}
              loading="lazy"
              decoding="async"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              className="absolute inset-0 w-full h-full object-contain p-3 select-none pointer-events-none transform scale-100 group-hover:scale-110 transition-all duration-700 ease-out opacity-0 group-hover:opacity-100 drop-shadow-md"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          {/* Badge Flotante de Tipo de Producto en Cápsula Translúcida */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-lg border ${
              productType === 'digital'
                ? "bg-indigo-950/80 text-indigo-200 border-indigo-400/40 shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                : "bg-emerald-950/80 text-emerald-200 border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            }`}>
              {productType === 'digital' ? (isEn ? '⚡ Digital 24/7' : '⚡ Digital 24/7') : (isEn ? '📦 US/Global Tracked' : '📦 Físico Rastreado')}
            </span>
            <span className="glass-pill text-zinc-300 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest w-fit">
              {displayCategory}
            </span>
          </div>

          {/* Insignia / Badge Personalizada */}
          {displayBadge && (
            <div className="absolute top-3 right-3 z-10">
              <span className="glass-btn-gold text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Sparkles size={9} className="text-black" />
                {displayBadge}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow bg-transparent">
        <div>
          <h3 className="font-sans font-bold text-sm sm:text-base text-white group-hover:text-[#F2CA50] transition-colors mb-1.5 line-clamp-1">
            <Link
              href={`/productos/${slug}`}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            >
              {displayName}
            </Link>
          </h3>
          
          {/* Calificación de 5 estrellas estilo Stitch Luxury */}
          <div className="flex items-center text-[11px] text-[#F2CA50] mb-3">
            <span className="tracking-wide">★★★★★</span>
            <span className="text-zinc-400 ml-1.5 text-[10px] font-semibold">(5.0)</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-white/10 mt-auto">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 block font-bold">Precio</span>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-black text-[#F2CA50] font-sans tracking-tight drop-shadow-[0_0_10px_rgba(242,202,80,0.3)]">
                ${price.toFixed(2)} <span className="text-[10px] text-zinc-300 font-bold">USD</span>
              </span>
              {compareAtPrice && compareAtPrice > price ? (
                <span className="text-xs text-zinc-500 line-through">
                  ${compareAtPrice.toFixed(2)}
                </span>
              ) : null}
            </div>
          </div>

          <button 
            onClick={() => addToCart({ id, name, price, image, productType })}
            className="glass-btn-gold px-3 sm:px-3.5 py-2 rounded-xl active:scale-95 transition-all duration-300 font-black text-xs flex items-center gap-1.5 select-none cursor-pointer"
            title="Añadir al Carrito"
          >
            <ShoppingBag size={13} className="text-black" />
            <span className="hidden sm:inline">{t('addToCart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
