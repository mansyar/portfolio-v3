import { describe, it, expect } from 'vitest';
import { FILE_SYSTEM } from '@/lib/constants';
import type { FSDrive } from '@/lib/constants';

describe('FSNode type structure (compile-time check via mock)', () => {
  it('FILE_SYSTEM should be an array with 3 drives', () => {
    expect(Array.isArray(FILE_SYSTEM)).toBe(true);
    expect(FILE_SYSTEM).toHaveLength(3);
  });

  it('all root entries should be drives', () => {
    for (const entry of FILE_SYSTEM) {
      expect(entry.type).toBe('drive');
      expect(entry.name).toMatch(/^[C-E]:\s*$/);
    }
  });

  it('C: drive should have Software_Engineering folder', () => {
    const cDrive = FILE_SYSTEM.find((d) => d.name.startsWith('C:')) as FSDrive;
    expect(cDrive).toBeDefined();
    expect(cDrive.children).toHaveLength(1);
    const swEng = cDrive.children[0];
    expect(swEng.type).toBe('folder');
    expect(swEng.name).toBe('Software_Engineering');
  });

  it('C:\\Software_Engineering should contain 2 project files', () => {
    const cDrive = FILE_SYSTEM.find((d) => d.name.startsWith('C:')) as FSDrive;
    const swEng = cDrive.children[0];
    expect(swEng.type).toBe('folder');
    if (swEng.type === 'folder') {
      expect(swEng.children).toHaveLength(2);
      const names = swEng.children.map((c) => c.name);
      expect(names).toContain('icarus-server-manager.mdx');
      expect(names).toContain('chasing-chapters.mdx');
    }
  });

  it('D: drive should have Systems_Data folder with 1 project', () => {
    const dDrive = FILE_SYSTEM.find((d) => d.name.startsWith('D:')) as FSDrive;
    expect(dDrive).toBeDefined();
    const sysData = dDrive.children[0];
    expect(sysData.type).toBe('folder');
    expect(sysData.name).toBe('Systems_Data');
    if (sysData.type === 'folder') {
      expect(sysData.children).toHaveLength(1);
      expect(sysData.children[0].name).toBe('tubular-bexus-osw.mdx');
    }
  });

  it('E: drive should have Knowledge_Base folder (renamed from DevOps_Academy)', () => {
    const eDrive = FILE_SYSTEM.find((d) => d.name.startsWith('E:')) as FSDrive;
    expect(eDrive).toBeDefined();
    const kb = eDrive.children[0];
    expect(kb.type).toBe('folder');
    expect(kb.name).toBe('Knowledge_Base');
  });

  it('E:\\Knowledge_Base should have subfolders per article category', () => {
    const eDrive = FILE_SYSTEM.find((d) => d.name.startsWith('E:')) as FSDrive;
    const kb = eDrive.children[0];
    expect(kb.type).toBe('folder');
    if (kb.type === 'folder') {
      const folderNames = kb.children.map((c) => c.name);
      expect(folderNames).toContain('DevOps');
      expect(folderNames).toContain('Software_Engineering');
      expect(folderNames).toContain('AI');
    }
  });

  it('E:\\Knowledge_Base\\DevOps should contain 3 article files', () => {
    const eDrive = FILE_SYSTEM.find((d) => d.name.startsWith('E:')) as FSDrive;
    const kb = eDrive.children[0];
    expect(kb.type).toBe('folder');
    if (kb.type === 'folder') {
      const devopsFolder = kb.children.find((c) => c.name === 'DevOps');
      expect(devopsFolder).toBeDefined();
      expect(devopsFolder!.type).toBe('folder');
      if (devopsFolder!.type === 'folder') {
        const names = devopsFolder!.children.map((c) => c.name);
        expect(names).toContain('docker-basics.mdx');
        expect(names).toContain('linux-essentials.mdx');
        expect(names).toContain('ci-cd-pipeline.mdx');
      }
    }
  });

  it('E:\\Knowledge_Base\\Software_Engineering should contain microservices-patterns article', () => {
    const eDrive = FILE_SYSTEM.find((d) => d.name.startsWith('E:')) as FSDrive;
    const kb = eDrive.children[0];
    expect(kb.type).toBe('folder');
    if (kb.type === 'folder') {
      const seFolder = kb.children.find((c) => c.name === 'Software_Engineering');
      expect(seFolder).toBeDefined();
      expect(seFolder!.type).toBe('folder');
      if (seFolder!.type === 'folder') {
        const names = seFolder!.children.map((c) => c.name);
        expect(names).toContain('microservices-patterns.mdx');
      }
    }
  });

  it('E:\\Knowledge_Base\\AI should contain llm-fine-tuning article', () => {
    const eDrive = FILE_SYSTEM.find((d) => d.name.startsWith('E:')) as FSDrive;
    const kb = eDrive.children[0];
    expect(kb.type).toBe('folder');
    if (kb.type === 'folder') {
      const aiFolder = kb.children.find((c) => c.name === 'AI');
      expect(aiFolder).toBeDefined();
      expect(aiFolder!.type).toBe('folder');
      if (aiFolder!.type === 'folder') {
        const names = aiFolder!.children.map((c) => c.name);
        expect(names).toContain('llm-fine-tuning.mdx');
      }
    }
  });
});

// Import helpers after types are verified
import { getChildren, resolvePath, getParent, splitPath } from '@/lib/filesystem';

describe('Navigation helpers', () => {
  describe('resolvePath', () => {
    it('should resolve a drive root path', () => {
      const node = resolvePath('C:\\');
      expect(node).not.toBeNull();
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

  describe('getChildren', () => {
    it('should return 3 drives for root path', () => {
      const children = getChildren('\\');
      expect(children).toHaveLength(3);
    });

    it('should return 2 project files for C:\\Software_Engineering', () => {
      const children = getChildren('C:\\Software_Engineering');
      expect(children).toHaveLength(2);
    });

    it('should return empty array for a file path', () => {
      const children = getChildren('C:\\Software_Engineering\\icarus-server-manager.mdx');
      expect(children).toEqual([]);
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

  describe('splitPath', () => {
    it('should return empty array for root', () => {
      expect(splitPath('\\')).toEqual([]);
    });

    it('should return segments for a path', () => {
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
});
