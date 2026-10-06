"use client";

import { X, MessageCircle, ExternalLink } from "lucide-react";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InquiryModal = ({ isOpen, onClose }: InquiryModalProps) => {
  if (!isOpen) return null;

  const phone = "13467392730";
  const defaultMessage = "¡Hola! ⚡ Me gustaría recibir asesoría sobre los productos de Aldri Shop (descargas digitales o rastreo de envíos). ¿Me podrían ayudar?";
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="fixed bottom-24 right-4 sm:right-8 z-[100] w-[calc(100vw-2rem)] sm:w-[380px] bg-white dark:bg-[#12131A] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-800 p-6 space-y-4 animate-in fade-in duration-300">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-2 text-[#25D366]">
            <MessageCircle size={20} fill="#25D366" className="text-white" />
            <span className="font-bold text-sm text-[#1A1C1C] dark:text-white">Atención Aldri Shop</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2 text-center py-2">
          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
            ¿Tienes dudas sobre una descarga digital, licencias o el rastreo de tu paquete con seguimiento? Chatea en directo con nosotros.
          </p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 rounded-full font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
        >
          <span>Abrir WhatsApp (+1 346 739 2730)</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </>
  );
};
