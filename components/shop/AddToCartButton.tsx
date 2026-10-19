"use client";

import { useCart } from "@/components/shop/Cart/CartContext";
import { useTranslations } from "next-intl";
import { ShoppingBag } from "lucide-react";

export const AddToCartButton = ({ product }: { product: any }) => {
  const { addToCart } = useCart();
  const t = useTranslations("ProductDetail");

  return (
    <button 
      onClick={() => addToCart({ 
        id: product._id.toString(), 
        name: product.name, 
        price: product.price, 
        image: product.images[0],
        addons: product.selectedAddons
      })}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#F2CA50] via-[#D4AF37] to-[#C5A059] text-black px-10 py-4 rounded-full font-extrabold text-sm sm:text-base uppercase tracking-wider hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105 active:scale-95 border border-amber-300/40"
    >
      <ShoppingBag size={18} className="text-black" />
      <span>{t('addToCart')}</span>
    </button>
  );
};
