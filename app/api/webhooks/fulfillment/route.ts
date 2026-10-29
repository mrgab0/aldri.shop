import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Order } from '@/lib/models/Order';

export const runtime = 'nodejs';

/**
 * Webhook receiver for real fulfillment and tracking updates
 * from CJ Dropshipping, Zendrop, or 17Track.
 *
 * Payload expectations:
 * {
 *   "secret": "...",
 *   "orderId": "ALD-XXXXX",
 *   "trackingNumber": "940011189956...",
 *   "trackingCarrier": "USPS / CJPacket",
 *   "trackingUrl": "https://...",
 *   "status": "shipped" | "in_transit" | "delivered"
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const webhookSecret = process.env.FULFILLMENT_WEBHOOK_SECRET;

    if (webhookSecret && body.secret !== webhookSecret) {
      return NextResponse.json({ error: 'Unauthorized webhook request' }, { status: 401 });
    }

    const { orderId, trackingNumber, trackingCarrier, trackingUrl, status } = body;

    if (!orderId || !trackingNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId and trackingNumber are mandatory' },
        { status: 400 }
      );
    }

    await dbConnect();

    const order = await Order.findOne({
      $or: [{ orderId }, { _id: orderId }]
    });

    if (!order) {
      return NextResponse.json({ error: `Order ${orderId} not found` }, { status: 404 });
    }

    // Actualizar tracking general
    order.trackingNumber = trackingNumber;
    if (trackingCarrier) order.trackingCarrier = trackingCarrier;
    order.trackingUrl = trackingUrl || `https://www.17track.net/es/track?nums=${encodeURIComponent(trackingNumber)}`;

    // Mapear estado
    if (status === 'delivered') {
      order.status = 'Entregado';
    } else if (status === 'shipped' || status === 'in_transit') {
      order.status = 'En camino';
    }

    // Actualizar paquete específico en shipments si existe
    if (order.shipments && order.shipments.length > 0) {
      order.shipments = order.shipments.map((pkg: any) => {
        return {
          ...pkg,
          trackingNumber: pkg.trackingNumber || trackingNumber,
          trackingCarrier: pkg.trackingCarrier || trackingCarrier,
          trackingUrl: pkg.trackingUrl || order.trackingUrl,
          status: status === 'delivered' ? 'delivered' : 'shipped'
        };
      });
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: `Tracking for order ${order.orderId} updated successfully`,
      trackingNumber,
      orderStatus: order.status
    });
  } catch (error: any) {
    console.error('Error processing fulfillment webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error processing webhook', details: error.message },
      { status: 500 }
    );
  }
}
