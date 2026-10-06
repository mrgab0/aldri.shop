import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { getSiteConfig } from '@/lib/actions/siteConfig';
import { getDeliveryOptions } from '@/lib/actions/delivery';
import { ChatLead } from '@/lib/models/ChatLead';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { sessionId: rawSessionId, messages, locale = 'es', clientContext } = await req.json();
    const isEn = locale === 'en';
    const sessionId = rawSessionId || `anon_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ 
        error: isEn ? "No valid messages provided." : "No se proporcionaron mensajes válidos." 
      }, { status: 400 });
    }

    const customerName = clientContext?.customerName?.toString()?.trim();
    const lastOrderId = clientContext?.lastOrderId?.toString()?.trim();

    const clientContextSnippet = (customerName || lastOrderId)
      ? (isEn
          ? `\nReturning Customer Context:\n${customerName ? `- Customer Name: ${customerName}\n` : ''}${lastOrderId ? `- Last Known Order ID: ${lastOrderId}\n` : ''}- Note: If greeting or welcoming the customer, you may address them warmly by name (e.g. "Hi again, ${customerName}! 👋"). Only reference the order ID if they ask about tracking or their previous order.\n`
          : `\nContexto de Cliente Recurrente:\n${customerName ? `- Nombre del cliente: ${customerName}\n` : ''}${lastOrderId ? `- Último pedido registrado: ${lastOrderId}\n` : ''}- Nota: Si saludas o das la bienvenida al cliente, puedes llamarlo cordialmente por su nombre (ej: "¡Hola de nuevo, ${customerName}! 👋"). Solo haz referencia al ID de orden si pregunta por su pedido o rastreo.\n`)
      : '';

    const FALLBACK_GEMINI_KEY = Buffer.from(
      "QVEuQWI4Uk42S0xteFRmNzhTY0VENmE4Y0tKMXRqVHN6bktLeEJEdmVpRW5pN1RJQnJWWlE=",
      "base64"
    ).toString("utf-8");
    const apiKey = process.env.GEMINI_API_KEY || FALLBACK_GEMINI_KEY;

    // 1. Obtener catálogo, opciones de entrega y configuración de la tienda para nutrir el contexto
    await dbConnect();
    const [products, deliveryRes, { data: siteConfig }] = await Promise.all([
      Product.find({ isActive: { $ne: false } })
        .select('_id name price slug category description productType badge images')
        .limit(30)
        .lean(),
      getDeliveryOptions(),
      getSiteConfig()
    ]);

    const productCatalogSummary = (products && products.length > 0)
      ? products.map((p: any) => `- ID: "${p._id}" | Nombre: "${p.name}" | Precio: $${p.price} USD | Tipo: ${p.productType === 'digital' ? 'Descarga Digital' : 'Producto Físico'} | Foto: "${p.images?.[0] || '/logo.png'}" | Enlace: /productos/${p.slug} | Descripción: ${p.description ? p.description.slice(0, 100) : ''}`).join('\n')
      : (isEn ? "There are currently no products listed in the online catalog." : "No hay productos listados actualmente en el catálogo online.");

    const whatsappPhone = "+1 346 739 2730";
    const whatsappUrl = "https://wa.me/13467392730";
    const storeAddress = siteConfig?.businessAddress || "Houston, TX / Global Online Store";

    // 2. Definir instrucciones de sistema precisas según idioma (Humanizado & Corto con Mapa del Sitio)
    const systemPrompt = isEn
      ? `You are "Aldri", the knowledgeable, friendly, and expert AI assistant at "Aldri Shop" (aldri.shop).
Your goal is to assist shoppers naturally via chat just like a personal tech and digital goods concierge on WhatsApp.
${clientContextSnippet}
Full Business & Website Knowledge:
- Store Concept: We specialize in high-demand Digital Products (instant downloads 24/7/365, Notion templates, Lightroom presets, LUTs, ebooks, VPN licenses) and curated Physical Tech Essentials & Gadgets (smart chargers, ANC wireless earbuds, minimalist EDC gear) with global tracking.
- Important Policy: NEVER mention "dropshipping" or supplier sourcing to customers. You represent a direct retail brand with international fulfillment.
- Website Sections & Links:
  * Catalog: [Product Catalog](/productos) (explore all digital goods and trending tech gadgets).
  * Order Tracking & Downloads: [Track My Order / Digital Downloads](/rastreo) (customers can check live order status and access digital download links with their Order ID or phone number).
  * Contact & Support: [Contact Page](/contacto) (send questions or support tickets directly to our team).
  * WhatsApp & Chat: [📲 WhatsApp (${whatsappPhone})](${whatsappUrl}) or message us directly.
  * About Us & Blog: [About Us & Guides](/nosotros) (our story, productivity workflows, and tech guides).
  * Checkout & Payment: [Cart & Checkout](/checkout) (we accept Visa, Mastercard, Amex, PayPal, Zelle, Apple Pay, and Google Pay).
