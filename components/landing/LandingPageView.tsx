"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/shop/Cart/CartContext";
import { trackLandingClick } from "@/lib/actions/landing";
import {
  ShieldCheck,
  Truck,
  Sparkles,
  Star,
  Clock,
  CheckCircle2,
  ChevronDown,
  MessageCircle,
  ShoppingCart,
  Lock,
  ArrowRight,
  Flame,
  Award,
  Zap,
  Check,
  X,
  CreditCard,
  Layers,
} from "lucide-react";

interface LandingPageViewProps {
  landing: {
    _id: string;
    title: string;
    subdomain: string;
    productId?: any;
    productSlug?: string;
    productType?: "dropship" | "digital";
    headline: string;
    subheadline: string;
    heroBadge?: string;
    promoPrice?: number;
    originalPrice?: number;
    discountPercentage?: number;
    countdownMinutes?: number;
    benefits: Array<{ title: string; description: string; icon?: string }>;
    features: string[];
    reviews: Array<{ name: string; location: string; rating: number; comment: string }>;
    faqs: Array<{ question: string; answer: string }>;
    customImages?: string[];
    ctaText: string;
    ctaType: "checkout" | "whatsapp";
    whatsappMessage?: string;
    themeColor: string;
    multiPacks?: Array<{
      quantity: number;
      title: string;
      badge?: string;
      price: number;
      originalPrice?: number;
      isPopular?: boolean;
    }>;
  };
}

