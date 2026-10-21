import type { FulfillmentItem, ShippingAddress, DispatchResult, MultiVendorDispatchSummary, FulfillmentProvider } from './types';
import { dispatchCJOrder } from './cjdropshipping';
import { dispatchZendropOrder } from './zendrop';

export interface DispatchOrderInput {
  orderId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    productType?: 'digital' | 'dropship';
    fulfillmentProvider?: FulfillmentProvider;
    supplierSku?: string;
  }>;
  shippingAddress: ShippingAddress;
  note?: string;
}

/**
 * Orchestrates multi-vendor fulfillment for an order.
 * Splits physical items by provider (CJ Dropshipping vs Zendrop),
 * executes the appropriate API calls in parallel, and returns unified shipment results.
 */
export async function dispatchMultiVendorOrder(input: DispatchOrderInput): Promise<MultiVendorDispatchSummary> {
  const { orderId, items, shippingAddress, note } = input;

  // Filtrar solo items físicos (los digitales se despachan instantáneamente sin transportista)
  const physicalItems = items.filter(i => i.productType !== 'digital');

  if (physicalItems.length === 0) {
    return {
      orderId,
      totalPackages: 0,
      packages: [],
      errors: []
    };
  }

  // Agrupar items por proveedor
  const groupedByProvider = new Map<FulfillmentProvider, FulfillmentItem[]>();

  for (const it of physicalItems) {
    const provider: FulfillmentProvider = it.fulfillmentProvider || 'cjdropshipping';
    const list = groupedByProvider.get(provider) || [];
    list.push({
      id: it.id,
      name: it.name,
      quantity: it.quantity,
      price: it.price,
      supplierSku: it.supplierSku,
      provider,
      productType: it.productType
    });
    groupedByProvider.set(provider, list);
  }

  const dispatchPromises: Promise<DispatchResult>[] = [];

  for (const [provider, providerItems] of groupedByProvider.entries()) {
    const req = {
      orderId,
      provider,
      items: providerItems,
      shippingAddress,
      note
    };

    if (provider === 'zendrop') {
      dispatchPromises.push(dispatchZendropOrder(req));
    } else if (provider === 'cjdropshipping') {
      dispatchPromises.push(dispatchCJOrder(req));
    } else {
      // Manual o Spocket fallback
      dispatchPromises.push(Promise.resolve({
        success: true,
        provider,
        packageId: `PKG-${provider.toUpperCase()}-${orderId}-${Date.now().toString().slice(-4)}`,
        dispatchId: `MANUAL-${orderId}`,
        status: 'pending' as const
      }));
    }
  }

  const results = await Promise.all(dispatchPromises);
  const errors = results.filter(r => !r.success && r.error).map(r => `[${r.provider}] ${r.error}`);

  return {
    orderId,
    totalPackages: results.length,
    packages: results,
    errors
  };
}
