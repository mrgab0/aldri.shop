import PrivacidadPage from "@/app/[locale]/privacidad/page";

export const metadata = {
  title: "Política de Privacidad Integral | Aldri Shop",
  description: "Política de Privacidad de Aldri Shop conforme a los estándares de GDPR, CCPA/CPRA, LGPD y APPI Japón.",
};

export default function RootPrivacidadPage() {
  return <PrivacidadPage params={Promise.resolve({ locale: "es" })} />;
}
