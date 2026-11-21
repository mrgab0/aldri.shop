export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1969648656656428";

// Registrar cambio de página
export const pageview = () => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "PageView");
  }
};

// Disparar evento personalizado o estándar
export const event = (name: string, options: Record<string, any> = {}) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", name, options);
  }
};

// 1. Ver Contenido / Producto o Landing
export const trackViewContent = (data: {
  id: string;
  name: string;
  price?: number;
  category?: string;
  currency?: string;
}) => {
  event("ViewContent", {
    content_ids: [data.id],
    content_name: data.name,
    content_category: data.category || "General",
    value: data.price || 0,
    currency: data.currency || "USD",
  });
};

// 2. Agregar al Carrito
export const trackAddToCart = (data: {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  currency?: string;
}) => {
  event("AddToCart", {
    content_ids: [data.id],
    content_name: data.name,
    content_type: "product",
    value: data.price * (data.quantity || 1),
    currency: data.currency || "USD",
  });
};

// 3. Iniciar Proceso de Pago (Checkout)
export const trackInitiateCheckout = (data: {
  items: Array<{ id: string; name: string; price: number; quantity?: number }>;
  total: number;
  currency?: string;
}) => {
  event("InitiateCheckout", {
    content_ids: data.items.map((i) => i.id),
    num_items: data.items.reduce((acc, i) => acc + (i.quantity || 1), 0),
    value: data.total,
    currency: data.currency || "USD",
  });
};

// 4. Compra Completada con Éxito
export const trackPurchase = (data: {
  orderId: string;
  total: number;
  items: Array<{ id: string; name?: string; price?: number; quantity?: number }>;
  currency?: string;
}) => {
  event("Purchase", {
    content_ids: data.items.map((i) => i.id),
    content_type: "product",
    order_id: data.orderId,
    value: data.total,
    currency: data.currency || "USD",
    num_items: data.items.reduce((acc, i) => acc + (i.quantity || 1), 0),
  });
};
