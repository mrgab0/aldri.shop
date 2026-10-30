"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, ArrowLeft, Fingerprint, Menu, X } from "lucide-react";
import { useCart } from "@/components/shop/Cart/CartContext";
import { LanguageSwitcher } from "@/components/shop/LanguageSwitcher";
import { ThemeToggle } from "@/components/shop/ThemeToggle";
import { CustomerBiometricModal } from "@/components/auth/CustomerBiometricModal";
import { useTranslations } from "next-intl";

export const ShopHeader = () => {
  const { cartItems } = useCart();
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations("nav");

  const navLinks = [
    { href: "/productos", label: t('catalog') },
    { href: "/rastreo", label: t('tracking') },
    { href: "/contacto", label: t('contact') }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#08080C]/85 backdrop-blur-2xl border-b border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] text-white transition-all select-none">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4 xl:gap-6 relative">
          {/* Logo Presionable hacia el Home */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0 relative z-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-[0_0_20px_rgba(212,175,55,0.25)] group-hover:scale-105 group-active:scale-95 transition-transform bg-[#0A0A0C] flex-shrink-0 flex items-center justify-center p-0.5">
              <img src="/logo.png" alt="Aldri Shop Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="hidden xl:block flex-shrink-0">
              <span className="text-lg font-serif font-black text-white tracking-tight group-hover:text-[#F2CA50] transition-colors block">
                Aldri <span className="text-[#F2CA50]">Shop</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#F2CA50]/90 font-bold block -mt-0.5">
                Digital &amp; Lifestyle Tech
              </span>
            </div>
          </Link>

          {/* Navegación Central (Escritorio) */}
          <nav className="hidden lg:flex flex-1 min-w-0 items-center justify-center overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden font-bold text-[11px] xl:text-xs uppercase tracking-wider 2xl:tracking-[0.15em] px-2 gap-1.5 xl:gap-2 2xl:gap-3 py-2 relative z-0">
            {navLinks.map((link, idx) => (
              <Link 
                key={idx}
                href={link.href} 
                className="px-2.5 xl:px-3.5 2xl:px-4 py-1.5 xl:py-2 2xl:py-2.5 rounded-full glass-pill text-zinc-300 hover:text-[#F2CA50] hover:border-[#F2CA50]/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Acciones Derecha (Acceso por Huella, Tema, Idioma, Carrito y Toggle Móvil) */}
          <div className="flex items-center gap-2 flex-shrink-0 relative z-10">
            {/* Botón de Acceso Biométrico / Passkeys con Huella */}
            <button
              onClick={() => setIsBioModalOpen(true)}
              className="flex items-center gap-1.5 glass-pill text-zinc-200 border border-white/15 hover:border-[#F2CA50]/50 hover:text-white px-2.5 xl:px-3 py-2 rounded-full text-xs font-bold hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
              title="Acceso con Huella / Face ID"
            >
              <Fingerprint size={16} className="text-[#F2CA50]" />
              <span className="hidden 2xl:inline text-[11px]">Huella 👆</span>
            </button>

            <div className="hover:-translate-y-0.5 active:scale-95 transition-all duration-300">
              <ThemeToggle />
            </div>
            <div className="hover:-translate-y-0.5 active:scale-95 transition-all duration-300">
              <LanguageSwitcher />
            </div>

            {/* Cart Button indicator con gradiente Champagne Gold */}
            <div className="relative ml-1">
              <Link
                href="/checkout"
                className="flex items-center gap-1.5 xl:gap-2 bg-gradient-to-r from-[#F2CA50] via-[#D4AF37] to-[#C5A059] hover:from-[#FFE088] hover:to-[#D4AF37] text-black px-3.5 xl:px-5 py-2 2xl:py-2.5 rounded-full font-extrabold text-xs shadow-md hover:shadow-lg hover:shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all border border-amber-300/40 select-none"
              >
                <ShoppingCart size={18} className="text-black" />
                <span className="hidden 2xl:inline">Carrito</span>
                {totalCount > 0 && (
                  <span className="bg-black text-[#F2CA50] text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                    {totalCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Botón Toggle de Menú Móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full glass-pill text-white border border-white/15 hover:border-[#F2CA50]/50 active:scale-95 transition-all"
              aria-label={isMobileMenuOpen ? "Contraer menú" : "Desplegar menú"}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* MENÚ MÓVIL DESPLEGABLE EN MATERIAL GLASS */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#08080C]/95 backdrop-blur-2xl px-4 py-4 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl glass-pill text-white font-bold text-sm active:scale-[0.98] transition-all hover:border-[#F2CA50]/40 hover:text-[#F2CA50]"
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-[#F2CA50]">→</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Modal Biométrico */}
      <CustomerBiometricModal
        isOpen={isBioModalOpen}
        onClose={() => setIsBioModalOpen(false)}
      />
    </>
  );
};
