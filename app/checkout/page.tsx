"use client";

import { useCart } from "@/components/shop/Cart/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { createOrder } from "@/lib/actions/order";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { DEFAULT_DELIVERY_OPTIONS, DeliveryOption } from "@/lib/deliveryOptions";
import { getDeliveryOptions } from "@/lib/actions/delivery";
import { validateCoupon, checkAutoLaunchCoupon } from "@/lib/actions/coupon";
import { getPaymentConfigs } from "@/lib/actions/paymentConfig";
import { logAnalyticsEventAction } from "@/lib/actions/analytics";
import { CustomerBiometricModal } from "@/components/auth/CustomerBiometricModal";
import { Zap, Rocket, Truck, Sun, Clock, Moon, Store, ShieldCheck, CheckCircle2, Ticket, Sparkles, Tag, AlertCircle, Copy, ExternalLink, QrCode, MessageSquare, Heart, Fingerprint } from "lucide-react";


const PaymentLogos = {
  zelle: <svg viewBox="0 0 38 24" width="38" height="24" className="w-8 h-auto"><path d="M0 0h38v24H0z" fill="#6d2277"/><path d="M10 5h18v3l-10 8h10v5H10v-3l10-8H10z" fill="#fff"/></svg>,
  cashapp: <svg viewBox="0 0 38 24" width="38" height="24" className="w-8 h-auto"><rect width="38" height="24" fill="#00D632"/><path d="M19 6v12M14 9h7a2 2 0 0 1 0 4h-4a2 2 0 0 0 0 4h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>,
  paypal: <svg viewBox="0 0 38 24" width="38" height="24" className="w-8 h-auto"><path d="M0 0h38v24H0z" fill="#003087"/><path d="M10 5h18v14H10z" fill="#009cde"/></svg>,
  square: <svg viewBox="0 0 38 24" width="38" height="24" className="w-8 h-auto"><rect width="38" height="24" fill="#000000" rx="4"/><rect x="11" y="7" width="16" height="10" rx="2" fill="#fff"/></svg>,
  efectivo: <svg viewBox="0 0 38 24" width="38" height="24" className="w-8 h-auto"><rect width="38" height="24" fill="#22C55E" rx="4"/><circle cx="19" cy="12" r="5" fill="#fff"/></svg>
};

const iconMap: Record<string, any> = {
  Zap: Zap,
  Rocket: Rocket,
  Truck: Truck,
  Sun: Sun,
  Clock: Clock,
  Moon: Moon,
  Store: Store,
};

import { DeliveryMapPicker } from "@/components/shop/DeliveryMapPicker";

