export type FulfillmentProvider = 'cjdropshipping' | 'zendrop' | 'spocket' | 'manual';

export interface FulfillmentItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  supplierSku?: string;
  provider: FulfillmentProvider;
  productType?: 'digital' | 'dropship';
}

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  email?: string;
  streetAddress: string;
  city?: string;
  state?: string;
  countryCode?: string;
  zipCode?: string;
  lat?: number;
  lng?: number;
}

export interface DispatchPackageRequest {
  orderId: string;
  provider: FulfillmentProvider;
  items: FulfillmentItem[];
  shippingAddress: ShippingAddress;
  note?: string;
}

export interface DispatchResult {
  success: boolean;
  provider: FulfillmentProvider;
  packageId: string;
  dispatchId?: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  trackingUrl?: string;
  status: 'pending' | 'processing' | 'shipped' | 'failed';
  error?: string;
}

export interface MultiVendorDispatchSummary {
  orderId: string;
  totalPackages: number;
  packages: DispatchResult[];
  errors: string[];
}
