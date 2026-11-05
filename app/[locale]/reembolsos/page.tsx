import { ShopHeader } from "@/components/shop/ShopHeader";
import { Footer } from "@/components/shop/Footer";
import { Metadata } from "next";
import { RotateCcw, Truck, ShieldCheck, CheckCircle2, Clock, HelpCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    title: isEn
      ? "Shipping & 30-Day Return Policy | Aldri Shop"
      : "Política de Envíos, Garantía y Reembolsos (30 Días) | Aldri Shop",
    description: isEn
      ? "Aldri Shop shipping timelines (USPS Priority 2-5 days, Global Fast Line 7-12 days), instant digital downloads, and 30-day money-back guarantee."
      : "Conoce los plazos de envío (USPS Priority 2-5 días, Global 7-12 días), descargas digitales instantáneas y nuestra garantía de devolución de 30 días en Aldri Shop.",
    openGraph: {
      title: isEn ? "Shipping & Returns | Aldri Shop" : "Envíos y Reembolsos | Aldri Shop",
      description: "Garantía de satisfacción de 30 días y plazos de entrega transparentes.",
      images: ["https://aldri.shop/logo.png"],
    },
  };
}

export default async function ReembolsosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";

  return (
    <div className="min-h-screen bg-[#060608] gold-ambient-mesh text-white flex flex-col select-none">
      <ShopHeader />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Cabecera */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-[#F2CA50]/40 text-[#F2CA50] text-xs font-black uppercase tracking-wider">
              <RotateCcw size={14} /> {isEn ? "Customer Satisfaction Guarantee" : "Garantía Total de Satisfacción"}
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-black text-white">
              {isEn ? "Shipping & Refund Policy" : "Política de Envíos y Reembolsos"}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
              {isEn
                ? "Transparent shipping timelines, instant digital fulfillment, and 30-day guarantee for physical items. Last updated: November 2026."
                : "Tiempos de despacho transparentes, entrega digital inmediata y 30 días de garantía para productos físicos. Última actualización: Noviembre de 2026."}
            </p>
          </div>

          {/* Tarjetas de Tiempos de Entrega */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-2xl glass-panel-luxury border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-[#F2CA50] flex items-center justify-center font-bold">
                ⚡
              </div>
              <h3 className="font-bold text-white text-sm">Descargas Digitales</h3>
              <p className="text-zinc-400 text-xs">
                <strong>Entrega Inmediata 24/7/365:</strong> En pantalla tras confirmar el pago y con respaldo directo a tu correo electrónico. Sin esperas postales.
              </p>
            </div>

            <div className="p-5 rounded-2xl glass-panel-luxury border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                📦
              </div>
              <h3 className="font-bold text-white text-sm">Envíos Zendrop US (EE.UU.)</h3>
              <p className="text-zinc-400 text-xs">
                <strong>2 a 5 Días Hábiles:</strong> Despacho desde almacenes en Estados Unidos vía USPS Priority Mail con número de seguimiento en tiempo real.
              </p>
            </div>

            <div className="p-5 rounded-2xl glass-panel-luxury border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                ✈️
              </div>
              <h3 className="font-bold text-white text-sm">Envíos Globales CJ Fast Line</h3>
              <p className="text-zinc-400 text-xs">
                <strong>7 a 12 Días Hábiles:</strong> Despacho aéreo internacional prioritario con entrega asegurada en domicilio y tracking oficial vía 17Track.
              </p>
            </div>
          </div>

          {/* Bloque Legal de Reembolsos */}
          <div className="glass-panel-luxury p-6 sm:p-10 rounded-3xl border border-white/10 space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {/* 1. Garantía 30 Días */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-serif font-black text-white flex items-center gap-2">
                <span className="text-[#F2CA50]">1.</span> Garantía de Devolución de 30 Días (Productos Físicos)
              </h2>
              <p>
                Todos los productos físicos adquiridos en Aldri Shop cuentan con una <strong className="text-white">garantía de satisfacción de 30 días naturales</strong> a partir de la fecha de entrega confirmada por el transportista. Puedes solicitar el reembolso o reemplazo sin coste adicional en cualquiera de los siguientes supuestos:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li>El producto llegó dañado, roto o con desperfectos atribuibles al transporte.</li>
                <li>El artículo recibido no coincide con las especificaciones, modelo o color solicitado.</li>
                <li>El paquete se extravió en tránsito o superó el plazo máximo garantizado sin entrega.</li>
              </ul>
            </section>

            {/* 2. Política de Activos Digitales */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-serif font-black text-white flex items-center gap-2">
                <span className="text-[#F2CA50]">2.</span> Política para Productos y Descargas Digitales
              </h2>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                <p className="text-zinc-300 text-xs">
                  Conforme a los estándares internacionales de comercio electrónico de bienes intangibles, las plantillas de Notion, colecciones de LUTs, guías y licencias de software son bienes consumibles de entrega digital instantánea.
                </p>
                <p className="text-amber-200 text-xs">
                  <strong>Una vez entregado el enlace o clave de duplicación/descarga, no se admiten cancelaciones por mero desistimiento subjetivo.</strong> No obstante, si el archivo presenta un fallo técnico atribuible a nosotros que no podamos resolver en un plazo de 48 horas, procederemos con el reembolso íntegro de la compra.
                </p>
              </div>
            </section>

            {/* 3. Proceso de Solicitud */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-serif font-black text-white flex items-center gap-2">
                <span className="text-[#F2CA50]">3.</span> ¿Cómo Solicitar una Devolución o Reembolso?
              </h2>
              <ol className="list-decimal pl-5 space-y-1.5 text-zinc-400">
                <li>
                  Ingresa a nuestra sección de <Link href="/rastreo" className="text-[#F2CA50] hover:underline font-bold">Rastreo de Pedidos</Link> con tu número de orden (ej. <code className="text-white">ALDR-123456-1</code>) o tu correo.
                </li>
                <li>
                  Contáctanos por WhatsApp oficial o a <strong className="text-white">soporte@aldri.shop</strong> adjuntando fotografías o video breve en caso de daño en producto físico.
                </li>
                <li>
                  Nuestro equipo de soporte revisará la solicitud y emitirá una resolución en un plazo máximo de <strong>24 a 48 horas hábiles</strong>.
                </li>
              </ol>
            </section>

            {/* 4. Plazos de Reembolso */}
            <section className="space-y-2 pt-4 border-t border-white/10">
              <h2 className="text-base sm:text-lg font-serif font-black text-white flex items-center gap-2">
                <span className="text-[#F2CA50]">4.</span> Plazos y Modalidad del Reembolso
              </h2>
              <p>
                Una vez aprobada la devolución, el importe íntegro se reintegrará a través del mismo canal utilizado por el comprador:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li><strong>Cripto (Binance Pay / USDT TRC20):</strong> Acreditación en menos de 2 horas.</li>
                <li><strong>Zelle / PayPal / CashApp:</strong> Acreditación el mismo día hábil.</li>
                <li><strong>Tarjeta de Crédito / Square:</strong> Reversión procesada de inmediato (reflejo bancario entre 2 y 5 días hábiles según la entidad emisora).</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