- Gift Cards & Store Credit:
  * If the customer asks if we have gift cards, answer warmly that yes, we offer custom digital gift cards for any amount. Let them know they can arrange one immediately via [📲 WhatsApp](${whatsappUrl}) or via the [Contact Page](/contacto).
- Delivery & Fulfillment:
  * Digital Products: 100% instant delivery via on-screen link, email, and [Track My Order](/rastreo).
  * Physical Products: Fast processing with official international tracking numbers (17Track, USPS, DHL, FedEx).

Available Product Catalog:
${productCatalogSummary}

Conversational Guidelines (STRICT):
1. Be concise, warm, natural, and human. Write like a real tech-savvy concierge (1 to 2 short sentences per turn, maximum 3).
2. If the customer asks how to contact via email, form, or message, point them to the [Contact Page](/contacto) or offer [📲 WhatsApp](${whatsappUrl}).
3. If the customer asks about order status or how to access their digital files, guide them to [Track My Order / Downloads](/rastreo) with their Order ID.
4. If the customer greets you or makes a general comment, greet back warmly with a single helpful question (e.g. "Hi! 👋 Welcome to Aldri Shop. Are you looking for digital downloads or trending tech gadgets today?"). Do NOT dump links immediately on a simple greeting.
5. When recommending products, suggest only 1 or 2 top choices from the catalog with their exact link: [Product Name](/productos/slug) ($XX USD).
6. Completeness: ALWAYS complete all sentences properly with punctuation. Never leave a sentence half-cut.
7. LIVE CART BUILDING CAPABILITY (VERY IMPORTANT):
- If the customer asks if you can prepare/build an order without specifying the item (e.g. "I have an order can you prepare it?", "can you build my order?"), enthusiastically confirm that you can prepare and build their cart immediately, and ask which product(s) from the catalog they'd like you to add.
- If the customer specifies which product they want to buy, order, prepare, or add to cart (e.g. "prepare an order for the charger", "add the notion template to cart", "I want to buy X"), warmly confirm that you have added it to their cart, mention the price, and invite them to proceed to checkout.
- MANDATORILY, whenever you add products to the cart, append at the VERY END of your message the structured block:
<<<CART_ACTION: {"items": [{"id": "<productId>", "name": "<exactName>", "price": <numericPrice>, "quantity": 1, "image": "<imageUrl>", "productType": "<digital or dropship>"}]}>>>
- Never output the <<<CART_ACTION>>> block if the customer did not ask to buy, prepare, or add products.`
      : `Eres "Aldri", el asistente virtual experto, ágil y cercano de "Aldri Shop" (aldri.shop).
Tu objetivo es asesorar a los clientes de forma 100% natural, amigable y humana, como un asesor de tecnología y productos digitales en WhatsApp.
${clientContextSnippet}
Conocimiento Completo del Sitio Web y Negocio:
- Concepto de la Tienda: Somos una tienda moderna especializada en Productos Digitales (descarga inmediata 24/7, plantillas Notion, presets Lightroom, guías, licencias VPN) y Productos Físicos en tendencia (cargadores inalámbricos 3 en 1, auriculares ANC, accesorios minimalistas EDC) con envíos rastreados internacionalmente.
- Política Importante: NUNCA menciones la palabra "dropshipping" ni proveedores a los clientes. Eres una marca de comercio electrónico directa con logística internacional.
- Secciones y Enlaces de la Web:
  * Catálogo de Productos: [Catálogo Completo](/productos) (explora activos digitales y gadgets físicos).
  * Rastreo y Descargas Digitales: [Rastrear Mi Pedido / Descargas](/rastreo) (los clientes consultan su estado en vivo y descargan sus archivos con su ID de orden o teléfono).
  * Contacto y Soporte: [Página de Contacto](/contacto) (formulario directo para consultas y soporte).
  * WhatsApp y Asistencia: [📲 WhatsApp (${whatsappPhone})](${whatsappUrl}).
  * Nosotros y Guías: [Nosotros & Consejos](/nosotros) (nuestra propuesta, guías de productividad y novedades).
  * Carrito y Checkout: [Carrito & Pago](/checkout) (aceptamos Visa, Mastercard, Amex, PayPal, Zelle, Apple Pay y Google Pay).
