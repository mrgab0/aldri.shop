"use client";

import React, { useState, useMemo } from "react";
import { REAL_CURATED_PRODUCTS, CuratedProductItem } from "@/data/curated-catalog";
import { Copy, Check, Share2, ExternalLink, Sparkles, Search, DollarSign, Globe2 } from "lucide-react";

interface SiteStripeLinkBuilderProps {
  affiliateCode: string;
  commissionRate: number; // e.g. 0.10
}

export function SiteStripeLinkBuilder({ affiliateCode, commissionRate }: SiteStripeLinkBuilderProps) {
  const [selectedProductSlug, setSelectedProductSlug] = useState<string>(REAL_CURATED_PRODUCTS[0]?.slug || "");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [targetLocale, setTargetLocale] = useState<"es" | "en">("es");
  const [copiedStore, setCopiedStore] = useState(false);
  const [copiedProduct, setCopiedProduct] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://aldri.shop";

  // Enlace general a la tienda
  const storeLink = `${baseUrl}/${targetLocale}?ref=${affiliateCode}`;

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return REAL_CURATED_PRODUCTS;
    const term = searchTerm.toLowerCase();
    return REAL_CURATED_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(term)) ||
        p.category.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const selectedProduct: CuratedProductItem | undefined = useMemo(() => {
    return REAL_CURATED_PRODUCTS.find((p) => p.slug === selectedProductSlug) || REAL_CURATED_PRODUCTS[0];
  }, [selectedProductSlug]);

  const productLink = selectedProduct
    ? `${baseUrl}/${targetLocale}/productos/${selectedProduct.slug}?ref=${affiliateCode}`
    : storeLink;

  const estimatedCommission = selectedProduct
    ? (selectedProduct.price * commissionRate).toFixed(2)
    : "0.00";

  const handleCopyStore = () => {
    navigator.clipboard.writeText(storeLink);
    setCopiedStore(true);
    setTimeout(() => setCopiedStore(false), 2500);
  };

  const handleCopyProduct = () => {
    navigator.clipboard.writeText(productLink);
    setCopiedProduct(true);
    setTimeout(() => setCopiedProduct(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!selectedProduct) return;
    const isEn = targetLocale === "en";
    const title = isEn ? selectedProduct.nameEn || selectedProduct.name : selectedProduct.name;
    const text = isEn
      ? `🔥 Check out "${title}" on Aldri Shop for only $${selectedProduct.price.toFixed(2)} USD with worldwide shipping!\n👉 Get it here: ${productLink}`
      : `🔥 ¡Mira este producto increíble en Aldri Shop: "${title}" por solo $${selectedProduct.price.toFixed(2)} USD con envío internacional garantizado!\n👉 Cómpralo aquí: ${productLink}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Barra de Herramientas Estilo Amazon SiteStripe */}
      <div className="bg-gradient-to-r from-[#0F1015] via-[#14151C] to-[#0F1015] border-2 border-[#F2CA50]/40 rounded-3xl p-5 md:p-7 shadow-[0_0_30px_rgba(242,202,80,0.12)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-[#F2CA50] flex items-center justify-center text-[#F2CA50]">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif font-black text-white">
                  Generador de Enlaces SiteStripe
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-[#F2CA50] border border-[#F2CA50]/40">
                  Aldri Associates
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Crea enlaces de referido rastreados con tu tag <strong className="text-[#F2CA50]">{affiliateCode}</strong> y 30 días de cookie.
              </p>
            </div>
          </div>

          {/* Selector de Idioma del Enlace */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-black/60 p-1.5 rounded-2xl border border-white/10 text-xs">
            <Globe2 size={15} className="text-[#F2CA50] ml-1.5" />
            <button
              type="button"
              onClick={() => setTargetLocale("es")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                targetLocale === "es"
                  ? "bg-[#F2CA50] text-black shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Español (/es)
            </button>
            <button
              type="button"
              onClick={() => setTargetLocale("en")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                targetLocale === "en"
                  ? "bg-[#F2CA50] text-black shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              English (/en)
            </button>
          </div>
        </div>

        {/* 1. Enlace Universal a la Tienda */}
        <div className="mt-5 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
            <span>🌐 Enlace General de la Tienda (Cualquier compra te da {(commissionRate * 100).toFixed(0)}%)</span>
            <span className="text-[11px] text-[#F2CA50] font-normal">Atribución 30 Días</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              readOnly
              value={storeLink}
              className="flex-1 px-4 py-3 bg-[#0A0A0E] border border-white/15 rounded-2xl text-xs text-zinc-200 font-mono focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyStore}
              className="px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 select-none cursor-pointer glass-btn-gold text-black shadow-md shrink-0"
            >
              {copiedStore ? <Check size={16} /> : <Copy size={16} />}
              {copiedStore ? "¡Copiado!" : "Copiar Enlace"}
            </button>
          </div>
        </div>

        {/* 2. Selector de los 40 Productos Reales */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                📦 Enlace Directo por Producto (Catálogo de 40 Ítems)
              </h4>
              <p className="text-xs text-zinc-400">
                Selecciona cualquier producto para generar su enlace y compartirlo directo a tus clientes.
              </p>
            </div>

            {/* Buscador de productos */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o categoría..."
                className="w-full pl-9 pr-4 py-2 bg-[#0A0A0E] border border-white/15 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F2CA50]"
              />
            </div>
          </div>

          {/* Menú Desplegable de Selección de Producto */}
          <select
            value={selectedProductSlug}
            onChange={(e) => setSelectedProductSlug(e.target.value)}
            className="w-full px-4 py-3 bg-[#0A0A0E] border border-white/15 rounded-2xl text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#F2CA50] cursor-pointer"
          >
            {filteredProducts.map((prod) => (
              <option key={prod.slug} value={prod.slug} className="bg-[#0A0A0E] text-white">
                {targetLocale === "en" ? prod.nameEn || prod.name : prod.name} — ${prod.price.toFixed(2)} USD ({prod.category})
              </option>
            ))}
          </select>

          {/* Tarjeta de Vista Previa del Producto Seleccionado */}
          {selectedProduct && (
            <div className="bg-[#08080C] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0 flex items-center justify-center p-1">
                <img
                  src={selectedProduct.images[0] || "/logo.png"}
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                    {selectedProduct.category}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Envío Internacional Rápido
                  </span>
                </div>
                <h5 className="font-bold text-white text-sm mt-1 truncate">
                  {targetLocale === "en" ? selectedProduct.nameEn || selectedProduct.name : selectedProduct.name}
                </h5>
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-1 text-xs">
                  <span className="text-zinc-400">
                    Precio: <strong className="text-white">${selectedProduct.price.toFixed(2)} USD</strong>
                  </span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-[#F2CA50] font-black flex items-center gap-1">
                    <DollarSign size={13} className="text-[#D4AF37]" />
                    Tu comisión: ~${estimatedCommission} USD
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Enlace Generado y Botones de Acción */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={productLink}
                className="flex-1 px-4 py-3 bg-[#0A0A0E] border border-white/15 rounded-2xl text-xs text-zinc-200 font-mono focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyProduct}
                  className="flex-1 sm:flex-none px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 select-none cursor-pointer glass-btn-gold text-black shadow-md shrink-0"
                >
                  {copiedProduct ? <Check size={16} /> : <Copy size={16} />}
                  {copiedProduct ? "¡Copiado!" : "Copiar"}
                </button>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="flex-1 sm:flex-none px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 select-none cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shrink-0 active:scale-95"
                >
                  <Share2 size={16} />
                  WhatsApp
                </button>
                <a
                  href={productLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center text-zinc-400 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 shrink-0"
                  title="Abrir enlace en nueva pestaña"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
