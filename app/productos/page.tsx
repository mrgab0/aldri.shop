import dbConnect from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { getAddons } from "@/lib/actions/addon";
import { CatalogClient } from "@/components/shop/CatalogClient";
import { REAL_CURATED_PRODUCTS } from "@/data/curated-catalog";
import { REAL_DIGITAL_PRODUCTS } from "@/data/digital-catalog";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductosCatalogPage() {
  let products: any[] = [];
  try {
    await dbConnect();
    const rawProducts = await Product.find({ isActive: { $ne: false } }).sort({ createdAt: -1 }).lean();
    products = JSON.parse(JSON.stringify(rawProducts));
  } catch (err) {
    console.warn("DB conexión secundaria en ProductosCatalogPage:", err);
  }

  // Unificar con catálogos curados y digitales asegurando que todos los 110+ productos estén disponibles
  const dbSlugs = new Set((products || []).map((p: any) => p.slug));
  const fallbackCurated = REAL_CURATED_PRODUCTS.filter((p) => !dbSlugs.has(p.slug)).map((p) => ({
    ...p,
    _id: (p as any)._id || `curated-${p.slug}`,
    productType: "dropship",
  }));
  const fallbackDigital = REAL_DIGITAL_PRODUCTS.filter((p) => !dbSlugs.has(p.slug)).map((p) => ({
    ...p,
    _id: (p as any)._id || `digital-${p.slug}`,
    productType: "digital",
  }));

  const allProducts = [...products, ...fallbackCurated, ...fallbackDigital];

  const addonsRes = await getAddons();
  const addons = addonsRes.success ? addonsRes.data : [];

  return <CatalogClient initialProducts={allProducts} initialAddons={addons} />;
}
