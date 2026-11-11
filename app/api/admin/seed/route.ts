import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { REAL_CURATED_PRODUCTS } from '@/data/curated-catalog';
import { REAL_DIGITAL_PRODUCTS } from '@/data/digital-catalog';

export async function POST(req: Request) {
  try {
    await dbConnect();

    // 1. Eliminar cualquier producto de simulación previo o SKU obsoleto que no pertenezca al catálogo oficial (físico o digital)
    const validSkus = [
      ...REAL_CURATED_PRODUCTS.map(p => p.sku),
      ...REAL_DIGITAL_PRODUCTS.map(p => p.sku)
    ];
    const delResult = await Product.deleteMany({
      $or: [
        { sku: { $nin: validSkus } },
        { sku: { $regex: /^ALDR-(?:DIG|DROP)-/i } },
        { sku: 'ALDR-ZD-MAGSAFE-FOLD' },
        { dropshipInfo: { $exists: false }, productType: 'dropship' }
      ]
    });

    // 2. Insertar o actualizar los productos físicos reales
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

    // 3. Insertar o actualizar los productos digitales y claves de videojuegos
    for (const digitalItem of REAL_DIGITAL_PRODUCTS) {
      const updatedDigital = await Product.findOneAndUpdate(
        { sku: digitalItem.sku },
        {
          ...digitalItem,
          isActive: true
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      createdProducts.push(updatedDigital);
    }

    const zdCount = createdProducts.filter(p => p?.dropshipInfo?.provider === 'zendrop').length;
    const cjCount = createdProducts.filter(p => p?.dropshipInfo?.provider === 'cjdropshipping').length;
    const digCount = createdProducts.filter(p => p?.productType === 'digital').length;

    return NextResponse.json({
      success: true,
      deletedLegacyCount: delResult.deletedCount,
      message: `Se sincronizaron ${createdProducts.length} productos 100% reales (${zdCount} Zendrop US + ${cjCount} CJ Dropshipping + ${digCount} Digitales & Claves)`,
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
