/**
 * Command Prompt — command registry, parser, and type definitions.
 *
 * All commands are registered in `COMMAND_REGISTRY` with their canonical name.
 * Aliases (e.g., `dir` → `ls`, `cls` → `clear`) share the same handler reference.
 */

import { getChildren, resolvePath, getParent } from '@/lib/filesystem';
import { PROJECTS_METADATA, ARTICLES_METADATA } from '@/lib/projects-data';
import { FILE_SYSTEM, type FSNode } from '@/lib/constants';

// ── Types ──────────────────────────────────────────────────────────

export interface CmdOutput {
  /** Lines of text to render in the terminal output area */
  lines: string[];
  /** If true, clear all output first (used by clear/cls) */
  clear?: boolean;
  /** If set, open an explorer window and navigate to this path */
  openExplorer?: string;
  /** If set, open a URL in a new browser tab */
  openUrl?: string;
  /** If set, update the cmdPath for this window (used by cd) */
  newCmdPath?: string;
}

export interface CmdContext {
  /** Current working directory path for the command window instance */
  cmdPath: string;
}

export type CommandHandler = (args: string[], context: CmdContext) => CmdOutput;

// ── Command Metadata ───────────────────────────────────────────────

export const COMMANDS: Record<string, string> = {
  help: 'Shows available commands and their descriptions',
  ls: 'Lists files and folders in the current directory',
  dir: 'Alias for ls',
  cd: 'Changes the current directory (supports ., .., \\, absolute paths)',
  chdir: 'Alias for cd',
  cat: 'Displays metadata for a project or article by slug',
  type: 'Alias for cat',
  clear: 'Clears the terminal screen and shows the welcome banner',
  cls: 'Alias for clear',
  neofetch: 'Displays Tux ASCII art and system information',
  open: 'Opens a file or app by slug (project folder or PDF)',
  whoami: 'Displays the current user name',
  echo: 'Outputs the provided text',
  '/?': 'Shows available commands (alias for help)',
};

// ── Parsing ────────────────────────────────────────────────────────

/**
 * Parse a raw input string into a command name and its arguments.
 *
 * @example
 * parseCommand('echo Hello World') // → { command: 'echo', args: ['Hello', 'World'] }
 * parseCommand('help')             // → { command: 'help', args: [] }
 */
export function parseCommand(input: string): { command: string; args: string[] } {
  const trimmed = input.trim();
  if (!trimmed) return { command: '', args: [] };

  const parts = trimmed.split(/\s+/);
  const command = parts[0]!.toLowerCase();
  const args = parts.slice(1);

  return { command, args };
}

// ── Command Handlers ────────────────────────────────────────────────

const handlerHelp: CommandHandler = () => {
  const lines = Object.entries(COMMANDS)
    .filter(
      ([key]) => key === key.toLowerCase() && !['dir', 'chdir', 'type', 'cls', '/?'].includes(key),
    )
    .map(([cmd, desc]) => `  ${cmd.padEnd(12)} ${desc}`);

  return {
    lines: ['', ...lines, ''],
  };
};

const handlerEcho: CommandHandler = (args) => {
  return { lines: [args.join(' ') || ''] };
};

const handlerWhoami: CommandHandler = () => {
  return { lines: ['mansyar\\administrator'] };
};

const handlerLs: CommandHandler = (args, context) => {
  const targetPath = args.length > 0 ? args[0]! : context.cmdPath;
  const children = getChildren(targetPath);

  if (children.length === 0) {
    return { lines: ['(empty)'] };
  }

  // Format each child node with type indicators
  const lines = children.map((node) => {
    if (node.type === 'drive') return `  [DRIVE]  ${node.name}\\`;
    if (node.type === 'folder') return `  [DIR]    ${node.name}\\`;
    // Files: use slug for cleaner display
    return `  [FILE]   ${node.slug}`;
  });

  return { lines };
};

const handlerCd: CommandHandler = (args, context) => {
  if (args.length === 0) {
    return { lines: [], newCmdPath: context.cmdPath };
  }

  const target = args[0]!;

  // Handle special paths
  if (target === '\\' || target === '/') {
    // Go to current drive root
    const drive = context.cmdPath.split('\\')[0]!;
    return { lines: [], newCmdPath: `${drive}\\` };
  }

  if (target === '..') {
    const parent = getParent(context.cmdPath);
    if (parent === '\\') {
      // At root, go to drives listing (keep current drive)
      const drive = context.cmdPath.split('\\')[0]!;
      return { lines: [], newCmdPath: `${drive}\\` };
    }
    return { lines: [], newCmdPath: parent };
  }

  if (target === '.') {
    return { lines: [], newCmdPath: context.cmdPath };
  }

  // Check if it's an absolute path (starts with a drive letter or \)
  let resolvedPath: string;
  if (/^[a-zA-Z]:\\/.test(target)) {
    // Absolute path like C:\ or D:\Systems_Data
    resolvedPath = target;
  } else if (target.startsWith('\\')) {
    // Absolute path starting with backslash — prepend current drive
    const drive = context.cmdPath.split('\\')[0]!;
    resolvedPath = `${drive}${target}`;
  } else {
    // Relative path — append to current directory
    const current = context.cmdPath.endsWith('\\') ? context.cmdPath : `${context.cmdPath}\\`;
    resolvedPath = `${current}${target}`;
  }

  // Remove trailing backslash if present and not just a drive root
  if (resolvedPath.length > 3 && resolvedPath.endsWith('\\')) {
    resolvedPath = resolvedPath.slice(0, -1);
  }

  // Ensure drive paths end with backslash
  if (/^[a-zA-Z]:$/.test(resolvedPath)) {
    resolvedPath = `${resolvedPath}\\`;
  }

  // Verify the path exists
  const node = resolvePath(resolvedPath);
  if (!node) {
    return { lines: ['The system cannot find the path specified.'] };
  }

  return { lines: [], newCmdPath: resolvedPath };
};

