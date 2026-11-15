# GitSpace 3D — System Architecture & Procedural Physics Specification

**Author:** Scribe (`scribe-technical-writer` / `TECHNICAL_WRITER`)  
**Technical Collaborators:** 
- Nexus (`nexus-frontend-developer`)
- Kore (`kore-backend-developer`)
- Atlas (`atlas-research-analyst`)
- Aegis (`aegis-security-engineer`)
- Vigil (`vigil-qa-engineer`)
- Helm (`helm-devops-engineer`)  
**Project:** GitSpace 3D (`D:\Project\GitSpace-3D`)  
**Project UUID:** `1eede197-d041-49f2-902c-244e9971b384`  
**Milestone:** Phase 5 — Quality Assurance, Security Audit & System Documentation  
**Date:** 2026-11-15  
**Authority:** Founder & CEO  

---

## 1. System Overview & Vision

**GitSpace 3D** transforms public GitHub software repositories into an interactive 3D universe. Rather than visualizing codebases as mundane lists or tables, GitSpace 3D renders repositories as individual celestial planetary bodies orbiting a central solar host star.

The platform is designed around three foundational engineering pillars:
1. **Strict Zero Code Ingestion**: 100% privacy assurance. The system queries numerical metadata and language distributions only. It never fetches, stores, or analyzes repository source-code files, trees, or diffs.
2. **Deterministic Procedural Graphics**: A repository's visual appearance (radius, orbital distance, velocity, terrain roughness, rings, and colors) is mathematically derived from its telemetry.
3. **High-Performance 60 FPS 3D Rendering**: Engineered with Three.js, React Three Fiber (R3F), and custom GLSL vertex and fragment shaders.

---

## 2. Technology Stack & Component Hierarchy

### Technology Stack
- **Framework**: Next.js 16.4.6 (App Router, Server & Client Components)
- **UI Library**: React 19.3.0 & React DOM
- **3D Graphics Engine**: Three.js v0.187.0 & `@react-three/fiber` v9.8.2
- **3D Utilities**: `@react-three/drei` v10.7.9
- **Styling & Design Tokens**: Tailwind CSS v4.3.3 (`@theme` cosmic palette)
- **Icons**: Lucide React v1.73.0
- **Testing**: Node.js Test Runner (Unit & Integration) + Playwright v1.65.1 (E2E)

### Directory Structure & Responsibilities
```
D:\Project\GitSpace-3D\
├── docs/                                  # Architectural & Mathematical Runbooks
│   ├── ARCHITECTURE.md                    # Complete System Architecture (this document)
│   ├── PROCEDURAL_PLANETARY_SHADERS.md    # GLSL Simplex & Rayleigh Shader Reference
│   ├── VISUAL_DNA_SPECIFICATION.md        # Mathematical Visual DNA Mapping Formulations
│   └── SECURITY_AUDIT.md                  # Zero-Code-Ingestion & CSP Hardening Audit
├── e2e/                                   # Playwright End-to-End Test Suite
│   └── gitspace.spec.ts                   # E2E Specs: Navigation, Search, WebGL, Responsive
├── src/
│   ├── app/
│   │   ├── api/repo/route.ts              # Next.js Route Handler (GET / POST /api/repo)
│   │   ├── globals.css                    # Tailwind CSS v4 Theme Tokens & Cosmic Utilities
│   │   ├── layout.tsx                     # Root App Shell & HTML Metadata
│   │   └── page.tsx                       # Single-Page Landing & 3D Celestial Container
│   ├── components/
│   │   ├── landing/                       # Landing Page Modules
│   │   │   ├── FeaturesSection.tsx        # 6 Interactive Feature Cards
│   │   │   ├── HeroSection.tsx            # Live Search Console, Presets & HUD Inspector
│   │   │   └── HowItWorksSection.tsx      # 3-Step Cosmic Synthesis Stepper
│   │   ├── layout/                        # Global Shell Components
│   │   │   ├── Footer.tsx                 # Semantic Footer with Zero-Code Guarantee
│   │   │   └── Navbar.tsx                 # Glassmorphic Sticky Header & Mobile Drawer
│   │   └── three/                         # Three.js / React Three Fiber Celestial Engine
│   │       ├── CentralStar.tsx            # Pulsating Chromosphere Host Star at Origin
│   │       ├── KeplerianOrbitRing.tsx     # Orbital Elliptical Trajectory Geometry
│   │       ├── PlanetMesh.tsx             # Procedural Planet Sphere, Rings & Axial Spin
│   │       ├── PlanetaryShaders.ts        # GLSL 3D Simplex, fBM & Rayleigh Shaders
│   │       ├── UniverseCanvas.tsx         # Client Canvas Mount, WebGL Detection & HUD
│   │       └── UniverseScene.tsx          # Scene Graph, OrbitControls & Starfield Particles
│   └── lib/                               # Core Subsystems & Mathematical Engines
│       ├── cache.ts                       # In-Memory LRU Cache with TTL Expiration
│       ├── constants.ts                   # Site Metadata, Nav Links & System Constants
│       ├── github.ts                      # GitHub REST Client & Rate-Limit Tracking
│       ├── types.ts                       # Shared TypeScript Interfaces & Data Contracts
│       ├── utils.ts                       # Tailwind Class Utilities
│       └── visualDna.ts                   # Planetary Visual DNA Procedural Mapping Engine
├── tests/                                 # Unit & Integration Test Suites
│   ├── api-cache.test.mjs                 # LRU Cache, TTL Expiration & Eviction Tests
│   ├── github-slug.test.mjs               # Slug Sanitization & Injection Rejection Tests
│   └── visual-dna.test.mjs                # Determinism, Bounds & Shannon Entropy Tests
├── next.config.ts                         # Next.js Webpack Config, CSP & Security Headers
├── package.json                           # Scripts & Dependency Manifest
├── playwright.config.ts                   # Playwright E2E Configuration
└── tsconfig.json                          # Strict TypeScript Configuration
```

