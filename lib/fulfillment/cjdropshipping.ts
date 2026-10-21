import type { DispatchPackageRequest, DispatchResult } from './types';

const CJ_API_URL = process.env.CJ_API_URL || 'https://developers.cjdropshipping.com/api2.0/v1';
const CJ_API_KEY = process.env.CJ_API_KEY || '';

/**
 * Dispatch an order package to CJ Dropshipping Open API.
 * If credentials are not yet configured, returns a simulated structured dispatch result
 * so the store flow operates without crashing.
 */
export async function dispatchCJOrder(req: DispatchPackageRequest): Promise<DispatchResult> {
  const packageId = `PKG-CJ-${req.orderId}-${Date.now().toString().slice(-4)}`;

  if (!CJ_API_KEY) {
    // Modo simulación estructurada / sandbox seguro
    return {
      success: true,
      provider: 'cjdropshipping',
      packageId,
      dispatchId: `CJ-SIM-${req.orderId}`,
      trackingCarrier: 'CJPacket Fast Line',
      trackingNumber: `CJ${Math.floor(100000000 + Math.random() * 900000000)}YQ`,
      trackingUrl: `https://www.17track.net/es/track?nums=CJ${Math.floor(100000000 + Math.random() * 900000000)}YQ`,
      status: 'processing'
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
        'CJ-Access-Token': CJ_API_KEY
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
        error: data.message || `Error HTTP ${res.status} en CJ Dropshipping`
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
      error: error.message || 'Fallo de conexión con CJ Dropshipping'
    };
  }
}
