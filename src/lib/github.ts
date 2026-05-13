/**
 * GitHub API fetch layer for build-time data sync.
 *
 * Provides functions to fetch repository statistics and commit counts
 * from the GitHub REST API. Supports optional GITHUB_TOKEN authentication
 * and configurable request timeout.
 *
 * @module
 */

// ── Types ────────────────────────────────────────────────────────────

export interface GitHubRepoData {
  name: string;
  stargazers_count: number;
  pushed_at: string;
  default_branch: string;
  language: string | null;
}

export interface GitHubCommitCountResponse {
  count: number;
}

// ── Configuration ────────────────────────────────────────────────────

const DEFAULT_TIMEOUT_MS = 10_000;
const GITHUB_API_BASE = 'https://api.github.com';

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Create a fetch-compatible RequestInit with optional auth and timeout signal.
 */
function buildRequestOptions(signal?: AbortSignal): RequestInit {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'luna-os-portfolio/1.0',
  };

  const token = process.env.GITHUB_TOKEN || '';
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return { headers, signal };
}

/**
 * Create an AbortSignal that aborts after `ms` milliseconds.
 */
function createTimeoutSignal(ms: number = DEFAULT_TIMEOUT_MS): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(new Error(`Request timed out after ${ms}ms`)), ms);
  return controller.signal;
}

/**
 * Parse the `Link` header from a GitHub API response to extract the
 * `rel="last"` page number, which represents the total commit count.
 *
 * @example
 * parseLinkHeader('<https://api.github.com/repos/foo/bar/commits?per_page=1&page=10>; rel="last"')
 * // → 10
 */
function parseLinkHeader(linkHeader: string | null): number | null {
  if (!linkHeader) return null;

  const match = linkHeader.match(/<(?:[^>]+\?)per_page=\d+&page=(\d+)>; rel="last"/);
  if (!match) return null;

  return parseInt(match[1]!, 10);
}

// ── API Functions ────────────────────────────────────────────────────

/**
 * Fetch repository metadata from the GitHub API.
 *
 * @param owner - Repository owner (user or organisation)
 * @param repo  - Repository name
 * @param timeoutMs - Optional timeout in milliseconds (default 10_000)
 * @returns Parsed repository data
 * @throws If the API returns a non-200 status or the request times out
 */
export async function fetchRepoStats(
  owner: string,
  repo: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<GitHubRepoData> {
  const signal = createTimeoutSignal(timeoutMs);
  const url = `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  const options = buildRequestOptions(signal);

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText} for ${owner}/${repo}`,
    );
  }

  const data: GitHubRepoData = await response.json();

  return {
    name: data.name,
    stargazers_count: data.stargazers_count,
    pushed_at: data.pushed_at,
    default_branch: data.default_branch,
    language: data.language,
  };
}

/**
 * Fetch total commit count for a repository by parsing the `Link` header
 * from a paginated commits endpoint request.
 *
 * Uses `per_page=1` to minimise response body size — only the header matters.
 *
 * @param owner - Repository owner
 * @param repo  - Repository name
 * @param timeoutMs - Optional timeout in milliseconds (default 10_000)
 * @returns Total number of commits
 * @throws If the API returns a non-200 status, the `Link` header is malformed,
 *         or the request times out
 */
export async function fetchRepoCommitCount(
  owner: string,
  repo: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<number> {
  const signal = createTimeoutSignal(timeoutMs);
  const url = `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?per_page=1&page=1`;
  const options = buildRequestOptions(signal);

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText} for ${owner}/${repo} commits`,
    );
  }

  const linkHeader = response.headers.get('Link');
  const count = parseLinkHeader(linkHeader);

  if (count === null && linkHeader !== null) {
    // A Link header was present but couldn't be parsed — malformed
    throw new Error(`Malformed Link header for ${owner}/${repo}: ${linkHeader}`);
  }

  // If no Link header, there's only one page (1 commit, or fewer)
  return count ?? 1;
}
