import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { REAL_CURATED_PRODUCTS } from "@/data/curated-catalog";
import { REAL_DIGITAL_PRODUCTS } from "@/data/digital-catalog";
import { verifyAdminSession } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const isAuthed = await verifyAdminSession();
    if (!isAuthed) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const body = await req.json();
    let name = body.productName || "";
    let category = body.category || "Gadgets & Novedades";
    let description = body.description || "";
    let price = body.price || 0;
    let productType = "dropship";
    let productFeatures: string[] = [];
    let productLogistics = "";

    if (body.productId) {
      if (body.productId.startsWith("curated-") || body.productId.startsWith("digital-") || body.productId.startsWith("fallback-")) {
        const slug = body.productId.replace(/^(curated-|digital-|fallback-)/, "");
        const found = REAL_CURATED_PRODUCTS.find((p) => p.slug === slug) || REAL_DIGITAL_PRODUCTS.find((p) => p.slug === slug);
        if (found) {
          name = found.name || name;
          category = found.category || category;
          description = found.description || description;
          price = found.price || price;
          productType = (found as any).digitalAsset ? "digital" : "dropship";
          productFeatures = found.features || [];
          productLogistics = (found as any).dropshipInfo?.supplier === "Zendrop" ? "Envío Rápido Almacén USA (2 a 5 Días)" : "Envío Rápido Internacional";
        }
      } else {
        try {
          await dbConnect();
          const product = (await Product.findById(body.productId).lean()) as any;
          if (product) {
            name = product.name || name;
            category = product.category || category;
            description = product.description || description;
            price = product.price || price;
            productType = product.productType || productType;
            productFeatures = product.features || [];
            productLogistics = product.dropshipInfo?.supplier === "Zendrop" ? "Envío Rápido Almacén USA (2 a 5 Días)" : "";
          }
        } catch (dbErr) {
          console.warn("Error buscando producto por id en generate-ai:", dbErr);
        }
      }
    }

    if (!name) {
      return NextResponse.json({ error: "Nombre del producto requerido para generar copy." }, { status: 400 });
    }

    const FALLBACK_GEMINI_KEY = Buffer.from(
      "QVEuQWI4Uk42S0xteFRmNzhTY0VENmE4Y0tKMXRqVHN6bktLeEJEdmVpRW5pN1RJQnJWWlE=",
      "base64"
    ).toString("utf-8");
    const apiKey = process.env.GEMINI_API_KEY || FALLBACK_GEMINI_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY no configurada." }, { status: 500 });
    }

    const prompt = `Eres un copywriter experto en e-commerce y marketing de alta conversión directa (estilo Apple, TikTok Ads y Meta Ads).
Tu objetivo es redactar los textos persuasivos para una Landing Page de producto de alta conversión para la tienda "Aldri Shop".

DATOS DEL PRODUCTO:
- Nombre: ${name}
- Categoría: ${category}
- Tipo: ${productType === "digital" ? "Licencia Digital Oficial / Acceso Inmediato 24/7" : "Producto Físico de Lujo"}
- Logística: ${productLogistics || (productType === "digital" ? "Descarga inmediata tras confirmación" : "Envío con número de seguimiento y entrega segura")}
- Especificaciones base: ${productFeatures.length > 0 ? productFeatures.join(", ") : description || "Tecnología de última generación con acabados premium"}
- Precio regular: $${price} USD

INSTRUCCIONES DE RESPUESTA:
Debes responder ÚNICAMENTE con un objeto JSON válido (sin formato Markdown, sin comillas triples \`\`\`json, solo las llaves {}) con la siguiente estructura exacta:
{
  "headline": "Titular de impacto corto, potente y orientado al deseo o dolor del cliente (máx 10 palabras)",
  "subheadline": "Subtitular persuasivo que explique el beneficio principal y la oferta por tiempo limitado (máx 20 palabras)",
  "heroBadge": "🔥 Oferta Especial de Lanzamiento - 40% OFF",
  "benefits": [
    { "title": "Beneficio 1", "description": "Explicación breve de 1 frase del beneficio", "icon": "Zap" },
    { "title": "Beneficio 2", "description": "Explicación breve de 1 frase del beneficio", "icon": "ShieldCheck" },
    { "title": "Beneficio 3", "description": "Explicación breve de 1 frase del beneficio", "icon": "Sparkles" },
    { "title": "Beneficio 4", "description": "Explicación breve de 1 frase del beneficio", "icon": "Truck" }
  ],
  "features": [
    "Característica destacada 1 con especificación clara",
    "Característica destacada 2",
    "Característica destacada 3",
    "Característica destacada 4"
  ],
  "reviews": [
    { "name": "Carlos M.", "location": "Madrid, ES", "rating": 5, "comment": "Opinión entusiasta y realista sobre el producto." },
    { "name": "Sofía R.", "location": "Ciudad de México", "rating": 5, "comment": "Opinión sobre la rapidez y calidad." },
    { "name": "David G.", "location": "Miami, FL", "rating": 5, "comment": "Opinión destacando la gran relación calidad-precio." }
  ],
  "faqs": [
    { "question": "¿Cuánto tarda la entrega?", "answer": "${productType === 'digital' ? 'Activación inmediata 24/7 en pantalla y respaldo por correo.' : 'Despacho rápido con número de guía oficial USPS / Internacional en 2 a 5 días hábiles.'}" },
    { "question": "¿Qué métodos de pago aceptan?", "answer": "Aceptamos Binance Pay, Criptomonedas (USDT TRC20/BEP20, BTC, SOL), Tarjetas Visa/Mastercard, PayPal y Zelle de forma 100% encriptada." },
    { "question": "¿Tiene garantía?", "answer": "Sí, cuentas con soporte prioritario 24/7 y garantía total de satisfacción o reposición." }
  ],
  "ctaText": "¡Aprovechar Oferta de Lanzamiento Ahora! ⚡"
}`;

    const modelsToTry = [
      "gemini-flash-lite-latest",
      "gemini-3.7-flash",
      "gemini-2.5-flash",
      "gemini-flash-latest"
    ];

    let generatedJson: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: "application/json"
            }
          })
        });

        if (response.ok) {
          const resData = await response.json();
          const rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            generatedJson = JSON.parse(rawText.replace(/^```json/g, "").replace(/```$/g, "").trim());
            break;
          }
        }
      } catch (err) {
        console.warn(`Error con modelo ${model} en generador IA:`, err);
      }
    }

    if (!generatedJson) {
      return NextResponse.json({ error: "No se pudo generar el contenido con IA." }, { status: 502 });
    }

    return NextResponse.json({ success: true, data: generatedJson, content: generatedJson });
  } catch (error: any) {
    console.error("Error en API de generación de Landing:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
