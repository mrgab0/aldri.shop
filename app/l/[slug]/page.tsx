import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getLandingPageBySlug, trackLandingView } from "@/lib/actions/landing";
import { LandingPageView } from "@/components/landing/LandingPageView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await getLandingPageBySlug(slug);

  if (!res.success || !res.data) {
    return {
      title: "Oferta Especial | Aldri Shop",
      description: "Descubre esta oferta exclusiva en Aldri Shop.",
    };
  }

  const landing = res.data;
  return {
    title: `${landing.headline} | Aldri Shop`,
    description: landing.subheadline || `Consigue ${landing.title} con descuento exclusivo en Aldri Shop.`,
    openGraph: {
      title: landing.headline,
      description: landing.subheadline,
      images: landing.customImages?.[0] || landing.productId?.images?.[0] || "/logo.png",
    },
  };
}

export default async function LandingSlugPage({ params }: Props) {
  const { slug } = await params;
  const res = await getLandingPageBySlug(slug);

  if (!res.success || !res.data) {
    notFound();
  }

  // Registrar visita silenciosamente
  try {
    await trackLandingView(slug);
  } catch (e) {
    console.error("Error al registrar vista de landing:", e);
  }

  return <LandingPageView landing={res.data} />;
}
