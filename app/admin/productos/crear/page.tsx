"use client";

import { ImageUploader } from "@/components/admin/ImageUploader";
import { FeatureListBuilder } from "@/components/admin/FeatureListBuilder";
import { AdminAddonManager } from "@/components/admin/AdminAddonManager";
import { ProductNameSkuInputs } from "@/components/admin/ProductNameSkuInputs";
import { useState, useEffect } from "react";
import { createProduct, getProductById } from "@/lib/actions/product";
import { getAddons } from "@/lib/actions/addon";
import { CheckCircle2, Eye, Edit3, ArrowLeft, Package, DollarSign, Image as ImageIcon, Flower2, PlusCircle, Sparkles, Tag, Copy } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CrearProductoPage() {
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ success: boolean; id?: string } | null>(null);
  const [addons, setAddons] = useState<any[]>([]);
  const [initialData, setInitialData] = useState<any>(null);
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get("duplicate");

  useEffect(() => {
    async function loadData() {
      const addonsRes = await getAddons();
      if (addonsRes.success && addonsRes.data) {
        setAddons(addonsRes.data);
      }

      if (duplicateId) {
        const prodRes = await getProductById(duplicateId);
        if (prodRes.success && prodRes.data) {
          setInitialData(prodRes.data);
        }
      }
    }
    loadData();
  }, [duplicateId]);

  const [selectedProductType, setSelectedProductType] = useState<string>("digital");

  useEffect(() => {
    if (initialData?.productType) {
      setSelectedProductType(initialData.productType);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createProduct(formData);

    setLoading(false);
    if (result.success) {
      setSuccessData(result);
    } else {
      alert("Hubo un error al guardar el producto.");
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto pb-12">
      {/* Header del Creador */}
      <div className="flex items-center justify-between mb-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin/productos" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1A1C1C]">
              {duplicateId ? "Duplicar Producto" : "Añadir Nuevo Producto"}
            </h1>
            <p className="text-xs text-gray-400">
              {duplicateId
                ? `Creando una copia basada en "${initialData?.name || 'producto'}"`
                : "Completa los detalles de tu nuevo producto digital o dropshipping"}
            </p>
          </div>
        </div>

        {duplicateId && (
          <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
            <Copy size={12} /> Módulo Duplicador
          </span>
        )}
      </div>

      {/* Formulario */}
      <div className={`transition-all duration-500 ${
        successData ? "opacity-0 scale-95 pointer-events-none absolute inset-0" : "opacity-100 scale-100"
      }`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECCIÓN 1: Información Básica y Tipo de Producto */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2 border-b pb-3">
              <Package size={18} className="text-[#FF97A4]" /> Información General
            </h2>

            {/* SELECCIÓN DE TIPO DE PRODUCTO */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700">Tipo de Producto *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProductType("digital")}
                  className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all text-center ${
                    selectedProductType === "digital"
                      ? "border-indigo-600 bg-indigo-50/60 text-indigo-900 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <span className="text-sm font-bold flex items-center gap-1.5">
                    ⚡ Descarga Digital
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Archivos, licencias, cursos o software
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProductType("dropship")}
                  className={`p-3.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all text-center ${
                    selectedProductType === "dropship"
                      ? "border-emerald-600 bg-emerald-50/60 text-emerald-900 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <span className="text-sm font-bold flex items-center gap-1.5">
                    📦 Dropshipping Físico
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Envío físico con tracking y carrier
                  </span>
                </button>
              </div>
              <input type="hidden" name="productType" value={selectedProductType} />
            </div>

            <ProductNameSkuInputs
              key={initialData?._id || duplicateId || "new"}
              initialName={initialData?.name || ""}
              initialSku={initialData?.sku || ""}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Categoría *</label>
                <input
                  name="category"
                  defaultValue={initialData?.category || ""}
                  placeholder="Ej: Software, Plantillas, Gadgets, Moda"
                  className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF97A4]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <Tag size={12} className="text-[#FF97A4]" /> Insignia / Etiqueta Destacada (Opcional)
                </label>
                <input
                  name="badge"
                  defaultValue={initialData?.badge || ""}
                  placeholder="Ej: Bestseller 🌟, ¡Nuevo!, Oferta Especial"
                  className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF97A4]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">Descripción del Producto *</label>
              <textarea
                name="description"
                defaultValue={initialData?.description || ""}
                placeholder="Escribe una descripción completa sobre el producto, características, beneficios y modo de uso..."
                className="p-3 border rounded-xl h-28 focus:outline-none focus:ring-2 focus:ring-[#FF97A4]"
                required
              />
            </div>
          </div>

          {/* SECCIÓN 2: Precio e Inventario */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2 border-b pb-3">
              <DollarSign size={18} className="text-[#FF97A4]" /> Precio y Disponibilidad
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Precio Actual ($ USD) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-gray-400 font-bold">$</span>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="49.99"
                    defaultValue={initialData?.price || ""}
                    className="p-3 pl-8 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#FF97A4] font-bold text-gray-800"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Precio Original / Antes ($ USD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-gray-400 font-bold">$</span>
                  <input
                    name="compareAtPrice"
                    type="number"
                    step="0.01"
                    placeholder="79.99"
                    defaultValue={initialData?.compareAtPrice || ""}
                    className="p-3 pl-8 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-600 line-through"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Stock Inicial *</label>
                <input
                  name="stock"
                  type="number"
                  placeholder="999"
                  defaultValue={initialData?.stock ?? 100}
                  className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF97A4]"
                  required
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN CONFIGURACIÓN ESPECÍFICA (DIGITAL VS DROPSHIPPING) */}
          {selectedProductType === "digital" ? (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2 border-b pb-3 border-indigo-100">
                ⚡ Entrega y Archivos Digitales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-700">URL del Archivo / Enlace de Descarga Directa</label>
                  <input
                    name="digitalFileUrl"
                    defaultValue={initialData?.digitalAsset?.fileUrl || ""}
                    placeholder="https://drive.google.com/... o enlace a S3 / Cloud / ZIP"
                    className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700">Formato del Archivo</label>
                  <input
                    name="digitalFileType"
                    defaultValue={initialData?.digitalAsset?.fileType || ""}
                    placeholder="Ej: ZIP, PDF, MP4, Preset, Software"
                    className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700">Tamaño del Archivo</label>
                  <input
                    name="digitalFileSize"
                    defaultValue={initialData?.digitalAsset?.fileSize || ""}
                    placeholder="Ej: 45 MB, 1.2 GB"
                    className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-700">Clave de Licencia o Código de Activación (Opcional)</label>
                  <input
                    name="digitalLicenseKey"
                    defaultValue={initialData?.digitalAsset?.licenseKey || ""}
                    placeholder="Ej: ALDR-KEY-XXXX-XXXX"
                    className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-2 border-b pb-3 border-emerald-100">
                📦 Logística y Proveedor de Dropshipping
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700">SKU del Proveedor</label>
                  <input
                    name="supplierSku"
                    defaultValue={initialData?.dropshipInfo?.supplierSku || ""}
                    placeholder="Ej: CJ-182948-US"
                    className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700">Origen del Envío</label>
                  <input
                    name="shippingOrigin"
                    defaultValue={initialData?.dropshipInfo?.shippingOrigin || "Almacén Internacional"}
                    placeholder="Ej: USA Warehouse, China Express, Europa"
                    className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-700">URL del Producto en Proveedor (Privado de Gestión)</label>
                  <input
                    name="supplierUrl"
                    defaultValue={initialData?.dropshipInfo?.supplierUrl || ""}
                    placeholder="https://aliexpress.com/item/... o enlace a CJ Dropshipping / Zendrop"
                    className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-700">Tiempo Estimado de Entrega</label>
                  <input
                    name="estimatedDeliveryDays"
                    defaultValue={initialData?.dropshipInfo?.estimatedDeliveryDays || "7-12 días hábiles"}
                    placeholder="Ej: 7-12 días hábiles con carrier tracked"
                    className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN 3: Carga de Imágenes con ImageKit */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2 border-b pb-3">
              <ImageIcon size={18} className="text-[#FF97A4]" /> Galería de Imágenes (ImageKit)
            </h2>
            <ImageUploader defaultImages={initialData?.images || []} maxImages={7} />
          </div>

          {/* SECCIÓN 4: Características Clave */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2 border-b pb-3">
              <Sparkles size={18} className="text-[#FF97A4]" /> Características Destacadas
            </h2>
            <FeatureListBuilder initialFeatures={initialData?.features || []} />
          </div>

          {/* SECCIÓN 5: Adicionales Compatibles */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <AdminAddonManager
              addons={addons}
              selectedIds={initialData?.addons || []}
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#FF97A4] text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-[#B0004A] transition-all shadow-md disabled:bg-gray-400 flex items-center justify-center gap-2 flex-1 md:flex-none"
            >
              {loading ? (
                <span>Guardando Producto...</span>
              ) : (
                <>
                  <PlusCircle size={18} />
                  <span>Publicar Producto</span>
                </>
              )}
            </button>
            <Link
              href="/admin/productos"
              className="bg-gray-100 text-gray-700 px-8 py-3.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>

      {/* Pantalla de Éxito Animada */}
      {successData && (
        <div className="bg-white p-12 rounded-2xl shadow-xl border border-gray-100 text-center animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center space-y-4 my-8">
          <div className="bg-green-100 p-4 rounded-full text-green-600 animate-bounce">
            <CheckCircle2 size={56} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">¡Producto Creado Exitosamente!</h2>
          <p className="text-gray-500 max-w-sm">El producto ya está disponible en el catálogo de tu tienda boutique.</p>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-2 bg-[#1A1C1C] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-black transition-all"
            >
              <Eye size={18} /> Ver Publicación
            </Link>
            <Link
              href={`/admin/productos/editar/${successData.id}`}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
            >
              <Edit3 size={18} /> Editar Producto
            </Link>
            <button
              onClick={() => {
                setSuccessData(null);
                window.location.reload();
              }}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
            >
              <ArrowLeft size={18} /> Crear Otro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