export default function CheckoutPage() {
  const { cartItems, clearCart, updateAddonCustomText } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [deliveryOptionsList, setDeliveryOptionsList] = useState<DeliveryOption[]>(DEFAULT_DELIVERY_OPTIONS);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption | null>(null);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);

  // Estado de Ubicación y Distancia por Millas
  const [deliveryLocation, setDeliveryLocation] = useState<{
    address: string;
    lat: number;
    lng: number;
    distanceMiles: number;
    googleMapsUrl: string;
  }>({
    address: "",
    lat: 29.7027,
    lng: -95.2936,
    distanceMiles: 0,
    googleMapsUrl: "https://maps.google.com",
  });

  const [isMounted, setIsMounted] = useState(false);

  // Estados para datos de contacto
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cardMessage, setCardMessage] = useState("");

  // Estados para Cupones y Pagos
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [autoLaunchInfo, setAutoLaunchInfo] = useState<{ isAvailable: boolean; orderIndex?: number; coupon?: any } | null>(null);
  
  // Datos de Configuración de Cuentas de Pago
  const [paymentConfigs, setPaymentConfigs] = useState<Record<string, any>>({});
  const [copiedText, setCopiedText] = useState("");

  useEffect(() => {
    async function loadOptionsAndCoupon() {
      const { data } = await getDeliveryOptions();
      if (data && data.length > 0) {
        setDeliveryOptionsList(data);
      }

      const payRes = await getPaymentConfigs();
      if (payRes.success && payRes.data) {
        setPaymentConfigs(payRes.data);
      }

      const autoRes = await checkAutoLaunchCoupon();
      if (autoRes.success && autoRes.isAutoAvailable && autoRes.coupon) {
        setAutoLaunchInfo({
          isAvailable: true,
          orderIndex: autoRes.orderIndex,
          coupon: autoRes.coupon
        });
        setAppliedCoupon(autoRes.coupon);
        setCouponSuccess(`🎁 ¡Felicidades! Eres el cliente #${autoRes.orderIndex} de inauguración. Cupón del ${autoRes.coupon.discountValue}% OFF aplicado automáticamente.`);
      }
    }
    loadOptionsAndCoupon();

    const savedName = localStorage.getItem("customerName") || "";
    const savedEmail = localStorage.getItem("customerEmail") || "";
    const savedPhone = localStorage.getItem("customerPhone") || "";
    const savedAddress = localStorage.getItem("customerAddress") || "";
    
    setName(savedName);
    setEmail(savedEmail);
    setPhone(savedPhone);
    setAddress(savedAddress);
    setIsMounted(true);

    if (cartItems.length > 0) {
      logAnalyticsEventAction({
        type: "cart_abandon",
        path: "/checkout",
        customerName: savedName,
        customerPhone: savedPhone,
        price: subtotal,
        cartItems: cartItems.map((i) => ({ productId: i.id, name: i.name, price: i.price, image: i.image }))
      });
    }
  }, [cartItems]);


  const handleCopyText = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(""), 3000);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Cálculo del Descuento del Cupón
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  // Subtotal Imponible tras Descuento
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);

  // Impuestos de Ley (Sales Tax 8.25%) sumados Adicionalmente al Subtotal Imponible
  const taxAmount = Math.round(taxableSubtotal * 0.0825 * 100) / 100;

  // Cálculo dinámico de tarifa por milla según la opción seleccionada
  const calcOptionFee = (opt: DeliveryOption) => {
    if (opt.id === "pickup") return 0;
    const miles = deliveryLocation?.distanceMiles || 0;
    const perMile = opt.pricePerMile || 0;
    const base = opt.extraPrice || 0;
    
    if (perMile > 0 && miles === 0) return base;

    const totalFee = perMile > 0 ? (miles * perMile) + base : base;
    return Math.round(totalFee * 100) / 100;
  };

  const isOnlyDigital = useMemo(() => {
    if (cartItems.length === 0) return true;
    return cartItems.every((item) => item.productType === 'digital');
  }, [cartItems]);

  const deliveryFee = isOnlyDigital ? 0 : (selectedDelivery ? calcOptionFee(selectedDelivery) : 0);

  // Total Final = Subtotal Imponible + Sales Tax (8.25%) + Envío
  const finalTotal = taxableSubtotal + taxAmount + deliveryFee;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    if (!couponInput.trim()) return;

    const res = await validateCoupon(couponInput, subtotal);
    if (res.success && res.coupon) {
      setAppliedCoupon(res.coupon);
      setCouponSuccess(`¡Cupón "${res.coupon.code}" aplicado con éxito!`);
      setCouponInput("");
    } else {
      setCouponError(res.error || "Código de cupón inválido.");
    }
  };

  const rawPaymentMethods = [
    { id: "zelle", label: "Zelle" },
    { id: "cashapp", label: "CashApp" },
    { id: "paypal", label: "PayPal" },
    { id: "square", label: "Square (Tarjeta)" },
    { id: "efectivo", label: "Efectivo" },
  ];

  const paymentMethods = rawPaymentMethods.filter((method) => {
    const cfg = paymentConfigs[method.id];
    return !cfg || cfg.isActive !== false;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isOnlyDigital && !selectedDelivery) {
      alert("Por favor selecciona una Opción de Entrega para completar tu pedido.");
      return;
    }

    setLoading(true);

    const data = new FormData(e.currentTarget);
    const hasDigital = cartItems.some(i => i.productType === 'digital');
    const hasDropship = cartItems.some(i => i.productType === 'dropship');
    const computedOrderType = isOnlyDigital ? "digital" : (hasDigital && hasDropship ? "hybrid" : "dropship");

    const orderData = {
      customerName: data.get("name")?.toString() || "",
      customerEmail: data.get("email")?.toString() || "",
      customerPhone: data.get("phone")?.toString() || "",
      orderType: computedOrderType,
      address: isOnlyDigital 
        ? "Entrega Digital (Sin dirección física)" 
        : (deliveryLocation.address || data.get("address")?.toString() || address || "Dirección de Envío"),
      destLat: isOnlyDigital ? 0 : deliveryLocation.lat,
      destLng: isOnlyDigital ? 0 : deliveryLocation.lng,
      distanceMiles: isOnlyDigital ? 0 : deliveryLocation.distanceMiles,
      googleMapsUrl: isOnlyDigital ? "" : deliveryLocation.googleMapsUrl,
      deliveryMethod: isOnlyDigital 
        ? "Descarga Digital Instantánea" 
        : (selectedDelivery ? `${selectedDelivery.title} (${selectedDelivery.estimatedTimeLabel})` : "Envío a Domicilio"),
      deliveryFee: deliveryFee,
      couponCode: appliedCoupon ? appliedCoupon.code : "",
      discountAmount: discountAmount,
      taxAmount: taxAmount,
      cardMessage: data.get("cardMessage")?.toString() || cardMessage || "",
      paymentMethod: data.get("paymentMethod")?.toString() || "",
      paymentRef: data.get("paymentRef")?.toString() || "N/A",
      items: cartItems,
      total: finalTotal
    };

    const existingOrderId = localStorage.getItem("lastOrderId") || undefined;
    const result = await createOrder(orderData, existingOrderId);
    
    if (result.success) {
      clearCart();
      localStorage.setItem("lastOrderId", result.orderId);
      localStorage.setItem("customerName", orderData.customerName);
      localStorage.setItem("customerEmail", orderData.customerEmail);
      localStorage.setItem("customerPhone", orderData.customerPhone);
      localStorage.setItem("customerAddress", orderData.address);

      router.push(`/checkout/confirmacion?orderId=${result.orderId}`);
    } else {
      alert("Error al procesar pedido");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0A0A0C] text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
      <ShopHeader />

      <main className="flex-1 py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 gap-2 border-[#EAE4DC] dark:border-white/10">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-black text-gray-900 dark:text-white">Finalizar Pedido</h1>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Selecciona tu método de entrega y completa tus datos</p>
            </div>
            <span className="bg-amber-500/10 text-[#D4AF37] dark:text-[#F2CA50] text-xs font-bold px-3.5 py-1.5 rounded-full border border-amber-500/20 flex items-center gap-1.5 shadow-sm">
              <ShieldCheck size={16} /> Pago Seguro Encriptado
            </span>
          </div>
          
          <div className="grid md:grid-cols-12 gap-8">
            
            {/* FORMULARIO DE DATOS Y SELECCIÓN DE ENTREGA */}
            <div className="md:col-span-7 bg-white dark:bg-[#121215] p-6 md:p-8 rounded-3xl shadow-sm border border-[#EAE4DC] dark:border-white/10 space-y-8">
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Datos de Contacto + Acceso Biométrico */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2 border-[#EAE4DC] dark:border-white/10">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400">
                      1. Información del Cliente
                    </h2>
                    <button
                      type="button"
                      onClick={() => setIsBioModalOpen(true)}
                      className="bg-amber-500/10 hover:bg-amber-500/20 text-[#D4AF37] dark:text-[#F2CA50] border border-amber-500/30 px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Fingerprint size={14} />
                      <span>Ingresar con Huella 👆</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <input 
                      name="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Nombre y Apellido Completo *" 
                      className="w-full p-3.5 border border-[#EAE4DC] dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-medium text-gray-900 dark:text-white bg-white dark:bg-[#121215] placeholder:text-gray-400" 
                      required 
                    />
                    <input 
                      type="email"
                      name="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="Correo Electrónico del Cliente *" 
                      className="w-full p-3.5 border border-[#EAE4DC] dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-medium text-gray-900 dark:text-white bg-white dark:bg-[#121215] placeholder:text-gray-400" 
                      required 
                    />
                    <input 
                      name="phone" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="Teléfono / WhatsApp de Contacto *" 
                      className="w-full p-3.5 border border-[#EAE4DC] dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-medium text-gray-900 dark:text-white bg-white dark:bg-[#121215] placeholder:text-gray-400" 
                      required 
                    />
                    {isOnlyDigital ? (
                      <div className="bg-[#4F46E5]/10 dark:bg-indigo-950/30 p-5 rounded-2xl border border-indigo-500/20 space-y-2 mt-2">
                        <div className="flex items-center gap-2 text-[#4F46E5] dark:text-indigo-300 font-bold text-sm">
                          <Sparkles size={16} />
                          <span>⚡ Orden Digital • Entrega Instantánea 24/7</span>
                        </div>
                        <p className="text-xs text-indigo-900/80 dark:text-indigo-200/80 leading-relaxed font-medium">
                          Tus productos se activarán inmediatamente después del pago. Recibirás los accesos y enlaces de descarga directamente en tu correo electrónico y en la pantalla de confirmación. No se requiere dirección física ni costos de envío.
                        </p>
                      </div>
                    ) : (
                      <DeliveryMapPicker
                        initialAddress={address}
                        onLocationChange={(locData) => {
                          setAddress(locData.address);
                          setDeliveryLocation(locData);
                        }}
                      />
                    )}
                  </div>
                </div>

                {!isOnlyDigital && (
                  <>
                    {/* Notas para el Envío */}
                    <div className="space-y-3 bg-[#FAF8F5] dark:bg-[#121215] p-4 rounded-2xl border border-[#EAE4DC] dark:border-white/10">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
                        Indicaciones para el Envío (Opcional)
                      </h2>
                      <textarea
                        name="cardMessage"
                        value={cardMessage}
                        onChange={(e) => setCardMessage(e.target.value)}
                        placeholder="Ej: Dejar en portería o instrucciones específicas para la entrega a domicilio."
                        className="w-full p-3.5 border border-[#EAE4DC] dark:border-white/10 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#D4AF37] h-20 bg-white dark:bg-[#121215] text-gray-900 dark:text-white placeholder:text-gray-400"
                      />
                    </div>

                    {/* 2. Selector de Opciones de Entrega */}
                    <div className="space-y-4 pt-2">
                      <div className="flex justify-between items-center border-b pb-2 border-[#EAE4DC] dark:border-white/10">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400">
                          2. Opción de Envío Físico
                        </h2>
                        <span className="text-xs font-bold text-[#D4AF37]">{deliveryOptionsList.length} opciones disponibles</span>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                        {deliveryOptionsList.map((option, index) => {
                          const IconComponent = iconMap[option.iconName] || Truck;
                          const isSelected = selectedDelivery ? ((selectedDelivery.id && selectedDelivery.id === option.id) || selectedDelivery.title === option.title) : false;
                          const optionPrice = calcOptionFee(option);

                          return (
                            <label
                              key={option.id || (option as any)._id || `delivery-${index}`}
                              onClick={() => setSelectedDelivery(option)}
                              className={`relative flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                                isSelected
                                  ? "border-[#D4AF37] bg-amber-500/10 dark:bg-amber-500/5 shadow-sm"
                                  : "border-[#EAE4DC] dark:border-white/10 hover:border-[#D4AF37]/50 bg-white dark:bg-[#121215]"
                              }`}
                            >
                              <div className="flex items-center gap-3.5">
                                <div className={`p-2.5 rounded-xl ${isSelected ? "bg-[#D4AF37] text-black" : "bg-stone-100 dark:bg-white/10 text-gray-500 dark:text-zinc-400"}`}>
                                  <IconComponent size={20} />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-gray-900 dark:text-white">{option.title}</span>
                                    {option.badge && (
                                      <span className="bg-black text-[#F2CA50] text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-sm border border-[#D4AF37]/50">
                                        {option.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{option.description}</p>
                                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px]">
                                    <span className="font-bold text-gray-500 dark:text-zinc-400">
                                      ⏱️ <strong className="text-gray-800 dark:text-gray-200">{option.estimatedTimeLabel}</strong>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right flex-shrink-0 ml-3">
                                <span suppressHydrationWarning className={`text-sm font-extrabold block ${optionPrice > 0 ? "text-[#D4AF37] dark:text-[#F2CA50]" : "text-emerald-600"}`}>
                                  {optionPrice > 0 ? `+$${optionPrice.toFixed(2)} USD` : "Gratis"}
                                </span>
                                {isSelected && (
                                  <CheckCircle2 size={18} className="text-[#D4AF37] ml-auto mt-1" />
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
                {/* 3. Información de Pago */}
                <div className="space-y-4 pt-2">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400 border-b pb-2 border-[#EAE4DC] dark:border-white/10">
                    3. Método de Pago
                  </h2>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {paymentMethods.map((method) => (
                      <label 
                        key={method.id} 
                        className={`relative flex flex-col items-center p-3.5 border-2 rounded-2xl cursor-pointer transition-all ${
                          selectedPayment === method.id 
                            ? 'border-[#D4AF37] bg-amber-500/10 dark:bg-amber-500/5 shadow-sm' 
                            : 'border-[#EAE4DC] dark:border-white/10 hover:border-[#D4AF37]/50 bg-white dark:bg-[#121215]'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value={method.id} 
                          className="peer sr-only" 
                          required 
                          onChange={() => setSelectedPayment(method.id)}
                        />
                        <div className="mb-1.5">
                          {PaymentLogos[method.id as keyof typeof PaymentLogos]}
                        </div>
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase">{method.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* TARJETA DESPLEGABLE CON DATOS DE PAGO Y CÓDIGO QR */}
                  {selectedPayment && (
                    <div className="bg-[#FAF8F5] dark:bg-[#121215] p-5 rounded-2xl border border-[#EAE4DC] dark:border-white/10 space-y-4 animate-in fade-in duration-300">
                      {(() => {
                        const cfg = paymentConfigs[selectedPayment] || {};
                        const detailToCopy = cfg.accountDetail || cfg.linkUrl || "";

                        return (
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-bold text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wider block">
                                  Instrucciones de Pago ({cfg.title || selectedPayment})
                                </span>
                                {cfg.holderName && (
                                  <span className="font-bold text-sm text-gray-900 dark:text-white block mt-0.5">
                                    Titular: {cfg.holderName}
                                  </span>
                                )}
                              </div>

                              {detailToCopy && (
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(detailToCopy)}
                                  className="bg-white dark:bg-[#121215] border border-[#EAE4DC] dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-[#D4AF37] hover:border-[#D4AF37] px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                                >
                                  <Copy size={13} />
                                  <span>{copiedText === detailToCopy ? "¡Copiado! ✓" : "Copiar Datos"}</span>
                                </button>
                              )}
                            </div>

                            {cfg.qrImage && (
                              <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-[#121215] rounded-2xl border border-[#EAE4DC] dark:border-white/10 w-fit mx-auto shadow-sm">
                                <img src={cfg.qrImage} alt={`QR ${cfg.title}`} className="w-44 h-44 object-contain rounded-xl" />
                                <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-bold mt-1.5 flex items-center gap-1">
                                  <QrCode size={12} /> Escanea con la App de {cfg.title}
                                </span>
                              </div>
                            )}

                            {cfg.linkUrl && (
                              <div className="text-center pt-1">
                                <a
                                  href={cfg.linkUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F2CA50] via-[#D4AF37] to-[#C5A059] text-black px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wide hover:shadow-lg hover:shadow-amber-500/25 transition-all shadow-sm"
                                >
                                  <span>Pagar vía {cfg.title}</span>
                                  <ExternalLink size={14} />
                                </a>
                              </div>
                            )}

                            {cfg.accountDetail && (
                              <div className="bg-white dark:bg-[#121215] p-3 rounded-xl border border-[#EAE4DC] dark:border-white/10 text-center font-mono font-extrabold text-sm text-gray-900 dark:text-white">
                                {cfg.accountDetail}
                              </div>
                            )}

                            {cfg.instructions && (
                              <div className="text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-[#121215] p-3.5 rounded-xl border border-[#EAE4DC] dark:border-white/10 space-y-1 shadow-sm">
                                <span className="font-bold text-gray-500 dark:text-zinc-400 uppercase text-[10px] tracking-wider block mb-1">
                                  📌 Paso a paso para pagar:
                                </span>
                                {cfg.instructions.split('\n').map((line: string, i: number) => (
                                  <p key={i} className="font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {line}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  <input 
                    name="paymentRef" 
                    placeholder={selectedPayment === 'efectivo' ? "No requerido para pago en efectivo" : "Número o Código de Referencia de Pago *"} 
                    className="w-full p-3.5 border border-[#EAE4DC] dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-medium text-gray-900 dark:text-white bg-white dark:bg-[#121215] placeholder:text-gray-400" 
                    disabled={selectedPayment === 'efectivo'}
                    required={selectedPayment !== 'efectivo'}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading || cartItems.length === 0} 
                  className="w-full bg-gradient-to-r from-[#F2CA50] via-[#D4AF37] to-[#C5A059] text-black py-4 rounded-full font-extrabold uppercase tracking-wider text-base hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Procesando Orden..." : `Confirmar Pedido - $${finalTotal.toFixed(2)} USD`}
                </button>
              </form>
            </div>

            {/* RESUMEN DE COMPRA CON DESGLOSE DINÁMICO */}
            <div className="md:col-span-5 bg-white dark:bg-[#121215] p-6 md:p-8 rounded-3xl shadow-sm border border-[#EAE4DC] dark:border-white/10 h-fit space-y-6">
              <h2 className="text-xl font-serif font-black text-gray-900 dark:text-white border-b pb-3 border-[#EAE4DC] dark:border-white/10">Resumen de Tu Pedido</h2>
              
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${JSON.stringify(item.addons)}`} className="flex justify-between items-start text-sm border-b pb-3 border-[#EAE4DC]/60 dark:border-white/5">
                    <div className="flex items-start gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-contain bg-[#FAF8F5] dark:bg-[#101013] border border-[#EAE4DC] dark:border-white/10 flex-shrink-0 p-1" />
                      )}
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block">{item.name}</span>
                        <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium block">Cant: {item.quantity}</span>
                        
                        {item.addons && item.addons.length > 0 && (
                          <div className="mt-1 space-y-1 border-t border-[#EAE4DC] dark:border-white/10 pt-1">
                            {item.addons.map((add: any, idx: number) => (
                              <div key={idx} className="text-[10px]">
                                <span className="block text-[#D4AF37] dark:text-[#F2CA50] font-bold">
                                  ✨ {add.name || add.value} {add.price ? `(+$${add.price.toFixed(2)})` : ''}
                                </span>
                                {add.customText ? (
                                  <div className="bg-amber-500/10 p-1.5 rounded-md text-gray-800 dark:text-gray-200 font-medium my-0.5 border border-amber-500/20 flex items-start gap-1">
                                    <MessageSquare size={11} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                                    <span><em>"{add.customText}"</em></span>
                                  </div>
                                ) : (
                                  updateAddonCustomText && (
                                    <input
                                      type="text"
                                      placeholder="Añadir notas para este ítem..."
                                      onChange={(e) => updateAddonCustomText(item.id, add.addonId, e.target.value)}
                                      className="mt-0.5 p-1 text-[9px] border border-[#EAE4DC] dark:border-white/10 rounded w-full focus:outline-none focus:ring-1 focus:ring-[#D4AF37] bg-white dark:bg-[#121215] text-gray-900 dark:text-white"
                                    />
                                  )
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="font-black text-gray-900 dark:text-white flex-shrink-0 ml-2 font-sans">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* CAJA DE CUPÓN DE DESCUENTO */}
              <div className="pt-4 border-t border-[#EAE4DC] dark:border-white/10 space-y-3">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Ticket size={14} className="text-[#D4AF37]" /> ¿Tienes un Cupón de Descuento?
                </label>

                {couponSuccess && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-start gap-2">
                    <Sparkles size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{couponSuccess}</span>
                  </div>
                )}

                {couponError && (
                  <div className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs p-3 rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                    <span>{couponError}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Ej: INAUGURACION, BIENVENIDA"
                    className="flex-1 p-2.5 border border-[#EAE4DC] dark:border-white/10 rounded-xl text-xs uppercase font-bold focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-900 dark:text-white bg-white dark:bg-[#121215] placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-gradient-to-r from-[#F2CA50] via-[#D4AF37] to-[#C5A059] hover:from-[#FFE088] hover:to-[#D4AF37] text-black px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase transition-all shadow-md hover:shadow-lg hover:shadow-amber-500/25 active:scale-95 border border-amber-300/40 select-none"
                  >
                    Aplicar
                  </button>
                </div>
              </div>

              {/* DESGLOSE TRANSPARENTE DE TOTALES */}
              <div className="space-y-2.5 pt-4 border-t border-[#EAE4DC] dark:border-white/10 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-zinc-400 font-medium">
                  <span>Subtotal Productos &amp; Adicionales</span>
                  <span className="font-bold text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Tag size={14} /> Descuento Cupón ({appliedCoupon.code})
                    </span>
                    <span>-${discountAmount.toFixed(2)} USD</span>
                  </div>
                )}

                <div className="flex justify-between text-amber-900 dark:text-[#F2CA50] font-medium bg-amber-500/10 dark:bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/20">
                  <span className="font-bold flex items-center gap-1 text-xs">
                    🏛️ Impuestos de Ley (Sales Tax 8.25%)
                  </span>
                  <span className="font-extrabold text-[#D4AF37] dark:text-[#F2CA50]">+${taxAmount.toFixed(2)} USD</span>
                </div>

                <div className="flex justify-between text-gray-600 dark:text-zinc-400 font-medium">
                  <span>Entrega {selectedDelivery ? `(${selectedDelivery.title})` : "(Por seleccionar)"}</span>
                  <span className={`font-bold ${deliveryFee > 0 ? "text-[#D4AF37] dark:text-[#F2CA50]" : "text-gray-900 dark:text-white"}`}>
                    {selectedDelivery ? (deliveryFee > 0 ? `+$${deliveryFee.toFixed(2)}` : "Gratis") : "$0.00"}
                  </span>
                </div>

                <div className="border-t border-[#EAE4DC] dark:border-white/10 pt-3 flex justify-between items-baseline font-extrabold text-xl text-gray-900 dark:text-white">
                  <span>Total Final</span>
                  <span className="text-2xl font-black text-[#D4AF37] dark:text-[#F2CA50] tracking-tight">${finalTotal.toFixed(2)} USD</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Modal Biométrico de Huella / Passkeys para el Cliente */}
      <CustomerBiometricModal
        isOpen={isBioModalOpen}
        onClose={() => setIsBioModalOpen(false)}
        onSuccess={(cust) => {
          if (cust.email) setEmail(cust.email);
          if (cust.name) setName(cust.name);
          if (cust.phone) setPhone(cust.phone);
        }}
      />
    </div>
  );
}
