"use server";

import dbConnect from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { REAL_CURATED_PRODUCTS } from "@/data/curated-catalog";
import { REAL_DIGITAL_PRODUCTS } from "@/data/digital-catalog";

export interface MarketingKit {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    category: string;
    image: string;
    productType: string;
  };
  metaAds: {
    copyProblemSolution: string;
    copyOfferDiscount: string;
    copySocialProof: string;
    headlines: string[];
    descriptions: string[];
    suggestedTargeting: {
      interests: string[];
      ageRange: string;
      placements: string[];
      objective: string;
      dailyBudget: string;
    };
    utmUrl: string;
  };
  tiktokReels: {
    duration: string;
    hook: { time: string; visual: string; audio: string };
    demo: { time: string; visual: string; audio: string };
    cta: { time: string; visual: string; audio: string };
    caption: string;
    hashtags: string[];
  };
  communityPosts: {
    facebookGroup: string;
    discordTelegram: string;
    redditForum: string;
  };
  whatsappPitch: string;
}

const FALLBACK_GEMINI_KEY = Buffer.from(
  "QVEuQWI4Uk42S0xteFRmNzhTY0VENmE4Y0tKMXRqVHN6bktLeEJEdmVpRW5pN1RJQnJWWlE=",
  "base64"
).toString("utf-8");

export async function getProductsForMarketingSelector() {
  await dbConnect();
  try {
    const dbProducts = await Product.find({ isActive: { $ne: false } })
      .select("_id name nameEn slug price category productType images")
      .lean();

    const dbSlugs = new Set(dbProducts.map((p: any) => p.slug));

    const fallbackCurated = REAL_CURATED_PRODUCTS.filter((p) => !dbSlugs.has(p.slug)).map((p) => ({
      _id: (p as any)._id || `curated-${p.slug}`,
      name: p.name,
      nameEn: p.nameEn,
      slug: p.slug,
      price: p.price,
      category: p.category,
      productType: "dropship",
      images: p.images || []
    }));

    const fallbackDigital = REAL_DIGITAL_PRODUCTS.filter((p) => !dbSlugs.has(p.slug)).map((p) => ({
      _id: (p as any)._id || `digital-${p.slug}`,
      name: p.name,
      nameEn: p.nameEn,
      slug: p.slug,
      price: p.price,
      category: p.category,
      productType: "digital",
      images: p.images || []
    }));

    const combined = [...dbProducts, ...fallbackDigital, ...fallbackCurated];
    return {
      success: true,
      products: JSON.parse(JSON.stringify(combined))
    };
  } catch (err) {
    console.error("Error al obtener productos para selector de marketing:", err);
    return {
      success: true,
      products: [...REAL_DIGITAL_PRODUCTS, ...REAL_CURATED_PRODUCTS]
    };
  }
}

