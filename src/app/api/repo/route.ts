/**
 * GitSpace 3D — Repository Telemetry & Visual DNA Route Handler
 * Developed by Kore (Backend Developer) & Atlas (Research Analyst)
 * 
 * GET /api/repo?repo=owner/repo
 * POST /api/repo { "repo": "owner/repo" }
 * 
 * NON-NEGOTIABLE ZERO CODE INGESTION:
 * Fetches and processes public metadata only. Never downloads repository files.
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchRepoTelemetry, validateRepoSlug, GitHubApiError } from "@/lib/github";
import { repoTelemetryCache } from "@/lib/cache";
import { generatePlanetaryVisualDNA } from "@/lib/visualDna";
import { RepoApiResponse, RepoTelemetry, PlanetaryVisualDNA } from "@/lib/types";

interface CachedRepoData {
  telemetry: RepoTelemetry;
  visualDna: PlanetaryVisualDNA;
}

async function handleRepoRequest(slug: string): Promise<NextResponse<RepoApiResponse>> {
  // 1. Validate Input Slug
  let validated: { owner: string; repo: string };
  try {
    validated = validateRepoSlug(slug);
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Invalid repository format",
        code: "INVALID_INPUT",
      },
      { status: 400 }
    );
  }

  const normalizedSlug = `${validated.owner}/${validated.repo}`.toLowerCase();
  const cacheKey = `repo:${normalizedSlug}`;

  // 2. Check In-Memory LRU Cache
  const cached = repoTelemetryCache.get(cacheKey) as CachedRepoData | undefined;
  if (cached) {
    return NextResponse.json(
      {
        success: true,
        telemetry: cached.telemetry,
        visualDna: cached.visualDna,
        cached: true,
      },
      {
        status: 200,
        headers: {
          "X-Cache": "HIT",
          "Cache-Control": "public, max-age=600, stale-while-revalidate=300",
        },
      }
    );
  }

  // 3. Fetch from GitHub API and Generate Visual DNA
  try {
    const { telemetry, rateLimit } = await fetchRepoTelemetry(normalizedSlug);
    const visualDna = generatePlanetaryVisualDNA(telemetry);

    // 4. Store in LRU Cache (15 min TTL)
    repoTelemetryCache.set(cacheKey, { telemetry, visualDna }, 15 * 60 * 1000);

    return NextResponse.json(
      {
        success: true,
        telemetry,
        visualDna,
        rateLimit,
        cached: false,
      },
      {
        status: 200,
        headers: {
          "X-Cache": "MISS",
          "Cache-Control": "public, max-age=600, stale-while-revalidate=300",
        },
      }
    );
  } catch (err: any) {
    if (err instanceof GitHubApiError) {
      return NextResponse.json(
        {
          success: false,
          error: err.message,
          code: err.code,
          rateLimit: err.rateLimit,
        },
        { status: err.statusCode }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected internal server error occurred while retrieving repository telemetry.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get("repo") || searchParams.get("q");

  if (!repo) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing required query parameter 'repo' (e.g. /api/repo?repo=facebook/react)",
        code: "INVALID_INPUT",
      },
      { status: 400 }
    );
  }

  return handleRepoRequest(repo);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const repo = body.repo || body.query;

    if (!repo) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required body property 'repo' (e.g. { \"repo\": \"facebook/react\" })",
          code: "INVALID_INPUT",
        },
        { status: 400 }
      );
    }

    return handleRepoRequest(repo);
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Malformed JSON request body.",
        code: "INVALID_INPUT",
      },
      { status: 400 }
    );
  }
}
