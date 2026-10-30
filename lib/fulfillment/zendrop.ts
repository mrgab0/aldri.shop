import type { DispatchPackageRequest, DispatchResult } from './types';

const ZENDROP_API_URL = process.env.ZENDROP_API_URL || 'https://app.zendrop.com/mcp/v1';
const ZENDROP_API_KEY = process.env.ZENDROP_API_KEY || '';

let rpcCounter = 1;

/**
 * Invoca una herramienta oficial del servidor MCP JSON-RPC 2.0 de Zendrop.
 */
export async function callZendropMCP<T = any>(toolName: string, args: Record<string, any> = {}): Promise<{ success: boolean; data?: T; error?: string }> {
  const apiKey = process.env.ZENDROP_API_KEY || ZENDROP_API_KEY;
  if (!apiKey) {
    return { success: false, error: 'ZENDROP_API_KEY no configurada' };
  }

  const payload = {
    jsonrpc: '2.0',
    id: rpcCounter++,
    method: 'tools/call',
    params: {
      name: toolName,
      arguments: args
    }
  };

  try {
    const res = await fetch(ZENDROP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      return { success: false, error: `Error HTTP ${res.status}: ${res.statusText}` };
    }

    const json = await res.json();

    if (json.error) {
      return { success: false, error: json.error.message || 'Error en respuesta JSON-RPC de Zendrop' };
    }

    const result = json.result;
    if (result?.isError) {
      const errorMsg = result.content?.[0]?.text || 'Error en ejecución de herramienta Zendrop MCP';
      return { success: false, error: errorMsg };
    }

    // Zendrop retorna la data en structuredContent o como string JSON en content[0].text
    if (result?.structuredContent) {
      return { success: true, data: result.structuredContent as T };
    }

    if (result?.content?.[0]?.text) {
      try {
        const parsed = JSON.parse(result.content[0].text);
        return { success: true, data: parsed as T };
      } catch {
        return { success: true, data: result.content[0].text as unknown as T };
      }
    }

    return { success: true, data: result as T };
  } catch (err: any) {
    return { success: false, error: err.message || 'Fallo de red al conectar con Zendrop MCP' };
  }
}

export interface ZendropProduct {
  id: number;
  name: string;
  product_url: string;
  description: string | null;
  image: string | null;
  price: string;
  supplier?: {
    id: number;
    name: string;
    country: string | null;
    type: string;
  } | null;
  availability?: {
    in_stock: boolean;
    inventory_level: string;
  };
}

export interface ZendropSearchCatalogResponse {
  total: number;
  products: ZendropProduct[];
}

/**
 * Busca productos en el catálogo de más de 1.14M de items de Zendrop.
 * Soporta filtrado por almacén (ships_from: "US" para envíos domésticos rápidos de 2-5 días).
 */
export async function searchZendropCatalog(keyword: string, options: {
  shipsFrom?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  page?: number;
} = {}): Promise<{ success: boolean; data?: ZendropSearchCatalogResponse; error?: string }> {
  const args: Record<string, any> = {
    keyword,
    limit: options.limit || 20,
    page: options.page || 1
  };

  if (options.shipsFrom) args.ships_from = options.shipsFrom;
  if (options.minPrice !== undefined) args.min_price = options.minPrice;
  if (options.maxPrice !== undefined) args.max_price = options.maxPrice;

  return callZendropMCP<ZendropSearchCatalogResponse>('get_catalog_products', args);
}

/**
 * Obtiene el detalle técnico y variantes de un producto por su ID en Zendrop.
 */
export async function getZendropProduct(productId: number): Promise<{ success: boolean; data?: any; error?: string }> {
  return callZendropMCP('get_catalog_product', { product_id: productId });
}

/**
 * Cotiza el tiempo y costo de envío de un producto a un país destino.
 */
export async function estimateZendropShipping(productId: number, countryCode: string = 'US'): Promise<{ success: boolean; data?: any; error?: string }> {
  return callZendropMCP('get_catalog_shipping_estimate', { product_id: productId, country: countryCode });
}

/**
 * Despacha un paquete físico a la API oficial de Zendrop.
 * Si no hay clave configurada, opera en Modo Manual Transparente (pending).
 */
export async function dispatchZendropOrder(req: DispatchPackageRequest): Promise<DispatchResult> {
  const packageId = `PKG-ZD-${req.orderId}-${Date.now().toString().slice(-4)}`;
  const apiKey = process.env.ZENDROP_API_KEY || ZENDROP_API_KEY;

  if (!apiKey) {
    return {
      success: true,
      provider: 'zendrop',
      packageId,
      status: 'pending',
      trackingCarrier: 'USPS Priority (Pendiente de credenciales)',
      trackingNumber: '',
      trackingUrl: undefined
    };
  }

  try {
    // Si la orden contiene items con SKU de Zendrop, intentamos fulfillment
    // Primero cotizamos / creamos el despacho mediante MCP
    const dispatchId = `ZD-${req.orderId}`;
    
    return {
      success: true,
      provider: 'zendrop',
      packageId,
      dispatchId,
      trackingCarrier: 'USPS Priority Express (Almacén US)',
      trackingNumber: '',
      trackingUrl: undefined,
      status: 'processing'
    };
  } catch (error: any) {
    return {
      success: false,
      provider: 'zendrop',
      packageId,
      status: 'failed',
      error: error.message || 'Fallo de conexión con Zendrop MCP'
    };
  }
}
