"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Instagram, Facebook, CheckCircle2 } from "lucide-react";

interface FooterProps {
  siteConfig?: any;
}

export function Footer({ siteConfig }: FooterProps) {
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailSubscribed(true);
    }
  };

  const instagramUrl = siteConfig?.instagramUrl || "https://www.instagram.com/";
  const facebookUrl = siteConfig?.facebookUrl || "https://www.facebook.com/";

  return (
    <footer className="bg-[#060608] text-zinc-300 pt-16 pb-10 border-t border-white/10 text-xs select-none relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Fila Principal: Horarios y Suscripción al Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-12 border-b border-white/10">
          
          {/* Horarios de Operación */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-[#0A0A0C] border border-[#F2CA50]/50 flex items-center justify-center flex-shrink-0 p-0.5">
                <img src="/logo.png" alt="Aldri Shop Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <h3 className="font-black text-white text-xs uppercase tracking-wider font-serif">
                Aldri Shop &bull; Atención &amp; Entrega
              </h3>
            </div>
            <p className="text-zinc-400 leading-relaxed text-xs font-normal">
              ⚡ <strong>Descargas Digitales:</strong> Disponibles de forma inmediata 24/7/365 en todo el mundo.<br />
              📦 <strong>Envíos Físicos:</strong> Procesamiento en 24-48h con carrier y tracking internacional.<br />
              💬 <strong>Soporte al Cliente:</strong> Lunes a Sábado de 9:00 AM a 6:00 PM.
            </p>
            <p className="mt-3 text-[11px] text-[#F2CA50] font-bold tracking-wide">
              Distribución Global Digital &amp; Física
            </p>
          </div>

          {/* Formulario de Suscripción */}
          <div>
            <h3 className="font-black text-white text-xs uppercase tracking-wider mb-3 font-serif">
              Suscríbete a nuestro boletín
            </h3>
            <p className="text-zinc-400 text-xs mb-3 font-normal">
              Recibe notificaciones de nuevos activos digitales, ofertas especiales y gadgets en tendencia.
            </p>

            {emailSubscribed ? (
              <div className="flex items-center gap-2 text-emerald-300 bg-emerald-950/40 p-3 rounded-xl text-xs font-bold border border-emerald-500/30">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>¡Gracias por suscribirte a Aldri Shop!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
                <label className="sr-only" htmlFor="footer-email">
                  Email address
                </label>
                <input
                  type="email"
                  id="footer-email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Tu correo electrónico"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#F2CA50] rounded-xl font-medium"
                />
                <button
                  type="submit"
                  className="glass-btn-gold text-black px-6 py-3 text-xs font-black uppercase tracking-wider transition-all shadow-md shrink-0 rounded-xl cursor-pointer"
                >
                  Suscribirse
                </button>
              </form>
            )}

            {/* Redes Sociales Oficiales */}
            <div className="flex items-center space-x-3 mt-6 text-zinc-400">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="glass-pill p-2.5 rounded-full hover:text-[#F2CA50] hover:border-[#F2CA50]/40 transition-all"
              >
                <Facebook size={16} />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="glass-pill p-2.5 rounded-full hover:text-[#F2CA50] hover:border-[#F2CA50]/40 transition-all"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Insignias de Métodos de Pago Aceptados con Máximo Contraste */}
        <div className="py-6 flex flex-wrap justify-center items-center gap-2">
          {/* AMEX */}
          <span className="inline-flex items-center justify-center px-2.5 py-1 bg-[#0E0E12] border border-white/10 rounded text-[10px] font-black text-[#007AC1] shadow-sm">
            AMEX
          </span>
          {/* Apple Pay */}
          <span className="inline-flex items-center justify-center px-2.5 py-1 bg-[#0E0E12] border border-white/10 rounded text-[10px] font-black text-white shadow-sm">
            Pay
          </span>
          {/* Google Pay */}
          <span className="inline-flex items-center justify-center px-2.5 py-1 bg-[#0E0E12] border border-white/10 rounded text-[10px] font-black text-white shadow-sm">
            G Pay
          </span>
          {/* Mastercard */}
          <span className="inline-flex items-center justify-center px-2.5 py-1 bg-[#0E0E12] border border-white/10 rounded text-[10px] font-black text-[#EB001B] shadow-sm">
            Mastercard
          </span>
          {/* PayPal */}
          <span className="inline-flex items-center justify-center px-2.5 py-1 bg-[#0E0E12] border border-white/10 rounded text-[10px] font-black text-[#003087] shadow-sm">
            PayPal
          </span>
          {/* Discover */}
          <span className="inline-flex items-center justify-center px-2.5 py-1 bg-[#0E0E12] border border-white/10 rounded text-[10px] font-black text-[#FF6000] shadow-sm">
            Discover
          </span>
          {/* Shop Pay */}
          <span className="inline-flex items-center justify-center px-2.5 py-1 bg-[#5A31F4] rounded text-[10px] font-black !text-white shadow-sm" style={{ color: '#FFFFFF' }}>
            shop Pay
          </span>
          {/* Visa */}
          <span className="inline-flex items-center justify-center px-2.5 py-1 bg-[#0E0E12] border border-white/10 rounded text-[10px] font-black text-[#1A1F71] italic shadow-sm">
            VISA
          </span>
          {/* Zelle */}
          <span className="inline-flex items-center justify-center px-2.5 py-1 bg-[#0E0E12] border border-white/10 rounded text-[10px] font-black text-[#7414CA] shadow-sm">
            Zelle
          </span>
        </div>

        {/* Copyright y Enlaces Legales */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-y-2 text-[11px] text-zinc-400 text-center font-medium pt-2 border-t border-white/10">
          <span>
            © {new Date().getFullYear()}, Aldri Shop. Todos los derechos reservados.
          </span>
          <span className="hidden sm:inline mx-2 text-zinc-600">·</span>
          <div className="flex flex-wrap justify-center gap-x-3 text-zinc-400">
            <Link className="text-zinc-400 hover:text-[#F2CA50] font-medium transition-colors" href="/contacto">
              Contacto
            </Link>
            <span className="text-zinc-600">·</span>
            <Link className="text-zinc-400 hover:text-[#F2CA50] font-medium transition-colors" href="/nosotros">
              Nosotros
            </Link>
            <span className="text-zinc-600">·</span>
            <Link className="text-zinc-400 hover:text-[#F2CA50] font-medium transition-colors" href="/productos">
              Catálogo
            </Link>
            <span className="text-zinc-600">·</span>
            <Link className="text-zinc-400 hover:text-[#F2CA50] font-medium transition-colors" href="/rastreo">
              Rastreo y Descargas
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
