import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { ChatLead } from "@/lib/models/ChatLead";
import { verifyAdminSession } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const isAuthed = await verifyAdminSession();
    if (!isAuthed) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    await dbConnect();
    const leads = await ChatLead.find({}).sort({ updatedAt: -1 }).limit(100).lean();

    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(leads))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const isAuthed = await verifyAdminSession();
    if (!isAuthed) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const { id, leadStatus, notes } = await req.json();
    await dbConnect();

    const updated = await ChatLead.findByIdAndUpdate(
      id,
      {
        ...(leadStatus ? { leadStatus } : {}),
        ...(notes !== undefined ? { notes } : {})
      },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
