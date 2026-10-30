"use client";

import React, { useState, useMemo, useCallback } from "react";
import { IAddon } from "@/lib/models/Addon";
import { Sparkles, Check, MessageSquare, ChevronDown, ChevronUp, Gift, Heart, Palette, Feather, Edit3 } from "lucide-react";

export interface SelectedAddonState {
  addonId: string;
  name?: string;
  price?: number;
  value?: string;
  customText?: string;
}

interface AddonSelectionProps {
  addons: IAddon[];
  onSelectionChange: (selectedAddons: SelectedAddonState[]) => void;
}

const categoryIcons: Record<string, any> = {
  "Chocolates & Dulces": Gift,
  "Peluches & Globos": Heart,
  "Personalización & Tarjetas": MessageSquare,
  "Decoración & Lazos": Feather,
  "Colores & Papeles": Palette,
};

export const AddonSelection = React.memo(({ addons, onSelectionChange }: AddonSelectionProps) => {
  const [selected, setSelected] = useState<SelectedAddonState[]>([]);
  
  // Agrupar adicionales por categoría interna (memoizado)
  const groupedAddons = useMemo(() => {
    return addons.reduce((acc, addon) => {
      const category = addon.category || "Otros Complementos";
      if (!acc[category]) acc[category] = [];
      acc[category].push(addon);
      return acc;
    }, {} as Record<string, IAddon[]>);
  }, [addons]);

  // Pestañas / Acordeones abiertos (por defecto abrimos el primero)
  const [openCategories, setOpenCategories] = useState<string[]>(() => Object.keys(groupedAddons).slice(0, 1));

  const toggleCategoryAccordion = useCallback((cat: string) => {
    setOpenCategories((prev) => 
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }, []);

  const toggleCheckbox = useCallback((addon: IAddon) => {
    const addonIdStr = addon._id.toString();
    setSelected((prev) => {
      const exists = prev.find((s) => s.addonId === addonIdStr);
      const nextSelection = exists
        ? prev.filter((s) => s.addonId !== addonIdStr)
        : [...prev, { addonId: addonIdStr, name: addon.name, price: addon.price, customText: "" }];
      onSelectionChange(nextSelection);
      return nextSelection;
    });
  }, [onSelectionChange]);

  const handleCustomTextChange = (addonIdStr: string, customText: string) => {
    const nextSelection = selected.map((s) =>
      s.addonId === addonIdStr ? { ...s, customText } : s
    );
    setSelected(nextSelection);
    onSelectionChange(nextSelection);
  };

  const handleSelectOption = (addon: IAddon, val: string) => {
    const addonIdStr = addon._id.toString();
    const existing = selected.find((s) => s.addonId === addonIdStr);
    const filtered = selected.filter((s) => s.addonId !== addonIdStr);
    const nextSelection = val 
      ? [...filtered, { addonId: addonIdStr, name: `${addon.name}: ${val}`, value: val, price: addon.price, customText: existing?.customText || "" }] 
      : filtered;
    
    setSelected(nextSelection);
    onSelectionChange(nextSelection);
  };

  const handleTextInput = (addon: IAddon, text: string) => {
    const addonIdStr = addon._id.toString();
    const filtered = selected.filter((s) => s.addonId !== addonIdStr);
    const nextSelection = text.trim() 
      ? [...filtered, { addonId: addonIdStr, name: `${addon.name}`, value: text, customText: text, price: addon.price }] 
      : filtered;
    
    setSelected(nextSelection);
    onSelectionChange(nextSelection);
  };

  return (
    <div className="space-y-3">
      {Object.entries(groupedAddons).map(([category, items]) => {
        const isOpen = openCategories.includes(category);
        const IconComponent = categoryIcons[category] || Sparkles;

        // Cuántos adicionales de esta categoría están seleccionados por el cliente
        const categorySelectedCount = items.filter((item) =>
          selected.some((s) => s.addonId === item._id.toString())
        ).length;

        return (
          <div
            key={category}
            className="glass-card-radical rounded-2xl border border-white/10 shadow-lg overflow-hidden transition-all duration-300"
          >
            {/* CABECERA DE CASCADA / ACORDEÓN DESPLEGABLE */}
            <button
              type="button"
              onClick={() => toggleCategoryAccordion(category)}
              className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-colors ${categorySelectedCount > 0 ? "glass-btn-gold text-black" : "glass-pill text-[#F2CA50]"}`}>
                  <IconComponent size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white leading-none">{category}</h4>
                  <span className="text-[11px] text-zinc-400 font-medium block mt-1">
                    {categorySelectedCount > 0 ? (
                      <strong className="text-[#F2CA50]">{categorySelectedCount} seleccionado(s)</strong>
                    ) : (
                      `${items.length} opción(es) disponible(s)`
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {categorySelectedCount > 0 && (
                  <span className="glass-btn-gold text-black text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    {categorySelectedCount}
                  </span>
                )}
                <div className="p-1 text-zinc-400">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>
            </button>

            {/* CONTENIDO DESPLEGABLE DE CASCADA */}
            {isOpen && (
              <div className="p-4 pt-1 border-t border-white/10 space-y-3 bg-[#0A0A0E]/60 animate-in fade-in duration-300">
                {items.map((addon) => {
                  const addonIdStr = addon._id.toString();
                  const selectedObj = selected.find((s) => s.addonId === addonIdStr);
                  const isSelected = !!selectedObj;

                  // 1. TIPO SELECCIÓN DE OPCIÓN (SWATCHES / DROPDOWN)
                  if (addon.type === "select" && addon.options && addon.options.length > 0) {
                    const currentSelectedVal = selectedObj?.value || "";

                    return (
                      <div key={addonIdStr} className="glass-pill p-3.5 rounded-xl border border-white/10 space-y-2 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-white">{addon.name}</span>
                          {addon.price > 0 && <span className="font-black text-xs text-[#F2CA50]">+${addon.price.toFixed(2)}</span>}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          {addon.options.map((opt) => (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => handleSelectOption(addon, currentSelectedVal === opt ? "" : opt)}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                                currentSelectedVal === opt
                                  ? "glass-btn-gold text-black font-extrabold shadow-md scale-105"
                                  : "glass-pill text-zinc-300 border-white/15 hover:border-[#F2CA50]/40 hover:text-white"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>

                        {/* Entrada opcional de dedicatoria/texto si está seleccionado */}
                        {isSelected && (
                          <div className="mt-2 pt-2 border-t border-white/10">
                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 mb-1">
                              <Edit3 size={12} className="text-[#F2CA50]" />
                              <span>Nota o Dedicatoria para este adicional (opcional):</span>
                            </label>
                            <input
                              type="text"
                              value={selectedObj?.customText || ""}
                              onChange={(e) => handleCustomTextChange(addonIdStr, e.target.value)}
                              placeholder="Ej: Escribir Feliz Cumpleaños en la cinta..."
                              className="w-full p-2.5 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#F2CA50]"
                            />
                          </div>
                        )}
                      </div>
                    );
                  }

                  // 2. TIPO MENSAJE DE TEXTO PERSONALIZADO (ej: Tarjeta de Dedicatoria)
                  if (addon.type === "text") {
                    const currentText = selectedObj?.value || "";

                    return (
                      <div key={addonIdStr} className="glass-pill p-3.5 rounded-xl border border-white/10 space-y-2 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-white flex items-center gap-1.5">
                            <MessageSquare size={14} className="text-[#F2CA50]" /> {addon.name}
                          </span>
                          {addon.price > 0 && <span className="font-black text-xs text-[#F2CA50]">+${addon.price.toFixed(2)}</span>}
                        </div>

                        <textarea
                          value={currentText}
                          onChange={(e) => handleTextInput(addon, e.target.value)}
                          placeholder="Escribe aquí tu mensaje especial de dedicatoria..."
                          className="w-full p-2.5 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#F2CA50] h-20"
                        />
                      </div>
                    );
                  }

                  // 3. TIPO CHECKBOX / EXTRA CON FOTO IMAGEKIT (ej: Ferrero Rocher, Peluche, Globo)
                  return (
                    <div
                      key={addonIdStr}
                      className={`p-3.5 rounded-xl border transition-all shadow-sm ${
                        isSelected ? "border-[#F2CA50] bg-amber-500/10 shadow-[0_0_15px_rgba(242,202,80,0.15)]" : "border-white/10 hover:border-white/20 bg-white/5"
                      }`}
                    >
                      <div 
                        onClick={() => toggleCheckbox(addon)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg bg-[#0E0E12] border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {addon.image ? (
                              <img src={addon.image} alt={addon.name} className="w-full h-full object-cover" />
                            ) : (
                              <Sparkles size={16} className="text-[#F2CA50]" />
                            )}
                          </div>

                          <div>
                            <span className="font-bold text-xs text-white block">{addon.name}</span>
                            {addon.description && <span className="text-[10px] text-zinc-400 block">{addon.description}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <span className="font-black text-xs text-[#F2CA50]">
                            {addon.price > 0 ? `+$${addon.price.toFixed(2)}` : "Gratis"}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                              isSelected ? "glass-btn-gold text-black border-[#F2CA50]" : "border-white/20 bg-white/5 text-transparent"
                            }`}
                          >
                            {isSelected && <Check size={12} strokeWidth={3} className="text-black" />}
                          </div>
                        </div>
                      </div>

                      {/* Casilla de Dedicatoria/Mensaje para este Adicional al seleccionarlo */}
                      {isSelected && (
                        <div className="mt-3 pt-2.5 border-t border-white/10 animate-in fade-in duration-200">
                          <label className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 mb-1.5">
                            <Edit3 size={12} className="text-[#F2CA50]" />
                            <span>Mensaje o Dedicatoria para este adicional (opcional):</span>
                          </label>
                          <input
                            type="text"
                            value={selectedObj?.customText || ""}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleCustomTextChange(addonIdStr, e.target.value)}
                            placeholder="Ej: Para María, o imprimir dedicatoria especial..."
                            className="w-full p-2.5 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#F2CA50]"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});
