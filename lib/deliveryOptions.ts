export interface DeliveryOption {
  id: string;
  title: string;
  description: string;
  estimatedTimeMinutes: number; // Para calculo o orden
  estimatedTimeLabel: string;
  extraPrice: number; // Precio adicional base en $ USD
  pricePerMile: number; // Costo por milla en $ USD
  badge?: string;
  iconName: string;
  isActive: boolean;
}

export const DEFAULT_DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: "digital_instant",
    title: "Descarga Digital Instantánea ⚡",
    description: "Acceso inmediato 24/7 con enlace seguro por email y en pantalla.",
    estimatedTimeMinutes: 1,
    estimatedTimeLabel: "Inmediato (0 minutos)",
    extraPrice: 0.00,
    pricePerMile: 0.00,
    badge: "Instantáneo ⚡",
    iconName: "Zap",
    isActive: true,
  },
  {
    id: "dropship_standard",
    title: "Envío Dropshipping Estándar Internacional 🚚",
    description: "Envío asegurado internacional con seguimiento en vivo vía 17Track.",
    estimatedTimeMinutes: 10080, // 7 días
    estimatedTimeLabel: "7 - 12 Días Hábiles",
    extraPrice: 0.00,
    pricePerMile: 0.00,
    badge: "Envío Gratis 🌍",
    iconName: "Truck",
    isActive: true,
  },
  {
    id: "dropship_express",
    title: "Envío Dropshipping Express Prioritario 🚀",
    description: "Procesamiento y despacho aéreo prioritario con transportadora premium.",
    estimatedTimeMinutes: 4320, // 3 días
    estimatedTimeLabel: "3 - 5 Días Hábiles",
    extraPrice: 9.99,
    pricePerMile: 0.00,
    badge: "Prioritario 🔥",
    iconName: "Rocket",
    isActive: true,
  },
];
