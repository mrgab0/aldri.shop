import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Product } from "@/lib/models/Product";
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

    if (body.productId) {
      await dbConnect();
      const product = (await Product.findById(body.productId).lean()) as any;
      if (product) {
        name = product.name || name;
        category = product.category || category;
        description = product.description || description;
        price = product.price || price;
        productType = product.productType || productType;
      }
    }

    if (!name) {
      return NextResponse.json({ error: "Nombre del producto requerido para generar copy." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY no configurada." }, { status: 500 });
    }

    const prompt = `Eres un copywriter experto en e-commerce y marketing de alta conversión directa (estilo Apple, TikTok Ads y Meta Ads).
Tu objetivo es redactar los textos persuasivos para una Landing Page de producto de alta conversión para la tienda "Aldri Shop".

DATOS DEL PRODUCTO:
- Nombre: ${name}
- Categoría: ${category}
- Tipo: ${productType === "digital" ? "Descarga Digital Instantánea" : "Producto Físico con Seguimiento Internacional"}
- Descripción base: ${description}
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
    { "question": "¿Cuánto tarda la entrega?", "answer": "${productType === 'digital' ? 'Acceso inmediato 24/7 en pantalla y por correo.' : 'Procesamiento en 24-48h con guía internacional (7 a 12 días).'}" },
    { "question": "¿Qué métodos de pago aceptan?", "answer": "Aceptamos tarjetas Visa, Mastercard, American Express, PayPal y Zelle de forma 100% segura." },
    { "question": "¿Tiene garantía?", "answer": "Sí, cuentas con soporte directo y garantía de satisfacción garantizada." }
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

    return NextResponse.json({ success: true, data: generatedJson });
  } catch (error: any) {
    console.error("Error en API de generación de Landing:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
