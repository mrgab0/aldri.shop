import { MetadataRoute } from "next";
import dbConnect from "@/lib/db";
import { Product } from "@/lib/models/Product";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Recalcular sitemap cada hora

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

  // Rutas dinámicas de productos desde MongoDB con soporte bilingüe
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    const products = await Product.find({ isActive: { $ne: false } }, "slug updatedAt").lean();

    productRoutes = locales.flatMap((loc) =>
      products.map((prod: any) => ({
        url: `${baseUrl}/${loc}/productos/${prod.slug}`,
        lastModified: prod.updatedAt ? new Date(prod.updatedAt) : new Date(),
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
  } catch (error) {
    console.error("Error al generar sitemap dinámico desde MongoDB:", error);
  }

  return [...staticRoutes, ...productRoutes];
}
