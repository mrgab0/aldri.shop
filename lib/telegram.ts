// lib/telegram.ts
// Notificador de Pedidos y Eventos Críticos vía Telegram (Hermes Bot)

export interface TelegramOrderItem {
  name: string;
  quantity: number;
  price: number;
  productType?: string;
  sku?: string;
}

export interface TelegramOrderPayload {
  orderId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  total: number;
  paymentMethod: string;
  paymentRef?: string;
  orderType?: string;
  referralCode?: string;
  items: TelegramOrderItem[];
}

/**
 * Envía una notificación formateada a Telegram cuando se crea un pedido.
 * Utiliza fetch nativo sin dependencias externas, compatible con Vercel Serverless.
 */
export async function sendTelegramOrderNotification(order: TelegramOrderPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const rawChatId = process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_ALLOWED_IDS;

  if (!token || !rawChatId) {
    console.warn("[Telegram] Notificación omitida: TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no configurados.");
    return { success: false, reason: "Missing credentials" };
  }

  const chatId = rawChatId.split(",")[0].trim();
  const hasDigital = order.items.some((i) => i.productType === "digital") || order.orderType === "digital";
  const cleanPhone = (order.customerPhone || "").replace(/[^0-9]/g, "");

  // Formatear lista de productos
  const itemsText = order.items
    .map(
      (it) =>
        `• *${it.name.replace(/[*_`\[\]]/g, "")}* (x${it.quantity || 1})\n  └ Precio: _$${(it.price || 0).toFixed(2)} USD_ [${
          it.productType === "digital" ? "⚡ Clave Digital (JIT)" : "📦 Físico Dropship"
        }]`
    )
    .join("\n");

  const messageLines: string[] = [
    `👑 *¡NUEVA ORDEN EN ALDRI SHOP!* 🚀`,
    ``,
    `📦 *Pedido:* \`${order.orderId}\``,
    `👤 *Cliente:* ${order.customerName.replace(/[*_`\[\]]/g, "")}`,
    `📧 *Email:* ${order.customerEmail || "No especificado"}`,
    `📱 *Teléfono:* ${order.customerPhone || "No especificado"}`,
    cleanPhone ? `💬 *WhatsApp:* [Abrir Chat Directo](https://wa.me/${cleanPhone})` : "",
    ``,
    `💳 *Método de Pago:* *${order.paymentMethod ? order.paymentMethod.toUpperCase() : "NO ESPECIFICADO"}*`,
    order.paymentRef ? `🧾 *Comprobante / TxID:* \`${order.paymentRef.replace(/[*_`]/g, "")}\`` : `🧾 *Comprobante:* _Pendiente de verificación_`,
    order.referralCode ? `🤝 *Afiliado / Embajador:* \`${order.referralCode}\`` : "",
    `💰 *TOTAL COBRADO:* *$${(order.total || 0).toFixed(2)} USD*`,
    ``,
    `🛍️ *Artículos Comprados:*`,
    itemsText,
    ``,
  ];

  if (hasDigital) {
    messageLines.push(
      `⚡ *ACCIÓN REQUERIDA (CICLO JIT):*`,
      `Esta orden contiene claves o productos digitales. Con el saldo recibido, adquiere la clave en [Eneba](https://www.eneba.com) o [CDKeys](https://www.cdkeys.com) y entrégala al cliente en el portal o por WhatsApp.`,
      ``
    );
  } else {
    messageLines.push(
      `📦 *LOGÍSTICA:* Despacho internacional en proceso de preparación.`,
      ``
    );
  }

  messageLines.push(`🔗 [Abrir Panel de Pedidos](https://aldri-shop.vercel.app/admin/pedidos)`);

  const messageText = messageLines.filter((l) => l !== "").join("\n");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`[Telegram] Error de API (${response.status}):`, errBody);
      return { success: false, status: response.status, error: errBody };
    }

    const data = await response.json();
    return { success: true, messageId: data.result?.message_id };
  } catch (error: any) {
    console.error("[Telegram] Error enviando mensaje de notificación:", error.message || error);
    return { success: false, error: error.message };
  }
}
