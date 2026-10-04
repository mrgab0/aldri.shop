import mongoose, { Schema, Document } from "mongoose";

export interface ISiteConfig extends Document {
  key: string; // "global"
  heroTitle: string;
  heroSlogan: string;
  heroButtonText: string;
  footerTitle: string;
  footerSlogan: string;
  footerCopyright: string;

  // Personalización del Home & Cuadrícula de Productos
  productColumnsDesktop?: number; // 3, 4, o 5 columnas
  productColumnsMobile?: number;  // 1 o 2 columnas

  // Identidad de Marca y Menú de Navegación
  logoUrl?: string;
  brandSlogan?: string;
  menuHomeLabel?: string;
  menuCatalogLabel?: string;
  menuTrackingLabel?: string;
  menuAboutLabel?: string;
  menuContactLabel?: string;
  primaryColor?: string;

  // Redes Sociales en Cabecera
  enableHeaderSocials?: boolean;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  whatsappUrl?: string;

  // Módulo Social de Instagram / TikTok (Pre-Footer)
  enableSocialFeed?: boolean;
  socialFeedTitle?: string;
  socialEmbedHtml?: string;

  // Módulo de Reseñas / Opiniones & Trustpilot (Pre-Footer)
  enableReviewsSection?: boolean;
  reviewsTitle?: string;
  reviewsRatingScore?: string;
  reviewsCountText?: string;
  trustpilotWidgetHtml?: string;

  // Módulo de iFrames / Widgets Personalizados
  enableCustomIframe?: boolean;
  customIframeTitle?: string;
  customIframeHtml?: string;

  // Módulo de Chatbot Inteligente Dialogflow CX
  enableChatbot?: boolean;
  dialogflowAgentId?: string;
  dialogflowProjectId?: string;
  dialogflowLocation?: string;
  dialogflowLanguageCode?: string;
  dialogflowChatTitle?: string;

  // Campos de 2FA (Seguridad de Dos Factores)
  twoFactorMode?: "none" | "pin" | "totp";
  twoFactorPin?: string;
  twoFactorSecret?: string;

  // Código OTP de rescate por email de emergencia
  rescueOtpCode?: string;
  rescueOtpExpiresAt?: Date;

  // Campos de Optimización SEO y Google Maps
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  googleSiteVerification?: string;
  bingSiteVerification?: string;
  googleAnalyticsId?: string;
  businessName?: string;
  businessPhone?: string;
  businessAddress?: string;
  businessCity?: string;

  updatedAt: Date;
}

const SiteConfigSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true, default: "global" },
  heroTitle: { type: String, default: "Aldri Shop" },
  heroSlogan: { type: String, default: "Tu tienda online de productos digitales de alta demanda y novedades exclusivas en dropshipping." },
  heroButtonText: { type: String, default: "Explorar Productos" },
  footerTitle: { type: String, default: "Aldri Shop" },
  footerSlogan: { type: String, default: "Innovación digital y productos exclusivos con envío directo a tu hogar." },
  footerCopyright: { type: String, default: "© 2026 Aldri Shop. Todos los derechos reservados." },

  // Personalización del Home & Cuadrícula (Por defecto 3 columnas en escritorio = Preservación 100%)
  productColumnsDesktop: { type: Number, default: 3 },
  productColumnsMobile: { type: Number, default: 2 },

  // Identidad de Marca y Menú
  logoUrl: { type: String, default: "/logo.png" },
  brandSlogan: { type: String, default: "Productos Digitales & Dropshipping Global" },
  menuHomeLabel: { type: String, default: "Inicio" },
  menuCatalogLabel: { type: String, default: "Catálogo" },
  menuTrackingLabel: { type: String, default: "📦 Rastreo" },
  menuAboutLabel: { type: String, default: "Nosotros" },
  menuContactLabel: { type: String, default: "Contacto" },
  primaryColor: { type: String, default: "#6366F1" },

  // Redes Sociales en Cabecera
  enableHeaderSocials: { type: Boolean, default: true },
  facebookUrl: { type: String, default: "https://facebook.com" },
  instagramUrl: { type: String, default: "https://instagram.com" },
  tiktokUrl: { type: String, default: "https://tiktok.com" },
  whatsappUrl: { type: String, default: "" },

  // Módulo Social Pre-Footer (Incrustados Instagram/TikTok)
  enableSocialFeed: { type: Boolean, default: true },
  socialFeedTitle: { type: String, default: "Síguenos en nuestras redes @aldrishop 🚀" },
  socialEmbedHtml: { type: String, default: "" },

  // Módulo de Reseñas / Opiniones & Trustpilot (Pre-Footer)
  enableReviewsSection: { type: Boolean, default: true },
  reviewsTitle: { type: String, default: "Lo que dicen nuestros clientes ⭐⭐⭐⭐⭐" },
  reviewsRatingScore: { type: String, default: "4.9 / 5.0" },
  reviewsCountText: { type: String, default: "+250 Opiniones Verificadas" },
  trustpilotWidgetHtml: { type: String, default: "" },

  // Módulo de iFrames Personalizados
  enableCustomIframe: { type: Boolean, default: false },
  customIframeTitle: { type: String, default: "Novedades & Promociones Destacadas" },
  customIframeHtml: { type: String, default: "" },

  // Módulo de Chatbot Inteligente Dialogflow CX
  enableChatbot: { type: Boolean, default: false },
  dialogflowAgentId: { type: String, default: "" },
  dialogflowProjectId: { type: String, default: "" },
  dialogflowLocation: { type: String, default: "us-central1" },
  dialogflowLanguageCode: { type: String, default: "es" },
  dialogflowChatTitle: { type: String, default: "Asistente • Aldri Shop 🤖" },

  twoFactorMode: { type: String, default: "none" },
  twoFactorPin: { type: String, default: "" },
  twoFactorSecret: { type: String, default: "" },

  rescueOtpCode: { type: String, default: "" },
  rescueOtpExpiresAt: { type: Date, default: null },

  // Campos SEO por defecto
  seoTitle: { type: String, default: "Aldri Shop | Productos Digitales & Dropshipping" },
  seoDescription: { type: String, default: "Descubre recursos digitales de entrega inmediata y productos seleccionados en tendencia con envío a tu puerta." },
  seoKeywords: { type: String, default: "productos digitales, software, ebooks, cursos, dropshipping, compras online, aldri shop" },
  ogImage: { type: String, default: "/logo.png" },
  googleSiteVerification: { type: String, default: "" },
  bingSiteVerification: { type: String, default: "" },
  googleAnalyticsId: { type: String, default: "" },
  businessName: { type: String, default: "Aldri Shop" },
  businessPhone: { type: String, default: "" },
  businessAddress: { type: String, default: "" },
  businessCity: { type: String, default: "" },

  updatedAt: { type: Date, default: Date.now }
});

export const SiteConfig = mongoose.models.SiteConfig || mongoose.model<ISiteConfig>("SiteConfig", SiteConfigSchema);
