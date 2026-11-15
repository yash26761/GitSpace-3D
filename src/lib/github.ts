/**
 * GitSpace 3D — GitHub Telemetry Client
 * Developed by Kore (Backend Developer)
 * 
 * STRICT ZERO CODE INGESTION POLICY:
 * Retrieves public repository metadata and language breakdown ONLY.
 * Never requests repository file trees, blobs, or code contents.
 */

import { GitHubRepoRaw, RepoTelemetry, RateLimitInfo } from "./types";

const GITHUB_API_BASE = "https://api.github.com";

export class GitHubApiError extends Error {
  statusCode: number;
  code: "INVALID_INPUT" | "NOT_FOUND" | "RATE_LIMITED" | "GITHUB_ERROR";
  rateLimit?: RateLimitInfo;

  constructor(
    message: string,
    statusCode: number,
    code: "INVALID_INPUT" | "NOT_FOUND" | "RATE_LIMITED" | "GITHUB_ERROR",
    rateLimit?: RateLimitInfo
  ) {
    super(message);
    this.name = "GitHubApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.rateLimit = rateLimit;
  }
}

/**
 * Validates repository slug format: "owner/repo"
 */
export function validateRepoSlug(slug: string): { owner: string; repo: string } {
  if (!slug || typeof slug !== "string") {
    throw new GitHubApiError("Repository identifier must be a non-empty string.", 400, "INVALID_INPUT");
  }

  const trimmed = slug.trim().replace(/^https?:\/\/github\.com\//i, "").replace(/\/+$/, "");
  const parts = trimmed.split("/");

  if (parts.length !== 2) {
    throw new GitHubApiError(
      `Invalid repository format "${slug}". Expected "owner/repo" (e.g. facebook/react).`,
      400,
      "INVALID_INPUT"
    );
  }

  const [owner, repo] = parts;
  const validIdentifier = /^[a-zA-Z0-9_.-]+$/;

  if (!validIdentifier.test(owner) || !validIdentifier.test(repo)) {
    throw new GitHubApiError(
      `Invalid characters in repository slug "${slug}". Only alphanumeric characters, dashes, dots, and underscores are permitted.`,
      400,
      "INVALID_INPUT"
    );
  }

  return { owner, repo };
}

/**
 * Extracts standard GitHub rate-limit headers from response.
 */
function extractRateLimits(headers: Headers): RateLimitInfo {
  return {
    limit: parseInt(headers.get("x-ratelimit-limit") || "60", 10),
    remaining: parseInt(headers.get("x-ratelimit-remaining") || "0", 10),
    reset: parseInt(headers.get("x-ratelimit-reset") || "0", 10),
  };
}

/**
 * Builds request headers safely on server side.
 * Never exposes token to client-side.
 */
function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "GitSpace-3D/1.0",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // Optional GitHub token to elevate rate limits from 60/hr to 5,000/hr
  const token = process.env.GITHUB_TOKEN;
  if (token && token.trim().length > 0) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  return headers;
}

/**
 * Fetches public repository metadata and language composition.
 * Strict Zero-Code-Ingestion enforcement:
 * Queries only /repos/{owner}/{repo} and /repos/{owner}/{repo}/languages.
 */
export async function fetchRepoTelemetry(slug: string): Promise<{
  telemetry: RepoTelemetry;
  rateLimit: RateLimitInfo;
}> {
  const { owner, repo } = validateRepoSlug(slug);
  const headers = buildHeaders();

  // 1. Fetch Repository Metadata
  const repoUrl = `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  
  let repoRes: Response;
  try {
    repoRes = await fetch(repoUrl, {
      headers,
      next: { revalidate: 0 }, // Handled by our in-memory LRU cache
    });
  } catch (err: any) {
    throw new GitHubApiError(
      `Failed to reach GitHub API: ${err?.message || "Network error"}`,
      502,
      "GITHUB_ERROR"
    );
  }

  const rateLimit = extractRateLimits(repoRes.headers);

  if (repoRes.status === 404) {
    throw new GitHubApiError(
      `GitHub repository "${owner}/${repo}" was not found or is private.`,
      404,
      "NOT_FOUND",
      rateLimit
    );
  }

  if (repoRes.status === 403 || repoRes.status === 429) {
    const isRateLimited = rateLimit.remaining === 0;
    const resetDate = rateLimit.reset ? new Date(rateLimit.reset * 1000).toLocaleTimeString() : "soon";
    throw new GitHubApiError(
      isRateLimited
        ? `GitHub API rate limit exceeded. Limit resets at ${resetDate}.`
        : "Access to GitHub repository was denied.",
      429,
      "RATE_LIMITED",
      rateLimit
    );
  }

  if (!repoRes.ok) {
    throw new GitHubApiError(
      `GitHub API responded with error status ${repoRes.status}: ${repoRes.statusText}`,
      repoRes.status,
      "GITHUB_ERROR",
      rateLimit
    );
  }

  const repoData: GitHubRepoRaw = await repoRes.json();

  // 2. Fetch Repository Language Distribution
  let languages: Record<string, number> = {};
  let totalBytes = 0;

  try {
    const langUrl = `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`;
    const langRes = await fetch(langUrl, { headers });
    if (langRes.ok) {
      languages = await langRes.json();
      totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    }
  } catch {
    // If language breakdown fails, fallback gracefully to repoData.language
    if (repoData.language) {
      languages[repoData.language] = 100000;
      totalBytes = 100000;
    }
  }

  // 3. Normalize Telemetry
  const telemetry: RepoTelemetry = {
    id: repoData.id,
    name: repoData.name,
    fullName: repoData.full_name,
    description: repoData.description || "No cosmic description provided.",
    url: repoData.html_url,
    owner: {
      login: repoData.owner.login,
      avatarUrl: repoData.owner.avatar_url,
      type: repoData.owner.type,
    },
    metrics: {
      stars: repoData.stargazers_count ?? 0,
      forks: repoData.forks_count ?? 0,
      openIssues: repoData.open_issues_count ?? 0,
      watchers: repoData.subscribers_count ?? repoData.watchers_count ?? 0,
      sizeKB: repoData.size ?? 0,
      primaryLanguage: repoData.language || "Unknown",
      languages,
      totalBytes,
      createdAt: repoData.created_at,
      updatedAt: repoData.updated_at,
      pushedAt: repoData.pushed_at,
      defaultBranch: repoData.default_branch || "main",
      isArchived: Boolean(repoData.archived),
    },
    cachedAt: Date.now(),
  };

  return { telemetry, rateLimit };
}
