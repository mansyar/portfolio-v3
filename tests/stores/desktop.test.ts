import { describe, it, expect, beforeEach } from 'vitest';

describe('Desktop Store — Start Menu State', () => {
  beforeEach(async () => {
    // Reset store before each test
    const mod = await import('@/stores/desktop');
    mod.$startMenuOpen.set(false);
  });

  describe('$startMenuOpen atom', () => {
    it('should initialize to false', async () => {
      const mod = await import('@/stores/desktop');
      expect(mod.$startMenuOpen.get()).toBe(false);
    });
  });

  describe('toggleStartMenu', () => {
    it('should flip $startMenuOpen from false to true', async () => {
      const mod = await import('@/stores/desktop');
      mod.toggleStartMenu();
      expect(mod.$startMenuOpen.get()).toBe(true);
    });

    it('should flip $startMenuOpen from true to false', async () => {
      const mod = await import('@/stores/desktop');
      mod.$startMenuOpen.set(true);
      mod.toggleStartMenu();
      expect(mod.$startMenuOpen.get()).toBe(false);
    });
  });

  describe('openStartMenu', () => {
    it('should set $startMenuOpen to true', async () => {
      const mod = await import('@/stores/desktop');
      mod.openStartMenu();
      expect(mod.$startMenuOpen.get()).toBe(true);
    });

    it('should remain true when already open', async () => {
      const mod = await import('@/stores/desktop');
      mod.$startMenuOpen.set(true);
      mod.openStartMenu();
      expect(mod.$startMenuOpen.get()).toBe(true);
    });
  });

  describe('closeStartMenu', () => {
    it('should set $startMenuOpen to false', async () => {
      const mod = await import('@/stores/desktop');
      mod.$startMenuOpen.set(true);
      mod.closeStartMenu();
      expect(mod.$startMenuOpen.get()).toBe(false);
    });

    it('should remain false when already closed', async () => {
      const mod = await import('@/stores/desktop');
      mod.closeStartMenu();
      expect(mod.$startMenuOpen.get()).toBe(false);
    });
  });
});
