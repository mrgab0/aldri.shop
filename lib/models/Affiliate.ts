import mongoose, { Schema, Document } from 'mongoose';

export type PayoutMethodType = 'binance_usdt' | 'paypal' | 'zelle' | 'bank_transfer';

export interface IAffiliate extends Document {
  code: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  payoutMethod: PayoutMethodType;
  payoutDetails: string;
  commissionRate: number;
  clicks: number;
  orderCount: number;
  totalSales: number;
  totalCommissionsEarned: number;
  totalCommissionsPaid: number;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AffiliateSchema: Schema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: 'Global',
  },
  payoutMethod: {
    type: String,
    enum: ['binance_usdt', 'paypal', 'zelle', 'bank_transfer'],
    default: 'binance_usdt',
  },
  payoutDetails: {
    type: String,
    required: true,
    trim: true,
  },
  commissionRate: {
    type: Number,
    required: true,
    default: 0.10, // 10% estándar Amazon Associates
    min: 0,
    max: 1,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  orderCount: {
    type: Number,
    default: 0,
  },
  totalSales: {
    type: Number,
    default: 0,
  },
  totalCommissionsEarned: {
    type: Number,
    default: 0,
  },
  totalCommissionsPaid: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

AffiliateSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Affiliate =
  mongoose.models.Affiliate || mongoose.model<IAffiliate>('Affiliate', AffiliateSchema);
