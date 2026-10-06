"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Sparkles, Loader2, Minimize2, Maximize2 } from "lucide-react";

interface CopilotMessage {
  role: "user" | "model";
  text: string;
}

export function AdminCopilotModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      role: "model",
      text: "👋 ¡Hola, Administrador! Soy **Aldri Copilot**, tu asistente ejecutivo. Tengo acceso a las órdenes, stock y leads en tiempo real. ¿En qué te puedo ayudar hoy? Puedes preguntarme:\n- *¿Cuáles son las ventas y órdenes recientes?*\n- *¿Qué productos tienen bajo inventario?*\n- *Redáctame un mensaje para contactar un lead caliente.*"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || loading) return;

    const newMessages: CopilotMessage[] = [...messages, { role: "user", text: textToSend }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const historyToSend = newMessages.slice(-8);
      const res = await fetch("/api/admin/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          history: historyToSend
        })
      });

      const data = await res.json();
      if (data.text) {
        setMessages((prev) => [...prev, { role: "model", text: data.text }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", text: "⚠️ Error obteniendo respuesta del copiloto." }
        ]);
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "⚠️ Error de conexión con el copiloto." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botón Flotante del Copiloto en el Admin */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:scale-105 active:scale-95 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 border-2 border-indigo-300/40 transition-all group"
        title="Abrir Copiloto IA del Negocio"
      >
        <div className="relative">
          <Bot size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full" />
        </div>
        <span className="font-extrabold text-xs hidden sm:inline tracking-wide">
          Aldri Copilot ✨
        </span>
      </button>

      {/* Modal / Ventana del Copiloto */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[95vw] sm:w-[460px] h-[580px] bg-white dark:bg-[#12131A] rounded-3xl border border-indigo-200 dark:border-indigo-900/60 shadow-[0_15px_50px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-bold text-xs tracking-wide flex items-center gap-1.5">
                  Aldri Copilot • Asistente Ejecutivo
                  <span className="bg-emerald-400/30 text-emerald-100 text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                    ONLINE
                  </span>
                </h3>
                <span className="text-[10px] text-indigo-100 opacity-90 block">Conectado a MongoDB & Gemini</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-indigo-50/70 dark:bg-gray-900/80 border-b border-indigo-100 dark:border-gray-800 flex gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSend("¿Cuáles son las ventas y órdenes recientes?")}
              className="px-2.5 py-1 bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-gray-700 whitespace-nowrap hover:bg-indigo-100 font-medium"
            >
              📊 Ventas recientes
            </button>
            <button
              onClick={() => handleSend("¿Hay productos con bajo stock?")}
              className="px-2.5 py-1 bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-gray-700 whitespace-nowrap hover:bg-indigo-100 font-medium"
            >
              📦 Stock bajo
            </button>
            <button
              onClick={() => handleSend("¿Qué leads calientes se han capturado en el chat?")}
              className="px-2.5 py-1 bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-gray-700 whitespace-nowrap hover:bg-indigo-100 font-medium"
            >
              🔥 Leads calientes
            </button>
          </div>

          {/* Messages Container */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                  msg.role === "user"
                    ? "ml-auto bg-indigo-600 text-white rounded-br-xs"
                    : "mr-auto bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-xs border border-gray-200/50 dark:border-gray-700/50"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="mr-auto bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-xs font-semibold">Consultando datos del negocio...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregúntale al copiloto sobre órdenes, leads o stock..."
              className="flex-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-all shadow"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
