/**
 * GitSpace 3D — Planetary Visual DNA Procedural Mapping Engine
 * Developed by Atlas (Research Analyst)
 * 
 * Deterministically maps real GitHub repository telemetry to 3D celestial
 * visual properties, shaders, and Keplerian orbital parameters.
 * 
 * STRICT ZERO CODE INGESTION:
 * Uses public metadata numbers (bytes, stars, forks, language distribution, timestamps)
 * without parsing or inspecting code files.
 */

import { RepoTelemetry, PlanetaryVisualDNA, PlanetClass } from "./types";

/**
 * Standard programming language color palette.
 * Based on GitHub linguist benchmarks and cosmic visual contrast.
 */
export const LANGUAGE_COLOR_MAP: Record<string, { base: string; surface: string; atmosphere: string }> = {
  TypeScript: { base: "#0f2b48", surface: "#3178c6", atmosphere: "#60a5fa" },
  JavaScript: { base: "#423806", surface: "#f7df1e", atmosphere: "#fef08a" },
  Python: { base: "#1e3a5f", surface: "#3572A5", atmosphere: "#38bdf8" },
  Rust: { base: "#451a03", surface: "#dea584", atmosphere: "#fdba74" },
  Go: { base: "#083344", surface: "#00ADD8", atmosphere: "#67e8f9" },
  C: { base: "#1f2937", surface: "#555555", atmosphere: "#9ca3af" },
  "C++": { base: "#4c0519", surface: "#f34b7d", atmosphere: "#fb7185" },
  "C#": { base: "#052e16", surface: "#178600", atmosphere: "#4ade80" },
  Java: { base: "#451a03", surface: "#b07219", atmosphere: "#fcd34d" },
  Kotlin: { base: "#2e1065", surface: "#A97BFF", atmosphere: "#c084fc" },
  Swift: { base: "#431407", surface: "#F05138", atmosphere: "#fb923c" },
  Ruby: { base: "#450a0a", surface: "#701516", atmosphere: "#f87171" },
  PHP: { base: "#1e1b4b", surface: "#4F5D95", atmosphere: "#818cf8" },
  HTML: { base: "#450a0a", surface: "#e34c26", atmosphere: "#f87171" },
  CSS: { base: "#3b0764", surface: "#563d7c", atmosphere: "#c084fc" },
  Shell: { base: "#14532d", surface: "#89e051", atmosphere: "#86efac" },
  Dart: { base: "#042f2e", surface: "#00B4AB", atmosphere: "#5eead4" },
  Elixir: { base: "#3b0764", surface: "#6e4a7e", atmosphere: "#d8b4fe" },
  Scala: { base: "#450a0a", surface: "#c22d40", atmosphere: "#f87171" },
  R: { base: "#0c4a6e", surface: "#198CE7", atmosphere: "#38bdf8" },
  Lua: { base: "#020617", surface: "#000080", atmosphere: "#60a5fa" },
  Haskell: { base: "#2e1065", surface: "#5e5086", atmosphere: "#c084fc" },
  Zig: { base: "#451a03", surface: "#ec915c", atmosphere: "#fdba74" },
  Vue: { base: "#064e3b", surface: "#41b883", atmosphere: "#34d399" },
  Solidity: { base: "#1e293b", surface: "#aa6746", atmosphere: "#cbd5e1" },
};

const DEFAULT_COLOR = { base: "#0f172a", surface: "#6366f1", atmosphere: "#818cf8" };

/**
 * 32-bit FNV-1a deterministic string hashing.
 * Guarantees consistent pseudo-random values across all runs.
 */
export function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

/**
 * Calculates Shannon polyglot entropy H from repository language byte breakdown.
 * Higher entropy indicates an architectural polyglot codebase.
 */
export function calculateShannonEntropy(languages: Record<string, number>, totalBytes: number): number {
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

  return entropy; // Typically between 0.0 and 3.5
}

/**
 * Derives Planet Class from physical scale and primary language category.
 */
export function derivePlanetClass(sizeKB: number, primaryLang: string): PlanetClass {
  if (sizeKB > 150000) return "Gas Giant";
  if (sizeKB > 50000) return "Super-Earth";
  if (["C", "Rust", "C++", "Go"].includes(primaryLang)) return "Volcanic";
  if (["TypeScript", "JavaScript", "Python"].includes(primaryLang)) return "Oceanic";
  if (["Haskell", "Elixir", "Scala"].includes(primaryLang)) return "Ice Giant";
  return "Terrestrial";
}

/**
 * Maps raw repository telemetry to full Planetary Visual DNA deterministically.
 */
