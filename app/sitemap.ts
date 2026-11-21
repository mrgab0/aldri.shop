import { MetadataRoute } from "next";
import dbConnect from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { REAL_CURATED_PRODUCTS } from "@/data/curated-catalog";
import { REAL_DIGITAL_PRODUCTS } from "@/data/digital-catalog";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aldri.shop";
  const locales = ["es", "en"];

  // Rutas estáticas de la tienda con soporte bilingüe (/es y /en)
  const staticPaths = ["", "/productos", "/contacto", "/rastreo", "/afiliados", "/privacidad", "/terminos", "/reembolsos"];
  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((loc) =>
    staticPaths.map((p) => ({
      url: `${baseUrl}/${loc}${p}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: p === "" ? 1.0 : 0.8,
      alternates: {
        languages: {
          es: `${baseUrl}/es${p}`,
          en: `${baseUrl}/en${p}`,
        },
      },
    }))
  );

  // Mapa de productos únicos por slug (iniciando con estáticos curados y digitales)
  const productMap = new Map<string, { slug: string; updatedAt?: Date }>();

  // 1. Agregar catálogo curado físico oficial
  REAL_CURATED_PRODUCTS.forEach((p) => {
    if (p.slug && p.isActive !== false) {
      productMap.set(p.slug, { slug: p.slug, updatedAt: new Date() });
    }
  });

  // 2. Agregar catálogo digital oficial
  REAL_DIGITAL_PRODUCTS.forEach((p) => {
    if (p.slug && p.isActive !== false) {
      productMap.set(p.slug, { slug: p.slug, updatedAt: new Date() });
    }
  });

  // 3. Obtener dinámicos desde MongoDB
  try {
    await dbConnect();
    const products = await Product.find({ isActive: { $ne: false } }, "slug updatedAt").lean();
    products.forEach((prod: any) => {
      if (prod.slug) {
        productMap.set(prod.slug, {
          slug: prod.slug,
          updatedAt: prod.updatedAt ? new Date(prod.updatedAt) : new Date(),
        });
      }
    });
  } catch (error) {
    console.error("Error al generar sitemap dinámico desde MongoDB:", error);
  }

  const allProductItems = Array.from(productMap.values());

  const productRoutes: MetadataRoute.Sitemap = locales.flatMap((loc) =>
    allProductItems.map((prod) => ({
      url: `${baseUrl}/${loc}/productos/${prod.slug}`,
      lastModified: prod.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: {
        languages: {
          es: `${baseUrl}/es/productos/${prod.slug}`,
          en: `${baseUrl}/en/productos/${prod.slug}`,
        },
      },
    }))
  );

  return [...staticRoutes, ...productRoutes];
}
