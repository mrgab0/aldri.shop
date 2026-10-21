import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ProductCard } from "@/components/shop/ProductCard/ProductCard";
import { StickyNav } from "@/components/shop/StickyNav";
import { TrustAnnouncementBar } from "@/components/shop/TrustAnnouncementBar";
import { LuxuryHeroSection } from "@/components/shop/LuxuryHeroSection";
import { BentoEditorialGrid } from "@/components/shop/BentoEditorialGrid";
import { StoreLocationSection } from "@/components/shop/StoreLocationSection";
import dbConnect from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { getSiteConfig } from "@/lib/actions/siteConfig";

const SocialAndReviewsSection = dynamic(
  () => import("@/components/shop/SocialAndReviewsSection").then((m) => m.SocialAndReviewsSection),
  { ssr: true }
);

const CustomIframeSection = dynamic(
  () => import("@/components/shop/CustomIframeSection").then((m) => m.CustomIframeSection),
  { ssr: true }
);


const Footer = dynamic(
  () => import("@/components/shop/Footer").then((m) => m.Footer),
  { ssr: true }
);

export const revalidate = 60;

export default async function Home() {
  let products: any[] = [];
  let siteConfig: any = null;
  let initialSlides: any[] = [];

  try {
    await dbConnect();
    const [productsRaw, siteConfigRes] = await Promise.all([
      Product.find({ isActive: { $ne: false } })
        .sort({ isFeatured: -1, createdAt: -1 })
        .limit(20)
        .lean(),
      getSiteConfig(),
    ]);
    products = JSON.parse(JSON.stringify(productsRaw || []));
    siteConfig = siteConfigRes?.data;
  } catch (err) {
    console.warn("Aviso: No se pudo conectar a la base de datos durante el pre-renderizado estático de Home. Usando valores seguros.", err);
  }

  return (
    <main className="min-h-screen gold-ambient-mesh text-white transition-colors duration-300 relative overflow-x-hidden">
      {/* Barra de anuncio superior (SAME DAY DELIVERY) */}
      <TrustAnnouncementBar phone="(346) 739-2730" />

      {/* Navegación y Menú Principal */}
      <StickyNav siteConfig={siteConfig} />

      {/* Hero Section Editorial de Lujo con tipografía Playfair y badges CRO */}
      <LuxuryHeroSection siteConfig={siteConfig} />

      {/* Bento Grid Editorial Stitch CRO */}
      <BentoEditorialGrid products={products} />

      {/* Módulo iFrame Personalizado (si está activo en el Administrador) */}
      {siteConfig?.enableCustomIframe && (
        <CustomIframeSection
          title={siteConfig.customIframeTitle}
          iframeHtml={siteConfig.customIframeHtml}
        />
      )}

      {/* Vitrina "TENDENCIAS & DESTACADOS" en cuadrícula de 5 columnas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 z-20 relative select-none" data-purpose="product-collection">
        
        {/* Título de Sección con interletreado dorado y cápsula de cristal */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill mb-3 border border-amber-400/30 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2CA50] animate-pulse" />
            <span className="text-[#F2CA50] text-xs font-black uppercase tracking-[0.25em]">
              Catálogo Seleccionado 2026
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-serif text-white tracking-[0.25em] uppercase font-bold drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            T E N D E N C I A S &nbsp; &amp; &nbsp; D E S T A C A D O S
          </h2>
          <p className="text-xs uppercase tracking-widest text-zinc-400 mt-2.5 font-bold">
            Digital Goods &bull; Instant Downloads &bull; Trending Hardware Selection
          </p>
        </div>

        {/* Cuadrícula de 5 columnas en desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductCard 
                key={product._id.toString()}
                id={product._id.toString()}
                name={product.name}
                slug={product.slug}
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                productType={product.productType || "digital"}
                category={product.category}
                badge={product.badge}
                image={product.images && product.images.length > 0 ? product.images[0] : ""}
                secondaryImage={product.images && product.images.length > 1 ? product.images[1] : undefined}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-zinc-400 py-12 font-medium">
              No hay productos disponibles por el momento.
            </p>
          )}
        </div>

        {/* Botón Ver Todo el Catálogo */}
        <div className="mt-14 text-center">
          <Link
            href="/productos"
            className="inline-block glass-btn-gold text-xs font-black tracking-widest uppercase px-12 py-4 rounded-full cursor-pointer select-none"
          >
            Ver Todo el Catálogo
          </Link>
        </div>
      </section>

      {/* Sección de Cobertura Global y Entrega Inmediata */}
      <StoreLocationSection
        phone={siteConfig?.phone || "+1 (800) ALDRI-SHOP"}
        email={siteConfig?.supportEmail || "soporte@aldri.shop"}
        whatsappUrl={siteConfig?.whatsappUrl || "https://wa.me/?text=Hola!%20Quisiera%20información%20sobre%20aldri.shop"}
      />

      {/* Secciones de Reseñas y Redes Sociales */}
      <SocialAndReviewsSection
        enableReviews={siteConfig?.enableReviewsSection !== false}
        reviewsTitle={siteConfig?.reviewsTitle}
        ratingScore={siteConfig?.reviewsRatingScore}
        countText={siteConfig?.reviewsCountText}
        trustpilotWidgetHtml={siteConfig?.trustpilotWidgetHtml}
        enableSocialFeed={siteConfig?.enableSocialFeed !== false}
        socialTitle={siteConfig?.socialFeedTitle || "Síguenos en Redes 🚀"}
        embedHtml={siteConfig?.socialEmbedHtml}
        instagramUrl={siteConfig?.instagramUrl || "https://www.instagram.com/"}
      />

      {/* Footer de Lujo */}
      <Footer siteConfig={siteConfig} />
    </main>
  );
}
