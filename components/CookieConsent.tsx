"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ChevronDown, ChevronUp, Lock, Globe2, Sparkles, Check } from "lucide-react";

export const CookieConsent = () => {
  const pathname = usePathname();
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    const consent = localStorage.getItem("aldri_cookie_consent_v3");
    if (!consent) {
      setShowConsent(true);
    }
  }, [pathname]);

  const acceptAll = () => {
    localStorage.setItem(
      "aldri_cookie_consent_v3",
      JSON.stringify({
        accepted: true,
        timestamp: new Date().toISOString(),
        scope: "all",
        jurisdictions: ["GDPR", "CCPA_CPRA", "LATAM_LGPD", "JAPAN_APPI"],
      })
    );
    setShowConsent(false);
  };

  const acceptEssential = () => {
    localStorage.setItem(
      "aldri_cookie_consent_v3",
      JSON.stringify({
        accepted: true,
        timestamp: new Date().toISOString(),
        scope: "essential",
        jurisdictions: ["GDPR", "CCPA_CPRA", "LATAM_LGPD", "JAPAN_APPI"],
      })
    );
    setShowConsent(false);
  };

  if (pathname?.startsWith("/admin") || !showConsent) return null;

  return (
    <div
      role="region"
      aria-label="Consentimiento de Cookies y Privacidad"
      className="fixed bottom-0 left-0 right-0 z-[120] bg-[#0A0A0E]/95 backdrop-blur-2xl text-white p-4 sm:p-6 shadow-[0_-12px_45px_rgba(0,0,0,0.8)] border-t border-[#F2CA50]/30 text-xs animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-400/20 text-[#F2CA50] border border-[#F2CA50]/40 flex items-center justify-center">
                <ShieldCheck size={16} />
              </span>
              <h3 className="font-serif font-black text-sm text-white tracking-wide flex items-center gap-2">
                Privacidad Global &amp; Cookies
              </h3>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                  🇪🇺 GDPR / RGPD
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                  🇺🇸 CCPA / CPRA
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                  🌎 LATAM (LGPD • LFPDPPP)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-[#F2CA50] border border-[#F2CA50]/30">
                  🇯🇵 APPI (個人情報保護法)
                </span>
              </div>
            </div>

            <p className="text-zinc-300 text-xs leading-relaxed">
              En <strong>Aldri Shop</strong> respetamos tus datos personales bajo los más altos estándares internacionales de privacidad (Unión Europea, Estados Unidos, América Latina y Ley APPI de Japón). Utilizamos cookies esenciales para el funcionamiento de la tienda y cookies opcionales para telemetría anónima y atribución de comisiones de afiliados. Puedes consultar tus derechos o revocar tu consentimiento en cualquier momento en nuestra{" "}
              <Link href="/privacidad" className="text-[#F2CA50] underline underline-offset-4 hover:text-white font-bold">
                Política de Privacidad Integral
              </Link>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end shrink-0">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="text-zinc-400 hover:text-white text-xs font-semibold underline underline-offset-4 flex items-center gap-1 px-3 py-2 cursor-pointer"
            >
              <span>{showDetails ? "Ocultar detalles" : "Detalles legales"}</span>
              {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <button
              type="button"
              onClick={acceptEssential}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-zinc-200 border border-white/15 transition-all cursor-pointer active:scale-95"
            >
              Solo Esenciales
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="glass-btn-gold text-[#060608] px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
            >
              Aceptar Todo y Continuar
            </button>
          </div>
        </div>

        {/* Desglose detallado explícito con cobertura legal estricta */}
        {showDetails && (
          <div className="p-4 sm:p-5 bg-black/60 rounded-2xl border border-white/10 text-xs text-zinc-300 space-y-3 mt-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-[#F2CA50] font-bold text-xs uppercase tracking-wider">
              <Lock size={14} /> Desglose de Finalidades y Derechos del Titular:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="font-bold text-white block">1. Cookies Esenciales</span>
                <p className="text-zinc-400">
                  Gestión del carrito de compras, token de sesión segura y prevención de ataques CSRF. No pueden desactivarse.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="font-bold text-white block">2. Atribución de Afiliados (30 Días)</span>
                <p className="text-zinc-400">
                  Tag anónimo para remunerar al embajador o vendedor que te recomendó nuestro catálogo, sin almacenar datos sensibles.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="font-bold text-white block">3. Telemetría y Analítica</span>
                <p className="text-zinc-400">
                  Métricas anónimas para evaluar velocidad de carga, páginas más visitadas y prevenir fraudes transaccionales.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="font-bold text-white block">4. Transferencia APPI Japón &amp; GDPR</span>
                <p className="text-zinc-400">
                  Consentimiento explícito para el procesamiento en infraestructura en la nube segura con cifrado TLS 1.3 y AES-256.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400">
              <span>
                Derechos ARCO / No venta de datos: No vendemos ni compartimos tu información personal con terceros para publicidad dirigida.
              </span>
              <Link href="/privacidad" className="text-[#F2CA50] hover:underline font-bold">
                Leer Política Completa →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
