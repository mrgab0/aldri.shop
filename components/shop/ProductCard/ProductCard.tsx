"use client";

import Link from 'next/link';
import React from 'react';
import { useCart } from "@/components/shop/Cart/CartContext";
import { useTranslations } from "next-intl";
import { ShoppingBag, Sparkles } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  badge?: string;
  image: string;
  secondaryImage?: string;
  productType?: 'digital' | 'dropship';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  category,
  badge,
  image,
  secondaryImage,
  productType = 'digital'
}) => {
  const { addToCart } = useCart();
  const t = useTranslations("common");

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
    <div className="group relative bg-white dark:bg-[#161619] rounded-2xl transition-all duration-300 overflow-hidden border border-[#EAE4DC] dark:border-white/10 hover:border-[#D4AF37]/60 dark:hover:border-[#D4AF37]/50 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0px_12px_32px_rgba(0,0,0,0.15)] dark:hover:shadow-[0px_0px_24px_rgba(212,175,55,0.18)] hover:-translate-y-1 flex flex-col justify-between select-none">
      <Link
        href={`/productos/${slug}`}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        className="block relative select-none"
      >
        {/* Contenedor de Imagen con Zoom suave */}
        <div className="relative aspect-square overflow-hidden bg-[#FAF8F5] dark:bg-[#101013] p-2.5 flex items-center justify-center">
          <img
            src={optimizedMainImage}
            alt={name}
            loading="lazy"
            decoding="async"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className={`w-full h-full object-contain select-none pointer-events-none transform group-hover:scale-105 transition-all duration-700 ease-out ${
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
              className="absolute inset-0 w-full h-full object-contain p-2.5 select-none pointer-events-none transform scale-100 group-hover:scale-105 transition-all duration-700 ease-out opacity-0 group-hover:opacity-100"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          {/* Badge Flotante de Tipo de Producto */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md border ${
              productType === 'digital'
                ? "bg-[#4F46E5] text-white border-indigo-400/40"
                : "bg-emerald-600 text-white border-emerald-400/40"
            }`}>
              {productType === 'digital' ? '⚡ Digital 24/7' : '📦 Físico'}
            </span>
            <span className="bg-white/95 dark:bg-[#1A1A1F]/90 text-gray-800 dark:text-gray-200 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#EAE4DC] dark:border-white/10 shadow-sm w-fit">
              {category}
            </span>
          </div>

          {/* Insignia / Badge Personalizada */}
          {badge && (
            <div className="absolute top-3 right-3">
              <span className="bg-black/90 text-[#F2CA50] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md border border-[#D4AF37]/50 flex items-center gap-1 backdrop-blur-sm">
                <Sparkles size={10} className="text-[#F2CA50]" />
                {badge}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow bg-white dark:bg-[#161619]">
        <div>
          <h3 className="font-sans font-bold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-[#D4AF37] dark:group-hover:text-[#F2CA50] transition-colors mb-1 line-clamp-1">
            <Link
              href={`/productos/${slug}`}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            >
              {name}
            </Link>
          </h3>
          
          {/* Calificación de 5 estrellas estilo Stitch Luxury */}
          <div className="flex items-center text-[11px] text-[#D4AF37] mb-2">
            <span>★★★★★</span>
            <span className="text-gray-400 dark:text-zinc-500 ml-1.5 text-[10px] font-medium">(5.0)</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2.5 border-t border-[#EAE4DC] dark:border-white/10 mt-auto">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-400 block font-semibold">Precio</span>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white font-sans tracking-tight">${price.toFixed(2)} USD</span>
              {compareAtPrice && compareAtPrice > price ? (
                <span className="text-xs text-gray-400 dark:text-zinc-500 line-through">
                  ${compareAtPrice.toFixed(2)}
                </span>
              ) : null}
            </div>
          </div>

          <button 
            onClick={() => addToCart({ id, name, price, image, productType })}
            className="bg-gradient-to-r from-[#F2CA50] via-[#D4AF37] to-[#C5A059] hover:from-[#FFE088] hover:to-[#D4AF37] text-black px-3 sm:px-3.5 py-2 rounded-xl active:scale-95 transition-all duration-300 font-extrabold text-xs shadow-md hover:shadow-lg hover:shadow-amber-500/25 flex items-center gap-1.5 hover:scale-105 border border-amber-300/40 select-none"
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
