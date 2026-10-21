"use client";

import { useState, useEffect } from "react";
import { Sparkles, ShoppingBag, X } from "lucide-react";

interface SaleNotification {
  customer: string;
  location: string;
  product: string;
  type: "digital" | "physical";
  timeAgo: string;
  flag: string;
}

const RECENT_SALES: SaleNotification[] = [
  {
    customer: "Carlos M.",
    location: "Houston, TX",
    product: "Solid Walnut MagSafe Charging Stand",
    type: "physical",
    timeAgo: "hace 4 min",
    flag: "🇺🇸"
  },
  {
    customer: "Elena R.",
    location: "Madrid, España",
    product: "Aldri Creator OS (Notion Suite)",
    type: "digital",
    timeAgo: "hace 11 min",
    flag: "🇪🇸"
  },
  {
    customer: "Mateo V.",
    location: "Ciudad de México",
    product: "Cyberpunk Titanium EDC Pen",
    type: "physical",
    timeAgo: "hace 18 min",
    flag: "🇲🇽"
  },
  {
    customer: "Sofía G.",
    location: "Santiago, Chile",
    product: "Cinematic LUTs Pack (Gold & Moody)",
    type: "digital",
    timeAgo: "hace 24 min",
    flag: "🇨🇱"
  },
  {
    customer: "Lucas B.",
    location: "Miami, FL",
    product: "Minimalist Leather Desk Pad",
    type: "physical",
    timeAgo: "hace 32 min",
    flag: "🇺🇸"
  }
];

export function RecentSalesTicker() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Verificar si el usuario lo descartó previamente en la sesión
    if (sessionStorage.getItem("aldri_sales_ticker_dismissed") === "true") {
      setDismissed(true);
      return;
    }

    // Primer retraso antes de mostrar la primera notificación (6 segundos)
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 6000);

    // Bucle de rotación
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % RECENT_SALES.length);
        setVisible(true);
      }, 800);
    }, 18000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  if (dismissed) return null;

  const current = RECENT_SALES[currentIdx];

  return (
    <div
      className={`fixed bottom-5 left-5 z-40 max-w-sm transition-all duration-700 transform pointer-events-auto ${
        visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
      }`}
    >
      <div className="glass-panel-luxury p-3.5 pr-4 rounded-2xl border border-amber-400/30 shadow-[0_0_30px_rgba(212,175,55,0.2)] flex items-center gap-3.5 text-white">
        {/* Icono de tipo con gradiente Champagne Gold */}
        <div className="w-10 h-10 rounded-xl glass-btn-gold flex items-center justify-center text-black shadow-lg flex-shrink-0">
          {current.type === "digital" ? <Sparkles size={18} /> : <ShoppingBag size={18} />}
        </div>

        {/* Detalles del comprador */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400">
            <span>{current.flag}</span>
            <span className="font-extrabold text-white">{current.customer}</span>
            <span>&bull;</span>
            <span className="truncate">{current.location}</span>
          </div>

          <p className="text-xs font-black text-white truncate mt-0.5">
            {current.type === "digital" ? "Descargó " : "Compró "}
            <span className="text-[#F2CA50] drop-shadow-[0_0_8px_rgba(242,202,80,0.4)]">{current.product}</span>
          </p>

          <span className="text-[10px] text-[#F2CA50]/80 font-bold block mt-0.5">
            Verificado {current.timeAgo} ✓
          </span>
        </div>

        {/* Botón de cierre */}
        <button
          onClick={() => {
            setVisible(false);
            setDismissed(true);
            sessionStorage.setItem("aldri_sales_ticker_dismissed", "true");
          }}
          className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          title="Cerrar notificación"
          aria-label="Cerrar notificación"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
