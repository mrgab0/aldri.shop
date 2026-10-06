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
} from "lucide-react";

interface LandingPageViewProps {
  landing: {
    _id: string;
    title: string;
    subdomain: string;
    productId?: any;
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
  };
}

export function LandingPageView({ landing }: LandingPageViewProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({ minutes: landing.countdownMinutes || 15, seconds: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Imágenes disponibles (customImages o del producto)
  const product = landing.productId;
  const images: string[] = (landing.customImages && landing.customImages.length > 0)
    ? landing.customImages
    : (product?.images && product.images.length > 0)
      ? product.images
      : ["/logo.png"];

  // Precios
  const price = landing.promoPrice || product?.price || 0;
  const originalPrice = landing.originalPrice || (price > 0 ? Math.round(price * 1.5) : 0);
  const discount = landing.discountPercentage || 
    (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 35);

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

    // Track click
    try {
      await trackLandingClick(landing.subdomain);
    } catch (e) {
      console.error(e);
    }

    if (landing.ctaType === "whatsapp") {
      const defaultMsg = `¡Hola Aldri Shop! Quiero ordenar "${landing.title}" con la oferta especial (${landing.subdomain}.aldri.shop).`;
      const msg = encodeURIComponent(landing.whatsappMessage || defaultMsg);
      const whatsappUrl = `https://wa.me/18322899478?text=${msg}`;
      window.open(whatsappUrl, "_blank");
      setIsSubmitting(false);
    } else {
      // Agregar al carrito y enviar al checkout
      if (product) {
        addToCart({
          id: product._id || landing._id,
          name: product.name || landing.title,
          price: price,
          image: images[0] || "/logo.png",
          productType: product.productType || "dropship",
        });
      } else {
        addToCart({
          id: landing._id,
          name: landing.title,
          price: price,
          image: images[0] || "/logo.png",
          productType: "dropship",
        });
      }
      router.push("/checkout");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Banner de Urgencia */}
      <div 
        className="text-white text-xs md:text-sm py-2 px-4 text-center font-bold flex items-center justify-center gap-2 shadow-inner"
        style={{ backgroundColor: landing.themeColor || "#ea580c" }}
      >
        <Flame className="w-4 h-4 animate-bounce" />
        <span>{landing.heroBadge || "🔥 OFERTA EXCLUSIVA - SOLO POR HOY"}</span>
        <span className="hidden sm:inline">|</span>
        <span className="bg-black/30 px-2 py-0.5 rounded text-white font-mono">
          Expira en: {String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
        </span>
      </div>

      {/* Header Minimalista */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-500/30">
              <Image src="/logo.png" alt="Aldri Shop" fill className="object-cover" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Aldri <span className="text-amber-400">Shop</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Compra 100% Segura y Verificada</span>
            <span className="sm:hidden">Compra Segura</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 md:py-12 space-y-12">
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Columna Izquierda: Galería */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
              <Image
                src={images[selectedImageIndex] || "/logo.png"}
                alt={landing.title}
                fill
                priority
                className="object-cover transition-all duration-300 hover:scale-105"
              />
              {discount > 0 && (
                <div className="absolute top-3 left-3 bg-red-600 text-white font-black text-xs md:text-sm px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider animate-pulse">
                  -{discount}% OFF
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? "border-amber-400 scale-105 shadow-md"
                        : "border-slate-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`${landing.title} thumbnail ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columna Derecha: Oferta y Copy Persuasivo */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span>+1,480 Clientes Satisfechos</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                {landing.headline}
              </h1>

              {landing.subheadline && (
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  {landing.subheadline}
                </p>
              )}
            </div>

            {/* Tarjeta de Precios & Urgencia */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800/80 border border-slate-700/80 shadow-xl space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-white">
                  ${price.toFixed(2)}
                </span>
                {originalPrice > price && (
                  <span className="text-base sm:text-lg text-slate-400 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  Ahorras ${(originalPrice - price).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-amber-300/90 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  La oferta se acaba en:{" "}
                  <strong className="font-mono text-white">
                    {String(timeLeft.minutes).padStart(2, "0")}m {String(timeLeft.seconds).padStart(2, "0")}s
                  </strong>
                </span>
              </div>

              {/* Botón CTA Grande */}
              <button
                onClick={handleCTA}
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl font-black text-base sm:text-lg text-white shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-wide cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: landing.themeColor || "#ea580c" }}
              >
                {landing.ctaType === "whatsapp" ? (
                  <MessageCircle className="w-6 h-6" />
                ) : (
                  <ShoppingCart className="w-6 h-6" />
                )}
                <span>{landing.ctaText || "Comprar Ahora"}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-400" /> Envío Rápido
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> Pago 100% Seguro
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> Garantía de Calidad
                </span>
              </div>
            </div>

            {/* Checklist de especificaciones / características clave */}
            {landing.features && landing.features.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Lo que incluye / Características destacadas:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-300">
                  {landing.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
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
          <section className="space-y-6 pt-6 border-t border-slate-800">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                ¿Por qué te encantará?
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Beneficios Que Hacen La Diferencia
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {landing.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: landing.themeColor || "#ea580c" }}
                  >
                    <Sparkles className="w-6 h-6" />
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

        {/* RESEÑAS VERIFICADAS */}
        {landing.reviews && landing.reviews.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-slate-800">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Testimonios Reales
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Lo Que Opinan Nuestros Clientes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {landing.reviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-300 italic">
                      "{rev.comment}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1">
                        {rev.name}
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </h4>
                      <p className="text-[11px] text-slate-400">{rev.location || "Cliente Verificado"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PREGUNTAS FRECUENTES (FAQ) */}
        {landing.faqs && landing.faqs.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-slate-800 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                ¿Tienes Dudas?
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
                    className="border border-slate-800 rounded-xl bg-slate-900/50 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-4 flex items-center justify-between gap-4 font-semibold text-sm text-white hover:text-amber-400"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 flex-shrink-0 transition-transform ${
                          isOpen ? "rotate-180 text-amber-400" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
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
        <section className="rounded-3xl p-8 text-center bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-6">
          <div className="max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              ¡Aprovecha El Descuento Antes de Que Se Agote!
            </h2>
            <p className="text-slate-400 text-sm">
              Garantía de satisfacción y soporte dedicado para responder cualquier inquietud.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={handleCTA}
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl font-black text-base text-white shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase cursor-pointer"
              style={{ backgroundColor: landing.themeColor || "#ea580c" }}
            >
              <span>{landing.ctaText || "Comprar Ahora"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer Minimalista */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-4 py-8 text-center text-xs text-slate-500 space-y-2 mb-16 md:mb-0">
        <p>© {new Date().getFullYear()} Aldri Shop. Todos los derechos reservados.</p>
        <p className="text-[11px] text-slate-400">
          Pagos encriptados con seguridad SSL de 256 bits.
        </p>
      </footer>

      {/* STICKY CTA BARRA FLOTANTE EN MÓVILES */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 line-through">
            ${originalPrice.toFixed(2)}
          </span>
          <span className="text-lg font-black text-white leading-none">
            ${price.toFixed(2)}
          </span>
        </div>
        <button
          onClick={handleCTA}
          disabled={isSubmitting}
          className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
          style={{ backgroundColor: landing.themeColor || "#ea580c" }}
        >
          {landing.ctaType === "whatsapp" ? (
            <MessageCircle className="w-4 h-4" />
          ) : (
            <ShoppingCart className="w-4 h-4" />
          )}
          <span>{landing.ctaText || "Comprar Ahora"}</span>
        </button>
      </div>
    </div>
  );
}
