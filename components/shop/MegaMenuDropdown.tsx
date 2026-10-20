"use client";

import Link from "next/link";
import { Download, Sparkles, Truck, ShieldCheck, ArrowRight, Laptop, Headphones, Compass, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

interface MegaMenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenuDropdown({ isOpen, onClose }: MegaMenuDropdownProps) {
  const t = useTranslations("nav");

  if (!isOpen) return null;

  const digitalCategories = [
    { name: "Plantillas Notion Pro", href: "/productos?cat=notion", icon: FileText, badge: "Popular" },
    { name: "LUTs & Presets Cinematográficos", href: "/productos?cat=luts", icon: Sparkles },
    { name: "Licencias de Software & VPN", href: "/productos?cat=licencias", icon: ShieldCheck, badge: "Top" },
    { name: "Kits de Productividad & Diseño", href: "/productos?cat=productividad", icon: Laptop },
  ];

  const dropshippingCategories = [
    { name: "Accesorios EDC & Multiherramientas", href: "/productos?cat=edc", icon: Compass, badge: "Trending" },
    { name: "Audio Hi-Fi & Auriculares", href: "/productos?cat=audio", icon: Headphones },
    { name: "Desk Setup & Estaciones de Carga", href: "/productos?cat=desk", icon: Laptop, badge: "HOT" },
    { name: "Gadgets de Viaje & Organización", href: "/productos?cat=gadgets", icon: Truck },
  ];

  const services = [
    { name: "Descarga Inmediata 24/7", href: "/rastreo", tag: "Instantáneo" },
    { name: "Seguimiento 17Track en Vivo", href: "/rastreo", tag: "Global" },
    { name: "Garantía de Reembolso", href: "/nosotros", tag: "Seguro" },
    { name: "Soporte Técnico Directo", href: "/contacto", tag: "24h" },
  ];

  return (
    <div 
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[92vw] max-w-5xl bg-white/95 dark:bg-[#12131A]/95 backdrop-blur-2xl rounded-3xl border border-[#D4AF37]/30 dark:border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6 sm:p-8 z-50 transition-all duration-300 animate-in fade-in slide-in-from-top-3"
      onMouseLeave={onClose}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Columna 1: Activos Digitales */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#D4AF37]/20 pb-2">
            <Download size={16} className="text-[#D4AF37]" />
            <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-stone-900 dark:text-white">
              Activos Digitales
            </h4>
          </div>
          <ul className="space-y-2.5">
            {digitalCategories.map((item, idx) => {
              const Icon = item.icon;
              return (
                <li key={idx}>
                  <Link 
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-gray-300 hover:text-[#D4AF37] p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-gray-800/60 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Icon size={14} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[#D4AF37] dark:text-[#F2CA50] border border-stone-200 dark:border-stone-700">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Columna 2: Hardware & Gadgets */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#D4AF37]/20 pb-2">
            <Truck size={16} className="text-[#D4AF37]" />
            <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-stone-900 dark:text-white">
              Gadgets &amp; Hardware
            </h4>
          </div>
          <ul className="space-y-2.5">
            {dropshippingCategories.map((item, idx) => {
              const Icon = item.icon;
              return (
                <li key={idx}>
                  <Link 
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-gray-300 hover:text-[#D4AF37] p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-gray-800/60 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Icon size={14} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${item.badge === "HOT" ? "bg-amber-600 text-white" : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Columna 3: Servicios & Compromiso */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#D4AF37]/20 pb-2">
            <ShieldCheck size={16} className="text-[#D4AF37]" />
            <h4 className="font-serif font-bold text-sm tracking-wider uppercase text-stone-900 dark:text-white">
              Garantías Aldri
            </h4>
          </div>
          <ul className="space-y-2.5">
            {services.map((item, idx) => (
              <li key={idx}>
                <Link 
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-gray-300 hover:text-[#D4AF37] p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-gray-800/60 transition-all"
                >
                  <span>⚡ {item.name}</span>
                  {item.tag && (
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/10 text-[#D4AF37] dark:text-[#F2CA50] border border-amber-500/30">
                      {item.tag}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna 4: Banner Visual de Oferta / Destacado */}
        <div className="relative rounded-2xl overflow-hidden group bg-gradient-to-br from-[#121215] via-[#1A1A1F] to-[#0A0A0C] p-5 text-white flex flex-col justify-between shadow-lg border border-[#D4AF37]/40">
          <div className="relative z-10 space-y-2">
            <span className="inline-block bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#F2CA50]">
              ⚡ Pack Destacado
            </span>
            <h5 className="font-serif font-bold text-base leading-snug text-white">
              Creator OS & LUTs Cinematográficos
            </h5>
            <p className="text-[11px] text-stone-300 font-medium">
              Licencia comercial completa y descarga instantánea.
            </p>
          </div>

          <Link
            href="/productos"
            onClick={onClose}
            className="mt-4 relative z-10 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#F2CA50] via-[#D4AF37] to-[#C5A059] hover:from-[#FFE088] hover:to-[#D4AF37] text-black px-4 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all shadow-md hover:shadow-amber-500/25 active:scale-95 border border-amber-300/40 select-none"
          >
            <span>Ver Catálogo Completo</span>
            <ArrowRight size={13} className="text-black" />
          </Link>
        </div>

      </div>
    </div>
  );
}
