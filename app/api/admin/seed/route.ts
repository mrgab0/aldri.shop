import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { REAL_CURATED_PRODUCTS } from '@/data/curated-catalog';

export async function POST(req: Request) {
  try {
    await dbConnect();

    // 1. Eliminar cualquier producto de simulación previo (mocks/placeholders)
    const delResult = await Product.deleteMany({
      $or: [
        { sku: { $regex: /^ALDR-(?:DIG|DROP)-/i } },
        { sku: 'ALDR-ZD-MAGSAFE-FOLD' },
        { dropshipInfo: { $exists: false }, productType: 'dropship' }
      ]
    });

    // 2. Insertar o actualizar los 10 productos reales bilingües
    const createdProducts = [];
    for (const item of REAL_CURATED_PRODUCTS) {
      const updated = await Product.findOneAndUpdate(
        { sku: item.sku },
        {
          ...item,
          isActive: true
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      createdProducts.push(updated);
    }

    return NextResponse.json({
      success: true,
      deletedLegacyCount: delResult.deletedCount,
      message: `Se sincronizaron ${createdProducts.length} productos 100% reales (5 Zendrop US + 5 CJ Dropshipping)`,
      count: createdProducts.length,
      products: createdProducts.map(p => ({
        id: p._id,
        name: p.name,
        nameEn: p.nameEn,
        sku: p.sku,
        provider: p.dropshipInfo?.provider,
        price: p.price,
        category: p.category
      }))
    });
  } catch (error) {
    console.error("Error al sembrar catálogo real:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error al sembrar catálogo real"
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return POST(req);
}
