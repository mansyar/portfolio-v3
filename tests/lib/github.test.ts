import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock fetch globally ─────────────────────────────────────────────

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Module under test — loaded after mocks are set up
let github: typeof import('@/lib/github');

beforeEach(async () => {
  vi.resetAllMocks();
  // Re-import to get fresh module state
  github = await import('@/lib/github');
});

// ── Helpers ──────────────────────────────────────────────────────────

function buildJsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function buildCommitsResponse(linkHeader?: string): Response {
  return new Response(JSON.stringify([]), {
    status: 200,
    headers: linkHeader ? { Link: linkHeader } : {},
  });
}

// ── Type checks ─────────────────────────────────────────────────────

describe('GitHubRepoData type shape', () => {
  it('should export GitHubRepoData interface with required fields', async () => {
    // Import the type (compile-time check)
    const data: import('@/lib/github').GitHubRepoData = {
      name: 'test-repo',
      stargazers_count: 42,
      pushed_at: '2026-04-15T10:00:00Z',
      default_branch: 'main',
      language: 'TypeScript',
    };
    expect(data.name).toBe('test-repo');
    expect(data.stargazers_count).toBe(42);
  });
});

// ── fetchRepoStats ──────────────────────────────────────────────────

describe('fetchRepoStats()', () => {
  it('should return correct shape for a valid repo', async () => {
    const apiResponse = {
      name: 'icarus-server-manager',
      stargazers_count: 142,
      pushed_at: '2026-04-15T10:00:00Z',
      default_branch: 'main',
      language: 'TypeScript',
    };
    mockFetch.mockResolvedValueOnce(buildJsonResponse(apiResponse));

    const result = await github.fetchRepoStats('ansyarr', 'icarus-server-manager');

    expect(result).toEqual({
      name: 'icarus-server-manager',
      stargazers_count: 142,
      pushed_at: '2026-04-15T10:00:00Z',
      default_branch: 'main',
      language: 'TypeScript',
    });
  });

  it('should call the correct GitHub API endpoint', async () => {
    mockFetch.mockResolvedValueOnce(
      buildJsonResponse({
        name: 'repo',
        stargazers_count: 0,
        pushed_at: '',
        default_branch: 'main',
        language: null,
      }),
    );

    await github.fetchRepoStats('ansyarr', 'test-repo');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/ansyarr/test-repo',
      expect.objectContaining({}),
    );
  });

  it('should pass GITHUB_TOKEN as Authorization header when set', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'test-token-123');
    // Re-import to pick up env var
    github = await import('@/lib/github');

    mockFetch.mockResolvedValueOnce(
      buildJsonResponse({
        name: 'repo',
        stargazers_count: 0,
        pushed_at: '',
        default_branch: 'main',
        language: null,
      }),
    );

    await github.fetchRepoStats('ansyarr', 'test-repo');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token-123',
        }),
      }),
    );

    vi.unstubAllEnvs();
  });

  it('should fallback to unauthenticated request when no GITHUB_TOKEN', async () => {
    vi.stubEnv('GITHUB_TOKEN', '');
    github = await import('@/lib/github');

    mockFetch.mockResolvedValueOnce(
      buildJsonResponse({
        name: 'repo',
        stargazers_count: 0,
        pushed_at: '',
        default_branch: 'main',
        language: null,
      }),
    );

    await github.fetchRepoStats('ansyarr', 'test-repo');

    const callArgs = mockFetch.mock.calls[0];
    const options = callArgs[1] as RequestInit;
    const headers = options.headers as Record<string, string> | undefined;
    expect(headers?.Authorization).toBeUndefined();

    vi.unstubAllEnvs();
  });

  it('should throw on non-200 response', async () => {
    mockFetch.mockResolvedValueOnce(buildJsonResponse({ message: 'Not found' }, 404));

    await expect(github.fetchRepoStats('ansyarr', 'nonexistent')).rejects.toThrow();
  });

  it('should throw on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(github.fetchRepoStats('ansyarr', 'test-repo')).rejects.toThrow('Network error');
  });

  it('should pass an AbortSignal to fetch', async () => {
    mockFetch.mockResolvedValueOnce(
      buildJsonResponse({
        name: 'repo',
        stargazers_count: 0,
        pushed_at: '',
        default_branch: 'main',
        language: null,
      }),
    );

    await github.fetchRepoStats('ansyarr', 'test-repo');

    const callArgs = mockFetch.mock.calls[0];
    const options = callArgs[1] as RequestInit;
    expect(options.signal).toBeDefined();
    expect(options.signal instanceof AbortSignal).toBe(true);
  });

  it('should throw with timeout error message for short timeout', async () => {
    // Mock fetch to delay longer than the timeout
    mockFetch.mockImplementationOnce(async (_url: string, options: RequestInit) => {
      // Create a promise that rejects when the signal aborts
      return new Promise((_resolve, reject) => {
        if (options.signal) {
          options.signal.addEventListener('abort', () => {
            reject(new Error(`Request timed out after`));
          });
        }
      });
    });

    // Use a very short timeout (50ms) to make it fast
    await expect(github.fetchRepoStats('ansyarr', 'test-repo', 50)).rejects.toThrow(/timed out/);
  }, 10000);
});

// ── fetchRepoCommitCount ────────────────────────────────────────────

describe('fetchRepoCommitCount()', () => {
  it('should return a number by parsing the Link header', async () => {
    mockFetch.mockResolvedValueOnce(
      buildCommitsResponse(
        '<https://api.github.com/repos/ansyarr/test-repo/commits?per_page=1&page=10>; rel="last"',
      ),
    );

    const count = await github.fetchRepoCommitCount('ansyarr', 'test-repo');
    expect(typeof count).toBe('number');
    expect(count).toBe(10);
  });

  it('should return 1 when no Link header (single page)', async () => {
    mockFetch.mockResolvedValueOnce(buildCommitsResponse(undefined));

    const count = await github.fetchRepoCommitCount('ansyarr', 'test-repo');
    expect(count).toBe(1);
  });

  it('should throw on non-200 response', async () => {
    mockFetch.mockResolvedValueOnce(buildJsonResponse({ message: 'Not found' }, 404));

    await expect(github.fetchRepoCommitCount('ansyarr', 'nonexistent')).rejects.toThrow();
  });

  it('should throw on malformed Link header', async () => {
    mockFetch.mockResolvedValueOnce(buildCommitsResponse('not-a-valid-link-header'));

    await expect(github.fetchRepoCommitCount('ansyarr', 'test-repo')).rejects.toThrow();
  });

  it('should throw on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(github.fetchRepoCommitCount('ansyarr', 'test-repo')).rejects.toThrow(
      'Network error',
    );
  });

  it('should throw with timeout error message for short timeout', async () => {
    mockFetch.mockImplementationOnce(async (_url: string, options: RequestInit) => {
      return new Promise((_resolve, reject) => {
        if (options.signal) {
          options.signal.addEventListener('abort', () => {
            reject(new Error(`Request timed out after`));
          });
        }
      });
    });

    await expect(github.fetchRepoCommitCount('ansyarr', 'test-repo', 50)).rejects.toThrow(
      /timed out/,
    );
  }, 10000);
});
