import type { DispatchPackageRequest, DispatchResult } from './types';

const CJ_API_URL = process.env.CJ_API_URL || 'https://developers.cjdropshipping.com/api2.0/v1';
const CJ_API_KEY = process.env.CJ_API_KEY || '';

// Caché en memoria para reutilizar el access token y no agotar puntos de API
let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Obtiene un access token válido para CJ Dropshipping Open API v2.0.
 * La vida útil de un token en CJ es de 180 días.
 * Si ya existe en caché y restan más de 60 minutos antes de expirar, se reutiliza.
 */
export async function getCJAccessToken(): Promise<string | null> {
  const apiKey = process.env.CJ_API_KEY || CJ_API_KEY;
  if (!apiKey) {
    return null;
  }

  const now = Date.now();
  if (cachedAccessToken && tokenExpiresAt > now + 3600 * 1000) {
    return cachedAccessToken;
  }

  try {
    const res = await fetch(`${CJ_API_URL}/authentication/getAccessToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apiKey })
    });

    const data = await res.json();

    if (res.ok && data.result && data.data?.accessToken) {
      cachedAccessToken = data.data.accessToken;
      // Guardar tiempo de expiración (por defecto 180 días si no viene la fecha explícita)
      tokenExpiresAt = data.data.accessTokenExpiryDate
        ? new Date(data.data.accessTokenExpiryDate).getTime()
        : now + 180 * 24 * 3600 * 1000;
      return cachedAccessToken;
    }

    console.error('[CJ Dropshipping Auth Error]', data.message || 'Respuesta inválida al renovar token');
    return null;
  } catch (error: any) {
    console.error('[CJ Dropshipping Network Error]', error.message || error);
    return null;
  }
}

/**
 * Despacha un paquete físico a CJ Dropshipping Open API.
 * Si no hay credenciales configuradas, opera en Modo Manual Transparente (pending).
 */
export async function dispatchCJOrder(req: DispatchPackageRequest): Promise<DispatchResult> {
  const packageId = `PKG-CJ-${req.orderId}-${Date.now().toString().slice(-4)}`;
  const apiKey = process.env.CJ_API_KEY || CJ_API_KEY;

  if (!apiKey) {
    // Modo Manual Transparente: Sin clave de API configurada.
    return {
      success: true,
      provider: 'cjdropshipping',
      packageId,
      status: 'pending',
      trackingCarrier: 'CJPacket Fast Line (Pendiente de credenciales)',
      trackingNumber: '',
      trackingUrl: undefined
    };
  }

  const accessToken = await getCJAccessToken();
  if (!accessToken) {
    return {
      success: false,
      provider: 'cjdropshipping',
      packageId,
      status: 'failed',
      error: 'Fallo de autenticación con CJ Dropshipping: Verifique la validez de CJ_API_KEY'
    };
  }

  try {
    const payload = {
      orderNumber: `${req.orderId}-${packageId}`,
      shippingZip: req.shippingAddress.zipCode || '00000',
      shippingCountryCode: req.shippingAddress.countryCode || 'US',
      shippingProvince: req.shippingAddress.state || '',
      shippingCity: req.shippingAddress.city || '',
      shippingAddress: req.shippingAddress.streetAddress,
      shippingCustomerName: req.shippingAddress.recipientName,
      shippingPhone: req.shippingAddress.phone,
      remark: req.note || 'Aldri Shop Order - Champagne Gold Package',
      products: req.items.map(item => ({
        vid: item.supplierSku || item.id,
        quantity: item.quantity
      }))
    };

    const res = await fetch(`${CJ_API_URL}/shopping/order/createOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': accessToken
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok || !data.result) {
      return {
        success: false,
        provider: 'cjdropshipping',
        packageId,
        status: 'failed',
        error: data.message || `Error HTTP ${res.status} al crear orden en CJ Dropshipping`
      };
    }

    const cjOrderId = data.data?.orderId || `CJ-${req.orderId}`;
    const trackNum = data.data?.trackingNumber || '';

    return {
      success: true,
      provider: 'cjdropshipping',
      packageId,
      dispatchId: cjOrderId,
      trackingCarrier: 'CJPacket Fast Line',
      trackingNumber: trackNum,
      trackingUrl: trackNum ? `https://www.17track.net/es/track?nums=${encodeURIComponent(trackNum)}` : undefined,
      status: trackNum ? 'shipped' : 'processing'
    };
  } catch (error: any) {
    return {
      success: false,
      provider: 'cjdropshipping',
      packageId,
      status: 'failed',
      error: error.message || 'Fallo de conexión con CJ Dropshipping al despachar orden'
    };
  }
}
