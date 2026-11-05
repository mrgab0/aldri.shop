import PrivacidadPage, { generateMetadata } from "@/app/[locale]/privacidad/page";

export { generateMetadata };

export default function RootPrivacidadPage() {
  return <PrivacidadPage params={Promise.resolve({ locale: "es" })} />;
}
