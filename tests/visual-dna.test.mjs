import test from "node:test";
import assert from "node:assert/strict";

// Mirror Atlas's Visual DNA Engine logic for testing in Node test runner
function hashString(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function calculateShannonEntropy(languages, totalBytes) {
  if (!totalBytes || totalBytes <= 0 || Object.keys(languages).length <= 1) {
    return 0;
  }
  let entropy = 0;
  for (const bytes of Object.values(languages)) {
    if (bytes > 0) {
      const p = bytes / totalBytes;
      entropy -= p * Math.log2(p);
    }
  }
  return entropy;
}

const LANGUAGE_COLOR_MAP = {
  TypeScript: { base: "#0f2b48", surface: "#3178c6", atmosphere: "#60a5fa" },
  JavaScript: { base: "#423806", surface: "#f7df1e", atmosphere: "#fef08a" },
  Python: { base: "#1e3a5f", surface: "#3572A5", atmosphere: "#38bdf8" },
  Rust: { base: "#451a03", surface: "#dea584", atmosphere: "#fdba74" },
  Go: { base: "#083344", surface: "#00ADD8", atmosphere: "#67e8f9" },
};

function generatePlanetaryVisualDNA(telemetry) {
  const { metrics, name, fullName } = telemetry;
  const hash = hashString(fullName || name);
  const palette = LANGUAGE_COLOR_MAP[metrics.primaryLanguage] || { base: "#0f172a", surface: "#6366f1", atmosphere: "#818cf8" };

  const effectiveSize = Math.max(10, metrics.sizeKB);
  const rawRadius = 1.0 + Math.log10(effectiveSize) * 0.38;
  const radius = Math.min(3.4, Math.max(1.1, Number(rawRadius.toFixed(2))));

  const logStars = Math.log10(Math.max(1, metrics.stars));
  const baseOrbit = 8.0 + logStars * 3.5;
  const hashJitter = ((hash % 100) / 100) * 2.5;
  const orbitalRadius = Math.min(38.0, Math.max(7.5, Number((baseOrbit + hashJitter).toFixed(1))));

  const rawSpeed = 1.15 / Math.pow(orbitalRadius, 0.75);
  const orbitalSpeed = Math.min(0.35, Math.max(0.05, Number(rawSpeed.toFixed(3))));

  const initialAngle = Number(((hash % 628) / 100).toFixed(2));
  const hasRing = metrics.forks >= 400 || metrics.stars >= 1000 || metrics.sizeKB >= 60000;

  const entropy = calculateShannonEntropy(metrics.languages, metrics.totalBytes);
  const noiseScale = Number(Math.min(4.8, Math.max(2.0, 2.2 + entropy * 0.85)).toFixed(2));
  const roughness = Number(Math.min(0.75, Math.max(0.25, 0.3 + entropy * 0.14)).toFixed(2));

  return {
    name,
    fullName,
    radius,
    orbitalRadius,
    orbitalSpeed,
    initialAngle,
    colorBase: palette.base,
    colorSurface: palette.surface,
    colorAtmosphere: palette.atmosphere,
    noiseScale,
    roughness,
    hasRing,
  };
}

test("Visual DNA — Deterministic Generation Guarantee", () => {
  const mockRepo = {
    name: "react",
    fullName: "facebook/react",
    metrics: {
      stars: 230000,
      forks: 46000,
      sizeKB: 320000,
      primaryLanguage: "JavaScript",
      languages: { JavaScript: 800000, TypeScript: 200000 },
      totalBytes: 1000000,
    },
  };

  const dna1 = generatePlanetaryVisualDNA(mockRepo);
  const dna2 = generatePlanetaryVisualDNA(mockRepo);

  assert.deepEqual(dna1, dna2, "Visual DNA output must be 100% deterministic across multiple runs");
  assert.equal(dna1.colorSurface, "#f7df1e", "JavaScript surface should map to solar yellow");
  assert.equal(dna1.hasRing, true, "High fork/star repository must develop planetary rings");
});

test("Visual DNA — Radius Clamping & Bounds Protection", () => {
  const tinyRepo = {
    name: "nano",
    fullName: "test/nano",
    metrics: { stars: 0, forks: 0, sizeKB: 1, primaryLanguage: "Rust", languages: {}, totalBytes: 0 },
  };

  const hugeRepo = {
    name: "linux",
    fullName: "torvalds/linux",
    metrics: { stars: 190000, forks: 54000, sizeKB: 2500000, primaryLanguage: "C", languages: {}, totalBytes: 0 },
  };

  const tinyDNA = generatePlanetaryVisualDNA(tinyRepo);
  const hugeDNA = generatePlanetaryVisualDNA(hugeRepo);

  assert.ok(tinyDNA.radius >= 1.1, `Tiny repo radius (${tinyDNA.radius}) must be >= 1.1`);
  assert.ok(hugeDNA.radius <= 3.4, `Huge repo radius (${hugeDNA.radius}) must be <= 3.4`);
  assert.ok(tinyDNA.orbitalRadius >= 7.5, "Orbital radius must respect minimum 7.5");
  assert.ok(hugeDNA.orbitalRadius <= 38.0, "Orbital radius must respect maximum 38.0");
});

test("Visual DNA — Shannon Polyglot Entropy Calculation", () => {
  // Monolingual repository: entropy = 0
  const mono = { TypeScript: 500000 };
  const hMono = calculateShannonEntropy(mono, 500000);
  assert.equal(hMono, 0, "Monolingual repo should have zero entropy");

  // Polyglot repository with 2 equal languages: entropy = 1.0 bit
  const biPoly = { TypeScript: 500000, Python: 500000 };
  const hBi = calculateShannonEntropy(biPoly, 1000000);
  assert.equal(Math.round(hBi), 1, "Evenly split 2-language repo should have entropy of 1.0");

  // Complex multi-language stack: entropy > 1.5
  const multiPoly = { TypeScript: 400000, Python: 300000, Rust: 200000, Go: 100000 };
  const hMulti = calculateShannonEntropy(multiPoly, 1000000);
  assert.ok(hMulti > 1.8, `Multi-language entropy (${hMulti}) must be > 1.8`);
});
