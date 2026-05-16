import { describe, it, expect } from 'vitest';
import { FILE_SYSTEM } from '@/lib/constants';
import { resolvePath, getChildren, getParent, splitPath } from '@/lib/filesystem';

// ── Core filesystem utility tests (regression guard) ─────────────

describe('splitPath', () => {
  it('should return empty array for root', () => {
    expect(splitPath('\\')).toEqual([]);
  });

  it('should return segments for a nested path', () => {
    expect(splitPath('C:\\Software_Engineering\\icarus-server-manager.mdx')).toEqual([
      'C:',
      'Software_Engineering',
      'icarus-server-manager.mdx',
    ]);
  });

  it('should handle trailing backslash', () => {
    expect(splitPath('C:\\')).toEqual(['C:']);
  });
});

describe('getParent', () => {
  it('should return root for a drive path', () => {
    expect(getParent('C:\\')).toBe('\\');
  });

  it('should return parent folder path', () => {
    expect(getParent('C:\\Software_Engineering')).toBe('C:\\');
  });

  it('should return empty string for root', () => {
    expect(getParent('\\')).toBe('');
  });
});

describe('resolvePath (core)', () => {
  it('should resolve a drive root path', () => {
    const node = resolvePath('C:\\');
    expect(node).not.toBeNull();
    expect(node).toBeDefined();
    expect(node!.type).toBe('drive');
  });

  it('should resolve a nested folder path', () => {
    const node = resolvePath('C:\\Software_Engineering');
    expect(node).not.toBeNull();
    if (node) {
      expect(node.type).toBe('folder');
      expect(node.name).toBe('Software_Engineering');
    }
  });

  it('should resolve a file path', () => {
    const node = resolvePath('C:\\Software_Engineering\\icarus-server-manager.mdx');
    expect(node).not.toBeNull();
    if (node) {
      expect(node.type).toBe('file');
    }
  });

  it('should return null for non-existent path', () => {
    expect(resolvePath('Z:\\')).toBeNull();
  });
});

describe('getChildren (core)', () => {
  it('should return 4 items at root (3 drives + Recycle Bin)', () => {
    const children = getChildren('\\');
    expect(children).toHaveLength(4);
  });

  it('should return 4 project files for C:\\Software_Engineering', () => {
    const children = getChildren('C:\\Software_Engineering');
    expect(children).toHaveLength(4);
  });

  it('should return empty array for a file path', () => {
    const children = getChildren('C:\\Software_Engineering\\icarus-server-manager.mdx');
    expect(children).toEqual([]);
  });

  it('should return empty array for non-existent path', () => {
    expect(getChildren('Z:\\')).toEqual([]);
  });
});

// ── My Documents filesystem tests ────────────────────────────────

describe('FILE_SYSTEM — D: drive', () => {
  it('should have Systems_Data and My_Documents as children of D: drive', () => {
    const dDrive = FILE_SYSTEM.find((d) => d.name === 'D:');
    expect(dDrive).toBeDefined();
    expect(dDrive!.children).toHaveLength(2);
    const folderNames = dDrive!.children.map((c) => c.name);
    expect(folderNames).toContain('Systems_Data');
    expect(folderNames).toContain('My_Documents');
  });
});

describe('FILE_SYSTEM — My_Documents folder', () => {
  it('should contain Resume.pdf, Certs/ (empty), and Contact.txt', () => {
    const dDrive = FILE_SYSTEM.find((d) => d.name === 'D:');
    const myDocs = dDrive!.children.find((c) => c.name === 'My_Documents');
    expect(myDocs).toBeDefined();
    expect(myDocs!.type).toBe('folder');

    const childNames = myDocs!.children.map((c) => c.name);
    expect(childNames).toContain('Resume.pdf');
    expect(childNames).toContain('Certs');
    expect(childNames).toContain('Contact.txt');

    // Certs/ is an empty folder
    const certs = myDocs!.children.find((c) => c.name === 'Certs');
    expect(certs).toBeDefined();
    expect(certs!.type).toBe('folder');
    if (certs!.type === 'folder') {
      expect(certs!.children).toHaveLength(0);
    }

    // Resume.pdf is a file
    const resume = myDocs!.children.find((c) => c.name === 'Resume.pdf');
    expect(resume).toBeDefined();
    expect(resume!.type).toBe('file');

    // Contact.txt is a file with correct slug
    const contact = myDocs!.children.find((c) => c.name === 'Contact.txt');
    expect(contact).toBeDefined();
    expect(contact!.type).toBe('file');
    if (contact!.type === 'file') {
      expect(contact!.slug).toBe('contact');
    }
  });
});

