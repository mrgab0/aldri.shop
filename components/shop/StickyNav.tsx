"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/shop/LanguageSwitcher";
import { ThemeToggle } from "@/components/shop/ThemeToggle";
import dynamic from "next/dynamic";
import { MegaMenuDropdown } from "@/components/shop/MegaMenuDropdown";
import { Fingerprint, Instagram, Facebook, MessageCircle, ChevronDown, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

const CustomerBiometricModal = dynamic(
  () => import("@/components/auth/CustomerBiometricModal").then((m) => m.CustomerBiometricModal),
  { ssr: false }
);

interface StickyNavProps {
  siteConfig?: any;
}

export function StickyNav({ siteConfig }: StickyNavProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("nav");

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 180);
    };
    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const enableSocials = siteConfig?.enableHeaderSocials !== false;
  const instagramUrl = siteConfig?.instagramUrl || "https://www.instagram.com/";
  const facebookUrl = siteConfig?.facebookUrl || "https://www.facebook.com/";
  const tiktokUrl = siteConfig?.tiktokUrl || "https://tiktok.com/";
  const whatsappUrl = siteConfig?.whatsappUrl || "https://wa.me/";

  const navLinks = [
    { href: "/productos", label: t('catalog'), isMega: true },
    { href: "/rastreo", label: t('tracking') },
    { href: "/contacto", label: t('contact') },
    { href: "/checkout", label: t('cart') }
  ];

  return (
    <>
      <nav
        className={`w-full z-50 transition-all duration-300 border-b border-white/10 ${
          isSticky
            ? "fixed top-0 bg-[#08080C]/85 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] py-0 border-t-0"
            : "relative bg-[#08080C]/70 backdrop-blur-xl py-1 border-t border-white/5"
        }`}
      >
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 xl:gap-6 relative">
          
          {/* LADO IZQUIERDO: Logo de Aldri Shop */}
          <div className="flex items-center gap-4 py-2 flex-shrink-0 relative z-10">
            <Link href="/" className="flex items-center gap-3.5 group flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-[0_0_20px_rgba(212,175,55,0.25)] group-hover:scale-105 group-active:scale-95 transition-transform bg-[#0A0A0C] flex items-center justify-center flex-shrink-0 p-0.5">
                <img src="/logo.png" alt="Aldri Shop Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-serif font-black text-xl sm:text-2xl text-white tracking-tight flex-shrink-0 leading-tight">
                  Aldri <span className="text-[#F2CA50]">Shop</span>
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#F2CA50]/90">
                  Digital &amp; Lifestyle Tech
                </span>
              </div>
            </Link>

            {enableSocials && (
              <div className="hidden 2xl:flex items-center gap-2 ml-2 pl-3 border-l border-white/15">
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-300 hover:text-[#F2CA50] hover:-translate-y-0.5 active:scale-95 transition-all glass-pill rounded-lg" title="Instagram">
                    <Instagram size={15} />
                  </a>
                )}
                {facebookUrl && (
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-300 hover:text-[#F2CA50] hover:-translate-y-0.5 active:scale-95 transition-all glass-pill rounded-lg" title="Facebook">
                    <Facebook size={15} />
                  </a>
                )}
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-emerald-400 hover:text-emerald-300 hover:-translate-y-0.5 active:scale-95 transition-all glass-pill rounded-lg" title="WhatsApp Directo">
                    <MessageCircle size={15} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* CENTRO: Botones de Navegación Editorial Lujo */}
          <div 
            ref={scrollRef}
            className="hidden lg:flex flex-1 min-w-0 items-center justify-center overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden font-bold uppercase tracking-wider 2xl:tracking-[0.18em] px-2 relative z-0 h-full"
            onMouseLeave={() => setIsMegaMenuOpen(false)}
          >
            {navLinks.map((link, idx) => (
              <div 
                key={idx} 
                className="relative h-full flex items-center"
                onMouseEnter={() => link.isMega && setIsMegaMenuOpen(true)}
              >
                <Link 
                  href={link.href} 
                  className="px-4 xl:px-6 h-16 xl:h-20 flex items-center justify-center text-zinc-200 hover:text-[#F2CA50] border-b-2 border-transparent hover:border-[#F2CA50] transition-all duration-200 tracking-widest uppercase font-black text-xs xl:text-[13px] hover:bg-white/[0.03]"
                >
                  <span>{link.label}</span>
                  {link.isMega && (
                    <ChevronDown 
                      size={13} 
                      className={`ml-1 transition-transform duration-300 ${isMegaMenuOpen ? "rotate-180 text-[#F2CA50]" : ""}`} 
                    />
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* Mega Menú Flotante */}
          <div onMouseEnter={() => setIsMegaMenuOpen(true)} onMouseLeave={() => setIsMegaMenuOpen(false)}>
            <MegaMenuDropdown 
              isOpen={isMegaMenuOpen} 
              onClose={() => setIsMegaMenuOpen(false)} 
            />
          </div>

          {/* DERECHA: Controles Auxiliares y Menú Móvil */}
          <div className="flex items-center gap-2.5 flex-shrink-0 relative z-10">
            <button
              onClick={() => setIsBioModalOpen(true)}
              className="flex items-center gap-2 glass-pill text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-amber-400/30 hover:border-amber-400/60 shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_20px_rgba(242,202,80,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              title="Acceso con Huella / Face ID (Passkeys)"
            >
              <Fingerprint size={16} className="text-[#F2CA50] animate-pulse" />
              <span className="hidden 2xl:inline text-[11px] font-black uppercase tracking-wider text-[#F2CA50]">Biometría</span>
            </button>

            <div className="hover:-translate-y-0.5 active:scale-95 transition-all duration-200">
              <ThemeToggle />
            </div>
            
            <div className="hover:-translate-y-0.5 active:scale-95 transition-all duration-200">
              <LanguageSwitcher />
            </div>

            {/* Botón de Menú Móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl glass-pill text-white active:scale-95 transition-all"
              aria-label={isMobileMenuOpen ? "Contraer menú" : "Desplegar menú"}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* MENÚ MÓVIL DESPLEGABLE EN CRISTAL */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#0A0A0E]/95 backdrop-blur-2xl px-4 py-4 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl glass-card-radical text-white font-bold text-sm hover:border-amber-400/50 transition-all hover:text-[#F2CA50]"
                >
                  <span className="tracking-widest uppercase">{link.label}</span>
                  <span className="text-xs text-[#F2CA50]">→</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </nav>

      {isBioModalOpen && (
        <CustomerBiometricModal
          isOpen={isBioModalOpen}
          onClose={() => setIsBioModalOpen(false)}
        />
      )}
    </>
  );
}
