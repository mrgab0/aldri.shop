"use server";

import dbConnect from "@/lib/db";
import { Affiliate, IAffiliate, PayoutMethodType } from "@/lib/models/Affiliate";
import { Order } from "@/lib/models/Order";
import { verifyAdminSession } from "@/lib/adminAuth";

export interface RegisterAffiliateInput {
  name: string;
  email: string;
  phone: string;
  country: string;
  code?: string;
  payoutMethod: PayoutMethodType;
  payoutDetails: string;
}

export async function registerAffiliateAction(input: RegisterAffiliateInput) {
  try {
    await dbConnect();

    const name = (input.name || "").trim();
    const email = (input.email || "").trim().toLowerCase();
    const phone = (input.phone || "").trim();
    const country = (input.country || "Global").trim();
    const payoutMethod = input.payoutMethod || "binance_usdt";
    const payoutDetails = (input.payoutDetails || "").trim();

    if (!name || !email || !phone || !payoutDetails) {
      return { success: false, error: "Por favor completa todos los campos requeridos." };
    }

    // Comprobar si el email ya está registrado
    const existingEmail = await Affiliate.findOne({ email });
    if (existingEmail) {
      return {
        success: false,
        error: "Este correo electrónico ya está registrado en el Programa de Afiliados. Puedes iniciar sesión directamente con tu código o email.",
      };
    }

    // Sanitizar o auto-generar código
    let proposedCode = (input.code || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    if (!proposedCode) {
      const cleanName = name.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 5) || "ALDR";
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      proposedCode = `${cleanName}${randomNum}`;
    }

    // Validar unicidad del código
    const existingCode = await Affiliate.findOne({ code: proposedCode });
    if (existingCode) {
      // Si el usuario especificó uno duplicado
      if (input.code) {
        return {
          success: false,
          error: `El código "${proposedCode}" ya está en uso. Por favor elige otro diferente.`,
        };
      }
      // Si fue auto-generado, añadir sufijo aleatorio
      proposedCode = `${proposedCode}${Math.floor(10 + Math.random() * 89)}`;
    }

    const newAffiliate = await Affiliate.create({
      code: proposedCode,
      name,
      email,
      phone,
      country,
      payoutMethod,
      payoutDetails,
      commissionRate: 0.10, // 10% estándar Amazon Associates
      clicks: 0,
      orderCount: 0,
      totalSales: 0,
      totalCommissionsEarned: 0,
      totalCommissionsPaid: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      data: {
        code: newAffiliate.code,
        name: newAffiliate.name,
        email: newAffiliate.email,
        commissionRate: newAffiliate.commissionRate,
      },
    };
  } catch (error: any) {
    console.error("Error al registrar afiliado:", error);
    return { success: false, error: error.message || "Error al procesar el registro de afiliado." };
  }
}

export async function getAffiliatePortalDataAction(codeOrEmail: string) {
  try {
    await dbConnect();
    const query = (codeOrEmail || "").trim();
    if (!query) {
      return { success: false, error: "Ingresa tu código de afiliado o correo electrónico." };
    }

    const affiliate = await Affiliate.findOne({
      $or: [{ code: query.toUpperCase() }, { email: query.toLowerCase() }],
    }).lean();

    if (!affiliate) {
      return {
        success: false,
        error: "No encontramos ninguna cuenta de afiliado con esos datos. Verifica tu código o regístrate.",
      };
    }

    // Obtener órdenes generadas por este afiliado
    const orders = await Order.find({
      $or: [{ affiliateId: affiliate._id }, { referralCode: affiliate.code }],
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("orderId total commissionAmount commissionStatus createdAt items status")
      .lean();

    const sanitizedOrders = orders.map((o: any) => ({
      orderId: o.orderId,
      total: o.total || 0,
      commissionAmount: o.commissionAmount || 0,
      commissionStatus: o.commissionStatus || "pending",
      status: o.status || "Procesando",
      itemsCount: Array.isArray(o.items) ? o.items.length : 1,
      createdAt: o.createdAt,
    }));

    return {
      success: true,
      affiliate: JSON.parse(JSON.stringify(affiliate)),
      orders: JSON.parse(JSON.stringify(sanitizedOrders)),
    };
  } catch (error: any) {
    console.error("Error al consultar portal de afiliado:", error);
    return { success: false, error: "Error al cargar datos del afiliado." };
  }
}

export async function recordAffiliateClickAction(code: string) {
  try {
    if (!code) return { success: false };
    await dbConnect();
    const normalizedCode = code.trim().toUpperCase();

    const res = await Affiliate.findOneAndUpdate(
      { code: normalizedCode, isActive: true },
      { $inc: { clicks: 1 }, $set: { updatedAt: new Date() } }
    );

    return { success: !!res };
  } catch (err) {
    console.error("Error registrando click de afiliado:", err);
    return { success: false };
  }
}

export async function getAffiliatesAdminAction() {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) {
      return { success: false, error: "No autorizado." };
    }

    await dbConnect();
    const affiliates = await Affiliate.find({}).sort({ createdAt: -1 }).lean();

    let totalAffiliates = affiliates.length;
    let activeAffiliates = 0;
    let totalClicks = 0;
    let totalSales = 0;
    let totalCommissionsEarned = 0;
    let totalCommissionsPaid = 0;

    affiliates.forEach((a: any) => {
      if (a.isActive) activeAffiliates++;
      totalClicks += a.clicks || 0;
      totalSales += a.totalSales || 0;
      totalCommissionsEarned += a.totalCommissionsEarned || 0;
      totalCommissionsPaid += a.totalCommissionsPaid || 0;
    });

    const pendingPayout = Math.max(0, totalCommissionsEarned - totalCommissionsPaid);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(affiliates)),
      summary: {
        totalAffiliates,
        activeAffiliates,
        totalClicks,
        totalSales: Math.round(totalSales * 100) / 100,
        totalCommissionsEarned: Math.round(totalCommissionsEarned * 100) / 100,
        totalCommissionsPaid: Math.round(totalCommissionsPaid * 100) / 100,
        pendingPayout: Math.round(pendingPayout * 100) / 100,
      },
    };
  } catch (error: any) {
    console.error("Error obteniendo afiliados en admin:", error);
    return { success: false, error: "Error al cargar afiliados." };
  }
}

