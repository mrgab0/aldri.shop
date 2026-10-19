import dbConnect from "../lib/db";
import { SiteConfig } from "../lib/models/SiteConfig";

async function run() {
  await dbConnect();
  console.log("Conectado a MongoDB Atlas.");

  const result = await SiteConfig.updateMany(
    { key: "global" },
    {
      $set: {
        heroTitle: "Aldri Shop",
        heroSlogan: "Activos digitales premium, plantillas Notion, LUTs cinematográficos y productos en tendencia.",
        footerTitle: "Aldri Shop",
        footerSlogan: "Tienda Oficial de Activos Digitales & Tech Gadgets • Cobertura Global",
        footerCopyright: "© 2026 Aldri Shop. Todos los derechos reservados.",
        logoUrl: "https://aldri.shop/logo.png",
        brandSlogan: "Activos Digitales & Tech Gadgets • Cobertura Global",
        facebookUrl: "https://www.facebook.com/aldrishop",
        instagramUrl: "https://www.instagram.com/aldri.shop",
        socialFeedTitle: "Síguenos en Instagram @aldri.shop 📸",
        dialogflowChatTitle: "Aldri • Asistente Virtual ⚡",
        seoTitle: "Aldri Shop | Activos Digitales & Tech Gadgets Global",
        seoDescription: "Tienda oficial de activos digitales, plantillas Notion, presets, LUTs cinematográficos y gadgets tecnológicos en tendencia con entrega inmediata.",
        seoKeywords: "activos digitales, notion templates, presets luts, software, tecnologia, gadgets, aldri shop",
        ogImage: "https://aldri.shop/logo.png",
        businessName: "Aldri Shop",
        businessAddress: "Sede Digital Online - Cobertura Global",
        businessCity: "Cobertura Global",
        updatedAt: new Date(),
      }
    },
    { upsert: true }
  );

  console.log("UPDATE COMPLETED SUCCESSFULLY:", result);

  const updatedDoc = await SiteConfig.findOne({ key: "global" }).lean();
  console.log("CURRENT SITECONFIG IN DB:", JSON.stringify(updatedDoc, null, 2));

  process.exit(0);
}

run().catch((err) => {
  console.error("ERROR:", err);
  process.exit(1);
});