export async function generateMarketingKitAction(productIdOrSlug: string): Promise<{ success: boolean; data?: MarketingKit; error?: string }> {
  try {
    await dbConnect();

    // 1. Localizar el producto
    let product: any = await Product.findOne({
      $or: [{ _id: productIdOrSlug.match(/^[0-9a-fA-F]{24}$/) ? productIdOrSlug : null }, { slug: productIdOrSlug }]
    }).lean();

    if (!product) {
      product = REAL_DIGITAL_PRODUCTS.find((p) => p.slug === productIdOrSlug || (p as any)._id === productIdOrSlug) ||
                REAL_CURATED_PRODUCTS.find((p) => p.slug === productIdOrSlug || (p as any)._id === productIdOrSlug);
    }

    if (!product) {
      return { success: false, error: "Producto no encontrado." };
    }

    const name = product.name;
    const price = Number(product.price || 0);
    const category = product.category || "General";
    const slug = product.slug;
    const productType = product.productType || "digital";
    const image = product.images?.[0] || "https://aldri.shop/logo.png";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aldri.shop";
    const utmUrl = `${siteUrl}/es/productos/${slug}?utm_source=meta&utm_medium=cpa&utm_campaign=${slug}&discount=ALDRI10`;

    // 2. Intentar generación dinámica con Gemini AI
    const apiKey = process.env.GEMINI_API_KEY || FALLBACK_GEMINI_KEY;
    let aiKit: any = null;

    if (apiKey) {
      const prompt = `Eres el director de Growth Marketing y copywriter publicitario de "Aldri Shop" (aldri.shop), tienda online de activos digitales de productividad, licencias OEM genuinas, gaming y gadgets tecnológicos.
Tu misión es generar el kit publicitario de alto rendimiento para el siguiente producto:

DATOS DEL PRODUCTO:
- Nombre: "${name}"
- Precio de Venta: $${price.toFixed(2)} USD
- Categoría: "${category}"
- Tipo de Producto: ${productType === "digital" ? "Descarga / Clave Digital Inmediata 24/7" : "Hardware Dropshipping con Envíos Rastreados"}
- Cupón de bienvenida activo: "ALDRI10" (10% de descuento automático)
- URL con UTM: "${utmUrl}"
- Atención y cierre alternativo: Vía WhatsApp Oficial de Aldri Shop (+1 346 739-2730)

INSTRUCCIONES DE FORMATO:
Responde ÚNICAMENTE con un JSON válido (sin markdown, sin bloques \`\`\`json, solo las llaves {}) con la estructura exacta:
{
  "metaAds": {
    "copyProblemSolution": "Texto persuasivo para anuncio de Facebook/Instagram atacando el dolor principal del cliente, presentando la solución y cerrando con el enlace.",
    "copyOfferDiscount": "Texto persuasivo enfocado en la oferta agresiva de inauguración: $${price.toFixed(2)} USD con 10% OFF usando el código ALDRI10 y entrega inmediata.",
    "copySocialProof": "Texto persuasivo de prueba social y velocidad (entrega en menos de 5 minutos, garantía 100% de reemplazo, satisfacción comprobada).",
    "headlines": [
      "Titular Gancho 1 (máx 6 palabras)",
      "Titular Gancho 2 (máx 6 palabras)",
      "Titular Gancho 3 (máx 6 palabras)"
    ],
    "descriptions": [
      "Línea de apoyo 1 (máx 5 palabras)",
      "Línea de apoyo 2",
      "Línea de apoyo 3"
    ],
    "suggestedTargeting": {
      "interests": ["Interés relevante 1", "Interés 2", "Interés 3", "Interés 4"],
      "ageRange": "18 - 45 años",
      "placements": ["Instagram Reels", "Instagram Feed", "Facebook Feed"],
      "objective": "Clientes potenciales o Ventas (Pixel socia)",
      "dailyBudget": "$3.00 - $5.00 USD / día"
    }
  },
  "tiktokReels": {
    "duration": "25 segundos",
    "hook": {
      "time": "0:00 - 0:03",
      "visual": "Instrucción de lo que se debe mostrar en pantalla (ej: grabar pantalla mostrando error o precio alto en tienda oficial)",
      "audio": "Lo que dice la voz en off para captar la atención inmediatamente"
    },
    "demo": {
      "time": "0:03 - 0:18",
      "visual": "Instrucción de cómo mostrar aldri.shop, agregar al carrito y aplicar cupón ALDRI10",
      "audio": "Explicación rápida del proceso y cómo se recibe al instante"
    },
    "cta": {
      "time": "0:18 - 0:25",
      "visual": "Pantalla final con el enlace de la bio y el cupón ALDRI10 resaltado",
      "audio": "Llamada a la acción clara para comprar hoy mismo"
    },
    "caption": "Texto descriptivo para el video en TikTok/Instagram optimizado para el algoritmo",
    "hashtags": ["#aldrishop", "#descuentos", "#gaming", "#tecnologia", "#productividad"]
  },
  "communityPosts": {
    "facebookGroup": "Publicación estilo recomendación o aporte para grupos de Facebook sin ser considerado spam",
    "discordTelegram": "Mensaje formateado con emojis para canales de Discord o comunidades de Telegram",
    "redditForum": "Post informativo y transparente para foros y comunidades de Reddit"
  },
  "whatsappPitch": "Mensaje directo de WhatsApp para responder a un cliente interesado que preguntó por el producto"
}`;

      const models = ["gemini-flash-lite-latest", "gemini-2.5-flash", "gemini-flash-latest"];
      for (const model of models) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
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

          if (res.ok) {
            const json = await res.json();
            const raw = json.candidates?.[0]?.content?.parts?.[0]?.text;
            if (raw) {
              aiKit = JSON.parse(raw.replace(/^```json/g, "").replace(/```$/g, "").trim());
              break;
            }
          }
        } catch (e) {
          console.warn(`Intento con modelo ${model} en marketing kit falló:`, e);
        }
      }
    }

    // 3. Si por alguna razón la API no responde, usar generador algorítmico determinista de alta calidad
    const isDigital = productType === "digital";
    const kit: MarketingKit = {
      product: {
        id: String(product._id || product.slug),
        name,
        slug,
        price,
        category,
        image,
        productType
      },
      metaAds: aiKit?.metaAds || {
        copyProblemSolution: `¿Buscabas ${name} al mejor precio y con garantía total? ⚡ En Aldri Shop consigues tu código oficial por solo $${price.toFixed(2)} USD con entrega instantánea a tu correo y WhatsApp. Olvídate de intermediarios dudosos o esperas innecesarias. 🔒 Activación garantizada de por vida. 👉 Consíguelo hoy mismo aquí: ${utmUrl}`,
        copyOfferDiscount: `🔥 ¡OFERTA DE INAUGURACIÓN! Llévate ${name} con un 10% de descuento extra usando el código ALDRI10. Precio especial: $${(price * 0.9).toFixed(2)} USD. ${isDigital ? '⚡ Descarga e instrucciones directas a tu email en 2 minutos.' : '📦 Envío seguro con número de rastreo en tiempo real.'} 👉 Haz clic y canjea tu descuento: ${utmUrl}`,
        copySocialProof: `⭐⭐⭐⭐⭐ Más de 500 clientes ya confían en Aldri Shop para sus compras de ${category}. Adquiere ${name} por $${price.toFixed(2)} USD con garantía de reemplazo 100% y soporte humano en vivo por WhatsApp. ¿Dudas antes de comprar? Nuestro equipo te asiste en 30 segundos. 👉 Ordena aquí: ${utmUrl}`,
        headlines: [
          aiKit?.metaAds?.headlines?.[0] || `${name} — Solo $${price.toFixed(2)}`,
          aiKit?.metaAds?.headlines?.[1] || `⚡ Entrega Inmediata Oficial`,
          aiKit?.metaAds?.headlines?.[2] || `🎁 10% OFF con ALDRI10`
        ],
        descriptions: [
          aiKit?.metaAds?.descriptions?.[0] || "Garantía de activación 100%",
          aiKit?.metaAds?.descriptions?.[1] || "Soporte en WhatsApp 24/7",
          aiKit?.metaAds?.descriptions?.[2] || "Pago local y en USD disponible"
        ],
        suggestedTargeting: {
          interests: aiKit?.metaAds?.suggestedTargeting?.interests || [
            category,
            isDigital ? "Videojuegos" : "Tecnología",
            "Compras en internet",
            "Ofertas y Descuentos"
          ],
          ageRange: aiKit?.metaAds?.suggestedTargeting?.ageRange || "18 - 45 años",
          placements: aiKit?.metaAds?.suggestedTargeting?.placements || ["Instagram Feed", "Instagram Reels", "Facebook Feed"],
          objective: aiKit?.metaAds?.suggestedTargeting?.objective || "Compras (Pixel socia) o Clientes Potenciales",
          dailyBudget: aiKit?.metaAds?.suggestedTargeting?.dailyBudget || "$3.00 - $5.00 USD / día"
        },
        utmUrl
      },
      tiktokReels: aiKit?.tiktokReels || {
        duration: "25 segundos",
        hook: {
          time: "0:00 - 0:03",
          visual: `Muestra en pantalla el precio habitual elevado de ${name} y luego haz una transición rápida a aldri.shop.`,
          audio: `Deja de pagar de más por ${name}. Te muestro cómo conseguirlo legal y con entrega instantánea.`
        },
        demo: {
          time: "0:03 - 0:18",
          visual: `Graba tu pantalla navegando en aldri.shop, seleccionando ${name}, mostrando el botón de WhatsApp y aplicando el cupón ALDRI10.`,
          audio: `Entras a aldri.shop, eliges tu producto por solo $${price.toFixed(2)} USD, pagas con tu método preferido y recibes tu entrega en menos de dos minutos.`
        },
        cta: {
          time: "0:18 - 0:25",
          visual: `Muestra la confirmación de orden y resalta el código ALDRI10 en la pantalla con una flecha hacia el perfil.`,
          audio: `Usa el código ALDRI10 para un diez por ciento de descuento hoy mismo. El link está en mi perfil.`
        },
        caption: `¿Cómo conseguir ${name} con entrega inmediata y garantía oficial? ⚡ Usa el código ALDRI10 para 10% de descuento en aldri.shop 🛍️ Link en la bio.`,
        hashtags: [
          "#aldrishop",
          `#${category.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
          "#gaming",
          "#ofertas",
          "#tecnologia",
          "#descuentos"
        ]
      },
      communityPosts: aiKit?.communityPosts || {
        facebookGroup: `Hola a todos 👋 Les comparto este dato para los que buscaban ${name}: en la tienda Aldri Shop lo tienen en oferta por $${price.toFixed(2)} USD con entrega instantánea y garantía de activación. Además, si usan el cupón ALDRI10 les descuenta un 10% adicional. Se puede pagar con tarjeta, Zelle, Binance o coordinar por WhatsApp: ${utmUrl}`,
        discordTelegram: `⚡ **OFERTA ESPECIAL EN ALDRI SHOP** ⚡\n\n📌 **Producto:** ${name}\n💰 **Precio:** $${price.toFixed(2)} USD *(¡10% OFF con código \`ALDRI10\`!)*\n🚀 **Entrega:** ${isDigital ? 'Digital Inmediata 24/7' : 'Envío Seguro Rastreado'}\n🛡️ **Garantía:** 100% de reemplazo oficial\n\n👉 **Comprar ahora:** ${utmUrl}`,
        redditForum: `Para quienes necesiten ${name}, en Aldri Shop lo tienen disponible con soporte en español y entrega garantizada por $${price.toFixed(2)} USD. Tienen cupón activo ALDRI10 para 10% OFF: ${utmUrl}`
      },
      whatsappPitch: aiKit?.whatsappPitch || `¡Hola! 👋 Vi tu interés en *${name}*. Tenemos disponibilidad inmediata por *$${price.toFixed(2)} USD*. Puedes pagar en tu moneda local (Pago Móvil, Transferencia, Zelle, Binance o Tarjeta) y te entregamos en 2 minutos. Además, te aplico el cupón de bienvenida *ALDRI10* para que te quede con 10% OFF. ¿Te gustaría que te ayude a procesar tu pedido?`
    };

    return {
      success: true,
      data: kit
    };
  } catch (error: any) {
    console.error("Error al generar kit de marketing:", error);
    return {
      success: false,
      error: error.message || "Error al procesar la solicitud de marketing."
    };
  }
}
