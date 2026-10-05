import { NextResponse } from "next/server";
import ImageKit from "imagekit";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "public_jdvouw9gy/nUSbY/3M4cpnm2mCY=";
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "private_hs81aHfixhB9dsZtteNUOVhgFI8=";
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/ufpz9hfbm";

    const imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });

    const authenticationParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error) {
    console.error("Error obteniendo auth parameters de ImageKit:", error);
    return NextResponse.json(
      { error: "No se pudieron generar las credenciales de subida a ImageKit" },
      { status: 500 }
    );
  }
}
