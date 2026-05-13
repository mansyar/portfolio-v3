import { describe, it, expect } from 'vitest';
import { FILE_SYSTEM } from '@/lib/constants';
import { resolvePath, getChildren } from '@/lib/filesystem';

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
    expect(node!.type).toBe('folder');
    if (node!.type === 'folder') {
      expect(node!.name).toBe('My_Documents');
    }
  });
});

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
    expect(node!.type).toBe('folder');
    if (node!.type === 'folder') {
      expect(node!.name).toBe('Recycle_Bin');
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
