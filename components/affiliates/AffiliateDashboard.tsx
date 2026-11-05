"use client";

import React from "react";
import { SiteStripeLinkBuilder } from "./SiteStripeLinkBuilder";
import {
  TrendingUp,
  MousePointerClick,
  ShoppingBag,
  DollarSign,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  HelpCircle,
  ShieldCheck,
  Award
} from "lucide-react";

interface AffiliateDashboardProps {
  affiliate: {
    code: string;
    name: string;
    email: string;
    phone: string;
    country: string;
    payoutMethod: string;
    payoutDetails: string;
    commissionRate: number;
    clicks: number;
    orderCount: number;
    totalSales: number;
    totalCommissionsEarned: number;
    totalCommissionsPaid: number;
    isActive: boolean;
    createdAt: string;
  };
  orders: Array<{
    orderId: string;
    total: number;
    commissionAmount: number;
    commissionStatus: string;
    status: string;
    itemsCount: number;
    createdAt: string;
  }>;
  onLogout: () => void;
}

export function AffiliateDashboard({ affiliate, orders, onLogout }: AffiliateDashboardProps) {
  const pendingBalance = Math.max(
    0,
    (affiliate.totalCommissionsEarned || 0) - (affiliate.totalCommissionsPaid || 0)
  );

  const payoutLabels: Record<string, string> = {
    binance_usdt: "Binance Pay / USDT (TRC20)",
    paypal: "PayPal Internacional",
    zelle: "Zelle (EE.UU.)",
    bank_transfer: "Transferencia Bancaria",
  };

  return (
    <div className="space-y-8 select-none">
      {/* Cabecera del Portal */}
      <div className="glass-panel-luxury p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F2CA50] text-[#060608] flex items-center justify-center font-serif font-black text-2xl shadow-lg shadow-amber-500/20 flex-shrink-0">
            {affiliate.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-serif font-black text-white">
                ¡Hola, {affiliate.name}!
              </h2>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 text-[#F2CA50] border border-[#F2CA50]/40 flex items-center gap-1">
                <Award size={12} /> Embajador Oficial
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 mt-1">
              <span>
                Tag: <strong className="text-[#F2CA50] font-mono">{affiliate.code}</strong>
              </span>
              <span>·</span>
              <span>
                Comisión: <strong className="text-white">{(affiliate.commissionRate * 100).toFixed(0)}%</strong>
              </span>
              <span>·</span>
              <span>
                País: <strong className="text-zinc-200">{affiliate.country}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl border border-white/15 hover:border-red-500/50 hover:bg-red-500/10 text-zinc-300 hover:text-red-400 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <LogOut size={14} />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Tarjetas KPI de Rendimiento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Clics */}
        <div className="glass-panel-luxury p-5 rounded-3xl border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Clics Registrados</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <MousePointerClick size={18} />
            </div>
          </div>
          <p className="text-3xl font-black text-white font-sans">{affiliate.clicks || 0}</p>
          <p className="text-[11px] text-zinc-400">Visitas a tus enlaces con cookie de 30 días</p>
        </div>

        {/* 2. Pedidos Generados */}
        <div className="glass-panel-luxury p-5 rounded-3xl border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Ventas Convertidas</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShoppingBag size={18} />
            </div>
          </div>
          <p className="text-3xl font-black text-white font-sans">{affiliate.orderCount || 0}</p>
          <p className="text-[11px] text-zinc-400">
            Total vendido: <strong className="text-white">${(affiliate.totalSales || 0).toFixed(2)} USD</strong>
          </p>
        </div>

        {/* 3. Comisiones Ganadas */}
        <div className="glass-panel-luxury p-5 rounded-3xl border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Ganado</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-[#F2CA50] border border-amber-500/20">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-3xl font-black text-[#F2CA50] font-sans">
            ${(affiliate.totalCommissionsEarned || 0).toFixed(2)}
          </p>
          <p className="text-[11px] text-zinc-400">
            Tasa activa: {(affiliate.commissionRate * 100).toFixed(0)}% por compra
          </p>
        </div>

        {/* 4. Saldo Pendiente por Cobrar */}
        <div className="glass-panel-luxury p-5 rounded-3xl border border-white/10 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Saldo por Cobrar</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Wallet size={18} />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-400 font-sans">${pendingBalance.toFixed(2)}</p>
          <p className="text-[11px] text-zinc-400">
            Ya pagado: <span className="text-zinc-200">${(affiliate.totalCommissionsPaid || 0).toFixed(2)} USD</span>
          </p>
        </div>
      </div>

      {/* Amazon SiteStripe Link Builder para los 40 Productos */}
      <SiteStripeLinkBuilder
        affiliateCode={affiliate.code}
        commissionRate={affiliate.commissionRate || 0.10}
      />

      {/* Historial de Ventas Referidas */}
      <div className="glass-panel-luxury p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-serif font-black text-white">Historial de Órdenes Referidas</h3>
            <p className="text-xs text-zinc-400">
              Compras generadas con tu código o mediante tus enlaces en los últimos 30 días.
            </p>
          </div>
          <span className="text-xs font-bold text-zinc-400 self-start sm:self-auto">
            {orders.length} pedidos registrados
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-white/10 rounded-2xl">
            <ShoppingBag size={32} className="mx-auto text-zinc-500 mb-3" />
            <p className="text-sm font-bold text-white">Aún no tienes ventas registradas</p>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
              Usa el generador SiteStripe de arriba para compartir tus enlaces en WhatsApp, TikTok, Instagram o blogs. ¡Las comisiones aparecerán aquí automáticamente!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Fecha</th>
                  <th className="py-3 px-3">Pedido</th>
                  <th className="py-3 px-3">Ítems</th>
                  <th className="py-3 px-3">Total Venta</th>
                  <th className="py-3 px-3">Tu Comisión</th>
                  <th className="py-3 px-3 text-right">Estado Liquidación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((ord, idx) => {
                  const isPaid = ord.commissionStatus === "paid";
                  return (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 text-zinc-300">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-white">
                        {ord.orderId.replace(/([0-9]{3})[0-9]{3}/, "$1***")}
                      </td>
                      <td className="py-3 px-3 text-zinc-400">{ord.itemsCount}</td>
                      <td className="py-3 px-3 font-bold text-zinc-200">
                        ${ord.total.toFixed(2)} USD
                      </td>
                      <td className="py-3 px-3 font-black text-[#F2CA50]">
                        +${ord.commissionAmount.toFixed(2)} USD
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            isPaid
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/20 text-[#F2CA50] border border-amber-500/30"
                          }`}
                        >
                          {isPaid ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {isPaid ? "Pagado" : "Pendiente"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tarjeta de Cuenta de Pago y Soporte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel-luxury p-6 rounded-3xl border border-white/10 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Wallet size={16} className="text-[#F2CA50]" /> Tus Datos de Cobro Internacional
          </h4>
          <div className="bg-[#0A0A0E] p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Método Seleccionado:</span>
              <strong className="text-white">
                {payoutLabels[affiliate.payoutMethod] || affiliate.payoutMethod}
              </strong>
            </div>
            <div className="flex flex-col gap-1 pt-1 border-t border-white/10">
              <span className="text-zinc-400">Dirección / Cuenta:</span>
              <span className="font-mono text-zinc-200 break-all bg-black/40 p-2 rounded-xl border border-white/5">
                {affiliate.payoutDetails}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400">
            ¿Necesitas cambiar tu cuenta de cobro? Contáctanos por WhatsApp oficial indicando tu código de afiliado.
          </p>
        </div>

        <div className="glass-panel-luxury p-6 rounded-3xl border border-white/10 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#F2CA50]" /> Garantías de Afiliados Aldri
          </h4>
          <ul className="text-xs text-zinc-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-[#F2CA50]">✓</span>
              <span><strong>Ventana de 30 días:</strong> Si tu cliente compra dentro de un mes, la comisión es tuya.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F2CA50]">✓</span>
              <span><strong>Liquidaciones Quincenales:</strong> Pagos directos en USDT Binance, PayPal o Zelle.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#F2CA50]">✓</span>
              <span><strong>40 Productos con Envío Global:</strong> Tus compradores reciben tracking y soporte internacional.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
