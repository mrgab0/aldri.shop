import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentConfig extends Document {
  methodId: string; // 'zelle', 'cashapp', 'paypal', 'square', 'efectivo', 'binance_pay', 'crypto'
  title: string;
  holderName?: string;
  accountDetail?: string; // Email, Phone, $Cashtag, Binance Pay ID or Wallet
  qrImage?: string; // ImageKit QR URL
  instructions?: string;
  linkUrl?: string; // For Square or Paypal.me or Binance Pay
  cryptoWallets?: {
    usdtTrc20?: string;
    usdtBep20?: string;
    bitcoin?: string;
    solana?: string;
  };
  isActive: boolean;
  updatedAt: Date;
}

const PaymentConfigSchema: Schema = new Schema({
  methodId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  holderName: { type: String, default: "" },
  accountDetail: { type: String, default: "" },
  qrImage: { type: String, default: "" },
  instructions: { type: String, default: "" },
  linkUrl: { type: String, default: "" },
  cryptoWallets: {
    usdtTrc20: { type: String, default: "" },
    usdtBep20: { type: String, default: "" },
    bitcoin: { type: String, default: "" },
    solana: { type: String, default: "" },
  },
  isActive: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now }
});

export const PaymentConfig = mongoose.models.PaymentConfig || mongoose.model<IPaymentConfig>('PaymentConfig', PaymentConfigSchema);
