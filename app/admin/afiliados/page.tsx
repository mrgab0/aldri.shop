"use client";

import { useEffect, useState } from "react";
import {
  getAffiliatesAdminAction,
  recordAffiliatePayoutAction,
  updateAffiliateCommissionRateAction,
  toggleAffiliateStatusAction,
} from "@/lib/actions/affiliate";
import {
  Users,
  Search,
  DollarSign,
  MousePointerClick,
  ShoppingBag,
  Wallet,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Percent,
  X,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
} from "lucide-react";

export default function AdminAfiliadosPage() {
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({
    totalAffiliates: 0,
    activeAffiliates: 0,
    totalClicks: 0,
    totalSales: 0,
    totalCommissionsEarned: 0,
    totalCommissionsPaid: 0,
    pendingPayout: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedAffiliate, setSelectedAffiliate] = useState<any>(null);

  // Modal de Liquidación / Pago
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [payoutNote, setPayoutNote] = useState("");
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutError, setPayoutError] = useState("");
  const [payoutSuccess, setPayoutSuccess] = useState("");

  // Modal de Edición de Tasa de Comisión
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [newRatePercent, setNewRatePercent] = useState<number>(10);
  const [rateLoading, setRateLoading] = useState(false);

  useEffect(() => {
    loadAffiliates();
  }, []);

  async function loadAffiliates() {
    setLoading(true);
    const res = await getAffiliatesAdminAction();
    if (res.success && res.data) {
      setAffiliates(res.data);
      if (res.summary) setSummary(res.summary);
    }
    setLoading(false);
  }

  const filteredAffiliates = affiliates.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q) ||
      (a.country && a.country.toLowerCase().includes(q))
    );
  });

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setAffiliates((prev) =>
      prev.map((a) => (a._id === id ? { ...a, isActive: !currentStatus } : a))
    );
    await toggleAffiliateStatusAction(id, !currentStatus);
  };

  const openPayoutModal = (aff: any) => {
    setSelectedAffiliate(aff);
    const pending = Math.max(0, (aff.totalCommissionsEarned || 0) - (aff.totalCommissionsPaid || 0));
    setPayoutAmount(Math.round(pending * 100) / 100);
    setPayoutNote(`Transferencia vía ${aff.payoutMethod}`);
    setPayoutError("");
    setPayoutSuccess("");
    setPayoutModalOpen(true);
  };

  const handleProcessPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAffiliate) return;
    setPayoutLoading(true);
    setPayoutError("");

    const res = await recordAffiliatePayoutAction(
      selectedAffiliate._id,
      payoutAmount,
      payoutNote
    );

    setPayoutLoading(false);

    if (res.success) {
      setPayoutSuccess("Liquidación registrada exitosamente.");
      setTimeout(() => {
        setPayoutModalOpen(false);
        loadAffiliates();
      }, 1200);
    } else {
      setPayoutError(res.error || "Error al procesar liquidación.");
    }
  };

  const openRateModal = (aff: any) => {
    setSelectedAffiliate(aff);
    setNewRatePercent(Math.round((aff.commissionRate || 0.10) * 100));
    setRateModalOpen(true);
  };

  const handleUpdateRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAffiliate) return;
    setRateLoading(true);

    const decimalRate = newRatePercent / 100;
    const res = await updateAffiliateCommissionRateAction(
      selectedAffiliate._id,
      decimalRate
    );

    setRateLoading(false);

    if (res.success) {
      setRateModalOpen(false);
      loadAffiliates();
    } else {
      alert(res.error || "Error al actualizar tasa.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤝</span>
            <h1 className="text-2xl font-serif font-black text-gray-900 dark:text-white">
              Centro de Control de Afiliados (Aldri Associates)
            </h1>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Supervisa embajadores, ventas generadas con etiquetas de referido y registra liquidaciones internacionales.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAffiliates}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold transition-all"
          >
            Refrescar
          </button>
          <a
            href="/es/afiliados"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md"
          >
            Ver Portal Público <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Tarjetas KPI de Resumen Global */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Afiliados */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#15161E] border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-medium">
            <span>Afiliados</span>
            <Users size={15} />
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            {summary.totalAffiliates}
          </p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
            {summary.activeAffiliates} activos
          </span>
        </div>

        {/* Clics */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#15161E] border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-medium">
            <span>Clics Totales</span>
            <MousePointerClick size={15} />
          </div>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {summary.totalClicks}
          </p>
          <span className="text-[10px] text-gray-500">Cookie 30 días</span>
        </div>

        {/* Ventas Brutas */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#15161E] border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-medium">
            <span>Ventas Referidas</span>
            <ShoppingBag size={15} />
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">
            ${summary.totalSales}
          </p>
          <span className="text-[10px] text-gray-500">USD Brutos</span>
        </div>

        {/* Comisiones Generadas */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#15161E] border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-medium">
            <span>Comisiones Total</span>
            <DollarSign size={15} />
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-[#F2CA50] mt-1">
            ${summary.totalCommissionsEarned}
          </p>
          <span className="text-[10px] text-gray-500">USD Ganados</span>
        </div>

        {/* Comisiones Pagadas */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#15161E] border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-medium">
            <span>Comisiones Pagadas</span>
            <CheckCircle2 size={15} />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ${summary.totalCommissionsPaid}
          </p>
          <span className="text-[10px] text-gray-500">USD Liquidados</span>
        </div>

        {/* Saldo Pendiente */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800/50 shadow-sm">
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-400 text-xs font-medium">
            <span>Por Liquidar</span>
            <Wallet size={15} />
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-[#F2CA50] mt-1">
            ${summary.pendingPayout}
          </p>
          <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold">
            Deuda activa
          </span>
        </div>
      </div>

      {/* Buscador de Afiliados */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email, tag o país..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#15161E] text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 self-end sm:self-auto">
          Mostrando {filteredAffiliates.length} de {affiliates.length} afiliados
        </span>
      </div>

      {/* Tabla de Afiliados */}
      <div className="bg-white dark:bg-[#12131A] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">Cargando afiliados...</div>
        ) : filteredAffiliates.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No se encontraron afiliados registrados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-[#171822] border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Afiliado / Tag</th>
                  <th className="py-3 px-4">Contacto &amp; País</th>
                  <th className="py-3 px-4">Método de Pago</th>
                  <th className="py-3 px-4 text-center">Clics / Ventas</th>
                  <th className="py-3 px-4 text-center">Tasa (%)</th>
                  <th className="py-3 px-4">Ganado / Pagado</th>
                  <th className="py-3 px-4 font-bold text-amber-600 dark:text-[#F2CA50]">Por Pagar</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredAffiliates.map((aff) => {
                  const pending = Math.max(
                    0,
                    (aff.totalCommissionsEarned || 0) - (aff.totalCommissionsPaid || 0)
                  );
                  const cleanPhone = aff.phone.replace(/[^0-9]/g, "");

                  return (
                    <tr
                      key={aff._id}
                      className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Nombre y Tag */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                          <span>{aff.name}</span>
                          {!aff.isActive && (
                            <span className="text-[9px] bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 px-1.5 py-0.2 rounded font-black">
                              PAUSADO
                            </span>
                          )}
                        </div>
                        <span className="inline-block mt-0.5 font-mono text-[11px] font-bold text-amber-600 dark:text-[#F2CA50] bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-500/30">
                          ?ref={aff.code}
                        </span>
                      </td>

                      {/* Contacto */}
                      <td className="py-3 px-4">
                        <div className="text-gray-700 dark:text-gray-300">{aff.email}</div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                          <span>{aff.country || "Global"}</span>
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 font-bold"
                            >
                              <MessageCircle size={11} /> {aff.phone}
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Cobro */}
                      <td className="py-3 px-4 max-w-[200px]">
                        <span className="font-bold text-[11px] uppercase tracking-wide text-gray-800 dark:text-gray-200 block">
                          {aff.payoutMethod}
                        </span>
                        <span className="font-mono text-[10px] text-gray-500 dark:text-gray-400 block truncate" title={aff.payoutDetails}>
                          {aff.payoutDetails}
                        </span>
                      </td>

                      {/* Clics / Ventas */}
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-gray-900 dark:text-white block">
                          {aff.clicks || 0} clics
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">
                          {aff.orderCount || 0} pedidos (${(aff.totalSales || 0).toFixed(0)} USD)
                        </span>
                      </td>

                      {/* Tasa */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => openRateModal(aff)}
                          className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                          title="Cambiar porcentaje de comisión"
                        >
                          {((aff.commissionRate || 0.10) * 100).toFixed(0)}%
                        </button>
                      </td>

                      {/* Ganado / Pagado */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 dark:text-white block">
                          ${(aff.totalCommissionsEarned || 0).toFixed(2)} USD
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">
                          Pagado: ${(aff.totalCommissionsPaid || 0).toFixed(2)}
                        </span>
                      </td>

                      {/* Saldo Pendiente */}
                      <td className="py-3 px-4 font-black text-amber-600 dark:text-[#F2CA50]">
                        ${pending.toFixed(2)} USD
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openPayoutModal(aff)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                          title="Registrar pago al afiliado"
                        >
                          Liquidar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(aff._id, aff.isActive)}
                          className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                            aff.isActive
                              ? "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                              : "border-red-400 text-red-500 hover:bg-red-50"
                          }`}
                          title={aff.isActive ? "Pausar afiliado" : "Activar afiliado"}
                        >
                          {aff.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Liquidación */}
      {payoutModalOpen && selectedAffiliate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#12131A] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Wallet size={18} className="text-emerald-500" /> Registrar Liquidación de Pago
              </h3>
              <button
                type="button"
                onClick={() => setPayoutModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-black/40 p-3 rounded-xl border border-gray-200 dark:border-gray-800 text-xs space-y-1">
              <div>
                Afiliado: <strong className="text-gray-900 dark:text-white">{selectedAffiliate.name}</strong> ({selectedAffiliate.code})
              </div>
              <div>
                Método: <strong className="text-gray-900 dark:text-white">{selectedAffiliate.payoutMethod}</strong>
              </div>
              <div className="font-mono break-all text-gray-600 dark:text-gray-300 text-[11px]">
                {selectedAffiliate.payoutDetails}
              </div>
            </div>

            {payoutError && (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-2.5 rounded-xl text-xs flex items-center gap-1.5">
                <AlertCircle size={14} />
                <span>{payoutError}</span>
              </div>
            )}

            {payoutSuccess && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-300 p-2.5 rounded-xl text-xs flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                <span>{payoutSuccess}</span>
              </div>
            )}

            <form onSubmit={handleProcessPayout} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Monto a Liquidar (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1A1B24] text-gray-900 dark:text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Referencia o Hash de Transferencia
                </label>
                <input
                  type="text"
                  value={payoutNote}
                  onChange={(e) => setPayoutNote(e.target.value)}
                  placeholder="Ej: Binance TxID 0x48f... o Transferencia Zelle #10492"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1A1B24] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayoutModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={payoutLoading}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-50"
                >
                  {payoutLoading ? "Guardando..." : "Confirmar Liquidación"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Tasa de Comisión */}
      {rateModalOpen && selectedAffiliate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#12131A] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Percent size={18} className="text-blue-500" /> Modificar Tasa de Comisión
              </h3>
              <button
                type="button"
                onClick={() => setRateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400">
              Ajusta el porcentaje de comisión para <strong className="text-gray-900 dark:text-white">{selectedAffiliate.name}</strong> ({selectedAffiliate.code}).
            </p>

            <form onSubmit={handleUpdateRate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Porcentaje de Comisión (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={newRatePercent}
                    onChange={(e) => setNewRatePercent(parseInt(e.target.value) || 10)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1A1B24] text-gray-900 dark:text-white text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="text-lg font-bold text-gray-500">%</span>
                </div>
                <span className="text-[10px] text-gray-500 block mt-1">
                  Estándar es 10%. Rango permitido: 1% a 50%.
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={rateLoading}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-50"
                >
                  {rateLoading ? "Actualizando..." : "Guardar Tasa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
