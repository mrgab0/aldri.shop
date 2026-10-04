import { IProduct as Product } from "@/lib/models/Product";

/**
 * Genera el script JSON-LD para un producto (Google Shopping & Rich Snippets).
 */
export function getProductSchema(product: Product, siteUrl: string = "https://aldri.shop") {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images || [],
    "description": product.description,
    "sku": product._id ? product._id.toString() : product.slug,
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/productos/${product.slug}`,
      "priceCurrency": "USD",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "OnlineStore",
        "name": "Aldri Shop"
      }
    }
  };

  return JSON.stringify(schema);
}

/**
 * Genera el marcado JSON-LD de Tienda Online para Google.
 */
export function getLocalBusinessSchema(config: any, siteUrl: string = "https://aldri.shop") {
  const schema = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "name": config?.businessName || "Aldri Shop",
    "image": config?.ogImage || `${siteUrl}/logo.png`,
    "@id": siteUrl,
    "url": siteUrl,
    "telephone": config?.businessPhone || "",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": config?.businessAddress || "",
      "addressLocality": config?.businessCity || "",
      "addressCountry": "US"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return JSON.stringify(schema);
}

/**
 * Genera el esquema de Migas de Pan (Breadcrumbs) para Google SERP.
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return JSON.stringify(schema);
}

/**
 * Helper para generar Metadata dinámica en Next.js
 */
export function constructMetadata({
  title,
  description,
  image,
  slug = ""
}: {
  title: string;
  description: string;
  image?: string;
  slug?: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aldri.shop";
  const fullUrl = slug ? `${siteUrl}/${slug}` : siteUrl;

  return {
    title: `${title} | Aldri Shop`,
    description,
    openGraph: {
      title,
      description,
      url: fullUrl,
      images: image ? [{ url: image }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}
