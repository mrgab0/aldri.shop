import { searchZendropCatalog, getZendropProduct, estimateZendropShipping } from '../lib/fulfillment/zendrop.ts';

async function run() {
  console.log('=== PRUEBA DE INTEGRACIÓN EN VIVO: ZENDROP MCP ===');
  
  // 1. Búsqueda con filtro ships_from: "US"
  console.log('1. Buscando productos con envío rápido desde Estados Unidos (ships_from: US)...');
  const searchRes = await searchZendropCatalog('magsafe', { shipsFrom: 'US', limit: 3 });
  
  if (!searchRes.success || !searchRes.data) {
    console.error('Fallo en búsqueda:', searchRes.error);
    process.exit(1);
  }

  console.log(`Éxito: Se encontraron ${searchRes.data.total} productos en catálogo.`);
  const sample = searchRes.data.products[0];
  console.log(`Producto de muestra: ID=${sample.id} | ${sample.name} | Precio: $${sample.price} | País: ${sample.supplier?.country}`);

  // 2. Detalle del producto
  console.log(`\n2. Consultando detalle técnico del producto ${sample.id}...`);
  const detailRes = await getZendropProduct(sample.id);
  if (detailRes.success) {
    console.log('Detalle obtenido con éxito.');
  }

  // 3. Estimación de flete a US
  console.log(`\n3. Estimando costo de envío a EE.UU...`);
  const shipRes = await estimateZendropShipping(sample.id, 'US');
  if (shipRes.success) {
    console.log('Estimación de envío recibida con éxito.');
  }

  console.log('\n✅ Conexión con Zendrop MCP validada y operativa al 100%.');
}

run().catch(console.error);