describe('resolvePath — My Documents', () => {
  it('should resolve D:\\My_Documents to the My_Documents folder node', () => {
    const node = resolvePath('D:\\My_Documents');
    expect(node).not.toBeNull();
    if (node && node.type === 'folder') {
      expect(node.name).toBe('My_Documents');
    }
  });
});

// ── Recycle Bin filesystem tests ─────────────────────────────────

describe('getChildren — root with Recycle Bin', () => {
  it('should return C:, D:, E: drives plus a Recycle_Bin entry at root', () => {
    const rootChildren = getChildren('\\');
    const names = rootChildren.map((n) => n.name);
    expect(names).toContain('C:');
    expect(names).toContain('D:');
    expect(names).toContain('E:');
    expect(names).toContain('Recycle_Bin');

    const recycleBin = rootChildren.find((n) => n.name === 'Recycle_Bin');
    expect(recycleBin).toBeDefined();
    expect(recycleBin!.type).toBe('folder');
  });
});

describe('resolvePath — Recycle Bin', () => {
  it('should resolve \\Recycle_Bin to a folder node', () => {
    const node = resolvePath('\\Recycle_Bin');
    expect(node).not.toBeNull();
    if (node && node.type === 'folder') {
      expect(node.name).toBe('Recycle_Bin');
    }
  });
});

describe('getChildren — Recycle Bin contents', () => {
  it('should return chasing-chapters (v1) as a deleted item', () => {
    const items = getChildren('\\Recycle_Bin');
    expect(items).toHaveLength(1);

    const item = items[0];
    expect(item.type).toBe('file');
    if (item.type === 'file') {
      expect(item.slug).toBe('chasing-chapters-v1');
    }
  });
});

describe('RECYCLE_BIN_METADATA — chasing-chapters-v1', () => {
  it('should have metadata for chasing-chapters-v1 with correct fields', async () => {
    const { RECYCLE_BIN_METADATA } = await import('@/lib/projects-data');
    const meta = RECYCLE_BIN_METADATA['chasing-chapters-v1'];
    expect(meta).toBeDefined();
    expect(meta.title).toBe('chasing-chapters (v1)');
    expect(meta.status).toBe('archived');
    expect(meta.description).toBeTruthy();
    expect(meta.repoUrl).toBeTruthy();
  });
});

describe('CONTACT_METADATA — all 6 fields', () => {
  it('should have all 6 contact fields', async () => {
    const { CONTACT_METADATA } = await import('@/lib/projects-data');
    expect(CONTACT_METADATA.name).toBe('Muhammad Ansyar Rafi Putra');
    expect(CONTACT_METADATA.title).toBe('Software Engineer (DevOps & Data)');
    expect(CONTACT_METADATA.email).toBeTruthy();
    expect(CONTACT_METADATA.github).toBe('github.com/mansyar');
    expect(CONTACT_METADATA.linkedin).toBeTruthy();
    expect(CONTACT_METADATA.location).toBe('Indonesia');
  });
});

describe('resolvePath edge cases', () => {
  it('should return null when a non-folder node is encountered before the final segment', () => {
    // icarus-server-manager is a file (not folder) in the FS tree
    // Trying to traverse through it should hit line 97 and return null
    const result = resolvePath('C:\\Software_Engineering\\icarus-server-manager\\nonexistent');
    expect(result).toBeNull();
  });

  it('should return null for completely invalid paths', () => {
    const result = resolvePath('Z:\\');
    expect(result).toBeNull();
  });
});
