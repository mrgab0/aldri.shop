import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { generateMarketingKitAction } from "@/lib/actions/marketing";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const isAuthed = await verifyAdminSession();
    if (!isAuthed) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: "ID o Slug de producto requerido." }, { status: 400 });
    }

    const result = await generateMarketingKitAction(productId);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Error al generar kit" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (err: any) {
    console.error("Error en API /admin/marketing/generate:", err);
    return NextResponse.json({ error: err.message || "Error interno del servidor" }, { status: 500 });
  }
}
