import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchZendropCatalog, getZendropProduct } from '../lib/fulfillment/zendrop.ts';
import { searchCJCatalog } from '../lib/fulfillment/cjdropshipping.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde .env.local si no están presentes
function loadEnvLocal() {
  const envPath = resolve(__dirname, '../.env.local');
  if (existsSync(envPath)) {
    const lines = readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}
loadEnvLocal();

// Directorios y Archivos de Datasets
const curatedDir = resolve(__dirname, '../data/curated-catalog');
if (!existsSync(curatedDir)) {
  mkdirSync(curatedDir, { recursive: true });
}

const archetypesPath = resolve(__dirname, '../data/audiences/archetypes.json');
const painPointsPath = resolve(__dirname, '../data/audiences/pain_points.json');

const archetypesData = JSON.parse(readFileSync(archetypesPath, 'utf-8')).archetypes;
const painPointsData = JSON.parse(readFileSync(painPointsPath, 'utf-8')).painPoints;

/**
 * Invoca el modelo Nemotron (120B Super VL o 30B Lightning) mediante el binario pi en Termux.
 */
export async function callNemotron(
  prompt: string,
  model: string = 'nvidia/nemotron-3.5-super-vl-120b-a12b',
  timeoutMs: number = 60000
): Promise<string> {
  const runWithModel = (targetModel: string): Promise<string> => {
    return new Promise((resolvePromise, reject) => {
      const proc = spawn('pi', [
        '--provider', 'nvidia',
        '--model', targetModel,
        '--thinking', 'off',
        '-p',
        '--no-session',
        '--no-tools'
      ], {
        env: {
          ...process.env,
          NVIDIA_API_KEY: process.env.NVIDIA_API_KEY || ''
        },
        signal: AbortSignal.timeout(timeoutMs)
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (d) => { stdout += d.toString(); });
      proc.stderr.on('data', (d) => { stderr += d.toString(); });

      // Enviar el prompt limpiamente por stdin y cerrar el flujo
      proc.stdin.write(prompt);
      proc.stdin.end();

      proc.on('close', (code) => {
        if (code === 0 && stdout.trim().length > 0) {
          resolvePromise(stdout.trim());
        } else {
          reject(new Error(`Nemotron (${targetModel}) exited with code ${code}. Stderr: ${stderr}`));
        }
      });

      proc.on('error', (err) => {
        reject(err);
      });
    });
  };

  try {
    return await runWithModel(model);
  } catch (err: any) {
    if (model.includes('120b')) {
      console.warn(`[Nemotron Fallback] Modelo 120B demoró o falló (${err.message}). Activando Nemotron 3.5 Lightning (30B ultra-rápido)...`);
      return await runWithModel('nvidia/nemotron-3.5-lightning-30b-a3b');
    }
    throw err;
  }
}

/**
 * Extrae y parsea de forma segura el bloque JSON retornado por Nemotron.
 */
function extractJSON(rawText: string): any {
  const cleaned = rawText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e: any) {
        throw new Error(`JSON malformado extraído de la respuesta: ${e.message}`);
      }
    }
    throw new Error(`No se pudo extraer una estructura JSON válida. Texto recibido: ${rawText.slice(0, 150)}...`);
  }
}

/**
 * Evalúa un candidato de producto a través de Nemotron Super VL.
 */