const handlerCat: CommandHandler = (args) => {
  if (args.length === 0) {
    return { lines: ['The system cannot find the file specified.'] };
  }

  const slug = args[0]!;

  // Check projects metadata first
  const project = PROJECTS_METADATA[slug];
  if (project) {
    const lines = [
      `Title:       ${project.title}`,
      `Description: ${project.description}`,
      `Language:    ${project.language}`,
      `Tech Stack:  ${project.techStack.join(', ')}`,
      `Stars:       ${project.stars}`,
      `Status:      ${project.status}`,
      `Last Commit: ${project.lastCommit}`,
      `Repository:  ${project.repoUrl}`,
    ];
    return { lines };
  }

  // Check articles metadata
  const article = ARTICLES_METADATA[slug];
  if (article) {
    const lines = [
      `Title:       ${article.title}`,
      `Description: ${article.description}`,
      `Category:    ${article.category}`,
      `Last Updated: ${article.lastUpdated}`,
    ];
    return { lines };
  }

  return { lines: ['The system cannot find the file specified.'] };
};

const handlerClear: CommandHandler = () => {
  return { lines: [], clear: true };
};

const handlerNeofetch: CommandHandler = () => {
  const tux = [
    '                   .--.',
    '                  / _ `.',
    '                 | / \\ |',
    '                 |/   \\|',
    '        _   __   /     \\',
    '       (_) / /  /      }',
    '       __ / /  /     _/',
    '      / _ \\ \\_/     /',
    '     / / \\_/      _/',
    '    / /          /',
    '   /_/    \\_____/',
    '   \\_\\____/',
    '',
    '  MANSYAR@LUNA-OS',
    '  ---------------',
    '  OS:         Luna OS XP Professional v1.0',
    '  Shell:      CMD.EXE v5.1',
    '  Uptime:     0 days, 0 hours, 5 minutes',
    '  Packages:   6 (npm), 3 (pnpm)',
    '  Terminal:   Windows XP Console',
    '  Resolution: 1440x900',
    '  DE:         Luna Theme',
    '  CPU:        Virtual x86',
    '  Memory:     512MB / 1024MB',
    '  Disk:       3 drives (C:, D:, E:)',
    '',
  ];
  return { lines: tux };
};

/**
 * Search the FILE_SYSTEM tree for a file by slug, returning its parent path.
 */
function findSlugParent(slug: string, nodes: FSNode[], parentPath: string): string | null {
  for (const node of nodes) {
    if (node.type === 'file' && node.slug === slug) {
      return parentPath;
    }
    if (node.type === 'drive') {
      const result = findSlugParent(slug, node.children, `${node.name}\\`);
      if (result) return result;
    }
    if (node.type === 'folder') {
      const result = findSlugParent(slug, node.children, `${parentPath}${node.name}\\`);
      if (result) return result;
    }
  }
  return null;
}

const handlerOpen: CommandHandler = (args) => {
  if (args.length === 0) {
    return { lines: ['The system cannot find the file specified.'] };
  }

  const target = args[0]!;

  // Handle resume.pdf → open in new tab
  if (target === 'resume.pdf') {
    return { lines: [], openUrl: '/resume.pdf' };
  }

  // Search the filesystem for the slug
  const parentPath = findSlugParent(target, FILE_SYSTEM, '');
  if (parentPath) {
    // Remove trailing backslash for consistency
    const normalized = parentPath.endsWith('\\') ? parentPath.slice(0, -1) : parentPath;
    return { lines: [], openExplorer: normalized };
  }

  return { lines: ['The system cannot find the file specified.'] };
};

// ── Registry ────────────────────────────────────────────────────────

export const COMMAND_REGISTRY: Record<string, CommandHandler> = {
  help: handlerHelp,
  '/?': handlerHelp,
  ls: handlerLs,
  dir: handlerLs,
  cd: handlerCd,
  chdir: handlerCd,
  cat: handlerCat,
  type: handlerCat,
  clear: handlerClear,
  cls: handlerClear,
  neofetch: handlerNeofetch,
  open: handlerOpen,
  whoami: handlerWhoami,
  echo: handlerEcho,
};
