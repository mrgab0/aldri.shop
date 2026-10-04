import mongoose, { Schema, Document } from 'mongoose';

export type ProductType = 'digital' | 'dropship';

// Interface para el Producto
export interface IProduct extends Document {
  name: string;
  slug: string;
  sku?: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  productType: ProductType;
  images: string[];
  stock: number;
  category: string;
  // Campos específicos de Productos Digitales
  digitalAsset?: {
    fileUrl?: string;
    fileSize?: string;
    fileType?: string;
    downloadLimit?: number;
    licenseKey?: string;
  };
  // Campos específicos de Dropshipping
  dropshipInfo?: {
    supplierSku?: string;
    supplierUrl?: string;
    estimatedDeliveryDays?: string;
    shippingOrigin?: string;
    weightKg?: number;
  };
  flowerType?: string;
  dimensions?: string;
  careInstructions?: string;
  addons?: mongoose.Types.ObjectId[] | any[];
  badge?: string;
  isActive?: boolean;
  flowerCount?: number;
  bouquetType?: string;
  features?: any[];
  seo?: {
    title?: string;
    description?: string;
  };
  createdAt?: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sku: { type: String, default: "" },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number, default: 0 },
  productType: { type: String, enum: ['digital', 'dropship'], default: 'digital' },
  images: [{ type: String }],
  stock: { type: Number, default: 0 },
  category: { type: String, required: true },
  digitalAsset: {
    fileUrl: { type: String, default: "" },
    fileSize: { type: String, default: "" },
    fileType: { type: String, default: "" },
    downloadLimit: { type: Number, default: 10 },
    licenseKey: { type: String, default: "" }
  },
  dropshipInfo: {
    supplierSku: { type: String, default: "" },
    supplierUrl: { type: String, default: "" },
    estimatedDeliveryDays: { type: String, default: "7-12 días hábiles" },
    shippingOrigin: { type: String, default: "Almacén Internacional" },
    weightKg: { type: Number, default: 0 }
  },
  flowerType: { type: String, default: "" },
  dimensions: { type: String, default: "" },
  careInstructions: { type: String, default: "" },
  addons: [{ type: Schema.Types.ObjectId, ref: 'Addon' }],
  badge: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  flowerCount: { type: Number, default: 0 },
  bouquetType: { type: String, default: "" },
  features: [{ label: String, value: String }],
  seo: {
    title: { type: String },
    description: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

ProductSchema.index({ productType: 1, isActive: 1 });

// Índices de Base de Datos para Consultas Ultrarrápidas y Menor Consumo de RAM (slug ya es único en el esquema)
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ isActive: 1, createdAt: -1 });

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normaliza acentos
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .replace(/\s+/g, '-') // Reemplaza espacios por -
    .replace(/[^\w\-]+/g, '') // Elimina caracteres especiales
    .replace(/\-\-+/g, '-') // Evita guiones múltiples --
    .replace(/^-+/, '') // Quita guiones iniciales
    .replace(/-+$/, ''); // Quita guiones finales
}

// Middleware para generar slug si cambia el nombre
ProductSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    const name = this.get('name') as string;
    this.set('slug', slugify(name));
  }
  next();
});

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
