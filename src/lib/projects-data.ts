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
