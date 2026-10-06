import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'es'
});

export default function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // 1. Detectar si la petición proviene de un subdominio (ej: cargador-mag.aldri.shop o cargador-mag.localhost:3000)
  // Normalizar eliminando el puerto si existe
  const hostWithoutPort = hostname.split(':')[0];
  const domainParts = hostWithoutPort.split('.');

  // En producción (aldri.shop): ['subdominio', 'aldri', 'shop'] -> 3 partes
  // En localhost: ['subdominio', 'localhost'] -> 2 partes
  let detectedSubdomain: string | null = null;

  if (hostWithoutPort.endsWith('aldri.shop') && domainParts.length > 2) {
    const sub = domainParts[0].toLowerCase();
    if (sub !== 'www' && sub !== 'admin' && sub !== 'api') {
      detectedSubdomain = sub;
    }
  } else if (hostWithoutPort.endsWith('localhost') && domainParts.length > 1) {
    const sub = domainParts[0].toLowerCase();
    if (sub !== 'www' && sub !== 'admin') {
      detectedSubdomain = sub;
    }
  }

  // 2. Si hay subdominio y la petición es hacia la raíz o landing, reescribir a /l/[subdominio]
  if (detectedSubdomain && (url.pathname === '/' || url.pathname === '')) {
    const rewriteUrl = new URL(`/l/${detectedSubdomain}`, request.url);
    return NextResponse.rewrite(rewriteUrl);
  }

  // Rutas que no deben pasar por intlMiddleware
  if (
    url.pathname.startsWith('/l/') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}
 
export const config = {
  // Coincide con rutas internacionales, landings directas o raíz
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
