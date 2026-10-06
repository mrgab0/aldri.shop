import mongoose, { Schema, Document } from "mongoose";

export interface ILandingPage extends Document {
  title: string;
  subdomain: string; // Ej: "cargador-mag" -> cargador-mag.aldri.shop o aldri.shop/l/cargador-mag
  productId?: mongoose.Types.ObjectId;
  headline: string;
  subheadline: string;
  heroBadge?: string;
  promoPrice?: number;
  originalPrice?: number;
  discountPercentage?: number;
  countdownMinutes?: number;
  benefits: Array<{ title: string; description: string; icon?: string }>;
  features: string[];
  reviews: Array<{ name: string; location: string; rating: number; comment: string }>;
  faqs: Array<{ question: string; answer: string }>;
  customImages?: string[];
  ctaText: string;
  ctaType: "checkout" | "whatsapp";
  whatsappMessage?: string;
  themeColor: string; // Hexadecimal, ej: "#6366F1" o "#163422"
  isActive: boolean;
  viewsCount: number;
  clicksCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const LandingPageSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subdomain: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, "El subdominio solo puede contener letras minúsculas, números y guiones"],
    },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    headline: { type: String, required: true },
    subheadline: { type: String, default: "" },
    heroBadge: { type: String, default: "🔥 Oferta Especial de Lanzamiento" },
    promoPrice: { type: Number },
    originalPrice: { type: Number },
    discountPercentage: { type: Number, default: 40 },
    countdownMinutes: { type: Number, default: 15 },
    benefits: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, default: "CheckCircle" },
      },
    ],
    features: [{ type: String }],
    reviews: [
      {
        name: { type: String, required: true },
        location: { type: String, default: "Cliente Verificado" },
        rating: { type: Number, default: 5 },
        comment: { type: String, required: true },
      },
    ],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    customImages: [{ type: String }],
    ctaText: { type: String, default: "¡Comprar Ahora con Descuento! ⚡" },
    ctaType: { type: String, enum: ["checkout", "whatsapp"], default: "checkout" },
    whatsappMessage: { type: String, default: "¡Hola! Quiero ordenar la oferta especial de la landing page." },
    themeColor: { type: String, default: "#6366F1" },
    isActive: { type: Boolean, default: true },
    viewsCount: { type: Number, default: 0 },
    clicksCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const LandingPage = mongoose.models.LandingPage || mongoose.model<ILandingPage>("LandingPage", LandingPageSchema);
