import ReembolsosPage, { generateMetadata } from "@/app/[locale]/reembolsos/page";

export { generateMetadata };

export default function RootReembolsosPage() {
  return <ReembolsosPage params={Promise.resolve({ locale: "es" })} />;
}