export async function updateAffiliateCommissionRateAction(affiliateId: string, commissionRate: number) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return { success: false, error: "No autorizado." };

    if (commissionRate < 0.01 || commissionRate > 0.50) {
      return { success: false, error: "La tasa de comisión debe estar entre 1% (0.01) y 50% (0.50)." };
    }

    await dbConnect();
    await Affiliate.findByIdAndUpdate(affiliateId, {
      commissionRate,
      updatedAt: new Date(),
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al actualizar comisión." };
  }
}

export async function recordAffiliatePayoutAction(
  affiliateId: string,
  amount: number,
  referenceNote: string
) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return { success: false, error: "No autorizado." };

    if (!amount || amount <= 0) {
      return { success: false, error: "Ingresa un monto válido a liquidar." };
    }

    await dbConnect();
    const aff = await Affiliate.findById(affiliateId);
    if (!aff) return { success: false, error: "Afiliado no encontrado." };

    const noteEntry = `[${new Date().toISOString().split("T")[0]}] Liquidación de $${amount.toFixed(2)} USD. Ref: ${referenceNote || "N/A"}`;
    const newNotes = aff.notes ? `${aff.notes}\n${noteEntry}` : noteEntry;

    aff.totalCommissionsPaid = (aff.totalCommissionsPaid || 0) + amount;
    aff.notes = newNotes;
    aff.updatedAt = new Date();
    await aff.save();

    // Actualizar las órdenes de este afiliado que estaban en 'pending' o 'approved' a 'paid'
    await Order.updateMany(
      { affiliateId: aff._id, commissionStatus: { $in: ["pending", "approved"] } },
      { $set: { commissionStatus: "paid" } }
    );

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al registrar liquidación." };
  }
}

export async function toggleAffiliateStatusAction(affiliateId: string, isActive: boolean) {
  try {
    const isAuth = await verifyAdminSession();
    if (!isAuth) return { success: false, error: "No autorizado." };

    await dbConnect();
    await Affiliate.findByIdAndUpdate(affiliateId, {
      isActive,
      updatedAt: new Date(),
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al actualizar estado del afiliado." };
  }
}
