export const SITE_NAME = 'GitSpace 3D';
export const SITE_TAGLINE = 'Your GitHub. Your Universe.';
export const SITE_DESCRIPTION =
  'Transform your GitHub repositories into an interactive 3D universe. Explore codebases as celestial planetary systems with real-time orbits, activity-driven topology, and GPU-accelerated rendering.';
export const SITE_URL = 'https://gitspace3d.dev';

export const NAV_LINKS = [
  { label: 'Overview', href: '#overview' },
  { label: 'Visualization', href: '#visualization' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
] as const;

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  category: string;
  iconName: 'Globe' | 'Sparkles' | 'BarChart3' | 'Orbit' | 'Shield' | 'Zap';
}

export const FEATURES: FeatureItem[] = [
  {
    id: 'planetary-mapping',
    title: 'Planetary Architecture',
    description:
      'Every repository manifests as a unique celestial world. Size, atmosphere, surface topology, and rings are shaped by your architectural complexity.',
    category: 'Visual Engine',
    iconName: 'Globe',
  },
  {
    id: 'orbital-velocity',
    title: 'Dynamic Orbital Physics',
    description:
      'Repository commit frequency and active branches translate directly into orbital velocity and cosmic gravitational fields in real-time space.',
    category: 'Dynamics',
    iconName: 'Orbit',
  },
  {
    id: 'multidimensional-insights',
    title: 'Deep Cosmological Telemetry',
    description:
      'Inspect any planetary body to analyze commit distribution, language composition, contributors, and pull request velocity at a glance.',
    category: 'Analytics',
    iconName: 'BarChart3',
  },
  {
    id: 'adaptive-lighting',
    title: 'GPU-Accelerated Shaders',
    description:
      'Powered by Three.js and WebGL 2.0 with custom physically based rendering (PBR), atmospheric scattering, and 60 FPS performance.',
    category: 'Performance',
    iconName: 'Zap',
  },
  {
    id: 'zero-source-exposure',
    title: 'Zero Code Ingestion',
    description:
      'Complete privacy guaranteed. GitSpace 3D computes visual topology purely from public repository metadata and commits — your source code never leaves GitHub.',
    category: 'Security',
    iconName: 'Shield',
  },
  {
    id: 'ecosystem-evolution',
    title: 'Living Ecosystem',
    description:
      'Watch your universe expand as you push code. New repositories ignite as proto-planets, active sprints glow brighter, and merged PRs emit solar pulses.',
    category: 'Evolution',
    iconName: 'Sparkles',
  },
];

export interface StepItem {
  step: string;
  title: string;
  description: string;
  detail: string;
}

export const STEPS: StepItem[] = [
  {
    step: '01',
    title: 'Connect GitHub Identity',
    description: 'Authenticate securely via GitHub OAuth with read-only permissions.',
    detail: 'No write permissions or raw codebase downloads requested. Only repository telemetry is queried.',
  },
  {
    step: '02',
    title: 'Synthesize Star System',
    description: 'Our engine computes planetary geometry, radii, orbital radii, and material shaders.',
    detail: 'Repositories are procedurally arranged into stable orbits around your central profile star.',
  },
  {
    step: '03',
    title: 'Navigate the 3D Cosmos',
    description: 'Freely explore your repository universe through full 3D orbital camera controls.',
    detail: 'Fly between planetary systems, inspect planetary cores, and view development momentum.',
  },
];

export const SYSTEM_METRICS = [
  { label: 'Rendering Pipeline', value: 'WebGL 2.0 / R3F' },
  { label: 'Target Framerate', value: '60 FPS Ultra-Smooth' },
  { label: 'Privacy Standard', value: 'Zero Code Storage' },
  { label: 'Visual Engine', value: 'Physical-Based Shaders' },
] as const;
