"use client";

import { useState } from "react";
import { getOrderById } from "@/lib/actions/order";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { Footer } from "@/components/shop/Footer";
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, User, MessageCircle, AlertCircle, Sparkles, Store, Gift } from "lucide-react";

export default function RastreoPedidoPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setOrder(null);

    const res = await getOrderById(query.trim());
    setLoading(false);

    if (res.success && res.data) {
      setOrder(res.data);
    } else {
      setError("No encontramos ningún pedido con ese ID o teléfono. Verifica los datos e intenta de nuevo.");
    }
  };

  const isPickupOrder = (method: string) => {
    const m = (method || "").toLowerCase();
    return m.includes("pickup") || m.includes("retiro") || m.includes("boutique") || m.includes("tienda");
  };

  const getStatusStep = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("entregado") || s.includes("retirado") || s.includes("delivered") || s.includes("completed")) return 3;
    if (s.includes("en camino") || s.includes("listo para retirar") || s.includes("listo") || s.includes("despachado")) return 2;
    if (s.includes("espera de despacho") || s.includes("en armado") || s.includes("preparando") || s.includes("en diseño")) return 1;
    return 0; // Confirmado / Recibido
  };

  return (
    <div className="min-h-screen bg-[#060608] gold-ambient-mesh text-white flex flex-col">
      <ShopHeader />

      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl space-y-8">
          {/* Header de Rastreo */}
          <div className="text-center space-y-3">
            <span className="glass-pill text-[#F2CA50] border-amber-400/30 text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full inline-block shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              Seguimiento en Tiempo Real
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-white">
              Rastrear Mi Pedido
            </h1>
            <p className="text-sm text-zinc-400 font-medium max-w-lg mx-auto">
              Ingresa el ID de tu Pedido, correo o teléfono para consultar el estado de tu compra y descargar tus productos digitales.
            </p>
          </div>

          {/* Formulario de Búsqueda */}
          <form onSubmit={handleSearch} className="glass-panel-luxury p-4 md:p-6 rounded-3xl border border-white/10 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 text-zinc-400" size={18} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ej: ALDR-123456-1, tu correo o teléfono"
                  className="w-full pl-11 pr-4 py-3.5 border rounded-2xl text-sm font-bold text-white bg-[#0E0E12] placeholder:text-zinc-500 border-white/15 focus:outline-none focus:ring-2 focus:ring-[#F2CA50]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="glass-btn-gold text-[#060608] px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 select-none cursor-pointer"
              >
                {loading ? "Buscando..." : "Buscar Pedido"}
              </button>
            </div>

            {error && (
              <div className="p-3.5 bg-red-950/40 text-red-300 text-xs font-bold rounded-2xl border border-red-800 flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </form>

          {/* Resultado del Rastreo */}
          {order && (() => {
            const isDigital = order.orderType === 'digital' || (!order.orderType && order.deliveryMethod?.toLowerCase().includes('digital'));
            const currentStep = getStatusStep(order.status);

            // Definición de etapas dinámicas según si es Digital o Dropshipping
            const steps = isDigital
              ? [
                  { label: "1. Pago Verificado", sub: "Confirmado", icon: Clock },
                  { label: "2. Procesando", sub: "Activando licencias", icon: Sparkles },
                  { label: "3. Descargas Listas", sub: "Enlaces activos", icon: Package },
                  { label: "4. Completado", sub: "Acceso permanente", icon: CheckCircle2 }
                ]
              : [
                  { label: "1. Confirmado", sub: "Pago verificado", icon: Clock },
                  { label: "2. Preparando", sub: "Empaque por proveedor", icon: Package },
                  { label: "3. En Tránsito", sub: "Guía asignada", icon: Truck },
                  { label: "4. Entregado", sub: "Entregado a destino", icon: CheckCircle2 }
                ];

            return (
              <div className="glass-panel-luxury p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-8 animate-in fade-in duration-500">
                {/* Encabezado del Pedido */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-white/10">
                  <div>
                    <span className="text-xs text-zinc-400 font-mono block">ID de Orden: {order.orderId || order._id}</span>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <User size={16} className="text-[#F2CA50]" />
                      <span>{order.customerName}</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold border ${
                      currentStep === 3
                        ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                        : currentStep === 2
                        ? "bg-indigo-950 text-indigo-300 border-indigo-700"
                        : currentStep === 1
                        ? "bg-amber-950 text-[#F2CA50] border-amber-700"
                        : "bg-blue-950 text-blue-300 border-blue-700"
                    }`}>
                      {order.status || (isDigital ? "Completado" : "Confirmado")}
                    </span>
                  </div>
                </div>
                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
                    }`}>
                      {order.status || (isDigital ? "Completado" : "Confirmado")}
                    </span>
                  </div>
                </div>

                {/* Línea de Tiempo / Progreso de 4 Pasos Dinámicos */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      Progreso de {isDigital ? "Entrega Digital Instantánea ⚡" : "Envío a Domicilio 🚚"}
                    </h4>
                    <span className="text-xs font-bold text-indigo-600">Paso {currentStep + 1} de 4</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    {steps.map((st, idx) => {
                      const IconComp = st.icon;
                      const isDone = currentStep >= idx;
                      const isCurrent = currentStep === idx;

                      return (
                        <div key={idx} className="space-y-2">
                          <div className={`w-11 h-11 mx-auto rounded-2xl flex items-center justify-center font-bold text-xs transition-all ${
                            isCurrent
                              ? "bg-indigo-600 text-white ring-4 ring-indigo-500/20 scale-105 shadow-md"
                              : isDone
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                          }`}>
                            <IconComp size={20} />
                          </div>
                          <div>
                            <span className={`text-[11px] font-extrabold block leading-tight ${
                              isDone ? "text-[#1A1C1C] dark:text-white" : "text-gray-500 dark:text-gray-400"
                            }`}>
                              {st.label}
                            </span>
                            <span className="text-[9px] text-gray-600 dark:text-gray-300 font-semibold block hidden sm:block mt-0.5">
                              {st.sub}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Descargas Digitales si aplican */}
                {(isDigital || order.items?.some((i: any) => i.productType === 'digital')) && (
                  <div className="p-5 bg-[#0E0E12] rounded-2xl border border-amber-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#F2CA50] flex items-center gap-1.5">
                        <Sparkles size={16} className="text-[#D4AF37]" /> Descargas Digitales &amp; Licencias
                      </h4>
                      <span className="text-[10px] font-black glass-btn-gold text-[#060608] px-2.5 py-0.5 rounded-full shadow-sm">
                        Acceso Autorizado
                      </span>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((it: any, i: number) => {
                        const hasDownload = it.downloadUrl && it.downloadUrl.trim() !== "" && it.downloadUrl !== "#";
                        return (
                          <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm">
                            <div>
                              <span className="font-bold text-sm text-white block">{it.name}</span>
                              <span className="text-xs text-zinc-400">
                                {hasDownload 
                                  ? "Licencia activa • Acceso y actualizaciones de por vida" 
                                  : "Configurando licencia personalizada • Enviado directo a tu email"}
                              </span>
                            </div>
                            {hasDownload ? (
                              <a
                                href={it.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-btn-gold text-[#060608] font-black px-5 py-2.5 rounded-xl text-xs transition-all shadow-sm flex items-center gap-1.5 hover:scale-105 select-none"
                              >
                                <span>Descargar Activo 📥</span>
                              </a>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F2CA50] bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/30">
                                <Clock size={14} className="text-[#F2CA50] animate-pulse" />
                                <span>Asignando Licencia (Enviado a tu email)</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Guías de Seguimiento Multi-Proveedor o Guía Única */}
                {order.shipments && order.shipments.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-emerald-700 dark:text-emerald-300 tracking-wider block">
                        🚚 Paquetes y Guías de Envío ({order.shipments.length} {order.shipments.length === 1 ? 'Paquete' : 'Paquetes Separados'}):
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                        Despacho Multi-Almacén
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {order.shipments.map((pkg: any, idx: number) => {
                        const providerLabel = pkg.provider === 'zendrop' 
                          ? 'Zendrop (Almacén EE.UU. Exprés 2-5 días)' 
                          : pkg.provider === 'cjdropshipping' 
                          ? 'CJ Dropshipping (Almacén Global 7-12 días)' 
                          : 'Paquetería Exprés';
                        const effectiveUrl = pkg.trackingUrl || (pkg.trackingNumber ? `https://www.17track.net/es/track?nums=${encodeURIComponent(pkg.trackingNumber)}` : null);

                        return (
                          <div key={idx} className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/50 dark:border-emerald-800/50 pb-2">
                              <span className="text-xs font-black text-emerald-900 dark:text-emerald-200">
                                Paquete #{idx + 1}: {providerLabel}
                              </span>
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white dark:bg-gray-900 text-emerald-700 border border-emerald-200">
                                {pkg.status || 'En Proceso'}
                              </span>
                            </div>

                            <p className="text-xs font-bold text-gray-900 dark:text-white">
                              Transportadora: <span className="text-emerald-600">{pkg.trackingCarrier || 'Asignando transportadora'}</span>
                            </p>

                            {pkg.trackingNumber ? (
                              <p className="text-xs font-bold text-gray-900 dark:text-white">
                                Número de Guía: <span className="font-mono bg-white dark:bg-gray-900 px-2 py-0.5 rounded border border-emerald-200">{pkg.trackingNumber}</span>
                              </p>
                            ) : (
                              <p className="text-xs text-gray-500 italic">
                                Guía en proceso de generación por el almacén.
                              </p>
                            )}

                            {effectiveUrl && (
                              <div className="pt-1">
                                <a
                                  href={effectiveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-100/90 dark:bg-emerald-900/60 px-3.5 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 shadow-sm transition-all hover:scale-105"
                                >
                                  <span>Rastrear Paquete en 17Track 🌐 →</span>
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : order.trackingNumber ? (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300 tracking-wider block">
                      🚚 Información de Envío (Producto Físico):
                    </span>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      Transportadora: <span className="text-emerald-600">{order.trackingCarrier || 'Paquetería Exprés'}</span>
                    </p>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      Número de Guía: <span className="font-mono bg-white dark:bg-gray-900 px-2 py-0.5 rounded border border-emerald-200">{order.trackingNumber}</span>
                    </p>
                    {(() => {
                      const effectiveUrl = order.trackingUrl || `https://www.17track.net/es/track?nums=${encodeURIComponent(order.trackingNumber)}`;
                      return (
                        <div className="pt-1">
                          <a
                            href={effectiveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-100/80 dark:bg-emerald-900/60 px-3.5 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 shadow-sm transition-all hover:scale-105"
                          >
                            <span>Rastrear en Tiempo Real (17Track / Carrier) 🌐 →</span>
                          </a>
                        </div>
                      );
                    })()}
                  </div>
                ) : null}

                {/* Detalles de Entrega */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl space-y-1.5 border border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] font-black uppercase text-gray-700 dark:text-gray-300 tracking-wider block">
                      {isDigital ? "Método de Entrega:" : "Dirección de Entrega:"}
                    </span>
                    <p className="text-xs font-bold text-gray-900 dark:text-white flex items-start gap-1.5">
                      {isDigital ? (
                        <Sparkles size={15} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <MapPin size={15} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span>{order.address || (isDigital ? "Entrega Digital Instantánea" : "Dirección registrada")}</span>
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl space-y-1.5 border border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] font-black uppercase text-gray-700 dark:text-gray-300 tracking-wider block">Modalidad de Envío:</span>
                    <p className="text-xs font-bold text-gray-900 dark:text-white flex items-start gap-1.5">
                      <Truck size={15} className="text-purple-500 flex-shrink-0 mt-0.5" />
                      <span>{order.deliveryMethod || (isDigital ? "Descarga Inmediata" : "Envío a Domicilio")}</span>
                    </p>
                  </div>
                </div>

                {/* Ítems del Pedido */}
                {order.items && order.items.length > 0 && (
                  <div className="p-4 bg-gray-50/70 dark:bg-gray-900/60 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2">
                    <span className="text-[10px] font-black uppercase text-gray-700 dark:text-gray-300 tracking-wider block flex items-center gap-1">
                      <Gift size={13} className="text-indigo-600" /> Ítems del Pedido:
                    </span>
                    <div className="space-y-1 text-xs">
                      {order.items.map((it: any, i: number) => (
                        <div key={i} className="flex justify-between items-center font-bold text-gray-900 dark:text-gray-100">
                          <span>• {it.name} (x{it.quantity})</span>
                          <span>${(it.price * it.quantity).toFixed(2)} USD</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botón Directo a Soporte */}
                <div className="pt-2 text-center">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`¡Hola Aldri Shop! Quisiera consultar el estado de mi pedido ID: ${order.orderId || order._id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full text-xs font-bold transition-all shadow-md"
                  >
                    <MessageCircle size={16} />
                    <span>Contactar a Soporte de Aldri Shop</span>
                  </a>
                </div>
              </div>
            );
          })()}
        </div>
      </main>

      <Footer />
    </div>
  );
}
