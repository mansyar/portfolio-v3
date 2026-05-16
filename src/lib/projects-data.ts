/**
 * Static project metadata extracted from MDX frontmatter.
 * Used by the Explorer detail pane at runtime — avoids importing MDX.
 */

export interface ProjectMetadata {
  title: string;
  description: string;
  repoUrl: string;
  language: string;
  techStack: string[];
  stars: number;
  lastCommit: string;
  status: string;
}

export interface ArticleMetadata {
  title: string;
  description: string;
  category: string;
  order: number;
  lastUpdated: string;
}

export const PROJECTS_METADATA: Record<string, ProjectMetadata> = {
  'icarus-server-manager': {
    title: 'Icarus Server Manager',
    description:
      'A lightweight, self-hosted server management dashboard for monitoring system metrics, managing Docker containers, and orchestrating deployments via a clean web UI.',
    repoUrl: 'https://github.com/mansyar/icarus-server-manager',
    language: 'TypeScript',
    techStack: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'Redis'],
    stars: 142,
    lastCommit: '2026-04-15',
    status: 'active',
  },
  'chasing-chapters': {
    title: 'Chasing Chapters',
    description:
      'A community-driven book discovery and reading tracker app with personalized recommendations, reading streaks, and social features for book enthusiasts.',
    repoUrl: 'https://github.com/mansyar/chasing-chapters',
    language: 'Python',
    techStack: ['Python', 'Django', 'PostgreSQL', 'Elasticsearch', 'Redis', 'Celery'],
    stars: 89,
    lastCommit: '2026-03-28',
    status: 'active',
  },
  'terminal-tactics': {
    title: 'Terminal Tactics',
    description:
      'A turn-based tactical strategy game played entirely in the terminal, featuring AI opponents, procedural maps, and a robust plugin system for custom game modes.',
    repoUrl: 'https://github.com/mansyar/terminal-tactics',
    language: 'TypeScript',
    techStack: ['TypeScript', 'Node.js', 'Ink', 'React', 'Vitest', 'GitHub Actions'],
    stars: 0,
    lastCommit: '2026-05-01',
    status: 'active',
  },
  simulacra: {
    title: 'Simulacra',
    description:
      'An autonomous AI "Ant Farm" — a persistent virtual world where AI agents live, work, and socialize. Built with TanStack Start, PixiJS, and Convex.',
    repoUrl: 'https://github.com/mansyar/simulacra',
    language: 'TypeScript',
    techStack: [
      'TanStack Start',
      'React',
      'TypeScript',
      'PixiJS v8',
      'Convex',
      'Groq API',
      'Tailwind CSS',
      'Framer Motion',
    ],
    stars: 0,
    lastCommit: '2026-04-15',
    status: 'wip',
  },
  'tubular-bexus-osw': {
    title: 'Tubular Bexus OSW',
    description:
      'An experimental real-time data pipeline framework for streaming ETL transformations, built with a custom actor model for fault-tolerant, low-latency data processing.',
    repoUrl: 'https://github.com/mansyar/tubular-bexus-osw',
    language: 'Rust',
    techStack: ['Rust', 'Apache Kafka', 'Arrow', 'Tokio', 'gRPC'],
    stars: 67,
    lastCommit: '2026-04-10',
    status: 'active',
  },
};

export const ARTICLES_METADATA: Record<string, ArticleMetadata> = {
  'docker-basics': {
    title: 'Docker Basics',
    description:
      'Learn the fundamentals of Docker — containers, images, Dockerfiles, and basic CLI commands to get started with containerization.',
    category: 'DevOps',
    order: 1,
    lastUpdated: '2026-05-13',
  },
  'linux-essentials': {
    title: 'Linux Essentials',
    description:
      'Essential Linux commands and system administration concepts for DevOps engineers.',
    category: 'DevOps',
    order: 2,
    lastUpdated: '2026-05-13',
  },
  'ci-cd-pipeline': {
    title: 'CI/CD Pipeline',
    description:
      'A practical guide to setting up continuous integration and deployment pipelines using GitHub Actions.',
    category: 'DevOps',
    order: 3,
    lastUpdated: '2026-05-13',
  },
  'microservices-patterns': {
    title: 'Microservices Patterns',
    description:
      'A comprehensive overview of common microservices architectural patterns — service decomposition, communication strategies, data management, and observability.',
    category: 'Software Engineering',
    order: 1,
    lastUpdated: '2026-05-13',
  },
  'llm-fine-tuning': {
    title: 'LLM Fine-Tuning Guide',
    description:
      'A practical guide to fine-tuning large language models — from data preparation and LoRA techniques to evaluation and deployment considerations.',
    category: 'AI',
    order: 1,
    lastUpdated: '2026-05-13',
  },
  'agent-assisted-coding': {
    title: 'Agent-Assisted Coding (Spec-Driven Development)',
    description:
      'A deep dive into the Conductor methodology — spec-first development, AI-assisted workflows, and best practices for agent-driven software development.',
    category: 'Software Engineering',
    order: 2,
    lastUpdated: '2026-05-16',
  },
  tdd: {
    title: 'Test-Driven Development (TDD)',
    description:
      'Master the Red-Green-Refactor cycle, learn testing best practices, understand coverage thresholds, and integrate TDD into modern development workflows.',
    category: 'Software Engineering',
    order: 3,
    lastUpdated: '2026-05-16',
  },
  'database-design-patterns': {
    title: 'Database Design Patterns',
    description:
      'A comprehensive guide to database design — SQL vs NoSQL trade-offs, indexing strategies, normalization forms, sharding patterns, and real-world design decisions.',
    category: 'Software Engineering',
    order: 4,
    lastUpdated: '2026-05-16',
  },
};

// ── Contact Metadata ──────────────────────────────────────────────

export interface ContactMetadata {
  name: string;
  title: string;
  email: string;
  github: string;
  linkedin: string;
  location: string;
}

export const CONTACT_METADATA: ContactMetadata = {
  name: 'Muhammad Ansyar Rafi Putra',
  title: 'Software Engineer (DevOps & Data)',
  email: 'your.email@example.com',
  github: 'github.com/mansyar',
  linkedin: 'linkedin.com/in/your-profile',
  location: 'Indonesia',
};

// ── Recycle Bin Metadata ──────────────────────────────────────────

export interface RecycleBinItem {
  title: string;
  status: string;
  description: string;
  repoUrl: string;
}

export const RECYCLE_BIN_METADATA: Record<string, RecycleBinItem> = {
  'chasing-chapters-v1': {
    title: 'chasing-chapters (v1)',
    status: 'archived',
    description:
      'Original version of the chasing-chapters project (pre-v2). This version has been superseded by the current active version.',
    repoUrl: 'https://github.com/mansyar/chasing-chapters',
  },
};
