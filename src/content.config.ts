import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { projectSchema, devopsAcademySchema } from '@/lib/content-schemas';

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.mdx', base: './src/content/projects' }),
  schema: projectSchema,
});

const devopsAcademy = defineCollection({
  loader: glob({ pattern: '**/[^_]*.mdx', base: './src/content/devops-academy' }),
  schema: devopsAcademySchema,
});

export const collections = { projects, devopsAcademy };
