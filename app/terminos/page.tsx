import TerminosPage from "@/app/[locale]/terminos/page";

export const metadata = {
  title: "Términos y Condiciones del Servicio | Aldri Shop",
  description: "Términos y condiciones oficiales de compra, licencias digitales, envíos físicos internacionales y reglas del Programa de Afiliados de Aldri Shop.",
};

export default function RootTerminosPage() {
  return <TerminosPage params={Promise.resolve({ locale: "es" })} />;
}