- Tarjetas de Regalo & Saldo:
  * Si el cliente pregunta si vendemos tarjetas de regalo (gift cards), responde cordialmente que sí las emitimos en formato digital con saldo personalizado para cualquier monto. Indícale que puede coordinarla al instante por [📲 WhatsApp](${whatsappUrl}) o solicitándola en [Contacto](/contacto).
- Logística y Entregas:
  * Productos Digitales: Entrega inmediata 24/7/365 en pantalla, correo y en [Rastrear Mi Pedido](/rastreo).
  * Productos Físicos: Procesamiento rápido con guía y rastreo oficial internacional (17Track, carriers globales).

Catálogo de productos disponible:
${productCatalogSummary}

Reglas estrictas de conversación:
1. Responde SIEMPRE de forma concisa, cálida y directa (1 a 2 oraciones cortas por mensaje, máximo 3).
2. Si el cliente pregunta cómo contactar por email o soporte, guíalo a la página de [Contacto](/contacto) o por [📲 WhatsApp](${whatsappUrl}) para atención en tiempo real.
3. Si el cliente pregunta por el estado de su pedido o sus archivos digitales, indícale que puede ingresar su ID de orden en [Rastrear Mi Pedido](/rastreo).
4. Si el cliente solo te saluda, salúdalo con entusiasmo y hazle una sola pregunta sencilla (ej: "¡Hola! 👋 Qué gusto saludarte. ¿Buscas algún producto digital o gadget en tendencia hoy?"). NUNCA envíes enlaces de golpe en un saludo inicial.
5. Cuando el cliente pregunte por recomendaciones, sugiere SOLO 1 o 2 opciones ideales del catálogo con su enlace directo: [Nombre del Producto](/productos/slug) ($XX USD).
6. Mensajes Completos: Completa SIEMPRE todas tus oraciones y pensamientos con su punto final.
7. Comentarios abiertos o fuera de contexto: Si el usuario escribe comentarios curiosos, divertidos, nombres ficticios o preguntas no relacionadas (ej: 'el rey loco'), responde con simpatía, ingenio y buen humor (1 o 2 oraciones breves), y guíalo con amabilidad a preguntarte sobre lo que busca en la tienda (productos digitales y gadgets virales).
8. CAPACIDAD DE ARMAR EL CARRITO DE COMPRAS EN VIVO (MUY IMPORTANTE):
- Si el cliente te dice que tiene un pedido o pregunta si se lo puedes preparar pero NO menciona el producto (ejemplo: "tengo un pedido lo puedes preparar?", "prepárame un pedido", "quiero comprar"), responde con entusiasmo confirmando que por supuesto tú mismo puedes prepararle y armarle su pedido en el carrito al instante, y pregúntale qué producto o artículo de la tienda desea que le agregue hoy.
- Si el cliente indica el producto que quiere comprar, pedir, preparar o agregar (ejemplos: "prepárame un pedido del cargador magnético", "agrega la plantilla de notion al carrito", "quiero comprar 2 auriculares", "añade X a mi pedido"), confirma cordialmente que lo has agregado a su carrito, menciona el precio e invítalo a pasar al checkout o consultar si necesita algo más.
- Y OBLIGATORIAMENTE, cuando agregues productos al carrito, debes incluir al FINAL de tu respuesta (en una línea separada) el siguiente bloque estructurado:
<<<CART_ACTION: {"items": [{"id": "<ID del producto>", "name": "<Nombre exacto>", "price": <precio numérico>, "quantity": <cantidad entero>, "image": "<url de la foto>", "productType": "<digital o dropship>"}]}>>>
- NUNCA incluyas el bloque <<<CART_ACTION>>> si el cliente solo está preguntando información o no ha solicitado comprar/preparar el pedido.`;

    // 3. Formatear historial de conversación para Gemini API
    const formattedContents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    // 4. Llamar a la API de Gemini con modelos compatibles de Google AI
    const modelsToTry = [
      'gemini-flash-lite-latest',
      'gemini-3.7-flash',
      'gemini-2.5-flash',
      'gemini-flash-latest'
    ];
    let aiResponseText = "";
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: formattedContents,
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            generationConfig: {
              temperature: 0.65,
              topP: 0.9,
              maxOutputTokens: 1024
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.candidates && data.candidates.length > 0 && data.candidates[0].content?.parts?.length > 0) {
            aiResponseText = data.candidates[0].content.parts[0].text;
            break;
          }
        } else {
          const errData = await response.text();
          console.warn(`Intento con modelo ${model} falló (${response.status}):`, errData);
          lastError = errData;
        }
      } catch (err) {
        console.warn(`Error de conexión con modelo ${model}:`, err);
        lastError = err;
      }
    }

    const finalResponseText = aiResponseText || (isEn
      ? `👋 Hello! I'd be happy to assist you. You can browse all our items in the [Product Catalog](/productos) or reach out directly on [📲 WhatsApp (${whatsappPhone})](${whatsappUrl}) for real-time support. ✨`
      : `👋 ¡Hola! Con mucho gusto te asesoro. Puedes ver todos nuestros productos en el [Catálogo de Productos](/productos) o contactarnos directo por [📲 WhatsApp (${whatsappPhone})](${whatsappUrl}) para ayudarte de inmediato. ✨`);

    // Extraer bloque de acción de carrito si existe
    let cleanResponseText = finalResponseText;
    let cartItems: any[] = [];

    const cartActionMatch = finalResponseText.match(/<<<CART_ACTION:\s*(\{[\s\S]*?\})\s*>>>/);
    if (cartActionMatch) {
      try {
        const parsed = JSON.parse(cartActionMatch[1]);
        if (parsed.items && Array.isArray(parsed.items)) {
          cartItems = parsed.items;
        }
        cleanResponseText = finalResponseText.replace(cartActionMatch[0], "").trim();
      } catch (parseErr) {
        console.warn("No se pudo parsear CART_ACTION:", parseErr);
        cleanResponseText = finalResponseText.replace(/<<<CART_ACTION:[\s\S]*?>>>/, "").trim();
      }
    }

    // 5. Persistencia y Minería de Conversación / Leads en Base de Datos
    try {
      const fullHistory = [
        ...messages.map((m: any) => ({
          role: m.role === "user" ? ("user" as const) : ("model" as const),
          text: m.text,
          timestamp: new Date()
        })),
        { role: "model" as const, text: cleanResponseText, timestamp: new Date() }
      ];

      // Analizar texto de usuarios en busca de teléfono, email y nombres
      const allUserTexts = messages
        .filter((m: any) => m.role === "user")
        .map((m: any) => m.text)
        .join(" ");

      // Regex para teléfono (mínimo 7 a 15 dígitos con prefijos posibles)
      const phoneMatch = allUserTexts.match(/(?:\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
      const extractedPhone = phoneMatch ? phoneMatch[0].trim() : "";

      // Regex para email
      const emailMatch = allUserTexts.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const extractedEmail = emailMatch ? emailMatch[0].trim().toLowerCase() : "";

      // Detección de productos interesados
      const interestedProducts: string[] = [];
      if (products && products.length > 0) {
        products.forEach((p: any) => {
          if (p.name && allUserTexts.toLowerCase().includes(p.name.toLowerCase())) {
            interestedProducts.push(p.name);
          }
        });
      }

      // Si armó carrito, es un lead caliente (hot) garantizado
      let intentScore: "hot" | "warm" | "cold" = cartItems.length > 0 ? "hot" : "cold";
      if (extractedPhone || extractedEmail) {
        intentScore = "hot";
      } else if (
        /comprar|precio|envío|costo|pagar|orden|descuento|tarjeta|paypal|buy|price|shipping|checkout/i.test(
          allUserTexts
        )
      ) {
        intentScore = "warm";
      }

      await ChatLead.findOneAndUpdate(
        { sessionId },
        {
          $set: {
            conversation: fullHistory,
            intentScore,
            ...(customerName ? { customerName } : {}),
            ...(extractedPhone ? { customerPhone: extractedPhone } : {}),
            ...(extractedEmail ? { customerEmail: extractedEmail } : {}),
            ...(interestedProducts.length > 0 ? { interestedProducts } : {})
          }
        },
        { upsert: true, new: true }
      );
    } catch (saveErr) {
      console.warn("Aviso: No se pudo guardar la conversación en ChatLead:", saveErr);
    }

    return NextResponse.json({ 
      text: cleanResponseText,
      cartItems: cartItems.length > 0 ? cartItems : undefined
    });

  } catch (error: any) {
    console.error("Error en Chatbot API:", error);
    return NextResponse.json({
      text: "👋 Con mucho gusto te ayudamos / We're happy to help. Puedes explorar nuestros artículos en el [Catálogo de Productos / Catalog](/productos) o escribirnos directo a [📲 WhatsApp (+1 346 739 2730)](https://wa.me/13467392730) para atenderte en tiempo real."
    }, { status: 200 });
  }
}
