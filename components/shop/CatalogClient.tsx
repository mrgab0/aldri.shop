"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/shop/ProductCard/ProductCard";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { Footer } from "@/components/shop/Footer";
import { Search, ArrowUpDown, Sparkles, RefreshCw, Gift, Check, Tag } from "lucide-react";
import { useCart } from "@/components/shop/Cart/CartContext";
import { useTranslations } from "next-intl";
import { WhatsAppButton } from "@/components/shop/WhatsAppButton";

interface CatalogClientProps {
  initialProducts: any[];
  initialAddons?: any[];
}

export function CatalogClient({ initialProducts, initialAddons = [] }: CatalogClientProps) {
  const t = useTranslations("Catalog");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "digital" | "dropship" | "addons">("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const { addToCart } = useCart();
  const [addedAddonId, setAddedAddonId] = useState<string | null>(null);

  // Normalizar items combinados (Productos + Adicionales)
  const combinedItems = useMemo(() => {
    const productsFormatted = initialProducts.map((p) => ({
      ...p,
      itemType: "product",
      productType: p.productType || "digital",
      displayCategory: p.category || "General",
    }));

    const addonsFormatted = initialAddons.map((a) => ({
      ...a,
      itemType: "addon",
      images: [a.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600"],
      displayCategory: a.category ? `Adicional: ${a.category}` : "Adicionales",
    }));

    return [...productsFormatted, ...addonsFormatted];
  }, [initialProducts, initialAddons]);

  // Extraer categorías únicas
  const categories = useMemo(() => {
    const set = new Set<string>();
    combinedItems.forEach((item) => {
      if (item.displayCategory) set.add(item.displayCategory);
    });
    return Array.from(set);
  }, [combinedItems]);

  // Filtrado y Ordenamiento en tiempo real
  const filteredItems = useMemo(() => {
    return combinedItems
      .filter((item) => {
        // Filtro por Tab
        if (activeTab === "digital" && (item.itemType !== "product" || item.productType !== "digital")) return false;
        if (activeTab === "dropship" && (item.itemType !== "product" || item.productType !== "dropship")) return false;
        if (activeTab === "addons" && item.itemType !== "addon") return false;

        // Filtro por Búsqueda
        const matchSearch =
          searchTerm === "" ||
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.displayCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtro por Categoría
        const matchCategory =
          selectedCategory === "all" ||
          item.displayCategory?.toLowerCase() === selectedCategory.toLowerCase();

        return matchSearch && matchCategory;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0;
      });
  }, [combinedItems, activeTab, searchTerm, selectedCategory, sortBy]);

  const handleAddAddonToCart = (addon: any) => {
    addToCart({
      id: addon._id,
      name: addon.name,
      price: addon.price,
      image: addon.images[0],
    });
    setAddedAddonId(addon._id);
    setTimeout(() => setAddedAddonId(null), 2000);
  };

  return (
    <div className="min-h-screen gold-ambient-mesh text-white flex flex-col transition-colors duration-300">
      <ShopHeader />

      <main className="flex-1 py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl space-y-8">
          
          {/* Cabecera Principal del Catálogo */}
          <div className="text-center max-w-3xl mx-auto space-y-3.5">
            <span className="text-[#F2CA50] text-xs font-black uppercase tracking-[0.25em] glass-pill px-4 py-1.5 rounded-full border border-amber-400/30 inline-block shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              {t('headerBadge')}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-black text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              {t('headerTitle')}
            </h1>
            <p className="text-zinc-300 text-sm md:text-base font-normal leading-relaxed">
              {t('headerDesc')}
            </p>
          </div>

          {/* TAB SWITCHER: Todos | Digitales | Dropshipping | Adicionales en Cristal */}
          <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto p-1.5 glass-panel-luxury rounded-full border border-white/10">
            <button
              onClick={() => { setActiveTab("all"); setSelectedCategory("all"); }}
              className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-full text-xs font-black uppercase tracking-wider transition-all text-center cursor-pointer ${
                activeTab === "all"
                  ? "glass-btn-gold text-black shadow-lg"
                  : "text-zinc-400 hover:text-[#F2CA50]"
              }`}
            >
              Todos ({combinedItems.length})
            </button>
            <button
              onClick={() => { setActiveTab("digital"); setSelectedCategory("all"); }}
              className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-full text-xs font-black uppercase tracking-wider transition-all text-center cursor-pointer ${
                activeTab === "digital"
                  ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              ⚡ Digitales ({combinedItems.filter(i => i.productType === 'digital').length})
            </button>
            <button
              onClick={() => { setActiveTab("dropship"); setSelectedCategory("all"); }}
              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-full text-xs font-black uppercase tracking-wider transition-all text-center cursor-pointer ${
                activeTab === "dropship"
                  ? "bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              📦 Físicos ({combinedItems.filter(i => i.productType === 'dropship').length})
            </button>
            {initialAddons.length > 0 && (
              <button
                onClick={() => { setActiveTab("addons"); setSelectedCategory("all"); }}
                className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-full text-xs font-black uppercase tracking-wider transition-all text-center cursor-pointer ${
                  activeTab === "addons"
                    ? "glass-btn-gold text-black shadow-lg"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Extras ({initialAddons.length})
              </button>
            )}
          </div>

          {/* PANEL DE BÚSQUEDA Y FILTROS EN MATERIAL GLASS */}
          <div className="glass-panel-luxury p-5 md:p-6 rounded-3xl border border-white/10 shadow-2xl space-y-5">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              
              {/* Campo de Búsqueda Sencillo */}
              <div className="relative w-full md:w-96">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-11 pr-4 py-3 border border-white/15 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F2CA50] focus:border-[#F2CA50]/50 transition-all bg-white/5 text-white placeholder:text-zinc-500 shadow-inner"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 hover:text-white bg-white/10 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Ordenamiento por Precio */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                  <ArrowUpDown size={14} className="text-[#F2CA50]" /> {t('sortBy')}
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="p-3 border border-white/15 rounded-2xl bg-[#0E0E12] text-xs font-bold text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#F2CA50] cursor-pointer"
                >
                  <option value="featured" className="bg-[#0E0E12] text-white">{t('featured')}</option>
                  <option value="price-asc" className="bg-[#0E0E12] text-white">{t('priceLowHigh')}</option>
                  <option value="price-desc" className="bg-[#0E0E12] text-white">{t('priceHighLow')}</option>
                </select>
              </div>
            </div>

            {/* Pastillas de Categorías (Pills) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-white/10 scrollbar-none">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === "all"
                    ? "glass-btn-gold text-black shadow-lg font-black"
                    : "glass-pill text-zinc-300 hover:text-white hover:border-[#F2CA50]/40"
                }`}
              >
                {t('allCategories')}
              </button>

              {categories.map((cat) => {
                const count = combinedItems.filter((i) => i.displayCategory === cat).length;
                const isSelected = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? "glass-btn-gold text-black shadow-lg font-black"
                        : "glass-pill text-zinc-300 hover:text-white hover:border-[#F2CA50]/40"
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* RESULTADOS DEL CATÁLOGO */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                {t('showingItems')} <strong className="text-white font-black">{filteredItems.length}</strong> {t('itemsInCatalog')}
              </span>
              {(searchTerm || selectedCategory !== "all" || activeTab !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setActiveTab("all");
                  }}
                  className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
                >
                  <RefreshCw size={12} /> {t('clearFilters')}
                </button>
              )}
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => {
                  if (item.itemType === "product") {
                    return (
                      <ProductCard
                        key={item._id}
                        id={item._id}
                        name={item.name}
                        slug={item.slug}
                        price={item.price}
                        category={item.category}
                        badge={item.badge}
                        productType={item.productType}
                        image={item.images[0] || "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&q=80&w=800"}
                      />
                    );
                  }

                  // TARJETA DE ADICIONAL
                  const isAdded = addedAddonId === item._id;

                  return (
                    <div
                      key={item._id}
                      className="glass-card-radical rounded-3xl p-5 flex flex-col justify-between group relative overflow-hidden"
                    >
                      <div className="space-y-3">
                        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#121218]/70 to-[#07070A]/90 p-2 flex items-center justify-center border border-white/10">
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 left-3 glass-btn-gold text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                            <Sparkles size={10} className="text-black" /> {t('addonBadge')}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-black text-[#F2CA50] uppercase tracking-widest block mb-1">
                            {item.category || t('addonBadge')}
                          </span>
                          <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-[#F2CA50] transition-colors">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-xs text-zinc-400 line-clamp-2 mt-1 font-normal">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">Precio</span>
                          <span className="text-xl font-black text-[#F2CA50] font-sans drop-shadow-[0_0_10px_rgba(242,202,80,0.3)]">
                            ${item.price.toFixed(2)} <span className="text-xs font-bold text-zinc-300">USD</span>
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddAddonToCart(item)}
                          className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer ${
                            isAdded
                              ? "bg-emerald-600 text-white"
                              : "glass-btn-gold text-black"
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check size={14} /> {t('added')}
                            </>
                          ) : (
                            <>
                              <Gift size={14} /> {t('addToCart')}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="glass-panel-luxury p-12 rounded-3xl border border-white/10 text-center space-y-4 max-w-lg mx-auto shadow-2xl">
                <Sparkles size={44} className="mx-auto text-[#F2CA50] animate-pulse" />
                <h3 className="text-xl font-bold text-white">{t('noResultsTitle')}</h3>
                <p className="text-xs text-zinc-300">
                  {t('noResultsDesc')}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setActiveTab("all");
                  }}
                  className="glass-btn-gold text-black px-7 py-3 rounded-full font-black text-xs tracking-wider uppercase shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  {t('viewAllBtn')}
                </button>
              </div>
            )}
          </div>

        </div>
      </main>

      <WhatsAppButton phoneNumber="13467392730" />
      <Footer />
    </div>
  );
}
