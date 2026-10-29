import type { DispatchPackageRequest, DispatchResult } from './types';

const ZENDROP_API_URL = process.env.ZENDROP_API_URL || 'https://api.zendrop.com/v1';
const ZENDROP_API_KEY = process.env.ZENDROP_API_KEY || '';

/**
 * Dispatch an order package to Zendrop API (US Warehouses Express).
 * If credentials are not yet configured, returns a simulated structured dispatch result
 * so the store flow operates without crashing.
 */
export async function dispatchZendropOrder(req: DispatchPackageRequest): Promise<DispatchResult> {
  const packageId = `PKG-ZD-${req.orderId}-${Date.now().toString().slice(-4)}`;

  if (!ZENDROP_API_KEY) {
    // Modo Manual Transparente: Sin clave de API configurada.
    // La orden queda registrada como pendiente de despacho para procesamiento manual.
    return {
      success: true,
      provider: 'zendrop',
      packageId,
      status: 'pending',
      trackingCarrier: 'USPS Priority (Pendiente de despacho)',
      trackingNumber: '',
      trackingUrl: undefined
    };
  }

  try {
    const payload = {
      external_order_id: `${req.orderId}-${packageId}`,
      shipping_address: {
        name: req.shippingAddress.recipientName,
        address1: req.shippingAddress.streetAddress,
        city: req.shippingAddress.city || '',
        state: req.shippingAddress.state || '',
        zip: req.shippingAddress.zipCode || '00000',
        country: req.shippingAddress.countryCode || 'US',
        phone: req.shippingAddress.phone,
        email: req.shippingAddress.email
      },
      line_items: req.items.map(item => ({
        sku: item.supplierSku || item.id,
        quantity: item.quantity
      }))
    };

    const res = await fetch(`${ZENDROP_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZENDROP_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        provider: 'zendrop',
        packageId,
        status: 'failed',
        error: data.message || `Error HTTP ${res.status} en Zendrop`
      };
    }

    const zdOrderId = data.order_id || `ZD-${req.orderId}`;
    const trackNum = data.tracking_number || '';

    return {
      success: true,
      provider: 'zendrop',
      packageId,
      dispatchId: zdOrderId,
      trackingCarrier: data.carrier || 'USPS Priority Express',
      trackingNumber: trackNum,
      trackingUrl: trackNum ? `https://www.17track.net/es/track?nums=${encodeURIComponent(trackNum)}` : undefined,
      status: trackNum ? 'shipped' : 'processing'
    };
  } catch (error: any) {
    return {
      success: false,
      provider: 'zendrop',
      packageId,
      status: 'failed',
      error: error.message || 'Fallo de conexión con Zendrop'
    };
  }
}