export async function evaluateProductWithNemotron(
  productCandidate: {
    provider: 'zendrop' | 'cjdropshipping';
    supplierId: string | number;
    name: string;
    description: string;
    priceUsd: number;
    imageUrl: string;
    shipsFrom?: string;
  },
  model: string = 'nvidia/nemotron-3.5-super-vl-120b-a12b'
) {
  const prompt = `
Actúa como el Director de Producto & Curaduría de Lujo de aldri.shop (tienda de Obsidian Luxury y tecnología de alto rendimiento).
Evalúa el siguiente producto candidato de dropshipping para determinar si tiene DEMANDA INELÁSTICA, ALTA CALIDAD VISUAL y potencial de margen bruto >65%.

=== DATOS DEL CANDIDATO ===
Proveedor: ${productCandidate.provider}
ID Proveedor: ${productCandidate.supplierId}
Nombre Crudo: ${productCandidate.name}
Precio de Fábrica: $${productCandidate.priceUsd} USD
Origen de Envío: ${productCandidate.shipsFrom || 'Global'}
URL Imagen Principal: ${productCandidate.imageUrl}
Descripción Cruda: ${productCandidate.description.slice(0, 500)}

=== MATRIZ DE AUDIENCIAS Y DOLORES (aldri.shop) ===
${JSON.stringify(archetypesData.slice(0, 3), null, 2)}
${JSON.stringify(painPointsData.slice(0, 2), null, 2)}

=== INSTRUCCIONES ESTRICTAS ===
1. Evalúa si el producto resuelve un dolor técnico real (ej: enfriamiento de teléfonos gamers Poco/iPhone, MagSafe premium, EDC).
2. Si la imagen o el producto parece plástico barato de $1 o mercancía genérica que nadie desea, dale un score bajo (<70) y veredicto "REJECT".
3. Si es un producto técnico de alto valor percibido, asígnale veredicto "STRONG_BUY" (score >= 85), transforma el título crudo a un título editorial de lujo estilo aldri.shop, define el precio de venta recomendado, 3 características destacadas y un combo sugerido con adicionales.

Responde ÚNICAMENTE con un objeto JSON válido con la siguiente estructura exacta:
{
  "scores": {
    "visual_aesthetic_score": 90,
    "inelastic_demand_score": 95,
    "margin_viability_score": 90,
    "composite_score": 92,
    "verdict": "STRONG_BUY"
  },
  "matched_archetype_id": "competitive-mobile-esports-grinder",
  "editorial": {
    "luxury_title": "Nombre Editorial de Lujo",
    "badge": "Edición Especial 2026",
    "category": "Hardware & Esports",
    "recommended_price_usd": 49.99,
    "bullet_features": [
      { "label": "Tecnología", "value": "Descripción concisa" },
      { "label": "Compatibilidad", "value": "Descripción concisa" },
      { "label": "Materiales", "value": "Descripción concisa" }
    ],
    "combo_upsell": {
      "combo_name": "Nombre del Bundle",
      "bundle_price_usd": 59.99,
      "addons_included": ["Dedales de Fibra de Plata", "Pad Magnético de Grafeno"]
    }
  },
  "rationale": "Breve explicación de por qué este producto y audiencia resonarán."
}
`;

  console.log(`\n[Nemotron] Evaluando candidato: "${productCandidate.name.slice(0, 50)}..."`);
  const rawResponse = await callNemotron(prompt, model);
  const evaluation = extractJSON(rawResponse);
  return evaluation;
}

/**
 * Guarda el producto curado localmente en data/curated-catalog/ y opcionalmente lo publica vía API.
 */
