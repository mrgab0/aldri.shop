import { defineConfig } from 'checkly';
import { Frequency } from 'checkly/constructs';

/**
 * Checkly Monitoring-as-Code Configuration for aldri.shop
 * Conecta los checks de Playwright a despliegues de Vercel (Previews y Producción)
 */
export default defineConfig({
  projectName: 'aldri.shop Visual & Functional Eyes',
  logicalId: 'aldri-shop-monitoring',
  repoUrl: 'https://github.com/aldri/aldri',
  checks: {
    activated: true,
    muted: false,
    runtimeId: '2024.02',
    frequency: Frequency.EVERY_24H,
    locations: ['us-east-1', 'sa-east-1'], // US East y São Paulo (LatAm)
    tags: ['storefront', 'visual-eyes', 'aldri-shop'],
    browserChecks: {
      frequency: Frequency.EVERY_24H,
      testMatch: '**/__checks__/**/*.spec.ts',
    },
  },
  cli: {
    runLocation: 'us-east-1',
    reporters: ['list'],
  },
});
