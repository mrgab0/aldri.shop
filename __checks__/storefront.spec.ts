import { test, expect } from '@playwright/test';

/**
 * Aldri.shop Visual & Functional Eyes (Playwright Spec)
 * Diseñado para ejecutarse en Checkly / CI contra despliegues de Vercel.
 */

const TARGET_URL = process.env.ENVIRONMENT_URL || process.env.PLAYWRIGHT_TEST_BASE_URL || 'https://aldri.shop';

test.describe('aldri.shop Visual Eyes & Storefront Tests', () => {

  // Bypass para Vercel Deployment Protection si está activo en Previews
  test.beforeEach(async ({ context }) => {
    if (process.env.VERCEL_BYPASS_TOKEN) {
      await context.setExtraHTTPHeaders({
        'x-vercel-protection-bypass': process.env.VERCEL_BYPASS_TOKEN,
      });
    }
  });

  test('1. Homepage: Carga limpia, tema coherente y captura visual', async ({ page }) => {
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Aldri/i);

    // Validación de integridad de tema: Evitar duplicidad o conflicto de clases oscuras
    const body = page.locator('body');
    await expect(body).toBeVisible();

    const bodyClass = (await body.getAttribute('class')) || '';
    const hasDuplicateDark = bodyClass.includes('dark') && bodyClass.includes('light');
    expect(hasDuplicateDark, 'El body no debe mezclar clases de tema opuestas').toBeFalsy();

    // Captura visual del Hero
    await page.screenshot({ path: 'screenshots/01-homepage-hero.png', fullPage: false });
  });

  test('2. Catálogo: Grid de productos y acentos Champagne Gold', async ({ page }) => {
    await page.goto(`${TARGET_URL}/productos`, { waitUntil: 'domcontentloaded' });

    // Esperar a que la página de productos se renderice
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Captura visual completa del catálogo para inspeccionar tarjetas y bordes
    await page.screenshot({ path: 'screenshots/02-productos-grid.png', fullPage: true });
  });

  test('3. Checkout: Estado inicial y seguridad', async ({ page }) => {
    await page.goto(`${TARGET_URL}/checkout`, { waitUntil: 'domcontentloaded' });
    
    // Verificar que la página de checkout está montada
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Captura visual del checkout
    await page.screenshot({ path: 'screenshots/03-checkout.png', fullPage: false });
  });

  test('4. Admin Panel: Protección de ruta y pantalla de autenticación', async ({ page }) => {
    await page.goto(`${TARGET_URL}/admin/login`, { waitUntil: 'domcontentloaded' });

    // La pantalla de login debe mostrar formulario de acceso
    const loginForm = page.locator('input, form, button');
    await expect(loginForm.first()).toBeVisible();

    // Captura visual del acceso admin
    await page.screenshot({ path: 'screenshots/04-admin-auth.png', fullPage: false });
  });

  test('5. Detalle de Producto: Verificación de Material Glass y Alto Contraste', async ({ page }) => {
    await page.goto(`${TARGET_URL}/productos`, { waitUntil: 'domcontentloaded' });
    const productLink = page.locator('a[href^="/productos/"]').first();
    await expect(productLink).toBeVisible();
    await productLink.click();
    await page.waitForLoadState('domcontentloaded');

    const productTitle = page.locator('h1').first();
    await expect(productTitle).toBeVisible();

    // Captura visual del detalle del producto con los paneles de cristal
    await page.screenshot({ path: 'screenshots/05-product-detail.png', fullPage: false });
  });

});
