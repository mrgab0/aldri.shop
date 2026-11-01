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

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`${CJ_API_URL}/authentication/getAccessToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apiKey }),
        signal: AbortSignal.timeout(15000)
      });

      const data = await res.json();

      if (res.ok && data.result && data.data?.accessToken) {
        cachedAccessToken = data.data.accessToken;
        tokenExpiresAt = data.data.accessTokenExpiryDate
          ? new Date(data.data.accessTokenExpiryDate).getTime()
          : now + 180 * 24 * 3600 * 1000;
        return cachedAccessToken;
      }

      console.error('[CJ Dropshipping Auth Error]', data.message || 'Respuesta inválida al renovar token');
    } catch (error: any) {
      if (attempt === 3) {
        console.error('[CJ Dropshipping Network Error]', error.message || error);
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return null;
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

/**
 * Consulta el catálogo oficial de CJ Dropshipping para búsqueda y curaduría.
 */
export async function searchCJCatalog(keyword: string, options: { pageNum?: number; pageSize?: number } = {}) {
  const token = await getCJAccessToken();
  if (!token) {
    return { success: false, error: 'No se pudo obtener el token de acceso de CJ Dropshipping', data: { list: [], total: 0 } };
  }

  const pageNum = options.pageNum || 1;
  const pageSize = options.pageSize || 10;
  const url = `${CJ_API_URL}/product/list?productNameEn=${encodeURIComponent(keyword)}&pageNum=${pageNum}&pageSize=${pageSize}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'CJ-Access-Token': token
      }
    });

    const data = await res.json();
    if (res.ok && data.result) {
      return {
        success: true,
        data: {
          total: data.data?.total || 0,
          list: (data.data?.list || []).map((item: any) => ({
            id: item.pid,
            name: item.productNameEn,
            price: Number(item.sellPrice || 0),
            image: item.productImage,
            productUrl: `https://cjdropshipping.com/product/${item.pid}.html`,
            categoryName: item.categoryName || 'Tech',
            countryCode: 'CN'
          }))
        }
      };
    }

    return {
      success: false,
      error: data.message || `Error HTTP ${res.status} al consultar catálogo CJ`,
      data: { list: [], total: 0 }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Error de red al consultar catálogo CJ',
      data: { list: [], total: 0 }
    };
  }
}

/**
 * Consulta el detalle completo de un producto específico por su ID (pid) en CJ Dropshipping.
 */
export async function getCJProduct(pid: string) {
  const token = await getCJAccessToken();
  if (!token) {
    return { success: false, error: 'No se pudo obtener el token de CJ', data: null };
  }

  try {
    const res = await fetch(`${CJ_API_URL}/product/query?pid=${encodeURIComponent(pid)}`, {
      method: 'GET',
      headers: {
        'CJ-Access-Token': token
      },
      signal: AbortSignal.timeout(15000)
    });

    const data = await res.json();
    if (res.ok && data.result && data.data) {
      return {
        success: true,
        data: {
          id: data.data.pid,
          name: data.data.productNameEn,
          price: Number(data.data.sellPrice || 0),
          image: data.data.productImage,
          productUrl: `https://cjdropshipping.com/product/${data.data.pid}.html`,
          description: data.data.description || data.data.productNameEn,
          categoryName: data.data.categoryName || 'Tech',
          countryCode: 'CN'
        }
      };
    }

    return {
      success: false,
      error: data.message || `No se pudo encontrar el producto CJ ${pid}`,
      data: null
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || `Error de red al consultar producto CJ ${pid}`,
      data: null
    };
  }
}