export function generatePlanetaryVisualDNA(telemetry: RepoTelemetry): PlanetaryVisualDNA {
  const { metrics, name, fullName } = telemetry;
  const hash = hashString(fullName || name);

  // 1. Planetary Colors derived from primary language
  const langKey = metrics.primaryLanguage;
  const palette = LANGUAGE_COLOR_MAP[langKey] || DEFAULT_COLOR;

  // Secondary language for rings/accents
  const sortedLangs = Object.entries(metrics.languages || {}).sort((a, b) => b[1] - a[1]);
  const secondaryLang = sortedLangs.length > 1 ? sortedLangs[1][0] : null;
  const secondaryPalette = secondaryLang ? LANGUAGE_COLOR_MAP[secondaryLang] : null;

  // 2. Physical Radius (Logarithmic scale based on repo sizeKB)
  // 10 KB -> radius ~1.1 | 10 MB (10,000 KB) -> radius ~2.1 | 500 MB -> radius ~3.2
  const effectiveSize = Math.max(10, metrics.sizeKB);
  const rawRadius = 1.0 + Math.log10(effectiveSize) * 0.38;
  const radius = Math.min(3.4, Math.max(1.1, Number(rawRadius.toFixed(2))));

  // 3. Orbital Distance (Keplerian semi-major axis)
  // Higher star count gives wider orbital presence; deterministic hash offset prevents overlap
  const logStars = Math.log10(Math.max(1, metrics.stars));
  const baseOrbit = 8.0 + logStars * 3.5;
  const hashJitter = ((hash % 100) / 100) * 2.5;
  const orbitalRadius = Math.min(38.0, Math.max(7.5, Number((baseOrbit + hashJitter).toFixed(1))));

  // 4. Keplerian Orbital Speed (w proportional to r^-0.75)
  const rawSpeed = 1.15 / Math.pow(orbitalRadius, 0.75);
  const orbitalSpeed = Math.min(0.35, Math.max(0.05, Number(rawSpeed.toFixed(3))));

  // 5. Initial Orbital Angle (Deterministic 0 to 2*PI)
  const initialAngle = Number(((hash % 628) / 100).toFixed(2));

  // 6. Axial Tilt (5 degrees to 32 degrees in radians)
  const axialTilt = Number((0.08 + ((hash % 45) / 100) * 0.45).toFixed(2));

  // 7. Activity Score based on pushed_at timestamp
  let daysSincePush = 30;
  if (metrics.pushedAt) {
    const pushedDate = new Date(metrics.pushedAt).getTime();
    if (!isNaN(pushedDate)) {
      daysSincePush = Math.max(0, (Date.now() - pushedDate) / (1000 * 3600 * 24));
    }
  }
  // Activity score: 1.0 = pushed today, 0.1 = pushed over 180 days ago
  const activityScore = Math.min(1.0, Math.max(0.1, Number((1.0 - Math.min(daysSincePush, 180) / 200).toFixed(2))));

  // 8. Axial Spin Speed (Active repos spin faster)
  const rotationSpeed = Number((0.25 + activityScore * 0.6).toFixed(2));

  // 9. Surface Shaders: Noise Scale & Roughness from Polyglot Shannon Entropy
  const entropy = calculateShannonEntropy(metrics.languages, metrics.totalBytes);
  const noiseScale = Number(Math.min(4.8, Math.max(2.0, 2.2 + entropy * 0.85)).toFixed(2));
  const roughness = Number(Math.min(0.75, Math.max(0.25, 0.3 + entropy * 0.14)).toFixed(2));
  const atmospherePower = Number(Math.min(3.8, Math.max(1.8, 3.6 - activityScore * 1.3)).toFixed(2));

  // 10. Planetary Rings (Forks >= 400 or Stars >= 1,000)
  const hasRing = metrics.forks >= 400 || metrics.stars >= 1000 || metrics.sizeKB >= 60000;
  let ringInnerRadius: number | undefined;
  let ringOuterRadius: number | undefined;
  let ringColor: string | undefined;

  if (hasRing) {
    ringInnerRadius = 1.35;
    const logForks = Math.log10(Math.max(10, metrics.forks));
    ringOuterRadius = Number((1.35 + Math.min(1.2, Math.max(0.4, logForks * 0.32))).toFixed(2));
    ringColor = secondaryPalette ? secondaryPalette.surface : palette.atmosphere;
  }

  const planetClass = derivePlanetClass(metrics.sizeKB, metrics.primaryLanguage);

  return {
    name,
    fullName,
    planetClass,
    radius,
    orbitalRadius,
    orbitalSpeed,
    initialAngle,
    axialTilt,
    rotationSpeed,
    colorBase: palette.base,
    colorSurface: palette.surface,
    colorAtmosphere: palette.atmosphere,
    noiseScale,
    roughness,
    atmospherePower,
    hasRing,
    ringInnerRadius,
    ringOuterRadius,
    ringColor,
    activityScore,
  };
}
