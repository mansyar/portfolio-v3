/**
 * Virtual filesystem type definitions and static tree constant.
 *
 * The dynamic FILE_SYSTEM tree is generated at build time by
 * scripts/generate-filesystem.mjs (output to filesystem.json).
 * The static tree below serves as the source of truth for dev mode
 * and tests. At build time, generate-filesystem.mjs produces a matching
 * trees from compiled content JSON.
 */

// ── Discriminated union types ──────────────────────────────────────

export interface FSDrive {
  type: 'drive';
  name: string;
  icon: string;
  children: FSFolder[];
}

export interface FSFolder {
  type: 'folder';
  name: string;
  icon: string;
  children: FSNode[];
}

export interface FSFile {
  type: 'file';
  name: string;
  icon: string;
  /** Slug referencing the MDX entry in the content collection */
  slug: string;
  /** Human-readable size string (e.g. "1.2 KB") */
  size: string;
}

export type FSNode = FSDrive | FSFolder | FSFile;

// ── Full filesystem tree ───────────────────────────────────────────

export const FILE_SYSTEM: FSDrive[] = [
  {
    type: 'drive',
    name: 'C:',
    icon: '/icons/drive-c.svg',
    children: [
      {
        type: 'folder',
        name: 'Software_Engineering',
        icon: '/icons/folder.svg',
        children: [
          {
            type: 'file',
            name: 'icarus-server-manager.mdx',
            icon: '/icons/file.svg',
            slug: 'icarus-server-manager',
            size: '1.5 KB',
          },
          {
            type: 'file',
            name: 'chasing-chapters.mdx',
            icon: '/icons/file.svg',
            slug: 'chasing-chapters',
            size: '1.3 KB',
          },
          {
            type: 'file',
            name: 'terminal-tactics.mdx',
            icon: '/icons/file.svg',
            slug: 'terminal-tactics',
            size: '2.0 KB',
          },
          {
            type: 'file',
            name: 'simulacra.mdx',
            icon: '/icons/file.svg',
            slug: 'simulacra',
            size: '2.0 KB',
          },
        ],
      },
    ],
  },
  {
    type: 'drive',
    name: 'D:',
    icon: '/icons/drive-d.svg',
    children: [
      {
        type: 'folder',
        name: 'Systems_Data',
        icon: '/icons/folder.svg',
        children: [
          {
            type: 'file',
            name: 'tubular-bexus-osw.mdx',
            icon: '/icons/file.svg',
            slug: 'tubular-bexus-osw',
            size: '1.8 KB',
          },
        ],
      },
      {
        type: 'folder',
        name: 'My_Documents',
        icon: '/icons/folder.svg',
        children: [
          {
            type: 'file',
            name: 'Resume.pdf',
            icon: '/icons/file.svg',
            slug: 'resume',
            size: '0 B',
          },
          {
            type: 'folder',
            name: 'Certs',
            icon: '/icons/folder.svg',
            children: [],
          },
          {
            type: 'file',
            name: 'Contact.txt',
            icon: '/icons/file.svg',
            slug: 'contact',
            size: '0.5 KB',
          },
        ],
      },
    ],
  },
  {
    type: 'drive',
    name: 'E:',
    icon: '/icons/drive-e.svg',
    children: [
      {
        type: 'folder',
        name: 'Knowledge_Base',
        icon: '/icons/folder.svg',
        children: [
          {
            type: 'folder',
            name: 'DevOps',
            icon: '/icons/folder.svg',
            children: [
              {
                type: 'file',
                name: 'docker-basics.mdx',
                icon: '/icons/file.svg',
                slug: 'docker-basics',
                size: '1.1 KB',
              },
              {
                type: 'file',
                name: 'linux-essentials.mdx',
                icon: '/icons/file.svg',
                slug: 'linux-essentials',
                size: '1.2 KB',
              },
              {
                type: 'file',
                name: 'ci-cd-pipeline.mdx',
                icon: '/icons/file.svg',
                slug: 'ci-cd-pipeline',
                size: '1.4 KB',
              },
            ],
          },
          {
            type: 'folder',
            name: 'Software_Engineering',
            icon: '/icons/folder.svg',
            children: [
              {
                type: 'file',
                name: 'microservices-patterns.mdx',
                icon: '/icons/file.svg',
                slug: 'microservices-patterns',
                size: '2.3 KB',
              },
            ],
          },
          {
            type: 'folder',
            name: 'AI',
            icon: '/icons/folder.svg',
            children: [
              {
                type: 'file',
                name: 'llm-fine-tuning.mdx',
                icon: '/icons/file.svg',
                slug: 'llm-fine-tuning',
                size: '2.5 KB',
              },
            ],
          },
        ],
      },
    ],
  },
];
