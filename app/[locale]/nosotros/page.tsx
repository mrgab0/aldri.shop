import { getPosts } from "@/lib/actions/post";
import { NosotrosClient } from "@/components/shop/NosotrosClient";
import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    title: isEn
      ? "About Us | Aldri Shop - Digital Products & Global Dropshipping"
      : "Nosotros | Aldri Shop - Productos Digitales & Dropshipping Global",
    description: isEn
      ? "Learn about Aldri Shop: our story, instant digital product delivery, and global tracked dropshipping essentials."
      : "Conoce más sobre Aldri Shop: nuestra historia, entrega inmediata de activos digitales y productos dropshipping en tendencia con seguimiento global.",
    openGraph: {
      title: isEn ? "About Us | Aldri Shop" : "Nosotros | Aldri Shop",
      description: isEn
        ? "Curated digital tools & trending dropshipping products. Instant access & global shipping."
        : "Herramientas digitales curadas y productos dropshipping en tendencia. Acceso instantáneo y envíos globales.",
      images: ["https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200"]
    }
  };
}

export default async function LocalizedNosotrosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { data: posts } = await getPosts({ publishedOnly: true });

  return <NosotrosClient initialPosts={posts || []} locale={locale} />;
}
