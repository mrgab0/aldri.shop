"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Rocket,
  Sparkles,
  ArrowLeft,
  Save,
  Loader2,
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageCircle,
  ShoppingCart,
  Star,
} from "lucide-react";
import {
  createLandingPage,
  updateLandingPage,
  checkSubdomainAvailability,
  getProductsForLandingSelector,
} from "@/lib/actions/landing";

interface LandingFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const THEME_COLORS = [
  { name: "Naranja Fuego", value: "#ea580c" },
  { name: "Verde Esmeralda", value: "#059669" },
  { name: "Azul Royal", value: "#2563eb" },
  { name: "Púrpura Lujo", value: "#7c3aed" },
  { name: "Rosa Vibrante", value: "#db2777" },
  { name: "Dorado / Ámbar", value: "#d97706" },
];

export function LandingForm({ initialData, isEditing = false }: LandingFormProps) {
  const router = useRouter();

  // Estados de carga y listas
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Campos principales del formulario
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    subdomain: initialData?.subdomain || "",
    productId: initialData?.productId?._id || initialData?.productId || "",
    headline: initialData?.headline || "",
    subheadline: initialData?.subheadline || "",
    heroBadge: initialData?.heroBadge || "🔥 Oferta Especial de Lanzamiento",
    promoPrice: initialData?.promoPrice || 0,
    originalPrice: initialData?.originalPrice || 0,
    discountPercentage: initialData?.discountPercentage || 40,
    countdownMinutes: initialData?.countdownMinutes || 15,
    themeColor: initialData?.themeColor || "#ea580c",
    ctaText: initialData?.ctaText || "Comprar Ahora con Descuento",
    ctaType: (initialData?.ctaType as "checkout" | "whatsapp") || "checkout",
    whatsappMessage: initialData?.whatsappMessage || "",
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  });

  // Listas dinámicas
  const [benefits, setBenefits] = useState<Array<{ title: string; description: string }>>(
    initialData?.benefits || [
      { title: "Envío Garantizado", description: "Rastreo en tiempo real y seguro de entrega en tu pedido." },
      { title: "Calidad Premium", description: "Fabricado con materiales de la más alta durabilidad probada." },
      { title: "Garantía de Satisfacción", description: "Soporte dedicado 24/7 y garantía de reemplazo." },
    ]
  );

  const [features, setFeatures] = useState<string[]>(
    initialData?.features || [
      "100% Original con garantía oficial",
      "Manual de usuario en español",
      "Empaque sellado de fábrica",
      "Atención al cliente personalizada",
    ]
  );

  const [reviews, setReviews] = useState<Array<{ name: string; location: string; rating: number; comment: string }>>(
    initialData?.reviews || [
      {
        name: "Carlos Mendoza",
        location: "Houston, TX",
        rating: 5,
        comment: "Excelente calidad, llegó exactamente como se describía y muy rápido.",
      },
      {
        name: "Mariana Silva",
        location: "Miami, FL",
        rating: 5,
        comment: "Lo compré con el descuento y superó mis expectativas. 100% recomendado.",
      },
      {
        name: "David Rodríguez",
        location: "Los Angeles, CA",
        rating: 5,
        comment: "La atención de Aldri Shop fue genial, resolvieron todas mis dudas de inmediato.",
      },
    ]
  );

  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>(
    initialData?.faqs || [
      {
        question: "¿Cuánto tarda en llegar mi pedido?",
        answer: "Los envíos se procesan inmediatamente y la entrega suele tomar entre 2 a 5 días hábiles con número de rastreo incluido.",
      },
      {
        question: "¿Qué métodos de pago aceptan?",
        answer: "Aceptamos Zelle, CashApp, Tarjetas de Crédito/Débito, PayPal y pagos electrónicos 100% seguros con cifrado SSL.",
      },
      {
        question: "¿Tiene garantía?",
        answer: "Sí, todos nuestros productos cuentan con garantía directa de satisfacción o reemplazo.",
      },
    ]
  );

  // Cargar productos para el selector
  useEffect(() => {
    async function load() {
      setLoadingProducts(true);
      const res = await getProductsForLandingSelector();
      if (res.success && res.data) {
        setProducts(res.data);
      }
      setLoadingProducts(false);
    }
    load();
  }, []);

  // Al seleccionar producto, autocompletar datos básicos si están vacíos
  const handleSelectProduct = (productId: string) => {
    setFormData((prev) => ({ ...prev, productId }));
    const prod = products.find((p) => p._id === productId);
    if (prod) {
      if (!formData.title) {
        setFormData((prev) => ({ ...prev, title: prod.name }));
      }
      if (!formData.subdomain) {
        const slug = (prod.slug || prod.name)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .substring(0, 30);
        setFormData((prev) => ({ ...prev, subdomain: slug }));
      }
      if (!formData.promoPrice || formData.promoPrice === 0) {
        setFormData((prev) => ({
          ...prev,
          promoPrice: prod.price || 0,
          originalPrice: prod.compareAtPrice || Math.round((prod.price || 0) * 1.4),
        }));
      }
    }
  };

  // Generar contenido con IA (Gemini)
  const handleGenerateAI = async () => {
    const selectedProd = products.find((p) => p._id === formData.productId);
    const productName = selectedProd?.name || formData.title;

    if (!productName || productName.trim() === "") {
      setStatusMessage({
        type: "error",
        text: "Por favor selecciona un producto o escribe un título antes de redactar con IA.",
      });
      return;
    }

    setGeneratingAi(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/landings/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          category: selectedProd?.category || "Tendencia",
          description: selectedProd?.description || "",
          price: formData.promoPrice || selectedProd?.price || 0,
        }),
      });

      const data = await res.json();
      if (data.success && data.content) {
        const c = data.content;
        setFormData((prev) => ({
          ...prev,
          headline: c.headline || prev.headline,
          subheadline: c.subheadline || prev.subheadline,
          heroBadge: c.heroBadge || prev.heroBadge,
          ctaText: c.ctaText || prev.ctaText,
          whatsappMessage: c.whatsappMessage || prev.whatsappMessage,
        }));

        if (c.benefits && Array.isArray(c.benefits)) {
          setBenefits(c.benefits);
        }
        if (c.features && Array.isArray(c.features)) {
          setFeatures(c.features);
        }
        if (c.reviews && Array.isArray(c.reviews)) {
          setReviews(c.reviews);
        }
        if (c.faqs && Array.isArray(c.faqs)) {
          setFaqs(c.faqs);
        }

        setStatusMessage({
          type: "success",
          text: "¡Contenido redactado exitosamente por IA con técnicas de alta conversión!",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "No se pudo generar el contenido con IA.",
        });
      }
    } catch (e: any) {
      setStatusMessage({
        type: "error",
        text: "Error de conexión al generar con IA: " + e.message,
      });
    } finally {
      setGeneratingAi(false);
    }
  };

  // Guardar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    const cleanSubdomain = formData.subdomain.toLowerCase().trim();
    if (!cleanSubdomain || !/^[a-z0-9-]+$/.test(cleanSubdomain)) {
      setStatusMessage({
        type: "error",
        text: "El subdominio solo puede contener letras minúsculas, números y guiones.",
      });
      setSubmitting(false);
      return;
    }

    // Verificar disponibilidad de subdominio
    const avail = await checkSubdomainAvailability(cleanSubdomain, isEditing ? initialData?._id : undefined);
    if (!avail.available) {
      setStatusMessage({
        type: "error",
        text: `El subdominio "${cleanSubdomain}" ya está en uso. Por favor elige otro.`,
      });
      setSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      subdomain: cleanSubdomain,
      benefits,
      features,
      reviews,
      faqs,
    };

    let res;
    if (isEditing) {
      res = await updateLandingPage(initialData._id, payload);
    } else {
      res = await createLandingPage(payload);
    }

    setSubmitting(false);

    if (res.success) {
      router.push("/admin/landings");
      router.refresh();
    } else {
      setStatusMessage({
        type: "error",
        text: res.error || "Ocurrió un error al guardar la landing page.",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Botón Volver & Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/landings"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isEditing ? "Editar Landing Page" : "Nueva Landing Page de Alta Conversión"}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Diseñada específicamente para tráfico directo desde anuncios.
            </p>
          </div>
        </div>

        {/* Botón IA flotante en el header */}
        <button
          type="button"
          onClick={handleGenerateAI}
          disabled={generatingAi}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          {generatingAi ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-300" />
          )}
          <span>{generatingAi ? "Redactando..." : "Redactar con IA"}</span>
        </button>
      </div>

      {/* Mensajes de Estado */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-sm flex items-start gap-3 border ${
            statusMessage.type === "success"
              ? "bg-emerald-950/40 border-emerald-800 text-emerald-200"
              : "bg-red-950/40 border-red-800 text-red-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECCIÓN 1: VINCULACIÓN Y SUBDOMINIO */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Globe className="w-5 h-5 text-amber-400" />
            1. Producto & Dirección Web (Subdominio)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Selector de Producto */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Vincular Producto del Catálogo
              </label>
              <select
                value={formData.productId}
                onChange={(e) => handleSelectProduct(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="">-- Seleccionar producto (opcional) --</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} (${p.price})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Al elegirlo, autocompletará precios e imágenes automáticamente.
              </p>
            </div>

            {/* Subdominio */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Subdominio Exclusivo <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  required
                  placeholder="ej: cargador-mag"
                  value={formData.subdomain}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-l-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                />
                <span className="bg-slate-800 border border-l-0 border-slate-800 px-3 py-2.5 text-xs text-amber-400 font-mono rounded-r-xl">
                  .aldri.shop
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Disponible en: <span className="text-slate-300 font-mono">aldri.shop/l/{formData.subdomain || "slug"}</span>
              </p>
            </div>
          </div>

          {/* Título Interno */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Título Interno de la Campaña <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="ej: Cargador Magnético Inalámbrico 3 en 1 - Campaña TikTok"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* SECCIÓN 2: TEXTOS DEL HERO & COPYWRITING */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              2. Textos Persuasivos del Hero
            </h2>
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={generatingAi}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Reescribir con IA
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Badge Superior del Hero
              </label>
              <input
                type="text"
                value={formData.heroBadge}
                onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                placeholder="🔥 Oferta Especial de Lanzamiento"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Titular Principal (Headline) <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                placeholder="ej: Carga Todos Tus Dispositivos a la Vez Sin Enredos de Cables"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400 resize-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Subtitular Explicativo (Subheadline)
              </label>
              <textarea
                rows={2}
                value={formData.subheadline}
                onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                placeholder="ej: Diseño plegable ultra compacto compatible con iPhone, Apple Watch y AirPods. Ideal para viajes y oficina."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: PRECIOS, URGENCIA Y TEMA */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Rocket className="w-5 h-5 text-amber-400" />
            3. Precios, Urgencia y Botón CTA
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Precio de Oferta ($)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.promoPrice}
                onChange={(e) => setFormData({ ...formData, promoPrice: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Precio Original / Antes ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Reloj Regresivo (Minutos)
              </label>
              <input
                type="number"
                value={formData.countdownMinutes}
                onChange={(e) => setFormData({ ...formData, countdownMinutes: parseInt(e.target.value) || 15 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          {/* Color del Tema */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Color de Acento del Tema
            </label>
            <div className="flex flex-wrap gap-3">
              {THEME_COLORS.map((color) => (
                <button
                  type="button"
                  key={color.value}
                  onClick={() => setFormData({ ...formData, themeColor: color.value })}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                    formData.themeColor === color.value
                      ? "border-white bg-slate-800 text-white shadow-md"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: color.value }}
                  />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Configuración de Acción del Botón CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tipo de Botón CTA
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, ctaType: "checkout" })}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                    formData.ctaType === "checkout"
                      ? "border-amber-400 bg-amber-500/10 text-amber-400"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Compra Directa</span>
                  <span className="text-[10px] font-normal text-slate-400">Va al Checkout</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, ctaType: "whatsapp" })}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                    formData.ctaType === "whatsapp"
                      ? "border-emerald-400 bg-emerald-500/10 text-emerald-400"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                  <span className="text-[10px] font-normal text-slate-400">Cierre 1-a-1</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Texto del Botón CTA
              </label>
              <input
                type="text"
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                placeholder="Comprar Ahora con Descuento"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />

              {formData.ctaType === "whatsapp" && (
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mensaje predeterminado de WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappMessage}
                    onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                    placeholder="¡Hola! Quiero ordenar la oferta con descuento..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECCIÓN 4: BENEFICIOS (3 TARJETAS) */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              4. Beneficios Clave ({benefits.length})
            </h2>
            <button
              type="button"
              onClick={() => setBenefits([...benefits, { title: "Nuevo Beneficio", description: "Descripción detallada del beneficio." }])}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-medium"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar Beneficio
            </button>
          </div>

          <div className="space-y-3">
            {benefits.map((b, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={b.title}
                    onChange={(e) => {
                      const updated = [...benefits];
                      updated[idx].title = e.target.value;
                      setBenefits(updated);
                    }}
                    placeholder="Título del beneficio"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setBenefits(benefits.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={b.description}
                  onChange={(e) => {
                    const updated = [...benefits];
                    updated[idx].description = e.target.value;
                    setBenefits(updated);
                  }}
                  placeholder="Descripción del beneficio"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN 5: RESEÑAS VERIFICADAS */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              5. Reseñas y Testimonios ({reviews.length})
            </h2>
            <button
              type="button"
              onClick={() =>
                setReviews([
                  ...reviews,
                  { name: "Nuevo Cliente", location: "Cliente Verificado", rating: 5, comment: "Excelente producto." },
                ])
              }
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-medium"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar Reseña
            </button>
          </div>

          <div className="space-y-3">
            {reviews.map((r, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={r.name}
                    onChange={(e) => {
                      const updated = [...reviews];
                      updated[idx].name = e.target.value;
                      setReviews(updated);
                    }}
                    placeholder="Nombre del cliente"
                    className="w-1/3 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
                  />
                  <input
                    type="text"
                    value={r.location}
                    onChange={(e) => {
                      const updated = [...reviews];
                      updated[idx].location = e.target.value;
                      setReviews(updated);
                    }}
                    placeholder="Ubicación"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setReviews(reviews.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={r.comment}
                  onChange={(e) => {
                    const updated = [...reviews];
                    updated[idx].comment = e.target.value;
                    setReviews(updated);
                  }}
                  placeholder="Comentario de la reseña"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 resize-none italic"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN 6: PREGUNTAS FRECUENTES (FAQs) */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-400" />
              6. Preguntas Frecuentes ({faqs.length})
            </h2>
            <button
              type="button"
              onClick={() =>
                setFaqs([
                  ...faqs,
                  { question: "¿Nueva pregunta?", answer: "Respuesta clara y convincente." },
                ])
              }
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-medium"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar Pregunta
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[idx].question = e.target.value;
                      setFaqs(updated);
                    }}
                    placeholder="Pregunta frecuente"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => {
                    const updated = [...faqs];
                    updated[idx].answer = e.target.value;
                    setFaqs(updated);
                  }}
                  placeholder="Respuesta para calmar dudas del cliente"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* BOTÓN FINAL DE GUARDAR */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Link
            href="/admin/landings"
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isEditing ? "Guardar Cambios" : "Publicar Landing Page 🚀"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