---

## 3. Data Flow & Subsystem Architecture

```mermaid
flowchart TD
    User["Founder / User Browser"] -->|"1. Submits 'owner/repo' or clicks preset"| Search["HeroSection Search Console"]
    Search -->|"2. GET /api/repo?repo=..."| RouteHandler["Route Handler (/api/repo)"]
    
    RouteHandler -->|"3. Check Cache (slug key)"| LRU["In-Memory LRU Cache (15m TTL)"]
    LRU -->|"Cache Hit (O(1))"| ReturnHit["Return Cached Telemetry & Visual DNA"]
    ReturnHit --> RouteHandler
    
    LRU -.->"Cache Miss"| GitHubClient["GitHub Telemetry Client (github.ts)"]
    GitHubClient -->|"4. REST API (Metadata Only)"| GitHubAPI["GitHub REST API (api.github.com)"]
    GitHubAPI -->|"/repos/{owner}/{repo}"| RepoMeta["Repo Metadata (stars, forks, size)"]
    GitHubAPI -->|"/repos/{owner}/{repo}/languages"| LangBytes["Language Byte Distribution"]
    
    RepoMeta & LangBytes -->|"5. Raw Public Numbers"| VisualDNA["Visual DNA Engine (visualDna.ts)"]
    VisualDNA -->|"6. Compute R, r_orbit, w, H, colors"| PlanetaryDNA["Planetary Visual DNA"]
    PlanetaryDNA -->|"7. Save to Cache"| LRU
    PlanetaryDNA -->|"8. Return JSON"| RouteHandler
    
    RouteHandler -->|"9. JSON Response (HTTP 200)"| Search
    Search -->|"10. Mount Dynamic Planet"| R3F["UniverseCanvas & UniverseScene"]
    R3F -->|"11. GPU Shader Compilation"| Shaders["GLSL Simplex & Rayleigh Shaders"]
```

---

## 4. Mathematical Mapping & Procedural Physics

### A. Planetary Radius ($R$)
Logarithmic scaling based on codebase volume ($\text{sizeKB}$):
$$R = \text{clamp}\left(1.0 + \log_{10}(\max(\text{sizeKB}, 10)) \times 0.38, 1.1, 3.4\right)$$

### B. Keplerian Orbital Mechanics
- **Orbital Distance ($r_{\text{orbit}}$)**:
  $$r_{\text{orbit}} = \text{clamp}\left(8.0 + \log_{10}(\max(\text{stars}, 1)) \times 3.5 + \Delta_{\text{hash}}, 7.5, 38.0\right)$$
- **Orbital Angular Velocity ($\omega$)**:
  $$\omega = \text{clamp}\left(\frac{1.15}{(r_{\text{orbit}})^{0.75}}, 0.05, 0.35\right)\text{ rad/s}$$
- **Real-Time Trajectory**:
  $$x(t) = r_{\text{orbit}} \cos(\theta_0 + \omega \cdot 0.3 \cdot t), \quad z(t) = r_{\text{orbit}} \sin(\theta_0 + \omega \cdot 0.3 \cdot t)$$

### C. Shannon Polyglot Entropy ($H$)
To capture code architectural diversity:
$$H = -\sum_{i=1}^{N} p_i \log_2(p_i), \quad p_i = \frac{\text{bytes}_i}{\sum \text{bytes}}$$
- Monolingual repos ($H = 0$) generate smooth, stratified oceanic terrains.
- Polyglot repos ($H > 1.5$) produce intricate tectonic plates ($uNoiseScale \in [2.0, 4.8]$, $uRoughness \in [0.25, 0.75]$).

---

## 5. Security & Zero-Code-Ingestion Standard

1. **Zero Source Code Guarantee**:
   - The application explicitly excludes `/contents`, `/git/trees`, `/git/blobs`, tarballs, or local repository cloning.
   - All visual characteristics are synthesized exclusively from high-level numerical telemetry.
2. **Server-Side Token Isolation**:
   - Optional `GITHUB_TOKEN` is consumed purely in server memory (`process.env.GITHUB_TOKEN`).
   - Never exposed in HTML bundles, client-side React state, or API responses.
3. **Content Security Policy (CSP)**:
   - Configured in `next.config.ts` enforcing `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, and permitting WebGL worker blobs.

---

## 6. Developer & Operations Guide

### Prerequisites
- Node.js v20+ (Node v24 recommended)
- npm v10+

### Setup & Run Commands
```bash
# Install dependencies
npm install

# Run automated unit test suite
npm test

# Run Playwright end-to-end regression tests
npm run test:e2e

# Run all test suites
npm run test:all

# Production build
npm run build

# Start local production server
npm start
```
