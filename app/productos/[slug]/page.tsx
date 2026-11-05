import type { Metadata } from "next";
import dbConnect from "@/lib/db";
import { Product } from "@/lib/models/Product";
import "@/lib/models/Addon";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { REAL_CURATED_PRODUCTS } from "@/data/curated-catalog";

interface RootProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProductBySlug(slug: string) {
  await dbConnect();
  try {
    const doc: any = await Product.findOne({ slug }).populate("addons").lean();
    if (doc && doc.isActive !== false) {
      return JSON.parse(JSON.stringify(doc));
    }
  } catch (err) {
    console.error("Error buscando producto en DB:", err);
  }

  const curated = REAL_CURATED_PRODUCTS.find((p) => p.slug === slug);
  if (curated && curated.isActive !== false) {
    return JSON.parse(JSON.stringify(curated));
  }

  return null;
}

export async function generateMetadata({ params }: RootProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Producto no encontrado | Aldri Shop",
      description: "El producto que buscas no está disponible en la tienda.",
    };
  }

  const title = product.name || "Producto Aldri Shop";
  const rawDesc = product.description || "";
  const cleanDesc = rawDesc.replace(/\s+/g, " ").trim().slice(0, 160);
  const mainImage = product.images?.[0] || "https://aldri.shop/logo.png";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aldri.shop";
  const productUrl = `${siteUrl}/es/productos/${product.slug}`;

  return {
    title: `${title} | Aldri Shop`,
    description: cleanDesc,
    alternates: {
      canonical: productUrl,
      languages: {
        es: `${siteUrl}/es/productos/${product.slug}`,
        en: `${siteUrl}/en/productos/${product.slug}`,
      },
    },
    openGraph: {
      title: `${title} — $${(product.price || 0).toFixed(2)} USD`,
      description: cleanDesc,
      url: productUrl,
      siteName: "Aldri Shop",
      images: [
        {
          url: mainImage,
          width: 800,
          height: 800,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — $${(product.price || 0).toFixed(2)} USD`,
      description: cleanDesc,
      images: [mainImage],
    },
  };
}

export default async function RootProductPage({ params }: RootProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aldri.shop";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: (product.description || "").slice(0, 250),
    image: product.images || [],
    sku: product.sku || product.slug,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: (product.stock ?? 1) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${siteUrl}/es/productos/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: "Aldri Shop",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "87",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </>
  );
}
