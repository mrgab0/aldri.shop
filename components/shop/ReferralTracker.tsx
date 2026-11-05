"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ReferralTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const refParam = searchParams.get("ref") || searchParams.get("tag");

      if (refParam) {
        const cleanCode = refParam.trim().toUpperCase();
        if (cleanCode.length >= 2 && cleanCode.length <= 32) {
          // 1. Persistir Cookie por 30 días (Atribución estilo Amazon)
          const thirtyDaysSeconds = 60 * 60 * 24 * 30;
          document.cookie = `aldri_ref=${encodeURIComponent(
            cleanCode
          )}; max-age=${thirtyDaysSeconds}; path=/; SameSite=Lax`;

          // 2. Persistir en localStorage como salvaguarda
          localStorage.setItem("aldri_ref", cleanCode);

          // 3. Registrar Clic en el Servidor (Deduplicado por sesión de navegación)
          const sessionKey = `aldri_ref_tracked_${cleanCode}`;
          if (!sessionStorage.getItem(sessionKey)) {
            sessionStorage.setItem(sessionKey, "1");
            fetch(`/api/affiliates/click?ref=${encodeURIComponent(cleanCode)}`, {
              method: "GET",
              keepalive: true,
            }).catch(() => {});
          }
        }
      }
    } catch (e) {
      // Ignorar de forma segura en entornos restringidos
    }
  }, [pathname]);

  return null;
}
