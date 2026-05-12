import { FILE_SYSTEM, type FSNode, type FSDrive, type FSFolder } from '@/lib/constants';

/**
 * Normalize a path: replace forward slashes, collapse multiple backslashes,
 * strip trailing backslash (except for root `\`).
 */
function normalize(path: string): string {
  let p = path.replace(/\//g, '\\');
  p = p.replace(/\\+/g, '\\');
  if (p.length > 1 && p.endsWith('\\')) {
    p = p.slice(0, -1);
  }
  return p;
}

/**
 * Split a normalized path into segments.
 * `C:\Software_Engineering\file.mdx` → `['C:', 'Software_Engineering', 'file.mdx']`
 */
export function splitPath(path: string): string[] {
  const normalized = normalize(path);
  if (normalized === '\\' || normalized === '') return [];
  return normalized.split('\\').filter(Boolean);
}

/**
 * Resolve a path string to an FSNode, or null if not found.
 *
 * @example
 * resolvePath('C:\Software_Engineering') → FSFolder node
 * resolvePath('Z:\') → null
 */
export function resolvePath(path: string): FSNode | null {
  const segments = splitPath(path);
  if (segments.length === 0) return null;

  // First segment must match a drive name (e.g. "C:")
  const driveName = segments[0];
  const drive = FILE_SYSTEM.find((d) => d.name === driveName);
  if (!drive) return null;

  if (segments.length === 1) return drive;

  // Walk through remaining segments
  let current: FSNode[] = drive.children;
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    const node = current.find(
      (n) => n.name === segment || (n.type === 'folder' && n.name === segment),
    );
    if (!node) return null;
    if (i === segments.length - 1) return node;
    if (node.type === 'folder') {
      current = node.children;
    } else {
      return null; // reached a non-folder before the last segment
    }
  }

  return null;
}

/**
 * Get the children of a path. Returns an empty array if the path
 * doesn't exist or points to a file.
 *
 * The root path `\` returns the top-level drives.
 */
export function getChildren(path: string): FSNode[] {
  const normalized = normalize(path);
  if (normalized === '\\') {
    return FILE_SYSTEM as unknown[] as FSNode[];
  }

  const node = resolvePath(normalized);
  if (!node) return [];

  if (node.type === 'drive') {
    return (node as FSDrive).children;
  }
  if (node.type === 'folder') {
    return (node as FSFolder).children;
  }
  // Files have no children
  return [];
}

/**
 * Get the parent path of a given path.
 * `C:\Software_Engineering` → `C:\`
 * `C:\` → `\`
 * `\` → `''`
 */
export function getParent(path: string): string {
  const normalized = normalize(path);
  if (normalized === '\\') return '';

  const segments = splitPath(normalized);
  if (segments.length <= 1) return '\\';

  return segments.slice(0, -1).join('\\') + '\\';
}