export function LandingPageView({ landing }: LandingPageViewProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({ minutes: landing.countdownMinutes || 15, seconds: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Identificar si es producto digital
  const product = landing.productId;
  const isDigital =
    landing.productType === "digital" ||
    product?.productType === "digital" ||
    !!product?.digitalAsset;

  // Imágenes disponibles (customImages o del producto)
  const images: string[] =
    landing.customImages && landing.customImages.length > 0
      ? landing.customImages
      : product?.images && product.images.length > 0
      ? product.images
      : ["/logo.png"];

  // Precios base
  const price = landing.promoPrice || product?.price || 29.99;
  const originalPrice = landing.originalPrice || (price > 0 ? Math.round(price * 1.5) : 49.99);
  const discount =
    landing.discountPercentage ||
    (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 40);

  // Multi-Packs (Packs de Descuento Escalonado)
  const defaultPacks = [
    {
      quantity: 1,
      title: "1 Unidad (Estándar)",
      badge: `${discount}% OFF`,
      price: price,
      originalPrice: originalPrice,
      isPopular: false,
    },
    {
      quantity: 2,
      title: "Pack x2 (Ahorro Pareja)",
      badge: "🔥 MÁS VENDIDO (10% EXTRA OFF)",
      price: Math.round(price * 2 * 0.9 * 100) / 100,
      originalPrice: originalPrice * 2,
      isPopular: true,
    },
    {
      quantity: 3,
      title: "Pack x3 (Máximo Valor / Regalo)",
      badge: "⭐ MEJOR AHORRO (15% EXTRA OFF)",
      price: Math.round(price * 3 * 0.85 * 100) / 100,
      originalPrice: originalPrice * 3,
      isPopular: false,
    },
  ];

  const packs =
    landing.multiPacks && landing.multiPacks.length > 0 ? landing.multiPacks : defaultPacks;

  const [selectedPackIndex, setSelectedPackIndex] = useState(() => {
    const popularIdx = packs.findIndex((p: any) => p.isPopular);
    return popularIdx !== -1 ? popularIdx : 0;
  });

  const activePack = packs[selectedPackIndex] || packs[0];
  const activePackOrigPrice =
    activePack.originalPrice || Math.round(originalPrice * activePack.quantity);
  const activeSavings = Math.max(0, activePackOrigPrice - activePack.price);
  const unitPrice = activePack.price / activePack.quantity;

  const themeAccent = landing.themeColor || "#F2CA50";

  // Countdown timer
  useEffect(() => {
    const totalSeconds = (landing.countdownMinutes || 15) * 60;
    let remaining = totalSeconds;

    const timer = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        remaining = 600; // Reiniciar en 10 min
      }
      setTimeLeft({
        minutes: Math.floor(remaining / 60),
        seconds: remaining % 60,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [landing.countdownMinutes]);

  const handleCTA = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Registrar clic analítico
    try {
      await trackLandingClick(landing.subdomain);
    } catch (e) {
      console.error(e);
    }

    if (landing.ctaType === "whatsapp") {
      const defaultMsg = `¡Hola Aldri Shop! Quiero ordenar el ${activePack.title} de "${landing.title}" por $${activePack.price.toFixed(2)} USD (aldri.shop/l/${landing.subdomain}).`;
      const msg = encodeURIComponent(landing.whatsappMessage || defaultMsg);
      const whatsappUrl = `https://wa.me/18322899478?text=${msg}`;
      window.open(whatsappUrl, "_blank");
      setIsSubmitting(false);
    } else {
      // 1-Click Funnel Checkout: Agregar el pack seleccionado y redirigir
      const packDisplayName =
        activePack.quantity > 1
          ? `${landing.title} - ${activePack.title}`
          : product?.name || landing.title;

      addToCart({
        id: `${product?._id || landing._id}-pack-${activePack.quantity}`,
        name: packDisplayName,
        price: activePack.price,
        quantity: 1,
        image: images[0] || "/logo.png",
        productType: isDigital ? "digital" : "dropship",
      });

      router.push("/checkout");
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] text-slate-100 flex flex-col font-sans selection:bg-[#F2CA50] selection:text-black">
      {/* Top Banner de Urgencia */}
      <div
        className="text-black text-xs md:text-sm py-2.5 px-4 text-center font-black flex items-center justify-center gap-2 shadow-inner"
        style={{ backgroundColor: themeAccent }}
      >
        <Flame className="w-4 h-4 animate-bounce text-black" />
        <span className="tracking-wide uppercase">
          {landing.heroBadge || "🔥 OFERTA EXCLUSIVA DE LANZAMIENTO - TIEMPO LIMITADO"}
        </span>
        <span className="hidden sm:inline">|</span>
        <span className="bg-black/80 px-2.5 py-0.5 rounded-full text-white font-mono font-bold text-xs tracking-wider">
          Expira en: {String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
        </span>
      </div>

      {/* Header Minimalista de Lujo */}
      <header className="border-b border-white/10 bg-[#0c0d12]/80 backdrop-blur-md sticky top-0 z-30 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#F2CA50]/50 shadow-[0_0_12px_rgba(242,202,80,0.2)]">
              <Image src="/logo.png" alt="Aldri Shop" fill className="object-cover" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              Aldri <span className="text-[#F2CA50]">Shop</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/60 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Compra 100% Segura & Garantizada</span>
            <span className="sm:hidden">Compra Segura</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 md:py-12 space-y-14">
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Columna Izquierda: Galería de Lujo */}
          <div className="space-y-4 md:sticky md:top-20">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#0e1017] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
              <Image
                src={images[selectedImageIndex] || "/logo.png"}
                alt={landing.title}
                fill
                priority
                className="object-cover transition-all duration-300 hover:scale-105"
              />
              {activeSavings > 0 && (
                <div className="absolute top-3 left-3 bg-red-600 text-white font-black text-xs md:text-sm px-3.5 py-1.5 rounded-full shadow-lg uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  AHORRAS ${activeSavings.toFixed(2)}
                </div>
              )}

              {/* Badge Digital o Físico */}
              <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2 text-xs">
                {isDigital ? (
                  <>
                    <Zap className="w-4 h-4 text-[#F2CA50] flex-shrink-0" />
                    <span className="text-slate-200 font-medium">
                      ⚡ <strong>Entrega Digital Inmediata 24/7</strong> en pantalla y correo
                    </span>
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-200 font-medium">
                      🇺🇸 <strong>Envío Rápido Almacén USA</strong> con guía USPS oficial
                    </span>
                  </>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? "border-[#F2CA50] scale-105 shadow-[0_0_12px_rgba(242,202,80,0.3)]"
                        : "border-white/10 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`${landing.title} miniatura ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columna Derecha: Oferta, Multi-Packs y CTA */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#F2CA50] text-xs font-bold uppercase tracking-wider">
                <div className="flex text-[#F2CA50]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F2CA50] text-[#F2CA50]" />
                  ))}
                </div>
                <span>4.9 / 5 (+1,480 Compradores Verificados)</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                {landing.headline}
              </h1>

              {landing.subheadline && (
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {landing.subheadline}
                </p>
              )}
            </div>

            {/* SELECTOR INTERACTIVO DE MULTI-PACKS (FUNNEL DE CONVERSIÓN) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#F2CA50]" />
                  Selecciona tu Opción de Ahorro:
                </label>
                <span className="text-[11px] text-[#F2CA50] font-semibold">
                  Envío Gratis Incluido
                </span>
              </div>

              <div className="space-y-2.5">
                {packs.map((pack, pIdx) => {
                  const isSelected = selectedPackIndex === pIdx;
                  const pOrig = pack.originalPrice || Math.round(originalPrice * pack.quantity);
                  const pUnit = pack.price / pack.quantity;

                  return (
                    <div
                      key={pIdx}
                      onClick={() => setSelectedPackIndex(pIdx)}
                      className={`relative p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#14151f] border-[#F2CA50] shadow-[0_0_20px_rgba(242,202,80,0.15)] ring-1 ring-[#F2CA50]"
                          : "bg-[#0e1017] border-white/10 hover:border-white/20 hover:bg-[#12141c]"
                      }`}
                    >
                      {/* Badge Superior */}
                      {pack.badge && (
                        <div
                          className={`absolute -top-2.5 right-4 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow ${
                            pack.isPopular
                              ? "bg-gradient-to-r from-red-600 to-orange-500 text-white animate-pulse"
                              : "bg-[#F2CA50] text-black"
                          }`}
                        >
                          {pack.badge}
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? "border-[#F2CA50] bg-[#F2CA50]"
                                : "border-slate-600 bg-transparent"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-black stroke-[3]" />}
                          </div>
                          <div>
                            <div className="font-extrabold text-sm sm:text-base text-white">
                              {pack.title}
                            </div>
                            <div className="text-xs text-slate-400">
                              ${pUnit.toFixed(2)} por unidad
                              {pack.quantity > 1 && (
                                <span className="ml-1.5 text-emerald-400 font-semibold">
                                  (Ahorras ${(pOrig - pack.price).toFixed(2)})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg sm:text-xl font-black text-white">
                            ${pack.price.toFixed(2)}
                          </div>
                          {pOrig > pack.price && (
                            <div className="text-xs text-slate-500 line-through">
                              ${pOrig.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tarjeta de Resumen y CTA */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#12141c] to-[#0a0b10] border border-white/10 shadow-2xl space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
                    Total a Pagar ({activePack.title}):
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      ${activePack.price.toFixed(2)}
                    </span>
                    {activePackOrigPrice > activePack.price && (
                      <span className="text-sm sm:text-base text-slate-500 line-through">
                        ${activePackOrigPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {activeSavings > 0 && (
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 font-extrabold px-3 py-1 rounded-full border border-emerald-500/30">
                    Ahorro Total: ${activeSavings.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Botón CTA de Conversión Inmediata */}
              <button
                onClick={handleCTA}
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl font-black text-base sm:text-lg text-black shadow-[0_4px_25px_rgba(242,202,80,0.3)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-wide cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: themeAccent }}
              >
                {landing.ctaType === "whatsapp" ? (
                  <MessageCircle className="w-6 h-6 text-black" />
                ) : (
                  <ShoppingCart className="w-6 h-6 text-black" />
                )}
                <span>{landing.ctaText || `Comprar ${activePack.title}`}</span>
                <ArrowRight className="w-5 h-5 text-black" />
              </button>

              {/* Métodos de Pago Confiables */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pagos 100% Cifrados con SSL de 256 bits</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-300 font-medium">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">Binance Pay</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">USDT / Cripto</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">Tarjetas Visa / MC</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">Zelle</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">PayPal</span>
                </div>
              </div>
            </div>

            {/* Checklist de especificaciones / características destacadas */}
            {landing.features && landing.features.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Especificaciones & Garantías Oficiales:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-300">
                  {landing.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-[#0d0e14] border border-white/5 p-2.5 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-[#F2CA50] flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* BENEFICIOS DESTACADOS */}
        {landing.benefits && landing.benefits.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-white/10">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F2CA50]">
                ¿Por qué destaca este producto?
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Beneficios Que Transforman Tu Experiencia
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {landing.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#0e1017] border border-white/10 hover:border-[#F2CA50]/40 transition-all space-y-3 shadow-lg"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-black shadow-md font-bold"
                    style={{ backgroundColor: themeAccent }}
                  >
                    <Sparkles className="w-5 h-5 text-black" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{benefit.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* COMPARATIVA DE ALTA CONVERSIÓN: ALDRI SHOP VS OTROS */}
        <section className="space-y-6 pt-6 border-t border-white/10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Calidad y Confianza Garantizada
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              ¿Por Qué Elegir Aldri Shop?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {/* Columna Aldri Shop */}
            <div className="p-6 rounded-2xl bg-[#0f141a] border-2 border-emerald-500/50 space-y-4 shadow-xl relative">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <span className="font-extrabold text-base text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> En Aldri Shop
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full">
                  Original & Seguro
                </span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Producto 100% original con especificaciones reales</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>
                    {isDigital
                      ? "Licencia oficial con activación garantizada y soporte"
                      : "Envío rápido directo con guía USPS rastreable"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Múltiples métodos de pago: Binance Pay, Cripto, Zelle, Tarjeta</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Atención al cliente personalizada y en tiempo real</span>
                </li>
              </ul>
            </div>

            {/* Columna Otros Sitios / Réplicas */}
            <div className="p-6 rounded-2xl bg-[#140e10] border border-red-500/30 space-y-4 shadow-xl opacity-80">
              <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
                <span className="font-bold text-base text-red-400 flex items-center gap-2">
                  <X className="w-5 h-5" /> Otras Tiendas / Copias
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-300 px-2.5 py-0.5 rounded-full">
                  Riesgo Alto
                </span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Réplicas genéricas que fallan tras pocas semanas de uso</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Envíos sin número de guía o claves revocadas por el fabricante</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Pasarelas poco confiables y riesgo de cobros no autorizados</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>Cero atención postventa una vez realizado el pago</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* RESEÑAS VERIFICADAS */}
        {landing.reviews && landing.reviews.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-white/10">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Opiniones Reales
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Lo Que Dicen Quienes Ya Lo Probaron
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {landing.reviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#0e1017] border border-white/10 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex text-[#F2CA50]">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#F2CA50] text-[#F2CA50]" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-300 italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                    <div className="w-9 h-9 rounded-full bg-[#161822] border border-white/10 flex items-center justify-center font-black text-xs text-[#F2CA50]">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        {rev.name}
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </h4>
                      <p className="text-[11px] text-slate-500">{rev.location || "Cliente Verificado"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PREGUNTAS FRECUENTES (FAQ) */}
        {landing.faqs && landing.faqs.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-white/10 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F2CA50]">
                Respuestas Inmediatas
              </span>
              <h2 className="text-2xl font-extrabold text-white">
                Preguntas Frecuentes
              </h2>
            </div>

            <div className="space-y-3">
              {landing.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-white/10 rounded-2xl bg-[#0e1017] overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-[#F2CA50] transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#F2CA50]" : "text-slate-400"
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* BANNER CTA FINAL */}
        <section className="rounded-3xl p-8 sm:p-10 text-center bg-gradient-to-b from-[#12141c] to-[#07070a] border border-white/10 shadow-[0_15px_60px_rgba(0,0,0,0.9)] space-y-6">
          <div className="max-w-xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              Oferta termina en: {String(timeLeft.minutes).padStart(2, "0")}m {String(timeLeft.seconds).padStart(2, "0")}s
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              No Dejes Pasar Esta Oportunidad
            </h2>
            <p className="text-slate-400 text-sm">
              Consigue el <strong>{activePack.title}</strong> por solo{" "}
              <strong className="text-white">${activePack.price.toFixed(2)} USD</strong> con entrega prioritaria.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={handleCTA}
              disabled={isSubmitting}
              className="w-full py-4 px-8 rounded-xl font-black text-base text-black shadow-[0_4px_30px_rgba(242,202,80,0.3)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase cursor-pointer"
              style={{ backgroundColor: themeAccent }}
            >
              <span>{landing.ctaText || `Comprar Ahora por $${activePack.price.toFixed(2)}`}</span>
              <ArrowRight className="w-5 h-5 text-black" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer Minimalista */}
      <footer className="border-t border-white/10 bg-[#060608] px-4 py-8 text-center text-xs text-slate-500 space-y-2 mb-20 md:mb-0">
        <p>© {new Date().getFullYear()} Aldri Shop. Todos los derechos reservados.</p>
        <p className="text-[11px] text-slate-400">
          Pagos seguros con cifrado bancario SSL de 256 bits. Aceptamos Binance Pay, Cripto, Tarjetas y Zelle.
        </p>
      </footer>

      {/* STICKY CTA BARRA FLOTANTE EN MÓVILES */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0d12]/95 backdrop-blur-md border-t border-white/10 p-3 shadow-[0_-5px_20px_rgba(0,0,0,0.8)] flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">
            {activePack.title}
          </span>
          <span className="text-lg font-black text-white leading-none">
            ${activePack.price.toFixed(2)}
          </span>
        </div>
        <button
          onClick={handleCTA}
          disabled={isSubmitting}
          className="flex-1 py-3 px-4 rounded-xl font-black text-xs text-black shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
          style={{ backgroundColor: themeAccent }}
        >
          {landing.ctaType === "whatsapp" ? (
            <MessageCircle className="w-4 h-4 text-black" />
          ) : (
            <ShoppingCart className="w-4 h-4 text-black" />
          )}
          <span>{landing.ctaText || "¡Comprar Ahora!"}</span>
        </button>
      </div>
    </div>
  );
}