import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar .env.local si no está presente en el proceso
function loadEnv() {
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
loadEnv();

async function syncRealCatalog() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aldri.shop';
  const adminPass = process.env.ADMIN_PASSWORD || 'TuPasswordSeguraAdmin2026';
  const catalogDir = resolve(__dirname, '../data/curated-catalog');

  console.log('===============================================================');
  console.log('   SINCRONIZACIÓN DE CATÁLOGO DORADO 100% REAL (aldri.shop)');
  console.log(`   Destino: ${siteUrl} | Modo: Depuración de Mocks + Inyección Real`);
  console.log('===============================================================');

  // 1. Limpieza de Mocks Ficticios
  console.log('\n🧹 [Paso 1] Eliminando productos mock / lorem ipsum de la base de datos...');
  try {
    const delRes = await fetch(`${siteUrl}/api/admin/products?mode=clear-mocks`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminPass}`,
        'Content-Type': 'application/json'
      }
    });

    const delData = await delRes.json();
    if (delRes.ok && delData.success) {
      console.log(`✅ [Depuración Exitosa] ${delData.deletedCount} productos de simulación eliminados.`);
    } else {
      console.warn(`⚠️ [Aviso] Respuesta de limpieza:`, delData);
    }
  } catch (err: any) {
    console.warn(`⚠️ [Aviso de Red] No se pudo ejecutar limpieza remota: ${err.message}`);
  }

  // 2. Lectura e Inyección de Productos Curados Reales
  console.log('\n📦 [Paso 2] Sincronizando productos reales verificados...');
  if (!existsSync(catalogDir)) {
    console.error('El directorio data/curated-catalog no existe.');
    return;
  }

  const files = readdirSync(catalogDir).filter(f => f.endsWith('.json'));
  console.log(`Encontrados ${files.length} productos en el catálogo curado local.`);

  let syncedCount = 0;
  for (const file of files) {
    const filePath = resolve(catalogDir, file);
    const content = JSON.parse(readFileSync(filePath, 'utf-8'));

    console.log(`\n➡️ Sincronizando: "${content.name}" (${content.dropshipInfo?.provider?.toUpperCase()})`);
    console.log(`   SKU: ${content.sku} | PVP: $${content.price} USD | Origen: ${content.dropshipInfo?.shippingOrigin}`);
    console.log(`   EN: "${content.nameEn || content.name}"`);

    try {
      const res = await fetch(`${siteUrl}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminPass}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        console.log(`   ✅ Publicado exitosamente en: ${siteUrl}/productos/${content.slug}`);
        syncedCount++;
      } else {
        console.warn(`   ⚠️ Error de publicación:`, resData);
      }
    } catch (err: any) {
      console.error(`   ⚠️ Fallo al conectar con la API: ${err.message}`);
    }
  }

  console.log('\n===============================================================');
  console.log(`   RESUMEN: ${syncedCount}/${files.length} productos reales sincronizados.`);
  console.log('===============================================================');
}

syncRealCatalog().catch(err => {
  console.error('Error fatal durante la sincronización:', err);
  process.exit(1);
});
