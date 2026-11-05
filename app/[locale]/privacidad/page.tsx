import { ShopHeader } from "@/components/shop/ShopHeader";
import { Footer } from "@/components/shop/Footer";
import { Metadata } from "next";
import { ShieldCheck, Lock, Globe2, FileText, CheckCircle2, UserCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    title: isEn
      ? "Privacy Policy (GDPR • CCPA • LATAM • APPI Japan) | Aldri Shop"
      : "Política de Privacidad Integral (GDPR • CCPA • LATAM • APPI Japón) | Aldri Shop",
    description: isEn
      ? "Comprehensive Privacy Policy covering GDPR (EU), CCPA/CPRA (USA), LGPD/LATAM, and APPI (Japan). Learn how Aldri Shop protects and respects your personal data."
      : "Política de Privacidad de Aldri Shop conforme a los estándares de GDPR (Unión Europea), CCPA/CPRA (EE.UU.), LGPD/LFPDPPP (Latinoamérica) y APPI (Japón).",
    openGraph: {
      title: isEn ? "Privacy Policy | Aldri Shop" : "Política de Privacidad | Aldri Shop",
      description: "Protección de datos personales, cookies y derechos de privacidad globales.",
      images: ["https://aldri.shop/logo.png"],
    },
  };
}

export default async function PrivacidadPage({ params }: { params: Promise<{ locale: string }> }) {
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
              <ShieldCheck size={14} /> {isEn ? "Global Legal Framework" : "Marco Legal Internacional"}
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-black text-white">
              {isEn ? "Comprehensive Privacy Policy" : "Política de Privacidad Integral"}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
              {isEn
                ? "Last updated: November 2026. Compliant with GDPR (EU/UK), CCPA/CPRA (USA), LGPD & LFPDPPP (LATAM), and APPI (Japan)."
                : "Última actualización: Noviembre de 2026. Conforme al RGPD (Unión Europea), CCPA/CPRA (Estados Unidos), LGPD/LFPDPPP (América Latina) y Ley APPI (Japón)."}
            </p>
          </div>

          {/* Sellos de Jurisdicciones Reguladas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl glass-panel-luxury border border-white/10 space-y-1">
              <span className="font-bold text-white block">🇪🇺 Unión Europea</span>
              <span className="text-[11px] text-zinc-400 block">GDPR / RGPD (Reg. UE 2016/679)</span>
            </div>
            <div className="p-4 rounded-2xl glass-panel-luxury border border-white/10 space-y-1">
              <span className="font-bold text-white block">🇺🇸 Estados Unidos</span>
              <span className="text-[11px] text-zinc-400 block">CCPA &amp; CPRA (Cal. Civ. Code)</span>
            </div>
            <div className="p-4 rounded-2xl glass-panel-luxury border border-white/10 space-y-1">
              <span className="font-bold text-white block">🌎 Latinoamérica</span>
              <span className="text-[11px] text-zinc-400 block">LGPD Brasil • LFPDPPP México • Ley 1581 Col</span>
            </div>
            <div className="p-4 rounded-2xl glass-panel-luxury border border-[#F2CA50]/30 bg-amber-500/5 space-y-1">
              <span className="font-bold text-[#F2CA50] block">🇯🇵 Japón (APPI)</span>
              <span className="text-[11px] text-zinc-300 block">個人情報保護法 (Act on Protection of Personal Info)</span>
            </div>
          </div>

          {/* Contenido Legal Estructurado */}
          <div className="glass-panel-luxury p-6 sm:p-10 rounded-3xl border border-white/10 space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {/* Sección 1: Responsable */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-serif font-black text-white flex items-center gap-2">
                <span className="text-[#F2CA50]">1.</span> Responsable del Tratamiento y Contacto Oficial
              </h2>
              <p>
                <strong>Aldri Shop</strong> (&quot;la Plataforma&quot;, &quot;nosotros&quot; o &quot;nuestro&quot;), con dominio oficial en <Link href="/" className="text-[#F2CA50] hover:underline font-bold">aldri.shop</Link>, es la entidad responsable del tratamiento de los datos personales recopilados a través de este sitio web, sus extensiones localizadas y canales de atención vinculados. Para cualquier consulta sobre privacidad o el ejercicio de derechos, nuestro Delegado de Protección de Datos (DPO) puede ser contactado vía correo electrónico en <strong className="text-white">soporte@aldri.shop</strong> o mediante nuestro canal oficial de soporte.
              </p>
            </section>

            {/* Sección 2: Datos Recopilados */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-serif font-black text-white flex items-center gap-2">
                <span className="text-[#F2CA50]">2.</span> Categorías de Datos Recopilados
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
                <li>
                  <strong className="text-zinc-200">Datos de Identificación y Contacto:</strong> Nombre, dirección de entrega física o correo electrónico para entrega de licencias digitales, número de teléfono (WhatsApp) proporcionado voluntariamente al procesar una orden o registrarse como afiliado.
                </li>
                <li>
                  <strong className="text-zinc-200">Datos Transaccionales:</strong> Método de pago seleccionado, referencia de transacción, historial de pedidos, detalle de ítems y comisiones generadas. <em>No almacenamos números de tarjetas de crédito directamente en nuestros servidores; los pagos son procesados por pasarelas externas seguras con certificación PCI-DSS.</em>
                </li>
                <li>
                  <strong className="text-zinc-200">Datos Técnicos y Telemetría:</strong> Dirección IP anonimizada, identificadores de sesión, navegador, sistema operativo y eventos de navegación necesarios para la integridad técnica del carrito y checkout.
                </li>
                <li>
                  <strong className="text-zinc-200">Datos de Atribución de Afiliados:</strong> Cookies técnicas con tag de referido (<code className="text-[#F2CA50]">aldri_ref</code>) con vigencia de 30 días, destinadas a remunerar a los embajadores comerciales sin asociar perfiles invasivos.
                </li>
              </ul>
            </section>

            {/* Sección 3: Bases Legales */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-serif font-black text-white flex items-center gap-2">
                <span className="text-[#F2CA50]">3.</span> Bases Jurídicas del Tratamiento
              </h2>
              <p>Tratamos tus datos exclusivamente amparados en las siguientes bases legítimas:</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li><strong>Ejecución Contractual (Art. 6.1.b GDPR):</strong> Para procesar tu compra, despachar productos físicos con tracking internacional o emitir descargas digitales.</li>
                <li><strong>Consentimiento Explícito (Art. 6.1.a GDPR / APPI Art. 27):</strong> Al aceptar cookies analíticas o registrarte en el Programa de Afiliados.</li>
                <li><strong>Cumplimiento de Obligaciones Legales y Fiscales:</strong> Facturación y registro contable de ventas y pagos.</li>
                <li><strong>Interés Legítimo:</strong> Prevención del fraude cibernético, seguridad de la plataforma y soporte al cliente.</li>
              </ul>
            </section>

            {/* Sección 4: Derechos por Jurisdicción */}
            <section className="space-y-4">
              <h2 className="text-base sm:text-lg font-serif font-black text-white flex items-center gap-2">
                <span className="text-[#F2CA50]">4.</span> Derechos Específicos por Jurisdicción
              </h2>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider text-[#F2CA50]">
                    A. Residentes en la Unión Europea y Reino Unido (GDPR / UK GDPR)
                  </h3>
                  <p className="text-zinc-400 text-xs">
                    Tienes derecho a solicitar el acceso, rectificación, portabilidad y supresión de tus datos (&quot;Derecho al Olvido&quot;), así como a limitar u oponerte a su tratamiento. Si consideras que tus derechos han sido vulnerados, puedes presentar una reclamación ante la Autoridad de Control competente en tu país de residencia.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider text-[#F2CA50]">
                    B. Residentes en Estados Unidos (CCPA / CPRA &amp; VCDPA)
                  </h3>
                  <p className="text-zinc-400 text-xs">
                    <strong>Cláusula &quot;Do Not Sell or Share My Personal Information&quot;:</strong> Aldri Shop <strong>NO vende ni alquila</strong> información personal de sus clientes a terceros para beneficio económico ni comercial. Los residentes de California, Virginia y otros estados gozan del derecho a conocer qué datos recopilamos, solicitar su eliminación y no ser discriminados por ejercer sus derechos de privacidad.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider text-[#F2CA50]">
                    C. Residentes en Latinoamérica (LGPD Brasil • LFPDPPP México • Ley 1581 Colombia)
                  </h3>
                  <p className="text-zinc-400 text-xs">
                    Garantizamos el ejercicio pleno de los derechos de Acceso, Rectificación, Cancelación y Oposición (Derechos ARCO). Puedes revocar en cualquier momento el consentimiento otorgado para comunicaciones comerciales o notificaciones de seguimiento.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/5 border border-[#F2CA50]/30 space-y-1">
                  <h3 className="font-bold text-[#F2CA50] text-xs uppercase tracking-wider">
                    D. Residentes en Japón (Ley APPI - 個人情報保護法)
                  </h3>
                  <p className="text-zinc-300 text-xs">
                    En estricto cumplimiento de la Ley de Protección de Información Personal de Japón (APPI):
                    <br />
                    1. <strong>Fines Específicos (利用目的の特定):</strong> La información recopilada se utiliza exclusivamente para la entrega de pedidos, facturación y soporte postventa.
                    <br />
                    2. <strong>Medidas de Control de Seguridad (安全管理措置):</strong> Mantenemos salvaguardas técnicas, administrativas y físicas avanzadas (cifrado TLS 1.3 y AES-256).
                    <br />
                    3. <strong>Transferencia Transfronteriza (外国にある第三者への提供):</strong> Al utilizar servidores de infraestructura cloud distribuidos globalmente con certificación SOC2 e ISO 27001, solicitamos tu consentimiento expreso mediante el banner de cookies para la transferencia técnica necesaria para procesar tus compras internacionales.
                  </p>
                </div>
              </div>
            </section>

            {/* Sección 5: Menores de Edad */}
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-serif font-black text-white flex items-center gap-2">
                <span className="text-[#F2CA50]">5.</span> Protección de Menores de Edad
              </h2>
              <p>
                Nuestra plataforma está dirigida exclusivamente a personas mayores de 18 años o mayores de 16 con consentimiento parental en las jurisdicciones que lo permitan. No recopilamos conscientemente datos de menores de edad. Si detectamos registros de un menor sin autorización válida, procederemos a su eliminación inmediata de nuestras bases de datos.
              </p>
            </section>

            {/* Sección 6: Contacto para Ejercicio de Derechos */}
            <section className="space-y-2 pt-4 border-t border-white/10">
              <h2 className="text-base sm:text-lg font-serif font-black text-white flex items-center gap-2">
                <span className="text-[#F2CA50]">6.</span> Ejercicio de Derechos y Contacto
              </h2>
              <p>
                Para ejercer cualquiera de tus derechos de privacidad, solicitar la exportación de tus datos o su borrado definitivo, por favor contáctanos con el asunto &quot;Solicitud de Privacidad / Derechos ARCO&quot; a través de nuestro correo oficial <strong className="text-[#F2CA50]">soporte@aldri.shop</strong> o enviando un mensaje directo a nuestra línea oficial de atención. Responderemos a tu solicitud dentro de los plazos legales estipulados por tu jurisdicción (máximo 30 días naturales).
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
