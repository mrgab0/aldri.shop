import ReembolsosPage from "@/app/[locale]/reembolsos/page";

export const metadata = {
  title: "Política de Envíos, Garantía y Reembolsos (30 Días) | Aldri Shop",
  description: "Conoce los plazos de envío (USPS Priority 2-5 días, Global 7-12 días), descargas digitales instantáneas y nuestra garantía de devolución de 30 días en Aldri Shop.",
};

export default function RootReembolsosPage() {
  return <ReembolsosPage params={Promise.resolve({ locale: "es" })} />;
}
