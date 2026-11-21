// Definición de tipos oficiales para productos digitales de aldri.shop

export interface DigitalProductItem {
  name: string;
  nameEn: string;
  slug: string;
  sku: string;
  description: string;
  descriptionEn: string;
  price: number;
  compareAtPrice: number;
  productType: "digital";
  images: string[];
  stock: number;
  category: string;
  categoryEn: string;
  badge: string;
  badgeEn: string;
  isActive: boolean;
  features: Array<{ label: string; value: string }>;
  featuresEn: Array<{ label: string; value: string }>;
  digitalAsset: {
    platform: 'Steam' | 'Xbox' | 'PlayStation' | 'PC' | 'Nintendo' | 'Multi';
    keyDeliveryType: 'instant_key' | 'download_link' | 'activation_guide' | 'jit_key';
    fileUrl?: string;
    availableKeys?: string[];
    activationInstructions: string;
    activationInstructionsEn: string;
  };
}
