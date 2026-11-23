"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Truck } from "lucide-react";
import { usePathname } from "next/navigation";

export const PedidoFlotante = () => {
  const pathname = usePathname();
  const [hasOrder, setHasOrder] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    const savedOrderId = localStorage.getItem("lastOrderId");
    if (savedOrderId) {
      setHasOrder(true);
      setOrderId(savedOrderId);
    }
  }, []);

  if (pathname?.startsWith("/admin") || !hasOrder) return null;

  return (
    <Link 
      href={`/checkout/confirmacion?orderId=${orderId}`}
      className="fixed top-20 left-4 z-[100] flex items-center gap-2 bg-[#0E0E12] text-white px-4 py-2 rounded-full shadow-[0_0_20px_rgba(242,202,80,0.25)] border border-[#F2CA50]/40 hover:bg-black transition-all animate-bounce"
    >
      <Truck size={16} className="text-[#F2CA50]" />
      <span className="text-xs font-bold uppercase tracking-widest text-[#F2CA50]">Pedido en camino</span>
    </Link>
  );
};
