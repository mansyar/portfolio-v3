import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { projectSchema, articleSchema } from '@/lib/content-schemas';

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.mdx', base: './src/content/projects' }),
  schema: projectSchema,
});

const articles = defineCollection({
  loader: glob({ pattern: '**/[^_]*.mdx', base: './src/content/articles' }),
  schema: articleSchema,
});

export const collections = { projects, articles };
