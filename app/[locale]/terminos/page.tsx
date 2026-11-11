import { ShopHeader } from "@/components/shop/ShopHeader";
import { Footer } from "@/components/shop/Footer";
import { Metadata } from "next";
import { FileText, ShieldCheck, ShoppingBag, Scale, Award, AlertCircle } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ locale?: string }> }): Promise<Metadata> {
  const resolved = await params;
  const locale = resolved?.locale || "es";
  const isEn = locale === "en";

  return {
    title: isEn
      ? "Terms of Service & Conditions | Aldri Shop"
      : "Términos y Condiciones del Servicio | Aldri Shop",
    description: isEn
      ? "Official Terms of Service of Aldri Shop. Product availability, digital asset licenses, international dropship fulfillment, and affiliate rules."
      : "Términos y condiciones oficiales de compra, licencias digitales, envíos físicos internacionales y reglas del Programa de Afiliados de Aldri Shop.",
    openGraph: {
      title: isEn ? "Terms of Service | Aldri Shop" : "Términos y Condiciones | Aldri Shop",
      description: "Condiciones contractuales de compra, licencias y garantías comerciales en Aldri Shop.",
      images: ["https://aldri.shop/logo.png"],
    },
  };
}

export default async function TerminosPage({ params }: { params: Promise<{ locale?: string }> }) {
  const resolved = await params;
  const locale = resolved?.locale || "es";
  const isEn = locale === "en";

  return (
    <div className="min-h-screen bg-[#060608] gold-ambient-mesh text-white flex flex-col select-none">
      <ShopHeader />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Cabecera */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-[#F2CA50]/40 text-[#F2CA50] text-xs font-black uppercase tracking-wider">
              <Scale size={14} /> {isEn ? "Legal Agreement" : "Condiciones Generales de Contratación"}
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-black text-white">
              {isEn ? "Terms of Service" : "Términos y Condiciones"}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
              {isEn
                ? "Please read these terms carefully before placing an order or registering for our Affiliate Program. Last updated: November 2026."
                : "Por favor lee atentamente estas condiciones antes de realizar un pedido o unirte a nuestro Programa de Afiliados. Última actualización: Noviembre de 2026."}
            </p>
          </div>

          {/* Bloque Legal */}
          <div className="glass-panel-luxury p-6 sm:p-10 rounded-3xl border border-white/10 space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {/* 1. Objeto */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-serif font-black text-white flex items-center gap-2">
                <span className="text-[#F2CA50]">1.</span> Objeto y Ámbito de Aplicación
              </h2>
              <p>
                Las presentes Condiciones Generales regulan el acceso, navegación y contratación de productos a través de la tienda en línea oficial <strong className="text-white">Aldri Shop</strong> (<Link href="/" className="text-[#F2CA50] hover:underline font-bold">aldri.shop</Link>). La realización de cualquier pedido o el registro en la plataforma implica la aceptación plena y sin reservas de todos los términos aquí estipulados.
              </p>
            </section>

            {/* 2. Catálogo Dual */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-serif font-black text-white flex items-center gap-2">
                <span className="text-[#F2CA50]">2.</span> Naturaleza del Catálogo de Productos
              </h2>
              <p>Aldri Shop opera un catálogo curado de 40 productos reales organizados en dos modalidades:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
                <li>
                  <strong className="text-zinc-200">Productos Digitales JIT:</strong> Plantillas de Notion, colecciones de LUTs para edición de video, guías y licencias de software. Se entregan de forma inmediata y automática 24/7/365 en pantalla tras confirmar la transacción y por correo electrónico.
                </li>
                <li>
                  <strong className="text-zinc-200">Productos Físicos (Dropshipping Multi-Almacén):</strong> Gadgets, periféricos de escritorio y accesorios EDC suministrados a través de almacenes internacionales certificados (Zendrop US y CJ Dropshipping Global Fast Line) con despacho en 24-48h hábiles y número de tracking oficial rastreable vía carrier internacional (USPS, CJPacket, DHL, 17Track).
                </li>
              </ul>
            </section>

            {/* 3. Precios y Moneda */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-serif font-black text-white flex items-center gap-2">
                <span className="text-[#F2CA50]">3.</span> Precios y Moneda de Facturación
              </h2>
              <p>
                Todos los precios de los productos están expresados y fijados en <strong className="text-white">Dólares Estadounidenses (USD)</strong>. Las tarifas no incluyen aranceles aduaneros o impuestos locales extraordinarios que pudieran ser aplicables por las autoridades aduaneras del país de destino del comprador (en los casos de envío físico internacional donde aplique legislación DDU/DAP).
              </p>
            </section>

            {/* 4. Medios de Pago */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-serif font-black text-white flex items-center gap-2">
                <span className="text-[#F2CA50]">4.</span> Pedidos y Métodos de Pago
              </h2>
              <p>
                Aceptamos pagos a través de los canales autorizados y configurados en la pasarela de checkout: Square Checkout (Tarjeta de Crédito/Débito), PayPal Internacional, Zelle (EE.UU.), CashApp y Criptomonedas estables (Binance Pay / USDT TRC20). Toda transacción requiere una referencia válida de confirmación. En caso de detectarse transacciones no autorizadas, fraudulentas o revertidas, Aldri Shop se reserva el derecho de cancelar el pedido y suspender el acceso a los activos digitales entregados.
              </p>
            </section>

            {/* 5. Licencia de Activos Digitales */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-serif font-black text-white flex items-center gap-2">
                <span className="text-[#F2CA50]">5.</span> Licencia de Uso de Activos Digitales
              </h2>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                <p className="text-zinc-300 text-xs font-medium">
                  Al adquirir una plantilla de Notion, paquete de LUTs o activo digital en Aldri Shop, el cliente recibe una <strong className="text-[#F2CA50]">licencia personal, comercial no exclusiva, intransferible y de por vida</strong> para su uso propio o en proyectos de sus clientes finales.
                </p>
                <p className="text-red-300 text-xs font-bold">
                  Queda terminantemente prohibida la reventa directa, sublicenciamiento, redistribución gratuita o comercialización de las plantillas o archivos fuente como producto propio en cualquier plataforma digital o marketplace.
                </p>
              </div>
            </section>

            {/* 6. Programa de Afiliados */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-serif font-black text-white flex items-center gap-2">
                <span className="text-[#F2CA50]">6.</span> Términos del Programa de Afiliados (Aldri Associates)
              </h2>
              <p>Los embajadores y afiliados registrados en el programa se comprometen a:</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li>No realizar spam, envío masivo no solicitado ni publicidad engañosa en redes sociales o mensajería.</li>
                <li>
                  <strong className="text-white">Prohibición de Auto-Referido:</strong> No está permitido utilizar su propio enlace o tag de afiliado para adquirir productos con descuento encubierto o auto-comisión. Nuestro sistema audita y anula automáticamente cualquier comisión donde el correo o teléfono del comprador coincida con el afiliado.
                </li>
                <li>Las liquidaciones se efectúan quincenalmente sobre ventas confirmadas y libres de devolución.</li>
              </ul>
            </section>

            {/* 7. Ley Aplicable */}
            <section className="space-y-2 pt-4 border-t border-white/10">
              <h2 className="text-base sm:text-lg font-serif font-black text-white flex items-center gap-2">
                <span className="text-[#F2CA50]">7.</span> Ley Aplicable y Resolución de Disputas
              </h2>
              <p>
                Estas Condiciones se rigen e interpretan de conformidad con los principios del comercio electrónico internacional y las leyes mercantiles aplicables. En caso de discrepancia, las partes acuerdan acudir prioritariamente al canal de mediación directa a través de <strong className="text-[#F2CA50]">soporte@aldri.shop</strong> antes de iniciar cualquier procedimiento arbitral o judicial.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
