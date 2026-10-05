import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product, slugify } from '@/lib/models/Product';

const DEMO_PRODUCTS = [
  // --- PRODUCTOS DIGITALES ---
  {
    name: "Notion Ultimate Business & Life OS (2026)",
    category: "Productividad & Negocios",
    price: 29.99,
    compareAtPrice: 59.99,
    productType: "digital",
    stock: 9999,
    sku: "ALDR-DIG-NOTION",
    badge: "Top Seller ⚡",
    images: [
      "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80",
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80"
    ],
    digitalAsset: {
      fileUrl: "https://aldri.shop/downloads/notion-ultimate-os-v2.zip",
      fileSize: "12 MB",
      fileType: "ZIP + Guía PDF",
      downloadLimit: 15,
      licenseKey: "ALDR-NOTION-2026-VIP"
    },
    features: [
      { label: "Formato", value: "Plantilla Notion + PDF" },
      { label: "Compatibilidad", value: "Web, Mac, Windows, iOS, Android" },
      { label: "Actualizaciones", value: "De por vida incluidas" }
    ],
    description: "Sistema todo en uno para gestionar proyectos, finanzas personales, CRM de clientes y hábitos diarios en Notion. Incluye video tutorial y soporte prioritario."
  },
  {
    name: "CyberShield VPN & Anti-Malware Pro (1 Año / 5 Dispositivos)",
    category: "Software & Seguridad",
    price: 19.99,
    compareAtPrice: 49.99,
    productType: "digital",
    stock: 500,
    sku: "ALDR-DIG-CYBER",
    badge: "80% OFF 🔥",
    images: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"
    ],
    digitalAsset: {
      fileUrl: "https://aldri.shop/downloads/cybershield-setup.exe",
      fileSize: "48 MB",
      fileType: "EXE / DMG",
      downloadLimit: 10,
      licenseKey: "CS-PRO-9842-8819-KEY"
    },
    features: [
      { label: "Duración", value: "12 meses completos" },
      { label: "Dispositivos", value: "Hasta 5 simultáneos" },
      { label: "Cifrado", value: "AES-256 militar" }
    ],
    description: "Protección de privacidad de nivel militar con servidores de alta velocidad en 60 países. Bloquea anuncios, rastreadores y malware con activación instantánea."
  },
  {
    name: "Creator Studio Suite: 200+ Lightroom Presets & 4K Cinema LUTs",
    category: "Recursos Creativos",
    price: 24.99,
    compareAtPrice: 65.00,
    productType: "digital",
    stock: 9999,
    sku: "ALDR-DIG-CREATOR",
    badge: "Bestseller 📸",
    images: [
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80"
    ],
    digitalAsset: {
      fileUrl: "https://aldri.shop/downloads/creator-suite-2026.zip",
      fileSize: "320 MB",
      fileType: "DNG, XMP, CUBE",
      downloadLimit: 20,
      licenseKey: "ALDR-CREATOR-STUDIO-PRO"
    },
    features: [
      { label: "Presets", value: "150 Lightroom Móvil & Desktop" },
      { label: "LUTs", value: "50+ Cinema 4K (.cube)" },
      { label: "Uso", value: "Comercial ilimitado" }
    ],
    description: "Transforma tus fotos y videos al estilo cinematográfico en un solo clic. Ideal para creadores de Instagram Reels, TikTok, YouTube y fotografía profesional."
  },
  {
    name: "Master AI & E-commerce Blueprint 2026 (Guía Interactiva & Prompts)",
    category: "Ebooks & Educación",
    price: 14.99,
    compareAtPrice: 39.99,
    productType: "digital",
    stock: 9999,
    sku: "ALDR-DIG-EBOOK",
    badge: "Nuevo 🚀",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80"
    ],
    digitalAsset: {
      fileUrl: "https://aldri.shop/downloads/ecommerce-ai-blueprint.pdf",
      fileSize: "18 MB",
      fileType: "PDF Interactivo",
      downloadLimit: 10,
      licenseKey: "ALDR-BOOK-AI-2026"
    },
    features: [
      { label: "Páginas", value: "128 páginas ilustradas" },
      { label: "Prompts", value: "+300 prompts probados" },
      { label: "Formato", value: "PDF interactivo para iPad / PC" }
    ],
    description: "La guía definitiva para construir, escalar y automatizar tiendas online utilizando Inteligencia Artificial. Incluye librerías de prompts, casos de estudio y checklists operativos."
  },

  // --- PRODUCTOS DROPSHIPPING ---
  {
    name: "Estación de Carga Magnética 3 en 1 MagSafe Plegable",
    category: "Tech Gadgets",
    price: 44.99,
    compareAtPrice: 79.99,
    productType: "dropship",
    stock: 120,
    sku: "ALDR-DROP-MAG3IN1",
    badge: "Tendencia ⚡",
    images: [
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80"
    ],
    dropshipInfo: {
      supplierSku: "CJ-MAG-FOLD-3IN1",
      supplierUrl: "https://cjdropshipping.com/product/magnetic-wireless-charger",
      estimatedDeliveryDays: "7-10 días hábiles",
      shippingOrigin: "Almacén Internacional Express",
      weightKg: 0.25
    },
    features: [
      { label: "Potencia", value: "15W Carga Rápida" },
      { label: "Compatibilidad", value: "iPhone, Apple Watch, AirPods" },
      { label: "Diseño", value: "Plegable de viaje en aluminio" }
    ],
    description: "Carga tu teléfono, reloj y audífonos al mismo tiempo sin cables enredados. Diseño ultra-compacto plegable ideal para el escritorio o para llevar de viaje."
  },
  {
    name: "Barra de Luz para Monitor LED con Control Inalámbrico Touch",
    category: "Workspace Setup",
    price: 38.50,
    compareAtPrice: 69.00,
    productType: "dropship",
    stock: 85,
    sku: "ALDR-DROP-LIGHTBAR",
    badge: "Top Desk 💡",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80"
    ],
    dropshipInfo: {
      supplierSku: "CJ-LIGHT-BAR-WIRELESS",
      supplierUrl: "https://cjdropshipping.com/product/monitor-screen-light-bar",
      estimatedDeliveryDays: "7-12 días hábiles",
      shippingOrigin: "Almacén Internacional",
      weightKg: 0.45
    },
    features: [
      { label: "Iluminación", value: "CRI > 95 sin reflejo en pantalla" },
      { label: "Control", value: "Puck giratorio inalámbrico 2.4GHz" },
      { label: "Montaje", value: "Contrapeso magnético universal" }
    ],
    description: "Ilumina tu espacio de trabajo sin provocar reflejos en la pantalla. Reduce el cansancio ocular durante largas jornadas de trabajo o estudio con control de temperatura de color."
  },
  {
    name: "Soporte de Cámara con Seguimiento Facial 360° por IA",
    category: "Creadores & Video",
    price: 32.00,
    compareAtPrice: 59.99,
    productType: "dropship",
    stock: 95,
    sku: "ALDR-DROP-AITRACK",
    badge: "Viral TikTok 🎬",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80"
    ],
    dropshipInfo: {
      supplierSku: "CJ-AI-TRACK360",
      supplierUrl: "https://cjdropshipping.com/product/ai-auto-tracking-phone-holder",
      estimatedDeliveryDays: "8-12 días hábiles",
      shippingOrigin: "Almacén Express",
      weightKg: 0.3
    },
    features: [
      { label: "Lente IA", value: "Reconocimiento sin app requerida" },
      { label: "Rotación", value: "360 grados continua" },
      { label: "Batería", value: "Hasta 8 horas recargable USB-C" }
    ],
    description: "Tu camarógrafo personal automático. Sigue tus movimientos suavemente en 360 grados sin necesidad de instalar apps ni sincronizar Bluetooth. Enciende y graba."
  },
  {
    name: "Mini Impresora Térmica Portátil de Bolsillo Bluetooth",
    category: "Gadgets & Accesorios",
    price: 27.99,
    compareAtPrice: 49.99,
    productType: "dropship",
    stock: 140,
    sku: "ALDR-DROP-PRINTER",
    badge: "Favorito 🖨️",
    images: [
      "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&q=80",
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&q=80"
    ],
    dropshipInfo: {
      supplierSku: "CJ-THERMAL-PRNT",
      supplierUrl: "https://cjdropshipping.com/product/mini-pocket-thermal-printer",
      estimatedDeliveryDays: "7-12 días hábiles",
      shippingOrigin: "Almacén Internacional",
      weightKg: 0.2
    },
    features: [
      { label: "Tecnología", value: "Térmica directa (Sin tinta)" },
      { label: "Conexión", value: "Bluetooth iOS & Android" },
      { label: "Resolución", value: "203 DPI alta definición" }
    ],
    description: "Imprime notas, listas de tareas, etiquetas, recibos y fotos monocromáticas desde tu teléfono en segundos. No requiere tinta ni tóner, solo papel térmico."
  }
];

export async function POST() {
  try {
    await dbConnect();

    const createdProducts = [];

    for (const item of DEMO_PRODUCTS) {
      const baseSlug = slugify(item.name);
      
      // Upsert por slug o sku para evitar duplicados en re-ejecuciones
      const updated = await Product.findOneAndUpdate(
        { $or: [{ slug: baseSlug }, { sku: item.sku }] },
        {
          ...item,
          slug: baseSlug,
          isActive: true
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      createdProducts.push(updated);
    }

    return NextResponse.json({
      success: true,
      message: `Se sincronizaron ${createdProducts.length} productos de catálogo (4 Digitales + 4 Dropshipping)`,
      count: createdProducts.length,
      products: createdProducts.map(p => ({
        id: p._id,
        name: p.name,
        productType: p.productType,
        price: p.price,
        category: p.category
      }))
    });
  } catch (error) {
    console.error("Error al sembrar productos:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error al sembrar productos"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
