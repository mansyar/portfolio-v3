import { z } from 'zod';

/**
 * Schema for project MDX frontmatter.
 * Projects live on C: or D: drives.
 */
export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  drive: z.enum(['C', 'D'], { message: 'Drive must be C or D' }),
  description: z.string().min(1, 'Description is required'),
  repoUrl: z.string().url('Repo URL must be a valid URL'),
  language: z.string().min(1, 'Language is required'),
  techStack: z.array(z.string()).default([]),
  stars: z.number().int().nonnegative('Stars must be non-negative'),
  lastCommit: z.string().min(1, 'Last commit date is required'),
  commits: z.number().int().nonnegative('Commits must be non-negative'),
  status: z.enum(['active', 'archived', 'wip'], {
    message: 'Status must be active, archived, or wip',
  }),
  icon: z.string().optional(),
});

/**
 * Schema for DevOps Academy MDX frontmatter.
 * Articles live on E: drive, grouped by category.
 */
export const devopsAcademySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  category: z.enum(['Docker', 'Linux', 'CI/CD'], {
    message: 'Category must be Docker, Linux, or CI/CD',
  }),
  order: z.number().int().nonnegative('Order must be non-negative'),
  description: z.string().min(1, 'Description is required'),
  lastUpdated: z.string().min(1, 'Last updated date is required'),
});

/** Inferred types from schemas */
export type Project = z.infer<typeof projectSchema>;
export type DevopsAcademy = z.infer<typeof devopsAcademySchema>;
