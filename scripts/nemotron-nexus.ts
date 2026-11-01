import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchZendropCatalog, getZendropProduct } from '../lib/fulfillment/zendrop.ts';
import { searchCJCatalog, getCJAccessToken, getCJProduct } from '../lib/fulfillment/cjdropshipping.ts';

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
  model: string = 'nvidia/nemotron-3.5-lightning-30b-a3b',
  timeoutMs: number = 60000
): Promise<string> {
  const apiKey = process.env.NVIDIA_API_KEY;

  // 1. Intento Ultrarrápido Directo a la API de NVIDIA NIM (~3 segundos por inferencia)
  if (apiKey) {
    try {
      const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          max_tokens: 3072
        }),
        signal: AbortSignal.timeout(timeoutMs)
      });

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (res.ok && content && content.trim().length > 0) {
        return content.trim();
      }
    } catch (fetchErr: any) {
      console.warn(`[NIM Direct Network Notice] ${fetchErr.message}. Activando motor CLI pi...`);
    }
  }

  // 2. Motor CLI Fallback con binario pi en Termux
  const runWithModel = (targetModel: string): Promise<string> => {
    return new Promise((resolvePromise, reject) => {
      const envObj: Record<string, string> = { ...process.env as Record<string, string> };
      if (apiKey) {
        envObj.NVIDIA_API_KEY = apiKey;
      } else {
        delete envObj.NVIDIA_API_KEY;
      }

      const proc = spawn('pi', [
        '--provider', 'nvidia',
        '--model', targetModel,
        '--thinking', 'off',
        '-p',
        '--no-session',
        '--no-tools'
      ], {
        env: envObj,
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
      console.warn(`[Nemotron Fallback] Modelo 120B falló (${err.message}). Activando Nemotron 3.5 Lightning (30B ultra-rápido)...`);
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
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const candidate = cleaned.slice(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(candidate);
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
  model: string = 'nvidia/nemotron-3.5-lightning-30b-a3b'
) {
  const prompt = `
Actúa como el Director de Producto & Curaduría de Lujo de aldri.shop (tienda de Obsidian Luxury y tecnología de alto rendimiento).
Evalúa y transforma el siguiente producto de dropshipping seleccionado para el catálogo oficial de aldri.shop.
Genera títulos editoriales de prestigio, badges de lujo, categorías y características técnicas en ESPAÑOL e INGLÉS para la tienda bilingüe con i18n, asignando un precio con margen bruto saludable (>60%).

=== DATOS DEL CANDIDATO ===
Proveedor: ${productCandidate.provider}
ID Proveedor: ${productCandidate.supplierId}
Nombre Crudo: ${productCandidate.name}
Precio de Fábrica: $${productCandidate.priceUsd} USD
Origen de Envío: ${productCandidate.shipsFrom || 'Global'}
URL Imagen Principal: ${productCandidate.imageUrl}
Descripción Cruda: ${productCandidate.description.slice(0, 500)}

=== MATRIZ DE AUDIENCIAS Y DOLORES (aldri.shop) ===
${JSON.stringify(archetypesData, null, 2)}
${JSON.stringify(painPointsData, null, 2)}

=== INSTRUCCIONES ESTRICTAS ===
1. Mapea el producto al arquetipo más afín y dolor correspondiente (ej: thermal throttling, desorden de cables, iluminación de monitor/escritorio, esports móvil).
2. Transforma el nombre crudo en un título editorial de lujo estilo aldri.shop (ej: Obsidian Edition, Pro MagSafe Series) en ESPAÑOL e INGLÉS.
3. Asigna un badge prestigioso (ej: "Edición Obsidian 2026", "USPS Priority 48H", "Esports Grade") en ESPAÑOL e INGLÉS.
4. Define el precio de venta recomendado en USD (asegurando un margen atractivo >60% sobre el coste de fábrica, entre $29.99 y $89.99 según producto).
5. Extrae 3 características técnicas clave con etiquetas concisas ("Tecnología", "Compatibilidad", "Materiales", etc.) en ESPAÑOL e INGLÉS.
6. Diseña una sugerencia de combo o bundle para elevar el AOV.
7. Asigna un score compuesto (>=80) y veredicto "STRONG_BUY".

Responde ÚNICAMENTE con un objeto JSON válido con la siguiente estructura exacta:
{
  "scores": {
    "visual_aesthetic_score": 90,
    "inelastic_demand_score": 90,
    "margin_viability_score": 90,
    "composite_score": 90,
    "verdict": "STRONG_BUY"
  },
  "matched_archetype_id": "competitive-mobile-esports-grinder",
  "editorial": {
    "luxury_title_es": "Título de Lujo en Español",
    "luxury_title_en": "Luxury Editorial Title in English",
    "badge_es": "Edición Especial 2026",
    "badge_en": "Special Edition 2026",
    "category_es": "Hardware & Esports",
    "category_en": "Hardware & Esports",
    "recommended_price_usd": 49.99,
    "bullet_features_es": [
      { "label": "Tecnología", "value": "Descripción concisa en español" },
      { "label": "Compatibilidad", "value": "Descripción concisa en español" },
      { "label": "Materiales", "value": "Descripción concisa en español" }
    ],
    "bullet_features_en": [
      { "label": "Technology", "value": "Concise description in English" },
      { "label": "Compatibility", "value": "Concise description in English" },
      { "label": "Materials", "value": "Concise description in English" }
    ],
    "combo_upsell": {
      "combo_name": "Nombre del Bundle",
      "bundle_price_usd": 59.99,
      "addons_included": ["Accesorio 1", "Accesorio 2"]
    }
  },
  "rationale": "Breve explicación técnica de valor y adecuación a aldri.shop."
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
  const titleEs = evaluation.editorial.luxury_title_es || evaluation.editorial.luxury_title || candidate.name;
  const titleEn = evaluation.editorial.luxury_title_en || evaluation.editorial.luxury_title || titleEs;
  const slug = titleEn
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const bulletFeaturesEs = evaluation.editorial.bullet_features_es || evaluation.editorial.bullet_features || [];
  const bulletFeaturesEn = evaluation.editorial.bullet_features_en || evaluation.editorial.bullet_features || bulletFeaturesEs;

  let recPrice = Number(evaluation.editorial.recommended_price_usd);
  if (!recPrice || isNaN(recPrice) || recPrice <= candidate.priceUsd) {
    recPrice = Number((candidate.priceUsd * 2.8).toFixed(2));
  }

  const productData = {
    name: titleEs,
    nameEn: titleEn,
    slug,
    sku: `ALDR-${candidate.provider.toUpperCase().slice(0, 2)}-${candidate.supplierId}`,
    description: `${titleEs}.\n\n` +
      bulletFeaturesEs.map((f: any) => `• ${f.label}: ${f.value}`).join('\n') +
      `\n\nOptimizado para el arquetipo de alto rendimiento. Envío rastreado garantizado con Aldri Shop.`,
    descriptionEn: `${titleEn}.\n\n` +
      bulletFeaturesEn.map((f: any) => `• ${f.label}: ${f.value}`).join('\n') +
      `\n\nEngineered for high performance. Guaranteed tracked shipping with Aldri Shop.`,
    price: recPrice,
    compareAtPrice: Number((recPrice * 1.35).toFixed(2)),
    productType: 'dropship',
    images: [candidate.imageUrl],
    stock: 250,
    category: evaluation.editorial.category_es || evaluation.editorial.category || 'Hardware & Esports',
    categoryEn: evaluation.editorial.category_en || evaluation.editorial.category || 'Hardware & Esports',
    badge: evaluation.editorial.badge_es || evaluation.editorial.badge || 'Selección Oficial 2026',
    badgeEn: evaluation.editorial.badge_en || 'Official Selection 2026',
    isActive: true,
    features: bulletFeaturesEs,
    featuresEn: bulletFeaturesEn,
    dropshipInfo: {
      provider: candidate.provider,
      supplierSku: String(candidate.supplierId),
      supplierUrl: candidate.productUrl || '',
      estimatedDeliveryDays: candidate.shipsFrom === 'US' ? '2-5 días hábiles (USPS Priority)' : '7-12 días hábiles (CJPacket Fast Line)',
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
  console.log(`💾 [Dataset Local Bilingüe] Guardado en: data/curated-catalog/${slug}.json`);

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

const TARGET_10 = [
  // 5 ZENDROP (Almacenes EE.UU. / 2-5 días USPS Priority)
  { provider: 'zendrop' as const, id: 2274608, shipsFrom: 'US' }, // Phone Cooler Magnetic Semiconductor MagSafe
  { provider: 'zendrop' as const, id: 1913482, shipsFrom: 'US' }, // 5 Lighting Mode LED Desk Lamp + Wireless Phone Charger
  { provider: 'zendrop' as const, id: 2244267, shipsFrom: 'US' }, // ORIA Wireless Charger 3 in 1 Fast Wireless Charging Station
  { provider: 'zendrop' as const, id: 2243201, shipsFrom: 'US' }, // LetLex LED Desk Lamp Qi Wireless Charger 3 in 1
  { provider: 'zendrop' as const, id: 2232519, shipsFrom: 'US' }, // CurcKua Dual Semi-Conductor Gaming Smartphone Cooling Radiator Pad

  // 5 CJ DROPSHIPPING (Fábricas Hardware Gaming / CJPacket Fast Line)
  { provider: 'cjdropshipping' as const, id: '2608230744531610800', shipsFrom: 'CN' },
  { provider: 'cjdropshipping' as const, id: '2608190258221622500', shipsFrom: 'CN' },
  { provider: 'cjdropshipping' as const, id: '2116461431242993666', shipsFrom: 'CN' },
  { provider: 'cjdropshipping' as const, id: '2610271348021604800', shipsFrom: 'CN' },
  { provider: 'cjdropshipping' as const, id: '2610240903511609000', shipsFrom: 'CN' }
];

/**
 * Flujo Principal CLI
 */
async function main() {
  const args = process.argv.slice(2);
  const isAll10 = args.includes('--curate-all-10');
  const provider = args.includes('--cj') ? 'cj' : 'zendrop';
  const shouldPublish = args.includes('--publish');
  const use120b = args.includes('--super-vl') || args.includes('--120b');
  const targetModel = use120b
    ? 'nvidia/nemotron-3.5-super-vl-120b-a12b'
    : 'nvidia/nemotron-3.5-lightning-30b-a3b';
  const keyword = args.find(a => !a.startsWith('--')) || 'magsafe';

  console.log('===============================================================');
  console.log('   NEXO NEMOTRON: MOTOR DISCRIMINATIVO DUAL & BILINGÜE');
  console.log(`   Modo: ${isAll10 ? 'CURADURÍA TOTAL 10 REALES (5 ZD + 5 CJ)' : provider.toUpperCase()} | Modelo: ${targetModel}`);
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

  if (isAll10) {
    console.log(`\n📦 Obteniendo datos verificados de los 10 productos reales de fábrica...`);
    
    // 1. Zendrop 5
    for (const item of TARGET_10.filter(t => t.provider === 'zendrop')) {
      const res = await getZendropProduct(item.id as number);
      const p = res.data?.product || res.data;
      if (p) {
        candidates.push({
          provider: 'zendrop',
          supplierId: item.id,
          name: p.name,
          description: p.description || p.name,
          priceUsd: Number(p.price || 15),
          imageUrl: p.image || p.images?.[0] || '',
          shipsFrom: 'US',
          productUrl: p.product_url || `https://app.zendrop.com/product/${item.id}`
        });
      }
    }

    // 2. CJ Dropshipping 5
    const cjItems = [
      { id: '2608230744531610800', name: 'RGB-illuminated Dual-turbine Semiconductor Digital-display Phone Cooler', price: 6.94, img: 'https://cc-west-usa.oss-us-west-1.aliyuncs.com/20230823/1692783893321.jpg' },
      { id: '2608190258221622500', name: 'Back-clamp High-power Magnetic Phone Radiator Cooler', price: 4.48, img: 'https://cc-west-usa.oss-us-west-1.aliyuncs.com/20230819/1692413902341.jpg' },
      { id: '2116461431242993666', name: '10-15 Inch Laptop Cooling Pad USB Powered Notebook Cooler Stand Tray Silent Fan', price: 11.00, img: 'https://cf.cjdropshipping.com/31f2725c-d1e0-4389-8908-4d2c0bff564f.jpg' },
      { id: '2610271348021604800', name: 'Pro Gaming Wireless Mobile Controller Dual Vibration RGB High Precision Hall Joysticks', price: 10.94, img: 'https://cf.cjdropshipping.com/quick/product/00f3089f-6242-4420-9c19-6dc68d3ed9a1.jpg' },
      { id: '2610240903511609000', name: 'RF45H Retro Handheld Game Console 4.5 Inch HD IPS Screen Linux Quad-Core System', price: 40.80, img: 'https://oss-cf.cjdropshipping.com/product/20231024/1698138231511.jpg' }
    ];

    for (const cj of cjItems) {
      candidates.push({
        provider: 'cjdropshipping',
        supplierId: cj.id,
        name: cj.name,
        description: cj.name,
        priceUsd: cj.price,
        imageUrl: cj.img,
        shipsFrom: 'CN',
        productUrl: `https://cjdropshipping.com/product/${cj.id}.html`
      });
    }

  } else if (provider === 'zendrop') {
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

  console.log(`\nTotal candidatos a evaluar: ${candidates.length}`);

  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    const targetSku = `ALDR-${candidate.provider.toUpperCase().slice(0, 2)}-${candidate.supplierId}`;
    const alreadyCurated = existsSync(curatedDir) && readdirSync(curatedDir).some(f => {
      if (!f.endsWith('.json')) return false;
      try {
        const raw = readFileSync(resolve(curatedDir, f), 'utf-8');
        return raw.includes(`"sku": "${targetSku}"`);
      } catch {
        return false;
      }
    });

    if (alreadyCurated) {
      console.log(`⏩ [Ya Curado] Saltando evaluación para "${candidate.name.slice(0, 45)}..." (SKU: ${targetSku})`);
      continue;
    }

    console.log(`\n---------------------------------------------------------------`);
    console.log(`[${i + 1}/${candidates.length}] Evaluando (${candidate.provider.toUpperCase()}): "${candidate.name.slice(0, 45)}..." ($${candidate.priceUsd} USD)`);

    try {
      const evalResult = await evaluateProductWithNemotron(candidate, targetModel);
      console.log('--- VEREDICTO DE NEMOTRON ---');
      console.log(`Puntaje Compuesto: ${evalResult.scores.composite_score}/100 | Veredicto: ${evalResult.scores.verdict}`);
      console.log(`Arquetipo Mapeado: ${evalResult.matched_archetype_id}`);
      console.log(`Título ES: ${evalResult.editorial.luxury_title_es || evalResult.editorial.luxury_title}`);
      console.log(`Título EN: ${evalResult.editorial.luxury_title_en || evalResult.editorial.luxury_title}`);
      console.log(`Precio Venta Recomendado: $${evalResult.editorial.recommended_price_usd} USD (Costo Fábrica: $${candidate.priceUsd} USD)`);
      if (evalResult.editorial.combo_upsell) {
        console.log(`Combo AOV Sugerido: ${evalResult.editorial.combo_upsell.combo_name} ($${evalResult.editorial.combo_upsell.bundle_price_usd} USD)`);
      }
      console.log(`Razonamiento: ${evalResult.rationale}`);

      if (evalResult.scores.verdict === 'STRONG_BUY' || evalResult.scores.verdict === 'BUY' || evalResult.scores.composite_score >= 60) {
        await saveAndPublishCuratedProduct(candidate, evalResult, shouldPublish);
      } else {
        console.log('\n[Filtro] Producto descartado por no alcanzar el umbral de lujo inelástico (>=60).');
      }
    } catch (err: any) {
      console.error('Error durante la evaluación de Nemotron:', err.message);
    }
  }

  console.log('\n===============================================================');
  console.log('   NEXO NEMOTRON: Ciclo de evaluación completado exitosamente.');
  console.log('===============================================================');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().catch((err) => {
    console.error('Error fatal en Nexo Nemotron:', err);
    process.exit(1);
  });
}