export async function saveAndPublishCuratedProduct(candidate: any, evaluation: any, shouldPublish: boolean = false) {
  const slug = evaluation.editorial.luxury_title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const productData = {
    name: evaluation.editorial.luxury_title,
    slug,
    sku: `ALDR-${candidate.provider.toUpperCase().slice(0, 2)}-${candidate.supplierId}`,
    description: `${evaluation.editorial.luxury_title}.\n\n` +
      evaluation.editorial.bullet_features.map((f: any) => `• ${f.label}: ${f.value}`).join('\n') +
      `\n\nOptimizado para el arquetipo de alto rendimiento. Envío rastreado internacional garantizado con Aldri Shop.`,
    price: Number(evaluation.editorial.recommended_price_usd),
    compareAtPrice: Number((evaluation.editorial.recommended_price_usd * 1.35).toFixed(2)),
    productType: 'dropship',
    images: [candidate.imageUrl],
    stock: 250,
    category: evaluation.editorial.category || 'Hardware & Esports',
    badge: evaluation.editorial.badge || 'Selección Oficial 2026',
    isActive: true,
    features: evaluation.editorial.bullet_features,
    dropshipInfo: {
      provider: candidate.provider,
      supplierSku: String(candidate.supplierId),
      supplierUrl: candidate.productUrl || '',
      estimatedDeliveryDays: candidate.shipsFrom === 'US' ? '2-5 días hábiles' : '7-12 días hábiles',
      shippingOrigin: candidate.shipsFrom === 'US' ? 'Almacén Estados Unidos (USPS Priority)' : 'Almacén Global Internacional',
      warehouseLocation: candidate.shipsFrom === 'US' ? 'US' : 'GLOBAL',
      weightKg: 0.25
    },
    nexusMetadata: {
      matchedArchetype: evaluation.matched_archetype_id,
      compositeScore: evaluation.scores.composite_score,
      verdict: evaluation.scores.verdict,
      rationale: evaluation.rationale,
      suggestedCombo: evaluation.editorial.combo_upsell,
      curatedAt: new Date().toISOString()
    }
  };

  // Guardar en dataset local
  const filePath = resolve(curatedDir, `${slug}.json`);
  writeFileSync(filePath, JSON.stringify(productData, null, 2), 'utf-8');
  console.log(`💾 [Dataset Local] Guardado en: data/curated-catalog/${slug}.json`);

  // Publicar vía API si está activo
  if (shouldPublish) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aldri.shop';
    const adminPass = process.env.ADMIN_PASSWORD || 'TuPasswordSeguraAdmin2026';

    console.log(`🚀 [Publicación API] Enviando producto a ${siteUrl}/api/admin/products...`);
    try {
      const res = await fetch(`${siteUrl}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminPass}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        console.log(`✅ [Tienda Oficial] ¡Producto publicado en vivo en ${siteUrl}/productos/${slug}!`);
      } else {
        console.warn(`⚠️ [Aviso API] Respuesta de tienda:`, resData);
      }
    } catch (err: any) {
      console.error(`⚠️ [Error Red API] No se pudo publicar en vivo: ${err.message}`);
    }
  }

  return productData;
}

/**
 * Flujo Principal CLI
 */
async function main() {
  const args = process.argv.slice(2);
  const provider = args.includes('--cj') ? 'cj' : 'zendrop';
  const shouldPublish = args.includes('--publish');
  const useLightning = args.includes('--lightning');
  const targetModel = useLightning
    ? 'nvidia/nemotron-3.5-lightning-30b-a3b'
    : 'nvidia/nemotron-3.5-super-vl-120b-a12b';
  const keyword = args.find(a => !a.startsWith('--')) || 'magsafe';

  console.log('===============================================================');
  console.log('   NEXO NEMOTRON: MOTOR DISCRIMINATIVO DUAL (aldri.shop)');
  console.log(`   Modo: ${provider.toUpperCase()} | Búsqueda: "${keyword}" | Modelo: ${targetModel}`);
  console.log(`   Publicar en Tienda: ${shouldPublish ? 'SÍ (Directo a Producción)' : 'NO (Solo Dataset Local)'}`);
  console.log('===============================================================');

  let candidates: Array<{
    provider: 'zendrop' | 'cjdropshipping';
    supplierId: string | number;
    name: string;
    description: string;
    priceUsd: number;
    imageUrl: string;
    shipsFrom?: string;
    productUrl?: string;
  }> = [];

  if (provider === 'zendrop') {
    console.log(`\n[Zendrop MCP] Consultando catálogo en vivo (ships_from: US)...`);
    const searchRes = await searchZendropCatalog(keyword, { shipsFrom: 'US', limit: 3 });

    if (!searchRes.success || !searchRes.data?.products?.length) {
      console.log('No se encontraron candidatos en Zendrop para esa búsqueda.');
      return;
    }

    console.log(`Encontrados ${searchRes.data.products.length} candidatos de alta velocidad.`);
    candidates = searchRes.data.products.slice(0, 2).map((item: any) => ({
      provider: 'zendrop',
      supplierId: item.id,
      name: item.name,
      description: item.description || item.name,
      priceUsd: Number(item.price),
      imageUrl: item.image || '',
      shipsFrom: item.supplier?.country || 'US',
      productUrl: item.product_url
    }));
  } else {
    console.log(`\n[CJ Dropshipping] Consultando catálogo oficial de fábrica...`);
    const searchRes = await searchCJCatalog(keyword, { pageSize: 3 });

    if (!searchRes.success || !searchRes.data?.list?.length) {
      console.log('No se encontraron candidatos en CJ Dropshipping para esa búsqueda.');
      return;
    }

    console.log(`Encontrados ${searchRes.data.list.length} candidatos especializados.`);
    candidates = searchRes.data.list.slice(0, 2).map((item: any) => ({
      provider: 'cjdropshipping',
      supplierId: item.id,
      name: item.name,
      description: item.name,
      priceUsd: Number(item.price),
      imageUrl: item.image || '',
      shipsFrom: 'CN',
      productUrl: item.productUrl
    }));
  }

  for (const candidate of candidates) {
    try {
      const evalResult = await evaluateProductWithNemotron(candidate, targetModel);
      console.log('\n--- VEREDICTO DE NEMOTRON ---');
      console.log(`Puntaje Compuesto: ${evalResult.scores.composite_score}/100 | Veredicto: ${evalResult.scores.verdict}`);
      console.log(`Arquetipo Mapeado: ${evalResult.matched_archetype_id}`);
      console.log(`Título Editorial: ${evalResult.editorial.luxury_title}`);
      console.log(`Categoría: ${evalResult.editorial.category} | Badge: ${evalResult.editorial.badge}`);
      console.log(`Precio Venta Recomendado: $${evalResult.editorial.recommended_price_usd} USD (Costo Fábrica: $${candidate.priceUsd} USD)`);
      if (evalResult.editorial.combo_upsell) {
        console.log(`Combo AOV Sugerido: ${evalResult.editorial.combo_upsell.combo_name} ($${evalResult.editorial.combo_upsell.bundle_price_usd} USD)`);
      }
      console.log(`Razonamiento: ${evalResult.rationale}`);

      if (evalResult.scores.verdict === 'STRONG_BUY' && evalResult.scores.composite_score >= 80) {
        await saveAndPublishCuratedProduct(candidate, evalResult, shouldPublish);
      } else {
        console.log('\n[Filtro] Producto descartado por no alcanzar el umbral de lujo inelástico (>=80 y STRONG_BUY).');
      }
    } catch (err: any) {
      console.error('Error durante la evaluación de Nemotron:', err.message);
    }
  }

  console.log('\n===============================================================');
  console.log('   NEXO NEMOTRON: Ciclo de evaluación completado exitosamente.');
  console.log('===============================================================');
}

main().catch((err) => {
  console.error('Error fatal en Nexo Nemotron:', err);
  process.exit(1);
});
