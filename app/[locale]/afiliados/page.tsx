"use client";

import React, { useState, useEffect } from "react";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { Footer } from "@/components/shop/Footer";
import { AffiliateDashboard } from "@/components/affiliates/AffiliateDashboard";
import {
  registerAffiliateAction,
  getAffiliatePortalDataAction,
} from "@/lib/actions/affiliate";
import { PayoutMethodType } from "@/lib/models/Affiliate";
import {
  Sparkles,
  TrendingUp,
  Globe2,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  UserCheck,
  Share2,
  Zap,
} from "lucide-react";

export default function AfiliadosPage() {
  const [activeTab, setActiveTab] = useState<"register" | "login">("register");
  const [loading, setLoading] = useState(false);
  const [portalData, setPortalData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Formulario de Registro
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCountry, setRegCountry] = useState("Global");
  const [regCode, setRegCode] = useState("");
  const [regPayoutMethod, setRegPayoutMethod] = useState<PayoutMethodType>("binance_usdt");
  const [regPayoutDetails, setRegPayoutDetails] = useState("");

  // Formulario de Acceso
  const [loginQuery, setLoginQuery] = useState("");

  // Comprobar si hay una sesión guardada localmente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCode = localStorage.getItem("aldri_affiliate_session");
      if (savedCode) {
        handleAutoLogin(savedCode);
      }
    }
  }, []);

  const handleAutoLogin = async (code: string) => {
    setLoading(true);
    const res = await getAffiliatePortalDataAction(code);
    setLoading(false);
    if (res.success && res.affiliate) {
      setPortalData(res);
    } else {
      localStorage.removeItem("aldri_affiliate_session");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    const res = await registerAffiliateAction({
      name: regName,
      email: regEmail,
      phone: regPhone,
      country: regCountry,
      code: regCode,
      payoutMethod: regPayoutMethod,
      payoutDetails: regPayoutDetails,
    });

    setLoading(false);

    if (res.success && res.data) {
      setSuccessMessage(`¡Registro exitoso! Tu código oficial es: ${res.data.code}`);
      localStorage.setItem("aldri_affiliate_session", res.data.code);
      // Cargar portal automáticamente
      const portalRes = await getAffiliatePortalDataAction(res.data.code);
      if (portalRes.success) {
        setPortalData(portalRes);
      }
    } else {
      setErrorMessage(res.error || "Error al completar el registro.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const res = await getAffiliatePortalDataAction(loginQuery);
    setLoading(false);

    if (res.success && res.affiliate) {
      localStorage.setItem("aldri_affiliate_session", res.affiliate.code);
      setPortalData(res);
    } else {
      setErrorMessage(res.error || "No encontramos tu cuenta. Verifica tu código o correo.");
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("aldri_affiliate_session");
    }
    setPortalData(null);
  };

  return (
    <div className="min-h-screen bg-[#060608] gold-ambient-mesh text-white flex flex-col">
      <ShopHeader />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {portalData ? (
            /* Vista del Portal de Afiliado Autenticado */
            <AffiliateDashboard
              affiliate={portalData.affiliate}
              orders={portalData.orders}
              onLogout={handleLogout}
            />
          ) : (
            /* Landing de Reclutamiento y Formularios */
            <div className="space-y-12">
              {/* Hero Section de Reclutamiento */}
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-[#F2CA50]/40 text-[#F2CA50] text-xs font-black uppercase tracking-wider">
                  <Sparkles size={14} /> Programa de Afiliados Internacional • Aldri Associates
                </div>
                <h1 className="text-3xl sm:text-5xl font-serif font-black text-white leading-tight">
                  Gana el <span className="text-[#F2CA50]">10% en USD</span> Vendiendo Productos en Todo el Mundo
                </h1>
                <p className="text-sm sm:text-base text-zinc-300 font-medium leading-relaxed max-w-2xl mx-auto">
                  Únete a nuestro programa de embajadores remotos. Comparte enlaces rastreados de nuestro catálogo de 40 productos reales con logística internacional garantizada y cobra tus comisiones por Binance USDT, PayPal o Zelle.
                </p>
              </div>

              {/* 3 Pilares del Programa */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="glass-panel-luxury p-6 rounded-3xl border border-white/10 space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-[#F2CA50] flex items-center justify-center mb-3">
                    <DollarSign size={22} />
                  </div>
                  <h3 className="text-base font-bold text-white">10% de Comisión en Cada Venta</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Comisiones líquidas en dólares sobre el valor total de la orden. En un pedido promedio ganas entre $5.00 y $18.00 USD netos.
                  </p>
                </div>

                <div className="glass-panel-luxury p-6 rounded-3xl border border-white/10 space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                    <Zap size={22} />
                  </div>
                  <h3 className="text-base font-bold text-white">Cookie de 30 Días Estilo Amazon</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Si un cliente entra con tu enlace y compra hoy o dentro de 30 días, la comisión se acredita a tu cuenta de manera 100% automática.
                  </p>
                </div>

                <div className="glass-panel-luxury p-6 rounded-3xl border border-white/10 space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                    <Globe2 size={22} />
                  </div>
                  <h3 className="text-base font-bold text-white">Pagos Globales Quincenales</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Sin importar en qué país te encuentres: cobras directo en cripto USDT (Binance Pay sin comisión), PayPal, Zelle o Transferencia.
                  </p>
                </div>
              </div>

              {/* Pestañas de Registro vs Acceso */}
              <div className="max-w-2xl mx-auto glass-panel-luxury p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
                <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/10 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("register");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === "register"
                        ? "bg-[#F2CA50] text-[#060608] shadow"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    1. Registrarse Gratis
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("login");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === "login"
                        ? "bg-[#F2CA50] text-[#060608] shadow"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    2. Ya Soy Afiliado (Ingresar)
                  </button>
                </div>

                {errorMessage && (
                  <div className="mb-5 bg-red-950/40 border border-red-800 text-red-300 p-3.5 rounded-2xl text-xs flex items-start gap-2">
                    <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="mb-5 bg-emerald-950/40 border border-emerald-800 text-emerald-300 p-3.5 rounded-2xl text-xs flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {activeTab === "register" ? (
                  /* Formulario de Registro */
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1">
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Ej: Alexander Gómez"
                          className="w-full px-4 py-3 bg-[#0A0A0E] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2CA50]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1">
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="alex@ejemplo.com"
                          className="w-full px-4 py-3 bg-[#0A0A0E] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2CA50]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1">
                          WhatsApp Internacional (con código) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+57 300 123 4567 o +1 305..."
                          className="w-full px-4 py-3 bg-[#0A0A0E] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2CA50]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1">
                          País de Residencia *
                        </label>
                        <input
                          type="text"
                          required
                          value={regCountry}
                          onChange={(e) => setRegCountry(e.target.value)}
                          placeholder="Colombia, México, España, EE.UU..."
                          className="w-full px-4 py-3 bg-[#0A0A0E] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2CA50]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">
                        Código de Afiliado Deseado (Opcional)
                      </label>
                      <input
                        type="text"
                        value={regCode}
                        onChange={(e) => setRegCode(e.target.value.toUpperCase())}
                        placeholder="Ej: ALEX20, TECHVIP (Si lo dejas vacío, lo generaremos por ti)"
                        className="w-full px-4 py-3 bg-[#0A0A0E] border border-white/15 rounded-xl text-xs text-white uppercase font-bold focus:outline-none focus:border-[#F2CA50]"
                      />
                      <span className="text-[10px] text-zinc-500 block mt-1">
                        Este código será el tag en tus enlaces: aldri.shop?ref=TU_CODIGO
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1">
                          Método de Pago Preferido *
                        </label>
                        <select
                          value={regPayoutMethod}
                          onChange={(e) => setRegPayoutMethod(e.target.value as PayoutMethodType)}
                          className="w-full px-4 py-3 bg-[#0A0A0E] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2CA50] cursor-pointer"
                        >
                          <option value="binance_usdt">Binance Pay / USDT (Cero Comisión)</option>
                          <option value="paypal">PayPal Internacional</option>
                          <option value="zelle">Zelle (EE.UU.)</option>
                          <option value="bank_transfer">Transferencia Bancaria Directa</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1">
                          Detalles de Cobro *
                        </label>
                        <input
                          type="text"
                          required
                          value={regPayoutDetails}
                          onChange={(e) => setRegPayoutDetails(e.target.value)}
                          placeholder="Dirección USDT TRC20, email PayPal o Zelle"
                          className="w-full px-4 py-3 bg-[#0A0A0E] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2CA50]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full glass-btn-gold text-[#060608] py-4 rounded-2xl font-black uppercase tracking-wider text-xs shadow-lg hover:shadow-amber-500/25 transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? "Creando tu cuenta de embajador..." : "Completar Registro & Generar Enlaces"}
                      <ArrowRight size={16} />
                    </button>
                  </form>
                ) : (
                  /* Formulario de Acceso al Panel */
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">
                        Código de Afiliado o Correo Registrado *
                      </label>
                      <input
                        type="text"
                        required
                        value={loginQuery}
                        onChange={(e) => setLoginQuery(e.target.value)}
                        placeholder="Ej: ALEX20 o alex@ejemplo.com"
                        className="w-full px-4 py-3 bg-[#0A0A0E] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#F2CA50]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full glass-btn-gold text-[#060608] py-4 rounded-2xl font-black uppercase tracking-wider text-xs shadow-lg hover:shadow-amber-500/25 transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? "Consultando métricas..." : "Entrar a Mi Panel de Afiliado"}
                      <ArrowRight size={16} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
