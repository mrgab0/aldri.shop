"use server";

import dbConnect from "@/lib/db";
import { LandingPage, ILandingPage } from "@/lib/models/LandingPage";
import { Product } from "@/lib/models/Product";
import { revalidatePath } from "next/cache";

export async function getLandingPages() {
  try {
    await dbConnect();
    const landings = await LandingPage.find({})
      .populate("productId", "name price images slug")
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(landings)),
    };
  } catch (error: any) {
    console.error("Error al obtener landing pages:", error);
    return { success: false, error: error.message };
  }
}

export async function getLandingPageBySlug(subdomain: string) {
  try {
    await dbConnect();
    const landing = await LandingPage.findOne({
      subdomain: subdomain.toLowerCase().trim(),
      isActive: true,
    })
      .populate("productId")
      .lean();

    if (!landing) {
      return { success: false, error: "Landing page no encontrada o inactiva." };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(landing)),
    };
  } catch (error: any) {
    console.error("Error al obtener landing page por slug:", error);
    return { success: false, error: error.message };
  }
}

export async function getLandingPageById(id: string) {
  try {
    await dbConnect();
    const landing = await LandingPage.findById(id).lean();
    if (!landing) return { success: false, error: "No encontrada" };
    return { success: true, data: JSON.parse(JSON.stringify(landing)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function checkSubdomainAvailability(subdomain: string, excludeId?: string) {
  try {
    await dbConnect();
    const query: any = { subdomain: subdomain.toLowerCase().trim() };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const exists = await LandingPage.findOne(query).select("_id").lean();
    return { available: !exists };
  } catch (error: any) {
    return { available: false, error: error.message };
  }
}

export async function createLandingPage(data: Partial<ILandingPage>) {
  try {
    await dbConnect();
    const cleanSubdomain = (data.subdomain || "").toLowerCase().trim();

    if (!cleanSubdomain || !/^[a-z0-9-]+$/.test(cleanSubdomain)) {
      return { success: false, error: "El subdominio solo puede contener letras minúsculas, números y guiones." };
    }

    const reserved = ["www", "admin", "api", "shop", "app", "mail", "aldri", "blog"];
    if (reserved.includes(cleanSubdomain)) {
      return { success: false, error: "Este subdominio es una palabra reservada del sistema." };
    }

    const existing = await LandingPage.findOne({ subdomain: cleanSubdomain }).lean();
    if (existing) {
      return { success: false, error: "Este subdominio ya está en uso por otra campaña." };
    }

    const newLanding = await LandingPage.create({
      ...data,
      subdomain: cleanSubdomain,
    });

    revalidatePath("/admin/landings");
    revalidatePath(`/l/${cleanSubdomain}`);
    return { success: true, data: JSON.parse(JSON.stringify(newLanding)) };
  } catch (error: any) {
    console.error("Error al crear landing page:", error);
    return { success: false, error: error.message };
  }
}

export async function updateLandingPage(id: string, data: Partial<ILandingPage>) {
  try {
    await dbConnect();
    const cleanSubdomain = (data.subdomain || "").toLowerCase().trim();

    if (cleanSubdomain) {
      const existing = await LandingPage.findOne({
        subdomain: cleanSubdomain,
        _id: { $ne: id },
      }).lean();
      if (existing) {
        return { success: false, error: "Este subdominio ya está ocupado por otra campaña." };
      }
    }

    const updated: any = await LandingPage.findByIdAndUpdate(
      id,
      { ...data, ...(cleanSubdomain ? { subdomain: cleanSubdomain } : {}) },
      { new: true }
    ).lean();

    if (!updated) return { success: false, error: "Landing page no encontrada." };

    revalidatePath("/admin/landings");
    if (updated.subdomain) revalidatePath(`/l/${updated.subdomain}`);
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Error al actualizar landing page:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteLandingPage(id: string) {
  try {
    await dbConnect();
    const deleted: any = await LandingPage.findByIdAndDelete(id).lean();
    revalidatePath("/admin/landings");
    return { success: true, data: deleted };
  } catch (error: any) {
    console.error("Error al eliminar landing page:", error);
    return { success: false, error: error.message };
  }
}

export async function trackLandingView(subdomain: string) {
  try {
    await dbConnect();
    await LandingPage.updateOne(
      { subdomain: subdomain.toLowerCase().trim() },
      { $inc: { viewsCount: 1 } }
    );
    return { success: true };
  } catch (error: any) {
    return { success: false };
  }
}

export async function trackLandingClick(subdomain: string) {
  try {
    await dbConnect();
    await LandingPage.updateOne(
      { subdomain: subdomain.toLowerCase().trim() },
      { $inc: { clicksCount: 1 } }
    );
    return { success: true };
  } catch (error: any) {
    return { success: false };
  }
}

export async function getProductsForLandingSelector() {
  try {
    await dbConnect();
    const products = await Product.find({ isActive: true })
      .select("_id name price compareAtPrice images description slug category")
      .sort({ createdAt: -1 })
      .lean();
    return { success: true, data: JSON.parse(JSON.stringify(products)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
