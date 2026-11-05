import { NextRequest, NextResponse } from "next/server";
import { recordAffiliateClickAction } from "@/lib/actions/affiliate";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("ref") || searchParams.get("tag");

    if (code) {
      await recordAffiliateClickAction(code);
    }

    return NextResponse.json({ ok: true }, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
