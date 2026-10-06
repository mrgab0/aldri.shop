import { getPosts } from "@/lib/actions/post";
import { NosotrosClient } from "@/components/shop/NosotrosClient";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Nosotros & Blog | Aldri Shop",
  description: "Conoce Aldri Shop: Tu plataforma global de activos digitales y productos físicos en tendencia con envíos garantizados.",
  openGraph: {
    title: "Nosotros & Blog | Aldri Shop",
    description: "Plataforma de confianza para descargas instantáneas y gadgets tecnológicos de alta calidad.",
    images: ["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200"]
  }
};

export default async function NosotrosPage() {
  const { data: posts } = await getPosts({ publishedOnly: true });

  return <NosotrosClient initialPosts={posts || []} locale="es" />;
}
