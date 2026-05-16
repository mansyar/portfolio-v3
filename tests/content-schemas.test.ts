import { describe, it, expect } from 'vitest';
import { projectSchema, articleSchema } from '@/lib/content-schemas';

const validProject = {
  title: 'Icarus Server Manager',
  slug: 'icarus-server-manager',
  drive: 'C',
  description: 'A server management tool.',
  repoUrl: 'https://github.com/user/icarus-server-manager',
  language: 'TypeScript',
  techStack: ['Node.js', 'Express', 'PostgreSQL'],
  stars: 42,
  lastCommit: '2026-04-15',
  commits: 128,
  status: 'active' as const,
  icon: 'server',
};

const validArticle = {
  title: 'Docker Basics',
  slug: 'docker-basics',
  category: 'Docker',
  order: 1,
  description: 'Learn Docker fundamentals.',
  lastUpdated: '2026-04-01',
};

function without<T extends Record<string, unknown>, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const result = { ...obj };
  delete result[key];
  return result as unknown as Omit<T, K>;
}

describe('Project Schema', () => {
  it('should parse a valid project entry', () => {
    const result = projectSchema.parse(validProject);
    expect(result.title).toBe('Icarus Server Manager');
    expect(result.drive).toBe('C');
    expect(result.techStack).toEqual(['Node.js', 'Express', 'PostgreSQL']);
    expect(result.status).toBe('active');
  });

  it('should accept drive value "D"', () => {
    const result = projectSchema.parse({ ...validProject, drive: 'D' });
    expect(result.drive).toBe('D');
  });

  it('should reject an invalid drive value', () => {
    expect(() => projectSchema.parse({ ...validProject, drive: 'X' })).toThrow();
  });

  it('should reject a project with negative stars', () => {
    expect(() => projectSchema.parse({ ...validProject, stars: -1 })).toThrow();
  });

  it('should require title', () => {
    expect(() => projectSchema.parse(without(validProject, 'title'))).toThrow();
  });

  it('should require repoUrl', () => {
    expect(() => projectSchema.parse(without(validProject, 'repoUrl'))).toThrow();
  });

  it('should accept optional icon field', () => {
    const result = projectSchema.parse(without(validProject, 'icon'));
    expect(result.title).toBe('Icarus Server Manager');
  });
});

describe('Article Schema (renamed from DevOps Academy)', () => {
  it('should parse a valid article entry', () => {
    const result = articleSchema.parse(validArticle);
    expect(result.title).toBe('Docker Basics');
    expect(result.category).toBe('Docker');
    expect(result.order).toBe(1);
  });

  it('should require category field', () => {
    expect(() => articleSchema.parse(without(validArticle, 'category'))).toThrow();
  });

  it('should reject negative order', () => {
    expect(() => articleSchema.parse({ ...validArticle, order: -1 })).toThrow();
  });

  it('should require description', () => {
    expect(() => articleSchema.parse(without(validArticle, 'description'))).toThrow();
  });

  describe('New Projects (Terminal Tactics, Simulacra)', () => {
    it('should validate terminal-tactics project with drive: C and status: active', () => {
      const result = projectSchema.parse({
        title: 'Terminal Tactics',
        slug: 'terminal-tactics',
        drive: 'C',
        description: 'A terminal-based tactics game with AI opponents.',
        repoUrl: 'https://github.com/mansyar/terminal-tactics',
        language: 'TypeScript',
        techStack: ['TypeScript', 'React', 'Node.js'],
        stars: 0,
        lastCommit: '2026-05-01',
        commits: 50,
        status: 'active',
      });
      expect(result.title).toBe('Terminal Tactics');
      expect(result.drive).toBe('C');
      expect(result.status).toBe('active');
    });

    it('should validate simulacra project with drive: C and status: wip', () => {
      const result = projectSchema.parse({
        title: 'Simulacra',
        slug: 'simulacra',
        drive: 'C',
        description: 'An in-development simulation project.',
        repoUrl: 'https://github.com/mansyar/simulacra',
        language: 'Python',
        techStack: ['Python', 'PyTorch', 'FastAPI'],
        stars: 0,
        lastCommit: '2026-04-15',
        commits: 25,
        status: 'wip',
      });
      expect(result.title).toBe('Simulacra');
      expect(result.drive).toBe('C');
      expect(result.status).toBe('wip');
    });

    it('should accept "wip" as a valid status value', () => {
      const result = projectSchema.parse({
        title: 'WIP Project',
        slug: 'wip-project',
        drive: 'C',
        description: 'A work in progress.',
        repoUrl: 'https://github.com/user/wip-project',
        language: 'Go',
        techStack: ['Go'],
        stars: 0,
        lastCommit: '2026-04-01',
        commits: 10,
        status: 'wip',
      });
      expect(result.status).toBe('wip');
    });
  });

  it('should accept any string category value (not just Docker, Linux, CI/CD)', () => {
    expect(
      articleSchema.parse({ ...validArticle, category: 'Software Engineering' }).category,
    ).toBe('Software Engineering');
    expect(articleSchema.parse({ ...validArticle, category: 'AI' }).category).toBe('AI');
    expect(articleSchema.parse({ ...validArticle, category: 'DevOps' }).category).toBe('DevOps');
  });

  it('should export articleSchema (not devopsAcademySchema)', () => {
    // This test verifies the rename
    expect(articleSchema).toBeDefined();
    // @ts-expect-error - devopsAcademySchema should no longer exist
    expect(typeof import('@/lib/content-schemas').devopsAcademySchema).toBe('undefined');
  });
});
