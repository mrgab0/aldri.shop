"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as crypto from "crypto";
import dbConnect from "@/lib/db";
import { SiteConfig } from "@/lib/models/SiteConfig";

const ADMIN_COOKIE_NAME = "ffy_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 días

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "aldri_master_secure_salt_auth_2026"
  );
}

function getExpectedAdminPassword(): string {
  const envPass = process.env.ADMIN_PASSWORD;
  if (!envPass) {
    console.warn("[AdminAuth] ALERTA: ADMIN_PASSWORD no está definida en las variables de entorno.");
    return "";
  }
  return envPass.trim();
}

/**
 * Genera un token de sesión criptográfico firmado con HMAC-SHA256 y timestamp
 */
async function createAdminSessionToken(): Promise<string> {
  const timestamp = Date.now().toString();
  const randomId = crypto.randomBytes(16).toString("hex");
  const payload = `${timestamp}:${randomId}`;
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");
  return `${payload}:${signature}`;
}

/**
 * Verifica la firma criptográfica y la vigencia temporal del token de sesión
 */
function verifyAdminSessionToken(token: string): boolean {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(":");
  if (parts.length !== 3) return false;

  const [timestampStr, randomId, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Comprobar expiración (7 días)
  const ageMs = Date.now() - timestamp;
  if (ageMs < 0 || ageMs > SESSION_MAX_AGE_SECONDS * 1000) {
    return false;
  }

  // Verificar firma HMAC con tiempo constante para prevenir timing attacks
  const payload = `${timestampStr}:${randomId}`;
  const expectedSignature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");

  try {
    const a = Buffer.from(signature, "hex");
    const b = Buffer.from(expectedSignature, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Establece la cookie de sesión del administrador con el token criptográfico firmado
 */
export async function setAdminSessionCookie(): Promise<void> {
  const token = await createAdminSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function loginAdminAction(formData: FormData) {
  const password = formData.get("password") as string;

  if (!password) {
    return { success: false, error: "Ingresa la contraseña del panel." };
  }

  const expectedPassword = getExpectedAdminPassword();
  if (!expectedPassword) {
    return {
      success: false,
      error: "Error de configuración en el servidor: ADMIN_PASSWORD no configurada.",
    };
  }

  // Verificación estricta en tiempo constante contra ADMIN_PASSWORD (Sin backdoors)
  const userPassBuffer = Buffer.from(password.trim());
  const expectedPassBuffer = Buffer.from(expectedPassword);

  const isPasswordValid =
    userPassBuffer.length === expectedPassBuffer.length &&
    crypto.timingSafeEqual(userPassBuffer, expectedPassBuffer);

  if (isPasswordValid) {
    // Consultar si el 2FA está activo
    await dbConnect();
    const config: any = await SiteConfig.findOne({ key: "global" }).lean();
    const twoFactorMode = config?.twoFactorMode || "none";

    if (twoFactorMode !== "none") {
      return {
        success: true,
        require2FA: true,
        twoFactorMode: twoFactorMode as "pin" | "totp",
      };
    }

    await setAdminSessionCookie();
    return { success: true, require2FA: false };
  }

  return { success: false, error: "Contraseña incorrecta. Inténtalo de nuevo." };
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
    if (!sessionCookie?.value) return false;
    return verifyAdminSessionToken(sessionCookie.value);
  } catch (error) {
    return false;
  }
}
