#!/usr/bin/env node
/**
 * Automated WCAG 2.1 Contrast Ratio Verification
 * Checks color pairs defined in Aldri Shop design tokens for both
 * Dark Theme (Obsidian Luxury) and Light Theme (Ivory & Burnished Gold).
 */

function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return [r, g, b];
}

function getRelativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex);
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function calculateContrastRatio(hex1, hex2) {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const DARK_THEME_PAIRS = [
  { name: "Obsidian Base (#060608) vs White Text (#FFFFFF)", bg: "#060608", fg: "#FFFFFF", minExpected: 7.0, target: "AAA" },
  { name: "Obsidian Base (#060608) vs Champagne Gold (#F2CA50)", bg: "#060608", fg: "#F2CA50", minExpected: 7.0, target: "AAA" },
  { name: "Obsidian Base (#060608) vs Zinc-300 Body (#D4D4D8)", bg: "#060608", fg: "#D4D4D8", minExpected: 7.0, target: "AAA" },
  { name: "Obsidian Base (#060608) vs Zinc-400 Placeholder (#A1A1AA)", bg: "#060608", fg: "#A1A1AA", minExpected: 4.5, target: "AA" },
  { name: "Gold Button (#F2CA50) vs Deep Obsidian Black (#060608)", bg: "#F2CA50", fg: "#060608", minExpected: 7.0, target: "AAA" },
  { name: "Gold Accent (#D4AF37) vs Deep Obsidian Black (#060608)", bg: "#D4AF37", fg: "#060608", minExpected: 7.0, target: "AAA" },
  { name: "Glass Card (#0E0E12) vs White Text (#FFFFFF)", bg: "#0E0E12", fg: "#FFFFFF", minExpected: 7.0, target: "AAA" },
  { name: "Glass Card (#0E0E12) vs Champagne Gold (#F2CA50)", bg: "#0E0E12", fg: "#F2CA50", minExpected: 7.0, target: "AAA" },
  { name: "Glass Card (#0E0E12) vs Zinc-400 Placeholder (#A1A1AA)", bg: "#0E0E12", fg: "#A1A1AA", minExpected: 4.5, target: "AA" },
];

const LIGHT_THEME_PAIRS = [
  { name: "Pure White (#FFFFFF) vs Jet Black Heading (#0A0A0C)", bg: "#FFFFFF", fg: "#0A0A0C", minExpected: 7.0, target: "AAA" },
  { name: "Alabaster Base (#F8F9FA) vs Jet Black Heading (#0A0A0C)", bg: "#F8F9FA", fg: "#0A0A0C", minExpected: 7.0, target: "AAA" },
  { name: "Pure White (#FFFFFF) vs Slate-800 Subheading (#1E293B)", bg: "#FFFFFF", fg: "#1E293B", minExpected: 7.0, target: "AAA" },
  { name: "Pure White (#FFFFFF) vs Slate-600 Body/Muted (#475569)", bg: "#FFFFFF", fg: "#475569", minExpected: 7.0, target: "AAA" },
  { name: "Pure White (#FFFFFF) vs Charcoal Body (#334155)", bg: "#FFFFFF", fg: "#334155", minExpected: 7.0, target: "AAA" },
  { name: "Pure White (#FFFFFF) vs Burnished Royal Gold Accent (#714B00)", bg: "#FFFFFF", fg: "#714B00", minExpected: 7.0, target: "AAA" },
  { name: "Alabaster Base (#F8F9FA) vs Burnished Royal Gold Accent (#714B00)", bg: "#F8F9FA", fg: "#714B00", minExpected: 7.0, target: "AAA" },
  { name: "Light Gold Badge Tint (#FFF8E7) vs Burnished Royal Gold (#714B00)", bg: "#FFF8E7", fg: "#714B00", minExpected: 7.0, target: "AAA" },
  { name: "Gold Button (#F2CA50) vs Jet Black Text (#060608)", bg: "#F2CA50", fg: "#060608", minExpected: 7.0, target: "AAA" },
  { name: "Light Input Field (#FFFFFF) vs Zinc-500 Placeholder (#71717A)", bg: "#FFFFFF", fg: "#71717A", minExpected: 4.5, target: "AA" },
];

console.log("=== VERIFICACIÓN MATEMÁTICA DE CONTRASTE WCAG 2.1 (MODO ARGON DUAL THEME) ===\n");
let hasFailure = false;

console.log("--- 1. SUITE MODO OSCURO (OBSIDIAN LUXURY): ---");
for (const pair of DARK_THEME_PAIRS) {
  const ratio = calculateContrastRatio(pair.bg, pair.fg);
  const passed = ratio >= pair.minExpected;
  const status = passed ? "✓ PASS" : "✗ FAIL";
  console.log(`${status} [${pair.target}] ${pair.name} -> Ratio: ${ratio.toFixed(2)}:1 (Min: ${pair.minExpected}:1)`);
  if (!passed) hasFailure = true;
}

console.log("\n--- 2. SUITE MODO CLARO (IVORY & BURNISHED GOLD): ---");
for (const pair of LIGHT_THEME_PAIRS) {
  const ratio = calculateContrastRatio(pair.bg, pair.fg);
  const passed = ratio >= pair.minExpected;
  const status = passed ? "✓ PASS" : "✗ FAIL";
  console.log(`${status} [${pair.target}] ${pair.name} -> Ratio: ${ratio.toFixed(2)}:1 (Min: ${pair.minExpected}:1)`);
  if (!passed) hasFailure = true;
}

console.log("\n--- 3. DETECCIÓN Y BLOQUEO DE PARES PROHIBIDOS (DEFECTOS HISTÓRICOS): ---");
const badBlackOnBlack = calculateContrastRatio("#060608", "#111827");
console.log(`[BLOQUEADO] Negro #111827 sobre Obsidian #060608 -> Ratio: ${badBlackOnBlack.toFixed(2)}:1 (< 4.5:1 Falla)`);

const badWhiteOnGold = calculateContrastRatio("#F2CA50", "#FFFFFF");
console.log(`[BLOQUEADO] Blanco #FFFFFF sobre Oro #F2CA50 -> Ratio: ${badWhiteOnGold.toFixed(2)}:1 (< 4.5:1 Falla)`);

const badGoldOnWhite = calculateContrastRatio("#FFFFFF", "#F2CA50");
console.log(`[BLOQUEADO] Oro Champagne #F2CA50 sobre Blanco #FFFFFF -> Ratio: ${badGoldOnWhite.toFixed(2)}:1 (< 4.5:1 Falla, sustituido por #714B00)`);

if (hasFailure) {
  console.error("\n❌ Falló una o más pruebas de contraste.");
  process.exit(1);
} else {
  console.log("\n✅ Todas las combinaciones de color activas (Modo Claro + Modo Oscuro) superan estrictamente los estándares WCAG AA / AAA.");
}
