# Arquitectura Técnica - Aldri Shop (Digital Products & Dropshipping)

## 1. Visión y Modelo de Negocio
**Aldri Shop** es una plataforma de comercio electrónico de alta conversión basada en Next.js (App Router), TypeScript y MongoDB, diseñada para soportar un modelo híbrido:
1. **Productos Digitales**: Cursos, plantillas, software, ebooks y recursos digitales descargables con acceso instantáneo 24/7 y sin costos de envío físico.
2. **Productos Dropshipping**: Artículos físicos en tendencia gestionados mediante proveedores directos, con soporte de dirección de envío, transportadora y números de rastreo.

---

## 2. Sistema de Diseño: Modern Tech & Minimal Commerce
- **Primario:** `#6366F1` (Indigo / Tech Accent) - Acciones y botones de compra.
- **Secundario:** `#10B981` (Emerald) - Badges de "Descarga Inmediata" y "Envío Gratis".
- **Superficie:** `#FFFFFF` (Modo Claro) / `#0F172A` (Modo Oscuro) con soporte de `next-themes`.
- **Texto:** `#0F172A` (Texto principal) y `#64748B` (Subtítulos y notas técnicas).
- **Tipografía:** `Manrope` y `Plus Jakarta Sans`.

---

## 3. Modelo de Datos Mongoose

### Esquema: `Product`
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `name` | String | Nombre del producto. |
| `slug` | String | URL amigable única para SEO. |
| `sku` | String | Código de referencia interno. |
| `description`| String | Descripción con soporte de especificaciones. |
| `price` | Number | Precio de venta en USD. |
| `compareAtPrice` | Number | Precio tachado para ofertas. |
| `productType` | String | `"digital"` o `"dropship"`. |
| `digitalAsset` | Object | `{ fileUrl, fileSize, fileType, downloadLimit, licenseKey }`. |
| `dropshipInfo` | Object | `{ supplierSku, supplierUrl, estimatedDeliveryDays, weightKg }`. |
| `images` | String[] | URLs de imágenes optimizadas. |
| `stock` | Number | Cantidad disponible (-1 = ilimitado para digital). |
| `category` | String | Categoría del catálogo. |
| `isActive` | Boolean | Estado de publicación. |

### Esquema: `Order`
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `orderId` | String | Identificador único de orden (ej: `ALDR-12345`). |
| `customerName` | String | Nombre del comprador. |
| `customerEmail`| String | Email para envío de recibos y enlaces de descarga. |
| `customerPhone`| String | Teléfono / WhatsApp de contacto. |
| `orderType` | String | `"digital"`, `"dropship"`, o `"hybrid"`. |
| `shippingAddress`| Object | Dirección física (solo requerida para dropshipping). |
| `trackingInfo` | Object | `{ carrier, trackingNumber, trackingUrl, estimatedDelivery }`. |
| `digitalDownloads`| Array | Enlaces y tokens de descarga autorizados. |
| `status` | String | `"Pagado"`, `"Procesando"`, `"Enviado"`, `"Entregado"`, etc. |
| `total` | Number | Total cobrado en USD. |

---

## 4. Estructura de Directorios (Next.js App Router)

```text
/aldri.shop
├── app/
│   ├── [locale]/           # Rutas internacionalizadas (es/en)
│   │   ├── page.tsx        # Portada / Landing
│   │   ├── productos/      # Catálogo con filtros digital / físico
│   │   │   └── [slug]/     # Ficha de producto con badge de entrega
│   │   ├── checkout/       # Checkout dinámico (digital vs físico)
│   │   ├── rastreo/        # Tracking de envíos y descargas
│   │   ├── contacto/       # Formulario y soporte
│   │   └── nosotros/       # Sobre Aldri Shop
│   ├── api/                # Endpoints (productos, checkout, rastreo)
│   ├── layout.tsx          # Layout global, PWA y Analytics
│   └── globals.css         # Estilos globales y Tailwind CSS
├── components/
│   ├── shop/               # Carrito, selector de moneda, checkout
│   ├── ui/                 # Componentes accesibles y botones
│   └── pwa/                # Soporte de Progressive Web App
├── lib/
│   ├── models/             # Modelos Mongoose (Product, Order, SiteConfig)
│   ├── db.ts               # Conexión optimizada a MongoDB
│   └── seo-utils.ts        # Marcado estructurado JSON-LD
└── public/                 # Activos estáticos, manifest e iconos
```

---

## 5. Estrategia de Entrega y Automatización
- **Productos Digitales**: Generación automática de enlace seguro de descarga tras confirmación de pago; el usuario puede descargar directamente en la pantalla de confirmación o mediante `/rastreo` con su número de orden y email.
- **Dropshipping**: El pedido almacena la dirección de entrega del cliente; se genera una alerta para procesar el pedido con el proveedor y se actualiza el código de seguimiento de la transportadora.
