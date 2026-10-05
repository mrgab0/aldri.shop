"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { Footer } from "@/components/shop/Footer";
import {
  Sparkles,
  Zap,
  Truck,
  ShieldCheck,
  Calendar,
  ArrowRight,
  MessageCircle,
  BookOpen,
  Globe,
  Clock,
  ShoppingBag
} from "lucide-react";

interface NosotrosClientProps {
  initialPosts: any[];
  locale?: string;
}

export function NosotrosClient({ initialPosts = [], locale = "es" }: NosotrosClientProps) {
  const [selectedTag, setSelectedTag] = useState("all");

  const tags = [
    { id: "all", label: "Todos los Artículos" },
    { id: "productividad", label: "Productividad" },
    { id: "tecnologia", label: "Tecnología & Gadgets" },
    { id: "recursos", label: "Recursos Digitales" }
  ];

  const filteredPosts = initialPosts.filter((post) => {
    if (selectedTag === "all") return true;
    const search = selectedTag.toLowerCase();
    return (
      post.title?.toLowerCase().includes(search) ||
      post.excerpt?.toLowerCase().includes(search) ||
      post.content?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#0B0C10] text-stone-900 dark:text-white flex flex-col transition-colors duration-300">
      <ShopHeader />

      <main className="nosotros-page-root flex-1">
        
        {/* HERO EDITORIAL: HISTORIA DE ALDRI SHOP */}
        <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-indigo-50/50 via-transparent to-transparent dark:from-[#181922]/60 dark:via-transparent dark:to-transparent border-b border-[#D4AF37]/20">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              
              {/* Kicker */}
              <div className="inline-flex items-center gap-2 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white border border-[#D4AF37]/40 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-sm">
                <Sparkles size={13} className="text-indigo-600 dark:text-[#C5A059]" />
                <span>Innovación Digital &amp; Curaduría Global</span>
              </div>

              {/* Título Principal */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black text-stone-900 dark:text-white tracking-tight leading-tight">
                Herramientas Digitales &amp; Gadgets en Tendencia
              </h1>

              {/* Resumen de Historia */}
              <p className="text-base sm:text-lg text-stone-700 dark:text-gray-300 leading-relaxed font-medium pt-2">
                En <strong className="font-bold text-stone-900 dark:text-white">Aldri Shop</strong>, nacimos para conectar a creadores, emprendedores y entusiastas del lifestyle moderno con activos digitales de alto rendimiento (plantillas Notion, presets, LUTs, guías) y productos dropshipping en tendencia internacional con entrega garantizada y rastreo en tiempo real.
              </p>

              <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-bold text-stone-700 dark:text-gray-300 pt-2">
                <span className="flex items-center gap-1 text-stone-900 dark:text-white">
                  <Globe size={15} className="text-indigo-600 dark:text-[#C5A059]" /> Cobertura Internacional
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-stone-900 dark:text-white">
                  <Zap size={15} className="text-amber-500" /> Descargas Inmediatas 24/7
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-stone-900 dark:text-white">
                  <Truck size={15} className="text-emerald-500" /> Tracking 17Track Global
                </span>
              </div>

            </div>

            {/* 3 PILARES DE ALDRI SHOP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-14">
              
              <div className="bg-white/80 dark:bg-[#181922]/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/25 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-sm border border-indigo-100 dark:border-indigo-900/50">
                  <Zap size={24} />
                </div>
                <h3 className="font-serif font-black text-lg text-stone-900 dark:text-white mb-2">
                  Descarga Instantánea
                </h3>
                <p className="text-xs text-stone-600 dark:text-gray-300 leading-relaxed font-medium">
                  Acceso inmediato a tus archivos digitales, licencias y enlaces seguros justo al completar tu orden, 24 horas al día, 365 días al año.
                </p>
              </div>

              <div className="bg-white/80 dark:bg-[#181922]/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/25 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 shadow-sm border border-amber-100 dark:border-amber-900/50">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-serif font-black text-lg text-stone-900 dark:text-white mb-2">
                  Curaduría &amp; Garantía Total
                </h3>
                <p className="text-xs text-stone-600 dark:text-gray-300 leading-relaxed font-medium">
                  Seleccionamos únicamente artículos probados con alta satisfacción de compra, especificaciones reales y soporte técnico permanente.
                </p>
              </div>

              <div className="bg-white/80 dark:bg-[#181922]/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/25 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 shadow-sm border border-emerald-100 dark:border-emerald-900/50">
                  <Truck size={24} />
                </div>
                <h3 className="font-serif font-black text-lg text-stone-900 dark:text-white mb-2">
                  Rastreo Internacional
                </h3>
                <p className="text-xs text-stone-600 dark:text-gray-300 leading-relaxed font-medium">
                  Monitoreo satelital y carrier internacional punto a punto compatible con 17Track, USPS, DHL y FedEx desde nuestra sección de rastreo.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* SECCIÓN BLOG EDITORIAL & CONSEJOS */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            
            {/* Cabecera del Blog */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                  <BookOpen size={14} className="text-indigo-600 dark:text-[#C5A059]" />
                  <span>Blog &amp; Consejos de Productividad</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-black text-stone-900 dark:text-white">
                  Guías, Tendencias y Recursos Tech
                </h2>
                <p className="text-sm text-stone-600 dark:text-gray-300 font-semibold max-w-xl">
                  Aprende a optimizar tus flujos de trabajo con nuestras guías especializadas y análisis de productos.
                </p>
              </div>

              {/* Filtros de Categorías */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.id)}
                    className={`px-4 py-2 rounded-full text-xs font-black transition-all whitespace-nowrap border ${
                      selectedTag === tag.id
                        ? "bg-stone-900 dark:bg-white text-white dark:text-stone-950 border-stone-900 dark:border-white shadow-sm"
                        : "bg-white dark:bg-[#181922] text-stone-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* GRID DE POSTS */}
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-[#181922] rounded-3xl border border-gray-200 dark:border-gray-800 p-8">
                <p className="text-sm font-bold text-stone-700 dark:text-gray-300">No hay artículos en esta categoría en este momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <article
                    key={post.slug || post._id}
                    className="bg-white dark:bg-[#181922] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    {/* Imagen del Post */}
                    <Link href={`/nosotros/${post.slug}`} className="relative h-56 overflow-hidden block bg-gray-100 dark:bg-gray-800">
                      <img
                        src={post.mainImage || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                          Aldri Insights
                        </span>
                      </div>
                    </Link>

                    {/* Contenido de la Tarjeta */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-[11px] text-stone-600 dark:text-gray-400 font-bold">
                          <Calendar size={13} className="text-indigo-600 dark:text-[#C5A059]" />
                          <span>{new Date(post.createdAt || Date.now()).toLocaleDateString("es-ES", { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span>•</span>
                          <span>3 min de lectura</span>
                        </div>

                        <Link href={`/nosotros/${post.slug}`}>
                          <h3 className="font-serif font-black text-lg text-stone-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-[#C5A059] transition-colors line-clamp-2 leading-snug">
                            {post.title}
                          </h3>
                        </Link>

                        <p className="text-xs text-stone-600 dark:text-gray-300 line-clamp-3 leading-relaxed font-medium">
                          {post.excerpt || post.content?.slice(0, 140)}
                        </p>
                      </div>

                      {/* Botón Leer Más */}
                      <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                        <Link
                          href={`/nosotros/${post.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-black text-stone-900 dark:text-white hover:text-indigo-600 dark:hover:text-[#C5A059] group-hover:translate-x-1 transition-transform"
                        >
                          <span>Leer Artículo Completo</span>
                          <ArrowRight size={14} className="text-indigo-600 dark:text-[#C5A059]" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

          </div>
        </section>

        {/* CTA FINAL DE COMPRA */}
        <section className="py-14 bg-gradient-to-r from-stone-100 via-stone-50 to-stone-100 dark:from-[#181922] dark:via-[#161822] dark:to-[#181922] border-t border-[#D4AF37]/20">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-stone-900 dark:text-white">
              ¿Listo para Potenciar Tu Productividad &amp; Estilo?
            </h2>
            <p className="text-sm text-stone-600 dark:text-gray-300 max-w-xl mx-auto font-medium leading-relaxed">
              Explora nuestro catálogo de activos digitales con descarga instantánea y gadgets con envío y seguimiento internacional garantizado.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
              <Link
                href="/productos"
                className="bg-stone-900 hover:bg-black dark:bg-[#C5A059] dark:hover:bg-[#d8b56f] text-white dark:text-stone-950 px-7 py-3.5 rounded-full font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <ShoppingBag size={16} />
                <span>Explorar Catálogo</span>
              </Link>
              <a
                href="https://wa.me/13467392730?text=¡Hola!%20Leí%20su%20página%20de%20Nosotros%20en%20Aldri%20Shop%20y%20quisiera%20más%20información."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3.5 rounded-full font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <MessageCircle size={16} />
                <span>Hablar por WhatsApp (+1 346 739 2730)</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
