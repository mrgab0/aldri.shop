"use client";

import { useState, useCallback, useMemo, startTransition } from "react";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { AddonSelection } from "@/components/shop/AddonSelection";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { CheckCircle2, Download, Cpu, Zap, Package, Sparkles, ShieldCheck, Truck, Tag, ArrowDown, Gamepad2 } from "lucide-react";
import { useTranslations } from "next-intl";

export const ProductDetail = ({ product }: { product: any }) => {
  const t = useTranslations("ProductDetail");
  const [selectedAddons, setSelectedAddons] = useState<{ addonId: string; value?: string; price?: number; name?: string }[]>([]);
  const [lastAddonToast, setLastAddonToast] = useState<{ name: string; price: number } | null>(null);

  const images = useMemo(() => (
    product.images && product.images.length > 0
      ? product.images
      : ["https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&q=80&w=800"]
  ), [product.images]);

  const [activeImage, setActiveImage] = useState(images[0]);

  // Formateador de viñetas para la descripción
  const descriptionBullets = useMemo(() => (
    (product.description || "")
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
  ), [product.description]);

  // Cálculo Dinámico del Precio Combinado (Base + Adicionales)
  const basePrice = Number(product.price || 0);
  const { addonsTotalPrice, combinedTotalPrice } = useMemo(() => {
    const addonsTotal = selectedAddons.reduce((acc, curr) => acc + (curr.price || 0), 0);
    return {
      addonsTotalPrice: addonsTotal,
      combinedTotalPrice: basePrice + addonsTotal
    };
  }, [selectedAddons, basePrice]);

  const handleSelectionChange = useCallback((newSelection: { addonId: string; value?: string; price?: number; name?: string }[]) => {
    setSelectedAddons(newSelection);
    // Si se añadió un nuevo adicional, disparamos el tooltip de forma no bloqueante con startTransition
    if (newSelection.length > selectedAddons.length) {
      const added = newSelection[newSelection.length - 1];
      if (added && added.name) {
        startTransition(() => {
          setLastAddonToast({ name: added.name || "Adicional", price: added.price || 0 });
        });
        setTimeout(() => {
          startTransition(() => {
            setLastAddonToast(null);
          });
        }, 4500);
      }
    }
  }, [selectedAddons.length]);

  return (
    <div className="min-h-screen gold-ambient-mesh text-white flex flex-col font-sans transition-colors duration-300">
      {/* Header Visible con Logo al Home y Carrito */}
      <ShopHeader />

      {/* Contenido Principal */}
      <main className="flex-1 py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl space-y-10">
          
          {/* Tarjeta Principal de Producto en Material Glass */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 glass-panel-luxury p-6 md:p-10 rounded-[32px] border border-white/10 shadow-2xl">
            
            {/* COLUMNA IZQUIERDA: Galería de Imágenes (hasta 7 fotos) */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-b from-[#121218]/70 to-[#07070A]/90 border border-white/10 shadow-lg group flex items-center justify-center p-3">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain p-2 transform group-hover:scale-105 transition-transform duration-700 ease-out drop-shadow-md"
                />
                
                {/* Insignia o Categoría Flotante */}
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <span className="glass-pill text-zinc-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                    {product.category}
                  </span>
                  {product.badge && (
                    <span className="glass-btn-gold text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Sparkles size={10} className="text-black" />
                      {product.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Tira de Miniaturas Seleccionables */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                        activeImage === img ? "border-[#F2CA50] ring-2 ring-[#F2CA50]/40 scale-105" : "border-white/10 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* COLUMNA DERECHA: Información y Especificaciones Estructuradas */}
            <div className="flex flex-col space-y-6">
              
              {/* Titular y Precio Dinámico */}
              <div>
                <span className="text-[#F2CA50] text-xs font-black uppercase tracking-[0.25em] block mb-1">
                  {product.category || "Colección Oficial Aldri Shop"}
                </span>
                <h1 className="text-3xl md:text-5xl font-serif font-black text-white leading-tight mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-baseline gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-5xl font-black text-[#F2CA50] font-sans tracking-tight transition-all drop-shadow-[0_0_15px_rgba(242,202,80,0.35)]">
                      ${combinedTotalPrice.toFixed(2)} <span className="text-sm text-zinc-300 font-bold">USD</span>
                    </span>
                    {addonsTotalPrice > 0 && (
                      <span className="text-xs text-zinc-500 line-through font-bold">
                        ${basePrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {addonsTotalPrice > 0 && (
                    <span className="glass-pill text-[#F2CA50] text-xs font-black px-3.5 py-1 rounded-full border border-amber-400/30 flex items-center gap-1 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                      <Sparkles size={13} className="text-[#F2CA50]" /> +${addonsTotalPrice.toFixed(2)} en adicionales
                    </span>
                  )}
                </div>
              </div>

              {/* CAJA VISUAL DE ESPECIFICACIONES EN MATERIAL GLASS */}
              <div className="glass-card-radical rounded-2xl p-5 border border-white/10 space-y-3.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#F2CA50] flex items-center gap-2">
                  <Sparkles size={14} className="text-[#F2CA50]" /> Especificaciones del Producto
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  {product.productType === 'digital' ? (
                    <>
                      <div className="glass-pill p-3 rounded-xl border border-white/10 flex items-center gap-2.5">
                        <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-lg">
                          <Package size={16} />
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[10px] uppercase font-bold">Tipo</span>
                          <span className="font-bold text-white">
                            {product.digitalAsset?.fileType || "Producto Digital"}
                          </span>
                        </div>
                      </div>

                      <div className="glass-pill p-3 rounded-xl border border-white/10 flex items-center gap-2.5">
                        <div className="p-2 bg-amber-500/20 text-[#F2CA50] rounded-lg">
                          <Truck size={16} />
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[10px] uppercase font-bold">Entrega</span>
                          <span className="font-bold text-[#F2CA50]">⚡ Inmediata 24/7</span>
                        </div>
                      </div>

                      <div className="glass-pill p-3 rounded-xl border border-white/10 flex items-center gap-2.5">
                        <div className="p-2 bg-amber-500/20 text-[#F2CA50] rounded-lg">
                          <ShieldCheck size={16} />
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[10px] uppercase font-bold">Acceso</span>
                          <span className="font-bold text-white">24/7 de por vida</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="glass-pill p-3 rounded-xl border border-white/10 flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg">
                          <Package size={16} />
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[10px] uppercase font-bold">Logística</span>
                          <span className="font-bold text-white">Envío Directo</span>
                        </div>
                      </div>

                      <div className="glass-pill p-3 rounded-xl border border-white/10 flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg">
                          <Truck size={16} />
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[10px] uppercase font-bold">Tiempo Estimado</span>
                          <span className="font-bold text-white">
                            {product.dropshipInfo?.estimatedDeliveryDays || "7-12 días hábiles"}
                          </span>
                        </div>
                      </div>

                      <div className="glass-pill p-3 rounded-xl border border-white/10 flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg">
                          <ShieldCheck size={16} />
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[10px] uppercase font-bold">Garantía</span>
                          <span className="font-bold text-white">Rastreo Incluido</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* VIÑETAS / CARACTERÍSTICAS DINÁMICAS (Features) */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">{t('includesTitle')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features.map((feature: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-xs glass-pill p-2.5 rounded-xl border border-white/10">
                        <CheckCircle2 size={16} className="text-[#F2CA50] flex-shrink-0" />
                        <span className="font-medium text-zinc-200">
                          <strong className="text-white">{feature.label}:</strong> {feature.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECCIÓN DE ADICIONALES COMPATIBLES */}
              {product.addons && product.addons.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <Tag size={14} className="text-[#F2CA50]" /> {t('addonsTitle')}
                  </h3>
                  <AddonSelection addons={product.addons} onSelectionChange={handleSelectionChange} />
                </div>
              )}

              {/* DESCRIPCIÓN SECTORIZADA EN VIÑETAS LIMPIAS */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">{t('descriptionTitle')}</h3>
                <div className="glass-card-radical p-5 rounded-2xl border border-white/10 space-y-2 text-sm text-zinc-300 font-light leading-relaxed">
                  {descriptionBullets.map((paragraph: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F2CA50] mt-2 flex-shrink-0 shadow-[0_0_6px_#F2CA50]" />
                      <p>{paragraph}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTÓN AGREGAR AL CARRITO CON ANIMACIÓN GAMIFICADA Y NOTIFICACIÓN */}
              <div className="pt-4 mt-auto space-y-3 relative">

                {/* Toast / Tooltip Flotante Animado cuando se selecciona un adicional */}
                {lastAddonToast && (
                  <div className="p-3 bg-[#161619] text-white rounded-2xl shadow-xl border border-[#D4AF37]/40 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-[#D4AF37] rounded-lg text-black">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <span className="text-xs font-extrabold block text-white">¡+1 {lastAddonToast.name} añadido a tu pedido!</span>
                        <span className="text-[10px] text-amber-200/80 font-medium">Sumado al total: ${combinedTotalPrice.toFixed(2)} USD</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-black bg-[#D4AF37] px-2.5 py-1 rounded-full">
                      +${lastAddonToast.price.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Banner elegante con señalización cuando hay adicionales */}
                {selectedAddons.length > 0 && (
                  <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-[#D4AF37]/20 to-amber-500/10 text-gray-900 dark:text-white rounded-2xl shadow-sm border border-[#D4AF37]/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Sparkles size={18} className="text-[#D4AF37] animate-spin duration-1000" />
                      <span className="text-xs font-black tracking-wide">
                        Configuración personalizada lista con {selectedAddons.length} adicional{selectedAddons.length > 1 ? 'es' : ''}
                      </span>
                    </div>
                    <ArrowDown size={18} className="text-[#D4AF37] animate-pulse" />
                  </div>
                )}

                <AddToCartButton
                  product={{
                    ...product,
                    price: combinedTotalPrice,
                    selectedAddons
                  }}
                />
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

