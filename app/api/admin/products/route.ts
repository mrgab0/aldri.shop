import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Product } from "@/lib/models/Product";

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ products: JSON.parse(JSON.stringify(products)) });
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const adminPass = process.env.ADMIN_PASSWORD || "TuPasswordSeguraAdmin2026";
    
    if (!authHeader || authHeader.replace("Bearer ", "") !== adminPass) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name || !body.slug || !body.price) {
      return NextResponse.json({ error: "Datos de producto incompletos" }, { status: 400 });
    }

    await dbConnect();
    const product = await Product.findOneAndUpdate(
      { slug: body.slug },
      { $set: body },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Error guardando producto curado:", error);
    return NextResponse.json({ error: error.message || "Error al guardar producto" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const adminPass = process.env.ADMIN_PASSWORD || "TuPasswordSeguraAdmin2026";
    
    if (!authHeader || authHeader.replace("Bearer ", "") !== adminPass) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode");

    await dbConnect();
    if (mode === "clear-mocks") {
      // Elimina los mocks antiguos que no provienen del motor real verificado
      const result = await Product.deleteMany({
        $or: [
          { sku: { $regex: /^ALDR-DIG-/ } },
          { sku: { $regex: /^ALDR-DRP-/ } },
          { sku: "ALDR-ZD-MAGSAFE-FOLD" },
          { dropshipInfo: { $exists: false } }
        ]
      });
      return NextResponse.json({ success: true, deletedCount: result.deletedCount });
    }

    return NextResponse.json({ error: "Modo no soportado" }, { status: 400 });
  } catch (error: any) {
    console.error("Error eliminando productos mock:", error);
    return NextResponse.json({ error: error.message || "Error al eliminar mocks" }, { status: 500 });
  }
}
