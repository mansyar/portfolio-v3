import { describe, it, expect } from 'vitest';
import { projectSchema, devopsAcademySchema } from '@/lib/content-schemas';

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

const validDevopsAcademy = {
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

describe('DevOps Academy Schema', () => {
  it('should parse a valid devops academy entry', () => {
    const result = devopsAcademySchema.parse(validDevopsAcademy);
    expect(result.title).toBe('Docker Basics');
    expect(result.category).toBe('Docker');
    expect(result.order).toBe(1);
  });

  it('should require category field', () => {
    expect(() => devopsAcademySchema.parse(without(validDevopsAcademy, 'category'))).toThrow();
  });

  it('should reject negative order', () => {
    expect(() => devopsAcademySchema.parse({ ...validDevopsAcademy, order: -1 })).toThrow();
  });

  it('should require description', () => {
    expect(() => devopsAcademySchema.parse(without(validDevopsAcademy, 'description'))).toThrow();
  });

  it('should accept category values: Docker, Linux, CI/CD', () => {
    expect(devopsAcademySchema.parse({ ...validDevopsAcademy, category: 'Linux' }).category).toBe(
      'Linux',
    );
    expect(devopsAcademySchema.parse({ ...validDevopsAcademy, category: 'CI/CD' }).category).toBe(
      'CI/CD',
    );
  });
});
