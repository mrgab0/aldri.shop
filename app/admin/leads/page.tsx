"use client";

import { useEffect, useState } from "react";
import {
  Users,
  MessageCircle,
  Phone,
  Mail,
  Flame,
  Zap,
  Snowflake,
  Search,
  Download,
  ExternalLink,
  RefreshCw,
  Clock,
  Eye,
  X,
  FileSpreadsheet
} from "lucide-react";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterScore, setFilterScore] = useState<"all" | "hot" | "warm" | "cold">("all");
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (data.success && data.data) {
        setLeads(data.data);
      }
    } catch (e) {
      console.error("Error al cargar leads:", e);
    } finally {
      setLoading(false);
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesScore = filterScore === "all" || lead.intentScore === filterScore;
    const term = search.toLowerCase();
    const matchesSearch =
      (lead.customerName || "").toLowerCase().includes(term) ||
      (lead.customerPhone || "").toLowerCase().includes(term) ||
      (lead.customerEmail || "").toLowerCase().includes(term) ||
      (lead.interestedProducts || []).some((p: string) => p.toLowerCase().includes(term));
    return matchesScore && matchesSearch;
  });

  const exportToCsv = () => {
    if (filteredLeads.length === 0) return alert("No hay leads para exportar.");
    const headers = ["Fecha", "Nombre", "Teléfono", "Email", "Score", "Productos Interesados", "Estado Lead"];
    const rows = filteredLeads.map((l) => [
      new Date(l.createdAt).toLocaleDateString(),
      `"${l.customerName || ''}"`,
      `"${l.customerPhone || ''}"`,
      `"${l.customerEmail || ''}"`,
      l.intentScore,
      `"${(l.interestedProducts || []).join('; ')}"`,
      l.leadStatus
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aldri_shop_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getScoreBadge = (score: string) => {
    switch (score) {
      case "hot":
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-400 text-xs px-2.5 py-1 rounded-full font-bold">
            <Flame size={12} className="fill-red-600 text-red-600" /> Lead Caliente 🔥
          </span>
        );
      case "warm":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-400 text-xs px-2.5 py-1 rounded-full font-bold">
            <Zap size={12} className="text-amber-600" /> Interesado ⚡
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-xs px-2.5 py-1 rounded-full font-semibold">
            <Snowflake size={12} /> Curioso
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#12131A] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Users size={16} /> Minería de Leads & Marketing
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Conversaciones & Leads Capturados por el Asistente IA
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Datos recopilados en tiempo real para campañas de WhatsApp, Email Marketing o prospección telefónica comercial.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={loadLeads}
            className="p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-xl transition-all"
            title="Recargar leads"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={exportToCsv}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <Download size={15} />
            <span>Exportar CSV ({filteredLeads.length})</span>
          </button>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#12131A] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Leads</span>
            <div className="text-3xl font-black text-gray-900 dark:text-white mt-1">{leads.length}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#12131A] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Leads Calientes (WhatsApp/Tel)</span>
            <div className="text-3xl font-black text-red-600 dark:text-red-400 mt-1">
              {leads.filter((l) => l.intentScore === "hot").length}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
            <Flame size={24} className="fill-red-500 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#12131A] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Con Intención de Compra</span>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {leads.filter((l) => l.intentScore === "warm").length}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <Zap size={24} />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-[#12131A] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, teléfono, correo o producto..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl text-xs bg-gray-50 dark:bg-gray-900 dark:text-white border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div className="flex items-center gap-1">
          {(["all", "hot", "warm", "cold"] as const).map((sc) => (
            <button
              key={sc}
              onClick={() => setFilterScore(sc)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                filterScore === sc
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              {sc === "all" ? "Todos" : sc === "hot" ? "🔥 Calientes" : sc === "warm" ? "⚡ Interesados" : "❄️ Curiosos"}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Leads */}
      <div className="bg-white dark:bg-[#12131A] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Lead / Contacto</th>
                <th className="py-3 px-4">Calificación</th>
                <th className="py-3 px-4">Productos Consultados</th>
                <th className="py-3 px-4 text-center">Acciones Directas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-semibold">
                    {loading ? "Cargando datos..." : "No hay leads registrados aún con este filtro."}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const cleanPhone = (lead.customerPhone || "").replace(/[^\d+]/g, "");
                  const whatsappMsg = encodeURIComponent(
                    `¡Hola ${lead.customerName || ""}! Te saludamos desde Aldri Shop. Vimos que estabas consultando en nuestra tienda online sobre nuestros productos. ¿Tienes alguna pregunta o deseas que te enviemos una oferta exclusiva de bienvenida? ⚡`
                  );

                  return (
                    <tr key={lead._id} className="hover:bg-gray-50/70 dark:hover:bg-gray-900/40 transition-colors">
                      <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-gray-400" />
                          <span>{new Date(lead.updatedAt || lead.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <strong className="text-gray-900 dark:text-white block font-bold">
                            {lead.customerName || "Visitante Anónimo"}
                          </strong>
                          {lead.customerPhone && (
                            <div className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                              <Phone size={11} /> {lead.customerPhone}
                            </div>
                          )}
                          {lead.customerEmail && (
                            <div className="text-gray-500 text-[11px] flex items-center gap-1">
                              <Mail size={11} /> {lead.customerEmail}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getScoreBadge(lead.intentScore)}
                      </td>

                      <td className="py-3.5 px-4">
                        {lead.interestedProducts && lead.interestedProducts.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {lead.interestedProducts.map((p: string, idx: number) => (
                              <span key={idx} className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                {p}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Interés general</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${whatsappMsg}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-sm transition-all"
                              title="Contactar directo por WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </a>
                          )}
                          {lead.customerEmail && (
                            <a
                              href={`mailto:${lead.customerEmail}?subject=Oferta%20Especial%20en%20Aldri%20Shop`}
                              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-sm transition-all"
                              title="Enviar email comercial"
                            >
                              <Mail size={14} />
                            </a>
                          )}
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-xl transition-all"
                            title="Ver transcripción del chat"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Transcripción Completa */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#181922] w-full max-w-xl rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  Historial de Chat: {selectedLead.customerName || "Visitante Anónimo"}
                </h3>
                <span className="text-[11px] text-gray-400">ID Sesión: {selectedLead.sessionId}</span>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
              {(selectedLead.conversation || []).map((msg: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl max-w-[85%] ${
                    msg.role === "user"
                      ? "ml-auto bg-indigo-600 text-white rounded-br-xs"
                      : "mr-auto bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
