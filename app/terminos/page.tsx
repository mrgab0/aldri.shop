import TerminosPage, { generateMetadata } from "@/app/[locale]/terminos/page";

export { generateMetadata };

export default function RootTerminosPage() {
  return <TerminosPage params={Promise.resolve({ locale: "es" })} />;
}
