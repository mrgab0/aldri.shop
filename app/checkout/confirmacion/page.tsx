import { Order } from "@/lib/models/Order";
import dbConnect from "@/lib/db";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Home } from "lucide-react";
import { OrderSummary } from "@/components/shop/OrderSummary";

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId: string }>;
}) {
  const { orderId } = await searchParams;
  await dbConnect();
  
  const orderDoc = await Order.findOne({ orderId }).lean();
  const order = orderDoc ? JSON.parse(JSON.stringify(orderDoc)) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] p-6">
      <div className="bg-white p-12 rounded-2xl shadow-xl border border-gray-100 text-center animate-in zoom-in-95 duration-500 max-w-lg w-full">
        <div className="bg-green-100 p-4 rounded-full text-green-600 mb-6 animate-bounce mx-auto w-20">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold text-[#1A1C1C] mb-2">¡Compra Finalizada con Éxito! 🚀</h2>
        <p className="text-gray-500 mb-6">
          Gracias por confiar en <strong>Aldri Shop</strong>. Hemos procesado tu orden y enviado una copia del comprobante a tu correo.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Número de Pedido</p>
            <p className="text-2xl font-mono font-bold text-indigo-600">{orderId}</p>
        </div>

        {order && <OrderSummary items={order.items} />}

        <div className="flex flex-col gap-3 mt-6">
          <Link 
            href={`/rastreo?order=${orderId}`}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md"
          >
            📦 Ver Estado del Pedido y Descargas
          </Link>
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
          >
            <Home size={18} /> Volver a la Tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
