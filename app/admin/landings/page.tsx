"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Rocket,
  Plus,
  ExternalLink,
  Copy,
  Check,
  Eye,
  MousePointerClick,
  TrendingUp,
  Edit,
  Trash2,
  Globe,
  Flame,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { getLandingPages, updateLandingPage, deleteLandingPage } from "@/lib/actions/landing";

export default function AdminLandingsPage() {
  const [landings, setLandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadLandings();
  }, []);

  async function loadLandings() {
    setLoading(true);
    const res = await getLandingPages();
    if (res.success && res.data) {
      setLandings(res.data);
    }
    setLoading(false);
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleToggleStatus = async (landing: any) => {
    const updatedStatus = !landing.isActive;
    setLandings((prev) =>
      prev.map((l) => (l._id === landing._id ? { ...l, isActive: updatedStatus } : l))
    );
    await updateLandingPage(landing._id, { isActive: updatedStatus });
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`¿Estás seguro de eliminar la landing page "${title}"? Esta acción no se puede deshacer.`)) {
      setLandings((prev) => prev.filter((l) => l._id !== id));
      await deleteLandingPage(id);
    }
  };

  // Métricas acumuladas
  const totalViews = landings.reduce((acc, l) => acc + (l.viewsCount || 0), 0);
  const totalClicks = landings.reduce((acc, l) => acc + (l.clicksCount || 0), 0);
  const avgConversion = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">
              <Rocket className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Creador de Landing Pages
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Crea páginas de venta ultraoptimizadas con subdominio propio y redacción asistida por IA.
          </p>
        </div>

        <Link
          href="/admin/landings/crear"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Nueva Landing Page
        </Link>
      </div>

      {/* Info DNS / Subdominios */}
      <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-blue-200 text-xs sm:text-sm flex items-start gap-3">
        <Globe className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-blue-300 font-semibold">¿Cómo funcionan los subdominios?</strong>
          <p className="mt-0.5 text-blue-200/90 text-xs">
            Cada landing aparta su propio subdominio como <code className="bg-blue-900/50 px-1 py-0.5 rounded text-blue-100 font-mono">https://tu-producto.aldri.shop</code>.
            Además, siempre está disponible al instante en <code className="bg-blue-900/50 px-1 py-0.5 rounded text-blue-100 font-mono">https://aldri.shop/l/tu-producto</code> para tus campañas de anuncios sin esperar propagación DNS.
          </p>
        </div>
      </div>

      {/* Métricas Globales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Visitas</p>
            <p className="text-2xl font-black text-white mt-1">{totalViews}</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Clics a Compra / WhatsApp</p>
            <p className="text-2xl font-black text-white mt-1">{totalClicks}</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <MousePointerClick className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Tasa de Conversión (CTR)</p>
            <p className="text-2xl font-black text-white mt-1">{avgConversion}%</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Listado de Landings */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 border border-slate-800 rounded-2xl bg-slate-900/40">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Cargando landing pages...
        </div>
      ) : landings.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/20 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
            <Rocket className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-white">No tienes landing pages creadas todavía</h3>
            <p className="text-sm text-slate-400">
              Crea tu primera página de producto en minutos con redacción automática de títulos y beneficios por IA.
            </p>
          </div>
          <Link
            href="/admin/landings/crear"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            Crear Mi Primera Landing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {landings.map((l) => {
            const pathUrl = `https://aldri.shop/l/${l.subdomain}`;
            const subUrl = `https://${l.subdomain}.aldri.shop`;
            const ctr = l.viewsCount > 0 ? ((l.clicksCount / l.viewsCount) * 100).toFixed(1) : "0.0";

            return (
              <div
                key={l._id}
                className={`p-5 rounded-2xl bg-slate-900/70 border transition-all flex flex-col justify-between space-y-4 ${
                  l.isActive ? "border-slate-800 hover:border-slate-700" : "border-slate-800/40 opacity-75"
                }`}
              >
                <div className="space-y-3">
                  {/* Fila superior: Estado y Switch */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          l.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${l.isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                        {l.isActive ? "Activa" : "Pausada"}
                      </span>
                      <span className="text-xs text-slate-400 uppercase font-mono px-2 py-0.5 rounded bg-slate-800">
                        CTA: {l.ctaType}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleStatus(l)}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title={l.isActive ? "Pausar Landing" : "Activar Landing"}
                    >
                      {l.isActive ? (
                        <ToggleRight className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-500" />
                      )}
                    </button>
                  </div>

                  {/* Título y Subdominio */}
                  <div>
                    <h3 className="font-bold text-white text-lg leading-snug">{l.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{l.headline}</p>
                  </div>

                  {/* Enlaces de acceso */}
                  <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono truncate">{subUrl}</span>
                      <button
                        onClick={() => handleCopy(subUrl, `${l._id}-sub`)}
                        className="text-slate-400 hover:text-amber-400 flex items-center gap-1 ml-2 flex-shrink-0 cursor-pointer"
                        title="Copiar subdominio"
                      >
                        {copiedId === `${l._id}-sub` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedId === `${l._id}-sub` ? "Copiado" : "Copiar"}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs border-t border-slate-800/60 pt-1.5">
                      <span className="text-slate-400 font-mono truncate">{pathUrl}</span>
                      <button
                        onClick={() => handleCopy(pathUrl, `${l._id}-path`)}
                        className="text-slate-400 hover:text-amber-400 flex items-center gap-1 ml-2 flex-shrink-0 cursor-pointer"
                        title="Copiar ruta directa"
                      >
                        {copiedId === `${l._id}-path` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedId === `${l._id}-path` ? "Copiado" : "Ruta"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Estadísticas */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="bg-slate-800/40 p-2 rounded-lg">
                      <p className="text-[10px] text-slate-400 uppercase">Vistas</p>
                      <p className="text-sm font-bold text-white mt-0.5">{l.viewsCount || 0}</p>
                    </div>
                    <div className="bg-slate-800/40 p-2 rounded-lg">
                      <p className="text-[10px] text-slate-400 uppercase">Clics</p>
                      <p className="text-sm font-bold text-emerald-400 mt-0.5">{l.clicksCount || 0}</p>
                    </div>
                    <div className="bg-slate-800/40 p-2 rounded-lg">
                      <p className="text-[10px] text-slate-400 uppercase">CTR</p>
                      <p className="text-sm font-bold text-amber-400 mt-0.5">{ctr}%</p>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <a
                    href={`/l/${l.subdomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Abrir Página
                  </a>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/landings/editar/${l._id}`}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Editar Landing"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(l._id, l.title)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                      title="Eliminar Landing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
