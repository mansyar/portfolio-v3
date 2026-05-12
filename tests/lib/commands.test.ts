import { describe, it, expect } from 'vitest';
import { COMMANDS, COMMAND_REGISTRY, parseCommand, type CmdOutput } from '@/lib/commands';

describe('Command types and constants', () => {
  it('should export COMMANDS object with all 9 primary command keys', () => {
    expect(COMMANDS).toBeDefined();
    const expected = [
      'help',
      'ls',
      'dir',
      'cd',
      'cat',
      'clear',
      'cls',
      'neofetch',
      'open',
      'whoami',
      'echo',
    ];
    expected.forEach((cmd) => {
      expect(COMMANDS).toHaveProperty(cmd);
    });
  });
});

describe('CommandHandler registry', () => {
  it('should export COMMAND_REGISTRY as a Record', () => {
    expect(COMMAND_REGISTRY).toBeDefined();
    expect(typeof COMMAND_REGISTRY).toBe('object');
  });

  it('should have handler functions for every command in COMMANDS', () => {
    for (const cmd of Object.keys(COMMANDS)) {
      expect(COMMAND_REGISTRY[cmd]).toBeDefined();
      expect(typeof COMMAND_REGISTRY[cmd]).toBe('function');
    }
  });

  it('should map aliases to the same handler (dir → ls, cls → clear, chdir → cd, type → cat, /? → help)', () => {
    expect(COMMAND_REGISTRY['dir']).toBe(COMMAND_REGISTRY['ls']);
    expect(COMMAND_REGISTRY['cls']).toBe(COMMAND_REGISTRY['clear']);
    expect(COMMAND_REGISTRY['chdir']).toBe(COMMAND_REGISTRY['cd']);
    expect(COMMAND_REGISTRY['type']).toBe(COMMAND_REGISTRY['cat']);
    expect(COMMAND_REGISTRY['/?']).toBe(COMMAND_REGISTRY['help']);
  });
});

describe('parseCommand', () => {
  it('should parse a simple command without args', () => {
    const result = parseCommand('help');
    expect(result).toEqual({ command: 'help', args: [] });
  });

  it('should parse a command with arguments', () => {
    const result = parseCommand('cd Software_Engineering');
    expect(result).toEqual({ command: 'cd', args: ['Software_Engineering'] });
  });

  it('should parse a command with multiple arguments', () => {
    const result = parseCommand('echo Hello World');
    expect(result).toEqual({ command: 'echo', args: ['Hello', 'World'] });
  });

  it('should handle leading and trailing whitespace', () => {
    const result = parseCommand('  ls   ');
    expect(result).toEqual({ command: 'ls', args: [] });
  });

  it('should handle empty string', () => {
    const result = parseCommand('');
    expect(result).toEqual({ command: '', args: [] });
  });

  it('should handle path arguments with backslashes', () => {
    const result = parseCommand('cd C:\\Software_Engineering');
    expect(result).toEqual({ command: 'cd', args: ['C:\\Software_Engineering'] });
  });

  it('should handle path arguments with forward slashes', () => {
    const result = parseCommand('cd C:/Software_Engineering');
    expect(result).toEqual({ command: 'cd', args: ['C:/Software_Engineering'] });
  });
});

describe('CmdOutput type', () => {
  it('should allow creating an output with lines', () => {
    const output: CmdOutput = { lines: ['Hello', 'World'] };
    expect(output.lines).toHaveLength(2);
  });

  it('should allow creating a clear signal output', () => {
    const output: CmdOutput = { lines: [], clear: true };
    expect(output.clear).toBe(true);
  });

  it('should allow creating an open-explorer output', () => {
    const output: CmdOutput = { lines: [], openExplorer: 'C:\\Software_Engineering' };
    expect(output.openExplorer).toBe('C:\\Software_Engineering');
  });

  it('should allow creating an open-url output', () => {
    const output: CmdOutput = { lines: [], openUrl: '/resume.pdf' };
    expect(output.openUrl).toBe('/resume.pdf');
  });
});
