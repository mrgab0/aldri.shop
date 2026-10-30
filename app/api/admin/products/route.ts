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
