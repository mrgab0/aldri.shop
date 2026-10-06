"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ShieldCheck, ChevronDown, ChevronUp, Lock } from "lucide-react";

export const CookieConsent = () => {
  const pathname = usePathname();
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    const consent = localStorage.getItem("aldri_cookie_consent_v2");
    if (!consent) {
      setShowConsent(true);
    }
  }, [pathname]);

  const acceptAll = () => {
    localStorage.setItem("aldri_cookie_consent_v2", JSON.stringify({
      accepted: true,
      timestamp: new Date().toISOString(),
      scope: "all"
    }));
    setShowConsent(false);
  };

  const acceptEssential = () => {
    localStorage.setItem("aldri_cookie_consent_v2", JSON.stringify({
      accepted: true,
      timestamp: new Date().toISOString(),
      scope: "essential"
    }));
    setShowConsent(false);
  };

  if (pathname?.startsWith("/admin") || !showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[120] bg-stone-950/95 backdrop-blur-xl text-white p-4 sm:p-6 shadow-[0_-10px_35px_rgba(0,0,0,0.6)] border-t border-indigo-500/30 text-xs animate-in slide-in-from-bottom-5 duration-300">
      <div className="max-w-7xl mx-auto space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-indigo-900/60 text-indigo-400 border border-indigo-500/30">
                <ShieldCheck size={16} />
              </span>
              <h3 className="font-bold text-sm text-white tracking-wide">
                Aviso de Privacidad, Recopilación de Datos y Cookies (GDPR • CCPA/CPRA • LATAM)
              </h3>
            </div>
            <p className="text-stone-300 text-[11px] sm:text-xs leading-relaxed">
              En <strong>Aldri Shop</strong> recopilamos y procesamos datos técnicos, telemetría y transcripciones de interacciones (incluyendo consultas en el Asistente Virtual IA, identificadores de dispositivo, dirección IP y datos de contacto como correo o teléfono suministrados voluntariamente). 
              Esta información es almacenada en base de datos segura para personalizar tu experiencia, optimizar pedidos y con fines de <strong>prospección y marketing comercial directo (campañas por correo electrónico, notificaciones de WhatsApp y contacto telefónico comercial)</strong>, conforme a las normativas de la Unión Europea (GDPR), Estados Unidos (CCPA/CPRA) y legislaciones de protección de datos de Latinoamérica.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="text-stone-400 hover:text-white text-[11px] font-semibold underline underline-offset-4 flex items-center gap-1 px-2 py-1"
            >
              <span>{showDetails ? "Ocultar detalles" : "Ver detalles legales"}</span>
              {showDetails ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            <button
              type="button"
              onClick={acceptEssential}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border border-stone-700"
            >
              Solo Esenciales
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all active:scale-95 border border-indigo-400/40"
            >
              Aceptar Todo y Continuar
            </button>
          </div>
        </div>

        {/* Desglose detallado explícito */}
        {showDetails && (
          <div className="p-4 bg-stone-900/90 rounded-2xl border border-white/10 text-[11px] text-stone-300 space-y-2 mt-2">
            <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Lock size={12} /> Desglose de Datos Recopilados y Derechos del Titular:
            </div>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Datos Técnicos:</strong> Dirección IP anonimizada/hasheada, tipo de navegador, sistema operativo y eventos de navegación (páginas visitadas, carritos y checkout).</li>
              <li><strong>Interacciones en Asistente IA & Leads:</strong> Las preguntas, productos consultados y datos de contacto suministrados (número telefónico, WhatsApp, email o nombre) se registran en base de datos para brindar soporte continuo y remarketing.</li>
              <li><strong>Finalidad Comercial:</strong> Envío de promociones especiales, seguimiento de carritos pendientes, ofertas personalizadas vía WhatsApp, correo electrónico y eventuales llamadas comerciales de asesoría.</li>
              <li><strong>Ejercicio de Derechos (ARCO/GDPR):</strong> Puedes solicitar en cualquier momento la consulta, rectificación o eliminación total de tus registros contactándonos a través de nuestra página de soporte o canal de WhatsApp.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
