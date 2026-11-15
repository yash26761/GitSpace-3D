/**
 * GitSpace 3D — Core Telemetry & Visual DNA Type Definitions
 * Phase 4: GitHub API Telemetry & Procedural Mapping Engine
 * 
 * Contract agreed between:
 * - Kore (Backend Developer) — GitHub Telemetry Ingestion & Caching
 * - Atlas (Research Analyst) — Planetary Visual DNA Procedural Mapping Engine
 */

export interface GitHubRepoRaw {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  subscribers_count?: number;
  watchers_count?: number;
  size: number; // in KB
  language: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
  archived: boolean;
  topics?: string[];
  license?: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  owner: {
    login: string;
    avatar_url: string;
    type: string;
  };
}

export interface RepoTelemetry {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  owner: {
    login: string;
    avatarUrl: string;
    type: string;
  };
  metrics: {
    stars: number;
    forks: number;
    openIssues: number;
    watchers: number;
    sizeKB: number;
    primaryLanguage: string;
    languages: Record<string, number>; // Language name -> byte count
    totalBytes: number;
    createdAt: string;
    updatedAt: string;
    pushedAt: string;
    defaultBranch: string;
    isArchived: boolean;
  };
  cachedAt?: number;
}

export type PlanetClass =
  | "Terrestrial"
  | "Super-Earth"
  | "Gas Giant"
  | "Oceanic"
  | "Volcanic"
  | "Ice Giant";

export interface PlanetaryVisualDNA {
  name: string;
  fullName: string;
  planetClass: PlanetClass;
  radius: number;           // 1.0 to 3.5 units
  orbitalRadius: number;    // 7.0 to 36.0 units
  orbitalSpeed: number;     // 0.04 to 0.40 radians/sec
  initialAngle: number;     // 0 to 2*PI (deterministic)
  axialTilt: number;        // radians
  rotationSpeed: number;    // radians per second
  colorBase: string;        // Hex code
  colorSurface: string;     // Hex code
  colorAtmosphere: string;  // Hex code
  noiseScale: number;       // 1.5 to 5.0
  roughness: number;        // 0.2 to 0.8
  atmospherePower: number;  // 1.8 to 4.0
  hasRing: boolean;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  ringColor?: string;
  activityScore: number;    // 0.0 to 1.0 (recent activity & velocity)
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix epoch seconds
}

export interface RepoApiResponse {
  success: boolean;
  telemetry?: RepoTelemetry;
  visualDna?: PlanetaryVisualDNA;
  error?: string;
  code?: "INVALID_INPUT" | "NOT_FOUND" | "RATE_LIMITED" | "GITHUB_ERROR" | "INTERNAL_ERROR";
  rateLimit?: RateLimitInfo;
  cached?: boolean;
}
