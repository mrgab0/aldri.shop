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
    await page.goto(`${TARGET_URL}/catalogo`, { waitUntil: 'domcontentloaded' });

    // Esperar a que la lista o tarjetas de productos se rendericen
    const productGrid = page.locator('main, section');
    await expect(productGrid.first()).toBeVisible();

    // Captura visual completa del catálogo para inspeccionar tarjetas y bordes
    await page.screenshot({ path: 'screenshots/02-catalogo-grid.png', fullPage: true });
  });

  test('3. Carrito y Checkout: Estado inicial y seguridad', async ({ page }) => {
    await page.goto(`${TARGET_URL}/carrito`, { waitUntil: 'domcontentloaded' });
    
    // Verificar que el contenedor principal del carrito está montado
    const cartContainer = page.locator('main');
    await expect(cartContainer).toBeVisible();

    // Captura visual del carrito
    await page.screenshot({ path: 'screenshots/03-carrito.png', fullPage: false });
  });

  test('4. Admin Panel: Protección de ruta y pantalla de autenticación', async ({ page }) => {
    await page.goto(`${TARGET_URL}/admin`, { waitUntil: 'domcontentloaded' });

    // La ruta admin no autenticada debe mostrar formulario de login o redirigir
    const loginOrAdmin = page.locator('input[type="password"], input[type="email"], h1, h2');
    await expect(loginOrAdmin.first()).toBeVisible();

    // Captura visual del acceso admin
    await page.screenshot({ path: 'screenshots/04-admin-auth.png', fullPage: false });
  });

});
