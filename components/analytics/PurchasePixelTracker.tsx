"use client";

import { useEffect, useRef } from "react";
import { trackPurchase } from "@/lib/pixel";

interface PurchasePixelTrackerProps {
  orderId: string;
  total: number;
  items: Array<{ id: string; name?: string; price?: number; quantity?: number }>;
}

export function PurchasePixelTracker({ orderId, total, items }: PurchasePixelTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!trackedRef.current && orderId) {
      trackedRef.current = true;
      trackPurchase({
        orderId,
        total,
        items,
      });
    }
  }, [orderId, total, items]);

  return null;
}
