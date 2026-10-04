import mongoose, { Schema, Document } from 'mongoose';

export type OrderType = 'digital' | 'dropship' | 'hybrid';

export interface IOrder extends Document {
  orderId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  orderType?: OrderType;
  address: string;
  destLat?: number;
  destLng?: number;
  distanceMiles?: number;
  googleMapsUrl?: string;
  deliveryMethod?: string;
  deliveryFee?: number;
  couponCode?: string;
  discountAmount?: number;
  taxAmount?: number;
  cardMessage?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    productType?: 'digital' | 'dropship';
    downloadUrl?: string;
    addons?: any[];
  }>;
  trackingNumber?: string;
  trackingCarrier?: string;
  trackingUrl?: string;
  digitalDownloads?: Array<{
    productId: string;
    name: string;
    downloadUrl: string;
    downloadExpiresAt?: Date;
  }>;
  total: number;
  paymentMethod: string;
  paymentRef: string;
  status: string;
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, default: "" },
  customerPhone: { type: String, required: true },
  orderType: { type: String, enum: ['digital', 'dropship', 'hybrid'], default: 'digital' },
  address: { type: String, default: "Entrega Digital" },
  destLat: { type: Number, default: 0 },
  destLng: { type: Number, default: 0 },
  distanceMiles: { type: Number, default: 0 },
  googleMapsUrl: { type: String, default: "" },
  deliveryMethod: { type: String, default: "Entrega Inmediata" },
  deliveryFee: { type: Number, default: 0 },
  couponCode: { type: String, default: "" },
  discountAmount: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  cardMessage: { type: String, default: "" },
  items: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number,
    productType: { type: String, default: 'digital' },
    downloadUrl: { type: String, default: '' },
    addons: Schema.Types.Mixed
  }],
  trackingNumber: { type: String, default: "" },
  trackingCarrier: { type: String, default: "" },
  trackingUrl: { type: String, default: "" },
  digitalDownloads: [{
    productId: String,
    name: String,
    downloadUrl: String,
    downloadExpiresAt: Date
  }],
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentRef: { type: String, required: true },
  status: { 
    type: String, 
    default: "Procesando",
  },
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
