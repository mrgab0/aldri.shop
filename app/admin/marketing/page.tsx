"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Flame,
  Layers,
  Video,
  Share2,
  MessageSquare,
  Rocket,
  Search,
  Filter,
  RefreshCw,
  Target,
  DollarSign,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import {
  getProductsForMarketingSelector,
  generateMarketingKitAction,
  MarketingKit
} from "@/lib/actions/marketing";

export default function MarketingAutomationPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "digital" | "dropship">("all");
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const [marketingKit, setMarketingKit] = useState<MarketingKit | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeCopyTab, setActiveCopyTab] = useState<"problem" | "offer" | "social">("offer");
  const [activeMainTab, setActiveMainTab] = useState<"meta" | "tiktok" | "communities" | "whatsapp">("meta");

  // Cargar catálogo para el selector
  useEffect(() => {
    async function fetchProducts() {
      setLoadingProducts(true);
      const res = await getProductsForMarketingSelector();
      if (res.products && res.products.length > 0) {
        setProducts(res.products);
        // Pre-seleccionar el primer producto digital por defecto
        const firstDigital = res.products.find((p: any) => p.productType === "digital") || res.products[0];
        if (firstDigital) {
          const id = String(firstDigital._id || firstDigital.slug);
          setSelectedProductId(id);
          // Autogenerar kit para el primer ítem
          handleGenerate(id);
        }
      }
      setLoadingProducts(false);
    }
    fetchProducts();
  }, []);

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleGenerate = (idToUse?: string) => {
    const targetId = idToUse || selectedProductId;
    if (!targetId) return;

    startTransition(async () => {
      const res = await generateMarketingKitAction(targetId);
      if (res.success && res.data) {
        setMarketingKit(res.data);
      }
    });
  };

  const filteredProducts = products.filter((p) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "digital" && p.productType === "digital") ||
      (activeFilter === "dropship" && p.productType !== "digital");

    const matchesSearch =
      searchTerm === "" ||
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const selectedProduct = products.find(
    (p) => String(p._id || p.slug) === selectedProductId || p.slug === selectedProductId
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* HEADER DE LA HERRAMIENTA */}
      <div className="bg-[#0B0B0E] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F2CA50]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#F2CA50]/10 border border-[#F2CA50]/30 px-3 py-1 rounded-full text-xs font-black text-[#F2CA50] uppercase tracking-wider">
              <Sparkles size={14} className="animate-pulse" />
              <span>Motor Autónomo de Crecimiento &amp; Tráfico</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-white">
              Aldri Marketing Hub <span className="text-[#F2CA50]">🤖</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
              Genera campañas publicitarias para <strong>Meta Ads</strong>, guiones virales de 25s para <strong>TikTok &amp; Reels</strong>, y publicaciones para comunidades con 1 solo clic. Conectado a Gemini AI y optimizado con el Pixel <code className="text-[#F2CA50] font-mono">socia</code>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/landings"
              className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <Rocket size={14} className="text-[#F2CA50]" />
              <span>Ver Landing Pages</span>
            </Link>
            <Link
              href="https://adsmanager.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md"
            >
              <ExternalLink size={14} />
              <span>Meta Ads Manager</span>
            </Link>
          </div>
        </div>
      </div>

      {/* BARRA DE SELECCIÓN DE PRODUCTO */}
      <div className="bg-[#0E0E12] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <Target size={16} className="text-[#F2CA50]" />
            <span>Paso 1: Selecciona el Producto Ganador a Promocionar</span>
          </h2>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium">Filtro:</span>
            <div className="inline-flex p-1 bg-black/40 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeFilter === "all" ? "bg-[#F2CA50] text-black font-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                Todos ({products.length})
              </button>
              <button
                onClick={() => setActiveFilter("digital")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeFilter === "digital" ? "bg-[#F2CA50] text-black font-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                ⚡ Digitales ({products.filter((p) => p.productType === "digital").length})
              </button>
              <button
                onClick={() => setActiveFilter("dropship")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeFilter === "dropship" ? "bg-[#F2CA50] text-black font-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                📦 Físicos ({products.filter((p) => p.productType !== "digital").length})
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-4 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, categoría o slug..."
              className="w-full bg-[#141419] border border-white/15 rounded-xl pl-10 pr-3.5 py-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#F2CA50]"
            />
          </div>

          <div className="md:col-span-5">
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                handleGenerate(e.target.value);
              }}
              disabled={loadingProducts}
              className="w-full bg-[#141419] border border-white/15 rounded-xl px-3.5 py-3 text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#F2CA50] cursor-pointer"
            >
              {filteredProducts.map((p) => (
                <option key={String(p._id || p.slug)} value={String(p._id || p.slug)}>
                  {p.productType === "digital" ? "⚡" : "📦"} {p.name} — ${Number(p.price || 0).toFixed(2)} USD ({p.category})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <button
              onClick={() => handleGenerate()}
              disabled={isPending || !selectedProductId}
              className="w-full glass-btn-gold text-black py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles size={14} className={isPending ? "animate-spin" : ""} />
              <span>{isPending ? "Generando con IA..." : "Regenerar Kit con IA"}</span>
            </button>
          </div>
        </div>

        {/* TARJETA DE RESUMEN DEL PRODUCTO SELECCIONADO */}
        {selectedProduct && (
          <div className="bg-[#121217] p-3.5 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              {selectedProduct.images?.[0] ? (
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-12 h-12 rounded-xl object-contain bg-black/40 border border-white/10 p-1"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-[#F2CA50] font-black flex items-center justify-center text-xs">
                  ALDRI
                </div>
              )}
              <div>
                <span className="font-extrabold text-white block text-sm">{selectedProduct.name}</span>
                <span className="text-zinc-400 block text-[11px]">
                  {selectedProduct.category} &bull; Precio: <strong className="text-[#F2CA50] font-mono">${Number(selectedProduct.price || 0).toFixed(2)} USD</strong> &bull; Tipo: <strong className="text-zinc-200">{selectedProduct.productType === "digital" ? "Digital Instantáneo" : "Dropship Físico"}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/es/productos/${selectedProduct.slug}`}
                target="_blank"
                className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-all flex items-center gap-1 font-bold text-[11px]"
              >
                <span>Ver en Tienda</span>
                <ExternalLink size={12} />
              </Link>
              <Link
                href={`/admin/landings/crear?productId=${selectedProduct._id || selectedProduct.slug}`}
                className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-[#F2CA50] border border-amber-500/30 transition-all flex items-center gap-1 font-bold text-[11px]"
              >
                <Rocket size={12} />
                <span>Crear Landing Page</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* PESTAÑAS PRINCIPALES DE LOS 4 CANALES */}
      <div className="flex border-b border-white/10 space-x-2 sm:space-x-4 overflow-x-auto pb-2 scrollbar-none text-xs sm:text-sm">
        <button
          onClick={() => setActiveMainTab("meta")}
          className={`px-5 py-3 rounded-2xl font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeMainTab === "meta"
              ? "bg-[#1877F2] text-white shadow-lg shadow-blue-600/30"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Target size={16} />
          <span>Meta Ads (Facebook / Instagram)</span>
        </button>

        <button
          onClick={() => setActiveMainTab("tiktok")}
          className={`px-5 py-3 rounded-2xl font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeMainTab === "tiktok"
              ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Video size={16} />
          <span>TikTok &amp; Reels Studio (25s)</span>
        </button>

        <button
          onClick={() => setActiveMainTab("communities")}
          className={`px-5 py-3 rounded-2xl font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeMainTab === "communities"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Share2 size={16} />
          <span>Comunidades &amp; Foros</span>
        </button>

        <button
          onClick={() => setActiveMainTab("whatsapp")}
          className={`px-5 py-3 rounded-2xl font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeMainTab === "whatsapp"
              ? "bg-[#25D366] text-white shadow-lg shadow-emerald-600/30"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <MessageSquare size={16} />
          <span>WhatsApp Direct Sales</span>
        </button>
      </div>

      {/* CONTENIDO DEL KIT DE MARKETING */}
      {isPending ? (
        <div className="bg-[#0E0E12] p-16 rounded-3xl border border-white/10 text-center space-y-4 shadow-xl">
          <Sparkles size={40} className="mx-auto text-[#F2CA50] animate-spin" />
          <h3 className="text-xl font-bold text-white">Generando Campaña Publicitaria con Gemini AI...</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Analizando arquetipos de comprador, ganchos de retención para TikTok y ángulos de dolor/beneficio para Meta Ads.
          </p>
        </div>
      ) : marketingKit ? (
        <div className="space-y-6">

          {/* TAB 1: META ADS */}
          {activeMainTab === "meta" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* COLUMNA IZQUIERDA: Textos del Anuncio */}
              <div className="lg:col-span-7 bg-[#0E0E12] p-6 rounded-3xl border border-white/10 shadow-lg space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-white">1. Textos Publicitarios (Ad Copy)</h3>
                    <p className="text-xs text-zinc-400">Selecciona el ángulo que mejor resuene con tu audiencia</p>
                  </div>
                  <span className="text-[11px] font-black uppercase text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                    Meta Ads Ready
                  </span>
                </div>

                {/* Sub-pestañas de Copy */}
                <div className="flex gap-2 p-1 bg-black/40 rounded-2xl border border-white/10 text-xs">
                  <button
                    onClick={() => setActiveCopyTab("offer")}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                      activeCopyTab === "offer" ? "bg-[#F2CA50] text-black font-black" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    🔥 Oferta &amp; Cupón ALDRI10
                  </button>
                  <button
                    onClick={() => setActiveCopyTab("problem")}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                      activeCopyTab === "problem" ? "bg-[#F2CA50] text-black font-black" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    🎯 Dolor / Solución
                  </button>
                  <button
                    onClick={() => setActiveCopyTab("social")}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                      activeCopyTab === "social" ? "bg-[#F2CA50] text-black font-black" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    ⭐ Prueba Social &amp; Velocidad
                  </button>
                </div>

                {/* Área de Texto Principal */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-bold uppercase tracking-wider">Texto Principal del Anuncio:</span>
                    <button
                      onClick={() => {
                        const copyText =
                          activeCopyTab === "offer"
                            ? marketingKit.metaAds.copyOfferDiscount
                            : activeCopyTab === "problem"
                            ? marketingKit.metaAds.copyProblemSolution
                            : marketingKit.metaAds.copySocialProof;
                        handleCopy(copyText, "primaryText");
                      }}
                      className="text-[#F2CA50] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === "primaryText" ? (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Check size={12} /> ¡Copiado!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Copy size={12} /> Copiar Texto
                        </span>
                      )}
                    </button>
                  </div>
                  <div className="bg-[#141419] p-4 rounded-2xl border border-white/10 text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans whitespace-pre-line select-all">
                    {activeCopyTab === "offer" && marketingKit.metaAds.copyOfferDiscount}
                    {activeCopyTab === "problem" && marketingKit.metaAds.copyProblemSolution}
                    {activeCopyTab === "social" && marketingKit.metaAds.copySocialProof}
                  </div>
                </div>

                {/* Titulares Sugeridos */}
                <div className="space-y-2">
                  <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">
                    Titulares de Alta Conversión (Headlines):
                  </span>
                  <div className="space-y-2">
                    {marketingKit.metaAds.headlines.map((hl, idx) => (
                      <div
                        key={idx}
                        className="bg-[#141419] p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs sm:text-sm text-white"
                      >
                        <span className="font-bold">{hl}</span>
                        <button
                          onClick={() => handleCopy(hl, `headline-${idx}`)}
                          className="text-[#F2CA50] hover:underline text-xs font-bold ml-2 shrink-0 cursor-pointer"
                        >
                          {copiedKey === `headline-${idx}` ? "¡Copiado! ✓" : "Copiar"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enlace de Destino con UTMs y Cupón */}
                <div className="space-y-2 bg-[#121217] p-4 rounded-2xl border border-[#F2CA50]/30">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#F2CA50] font-black uppercase tracking-wider">
                      🔗 Enlace con UTM y Cupón ALDRI10 (Pégalo en el Anuncio):
                    </span>
                    <button
                      onClick={() => handleCopy(marketingKit.metaAds.utmUrl, "utmUrl")}
                      className="text-white hover:text-[#F2CA50] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === "utmUrl" ? "¡Copiado! ✓" : "Copiar Enlace"}
                    </button>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={marketingKit.metaAds.utmUrl}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-[#F2CA50] select-all focus:outline-none"
                  />
                  <span className="text-[11px] text-zinc-400 block">
                    Al hacer clic, el usuario llega directamente al producto con el Pixel <code className="text-[#F2CA50]">socia</code> registrando el tráfico.
                  </span>
                </div>
              </div>

              {/* COLUMNA DERECHA: Configuración de Campaña en Meta Ads Manager */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Preview Visual del Anuncio (Simulación Facebook/Instagram) */}
                <div className="bg-[#141419] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                  <div className="p-4 border-b border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#F2CA50] to-[#D4AF37] text-black font-black flex items-center justify-center text-xs shadow-md">
                      AS
                    </div>
                    <div>
                      <span className="font-extrabold text-white text-xs block">Aldri Shop Oficial</span>
                      <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                        Patrocinado &bull; 🌐 Publicidad
                      </span>
                    </div>
                  </div>

                  <div className="p-4 text-xs text-zinc-200 line-clamp-3">
                    {activeCopyTab === "offer"
                      ? marketingKit.metaAds.copyOfferDiscount
                      : activeCopyTab === "problem"
                      ? marketingKit.metaAds.copyProblemSolution
                      : marketingKit.metaAds.copySocialProof}
                  </div>

                  {marketingKit.product.image && (
                    <div className="relative aspect-video bg-[#0B0B0E] flex items-center justify-center p-3 border-y border-white/10">
                      <img
                        src={marketingKit.product.image}
                        alt={marketingKit.product.name}
                        className="max-h-full max-w-full object-contain drop-shadow-xl"
                      />
                    </div>
                  )}

                  <div className="p-4 bg-[#0E0E12] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">ALDRI.SHOP</span>
                      <span className="font-bold text-white text-xs line-clamp-1">
                        {marketingKit.metaAds.headlines[0]}
                      </span>
                    </div>
                    <span className="px-4 py-2 bg-gradient-to-r from-[#F2CA50] to-[#D4AF37] text-black rounded-xl font-black text-xs uppercase shadow-md">
                      Comprar
                    </span>
                  </div>
                </div>

                {/* Hoja de Configuración para Meta Ads Manager */}
                <div className="bg-[#0E0E12] p-5 rounded-3xl border border-white/10 space-y-3.5 shadow-lg">
                  <h4 className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <Target size={14} />
                    <span>Configuración Recomendada en Meta Ads</span>
                  </h4>

                  <div className="space-y-2.5 text-xs text-zinc-300">
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-zinc-400">Objetivo de Campaña:</span>
                      <strong className="text-white">{marketingKit.metaAds.suggestedTargeting.objective}</strong>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-zinc-400">Presupuesto Sugerido:</span>
                      <strong className="text-emerald-400">{marketingKit.metaAds.suggestedTargeting.dailyBudget}</strong>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-zinc-400">Rango de Edad:</span>
                      <strong className="text-white">{marketingKit.metaAds.suggestedTargeting.ageRange}</strong>
                    </div>

                    <div className="py-1.5">
                      <span className="text-zinc-400 block mb-1.5">Intereses a Segmentar en Meta:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {marketingKit.metaAds.suggestedTargeting.interests.map((it, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-500/10 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                          >
                            {it}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="py-1.5">
                      <span className="text-zinc-400 block mb-1">Ubicaciones Recomendadas:</span>
                      <span className="text-xs text-zinc-200 font-medium">
                        {marketingKit.metaAds.suggestedTargeting.placements.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: TIKTOK & REELS STUDIO */}
          {activeMainTab === "tiktok" && (
            <div className="bg-[#0E0E12] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Video size={20} className="text-pink-500" />
                    <span>Guión Viral de 25 Segundos para TikTok &amp; Reels</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Estructura probada de interrupción de scroll, demostración en vivo y llamada al cupón ALDRI10.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const fullScript = `🎬 GUIÓN VIRAL PARA TIKTOK / REELS (${marketingKit.product.name})\n\n[0-3s] GANCHO:\nVisual: ${marketingKit.tiktokReels.hook.visual}\nVoz: "${marketingKit.tiktokReels.hook.audio}"\n\n[3-18s] DEMOSTRACIÓN:\nVisual: ${marketingKit.tiktokReels.demo.visual}\nVoz: "${marketingKit.tiktokReels.demo.audio}"\n\n[18-25s] LLAMADA A LA ACCIÓN:\nVisual: ${marketingKit.tiktokReels.cta.visual}\nVoz: "${marketingKit.tiktokReels.cta.audio}"\n\n📌 CAPTION:\n${marketingKit.tiktokReels.caption}\n\n${marketingKit.tiktokReels.hashtags.join(' ')}`;
                    handleCopy(fullScript, "fullScript");
                  }}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  {copiedKey === "fullScript" ? "¡Guión Completo Copiado! ✓" : "Copiar Guión Completo"}
                </button>
              </div>

              {/* Tabla de Estructura de Guión en 3 Bloques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* BLOQUE 1: HOOK */}
                <div className="bg-[#141419] p-5 rounded-2xl border border-pink-500/30 space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="bg-pink-500/20 text-pink-400 font-mono font-black text-xs px-2.5 py-0.5 rounded-full border border-pink-500/40">
                      ⏱️ {marketingKit.tiktokReels.hook.time}
                    </span>
                    <span className="text-[10px] font-black uppercase text-zinc-400">1. Hook de Choque</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase text-zinc-400 block">👀 En Pantalla (Visual):</span>
                    <p className="text-xs text-zinc-200 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/5">
                      {marketingKit.tiktokReels.hook.visual}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase text-pink-400 block">🗣️ Voz en Off (Audio):</span>
                    <p className="text-xs font-semibold text-white leading-relaxed italic bg-pink-950/20 p-2.5 rounded-xl border border-pink-500/20">
                      &quot;{marketingKit.tiktokReels.hook.audio}&quot;
                    </p>
                  </div>
                </div>

                {/* BLOQUE 2: DEMO */}
                <div className="bg-[#141419] p-5 rounded-2xl border border-amber-500/30 space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="bg-amber-500/20 text-[#F2CA50] font-mono font-black text-xs px-2.5 py-0.5 rounded-full border border-amber-500/40">
                      ⏱️ {marketingKit.tiktokReels.demo.time}
                    </span>
                    <span className="text-[10px] font-black uppercase text-zinc-400">2. Demostración</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase text-zinc-400 block">👀 En Pantalla (Visual):</span>
                    <p className="text-xs text-zinc-200 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/5">
                      {marketingKit.tiktokReels.demo.visual}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase text-[#F2CA50] block">🗣️ Voz en Off (Audio):</span>
                    <p className="text-xs font-semibold text-white leading-relaxed italic bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/20">
                      &quot;{marketingKit.tiktokReels.demo.audio}&quot;
                    </p>
                  </div>
                </div>

                {/* BLOQUE 3: CTA */}
                <div className="bg-[#141419] p-5 rounded-2xl border border-emerald-500/30 space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="bg-emerald-500/20 text-emerald-400 font-mono font-black text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                      ⏱️ {marketingKit.tiktokReels.cta.time}
                    </span>
                    <span className="text-[10px] font-black uppercase text-zinc-400">3. Cierre &amp; Cupón</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase text-zinc-400 block">👀 En Pantalla (Visual):</span>
                    <p className="text-xs text-zinc-200 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/5">
                      {marketingKit.tiktokReels.cta.visual}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase text-emerald-400 block">🗣️ Voz en Off (Audio):</span>
                    <p className="text-xs font-semibold text-white leading-relaxed italic bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20">
                      &quot;{marketingKit.tiktokReels.cta.audio}&quot;
                    </p>
                  </div>
                </div>

              </div>

              {/* Caption y Hashtags Virales */}
              <div className="bg-[#121217] p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-white">Pie de Video (Caption) &amp; Hashtags Algorítmicos:</span>
                  <button
                    onClick={() => {
                      const captionText = `${marketingKit.tiktokReels.caption}\n\n${marketingKit.tiktokReels.hashtags.join(' ')}`;
                      handleCopy(captionText, "caption");
                    }}
                    className="text-[#F2CA50] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === "caption" ? "¡Copiado! ✓" : "Copiar Caption"}
                  </button>
                </div>
                <div className="bg-black/50 p-3.5 rounded-xl text-xs sm:text-sm text-zinc-200 select-all font-sans">
                  {marketingKit.tiktokReels.caption}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {marketingKit.tiktokReels.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-pink-500/10 text-pink-300 border border-pink-500/20 px-2 py-0.5 rounded-md text-xs font-mono font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMUNIDADES & FOROS */}
          {activeMainTab === "communities" && (
            <div className="bg-[#0E0E12] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-6">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Share2 size={20} className="text-purple-400" />
                  <span>Publicaciones para Comunidades (Tráfico Orgánico de Alta Intención)</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Adaptadas al formato natural de cada plataforma para evitar ser considerado spam.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Grupos de Facebook */}
                <div className="bg-[#141419] p-5 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="font-extrabold text-blue-400 text-xs">👥 Grupos de Facebook</span>
                      <button
                        onClick={() => handleCopy(marketingKit.communityPosts.facebookGroup, "fbPost")}
                        className="text-[#F2CA50] hover:underline text-xs font-bold cursor-pointer"
                      >
                        {copiedKey === "fbPost" ? "¡Copiado! ✓" : "Copiar"}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line bg-black/40 p-3 rounded-xl border border-white/5 select-all">
                      {marketingKit.communityPosts.facebookGroup}
                    </p>
                  </div>
                  <span className="text-[10px] text-zinc-500 block pt-1">
                    💡 Publicar en grupos de compra/venta gamer, diseñadores o emprendedores.
                  </span>
                </div>

                {/* 2. Discord y Telegram */}
                <div className="bg-[#141419] p-5 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="font-extrabold text-indigo-400 text-xs">💬 Canales Discord / Telegram</span>
                      <button
                        onClick={() => handleCopy(marketingKit.communityPosts.discordTelegram, "discordPost")}
                        className="text-[#F2CA50] hover:underline text-xs font-bold cursor-pointer"
                      >
                        {copiedKey === "discordPost" ? "¡Copiado! ✓" : "Copiar"}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line bg-black/40 p-3 rounded-xl border border-white/5 font-mono select-all">
                      {marketingKit.communityPosts.discordTelegram}
                    </p>
                  </div>
                  <span className="text-[10px] text-zinc-500 block pt-1">
                    💡 Ideal para canales de #promociones o servidores de gaming.
                  </span>
                </div>

                {/* 3. Reddit y Foros */}
                <div className="bg-[#141419] p-5 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="font-extrabold text-orange-400 text-xs">🌐 Reddit &amp; Foros</span>
                      <button
                        onClick={() => handleCopy(marketingKit.communityPosts.redditForum, "redditPost")}
                        className="text-[#F2CA50] hover:underline text-xs font-bold cursor-pointer"
                      >
                        {copiedKey === "redditPost" ? "¡Copiado! ✓" : "Copiar"}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line bg-black/40 p-3 rounded-xl border border-white/5 select-all">
                      {marketingKit.communityPosts.redditForum}
                    </p>
                  </div>
                  <span className="text-[10px] text-zinc-500 block pt-1">
                    💡 Formato transparente para responder dudas en hilos temáticos.
                  </span>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: WHATSAPP DIRECT PITCH */}
          {activeMainTab === "whatsapp" && (
            <div className="bg-[#0E0E12] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <MessageSquare size={20} className="text-[#25D366]" />
                    <span>Mensaje de Cierre 1 a 1 por WhatsApp</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Mensaje persuasivo listo para responder a clientes que pregunten por este producto.
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(marketingKit.whatsappPitch, "waPitch")}
                  className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  {copiedKey === "waPitch" ? "¡Copiado! ✓" : "Copiar Mensaje"}
                </button>
              </div>

              <div className="bg-[#141419] p-5 rounded-2xl border border-emerald-500/20 space-y-4">
                <div className="bg-[#0B0B0E] p-4 rounded-xl border border-white/10 text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-line select-all font-sans">
                  {marketingKit.whatsappPitch}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(marketingKit.whatsappPitch)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <MessageSquare size={14} />
                    <span>Compartir en WhatsApp</span>
                  </a>

                  <span className="text-xs text-zinc-400">
                    Incluye automáticamente el cupón de 10% OFF (<strong>ALDRI10</strong>) y garantía de activación.
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      ) : null}
    </div>
  );
}
