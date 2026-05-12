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

describe('Help command', () => {
  it('should list all available commands with descriptions', () => {
    const output = COMMAND_REGISTRY['help']([], { cmdPath: 'C:\\' });
    expect(output.lines.length).toBeGreaterThan(0);
    // Should contain 'help', 'ls', 'cd', 'cat', etc.
    expect(output.lines.some((l) => l.includes('help'))).toBe(true);
    expect(output.lines.some((l) => l.includes('ls'))).toBe(true);
    expect(output.lines.some((l) => l.includes('cd'))).toBe(true);
    expect(output.lines.some((l) => l.includes('neofetch'))).toBe(true);
    expect(output.lines.some((l) => l.includes('whoami'))).toBe(true);
    expect(output.lines.some((l) => l.includes('echo'))).toBe(true);
  });

  it('should work via /? alias', () => {
    const output = COMMAND_REGISTRY['/?']([], { cmdPath: 'C:\\' });
    const helpOutput = COMMAND_REGISTRY['help']([], { cmdPath: 'C:\\' });
    expect(output.lines).toEqual(helpOutput.lines);
  });

  it('should not include alias-only entries (dir, cls, chdir, type) as separate lines', () => {
    const output = COMMAND_REGISTRY['help']([], { cmdPath: 'C:\\' });
    // If 'ls' is listed, 'dir' shouldn't get its own row
    expect(output.lines.some((l) => l.includes('ls'))).toBe(true);
  });
});

describe('Echo command', () => {
  it('should output text verbatim', () => {
    const output = COMMAND_REGISTRY['echo'](['Hello', 'World'], { cmdPath: 'C:\\' });
    expect(output.lines).toEqual(['Hello World']);
  });

  it('should output empty string when no args provided', () => {
    const output = COMMAND_REGISTRY['echo']([], { cmdPath: 'C:\\' });
    expect(output.lines).toEqual(['']);
  });

  it('should preserve special characters', () => {
    const output = COMMAND_REGISTRY['echo'](['C:\\>', 'test!'], { cmdPath: 'C:\\' });
    expect(output.lines).toEqual(['C:\\> test!']);
  });
});

describe('Whoami command', () => {
  it('should display mansyar\\administrator', () => {
    const output = COMMAND_REGISTRY['whoami']([], { cmdPath: 'C:\\' });
    expect(output.lines).toHaveLength(1);
    expect(output.lines[0]).toBe('mansyar\\administrator');
  });

  it('should ignore any arguments', () => {
    const output = COMMAND_REGISTRY['whoami'](['extra', 'args'], { cmdPath: 'C:\\' });
    expect(output.lines[0]).toBe('mansyar\\administrator');
  });
});

describe('Ls command', () => {
  it('should list drives at root path (C:, D:, E:)', () => {
    const output = COMMAND_REGISTRY['ls']([], { cmdPath: '\\' });
    expect(output.lines.some((l) => l.includes('C:'))).toBe(true);
    expect(output.lines.some((l) => l.includes('D:'))).toBe(true);
    expect(output.lines.some((l) => l.includes('E:'))).toBe(true);
  });

  it('should list folders inside C:\\Software_Engineering', () => {
    const output = COMMAND_REGISTRY['ls']([], { cmdPath: 'C:\\' });
    expect(output.lines.some((l) => l.includes('Software_Engineering'))).toBe(true);
  });

  it('should list files with slug metadata in a folder', () => {
    const output = COMMAND_REGISTRY['ls']([], { cmdPath: 'C:\\Software_Engineering' });
    expect(output.lines.some((l) => l.includes('icarus-server-manager'))).toBe(true);
    expect(output.lines.some((l) => l.includes('chasing-chapters'))).toBe(true);
  });

  it('should list directory when path argument is provided', () => {
    const output = COMMAND_REGISTRY['ls'](['D:\\Systems_Data'], { cmdPath: 'C:\\' });
    expect(output.lines.some((l) => l.includes('tubular-bexus-osw'))).toBe(true);
  });

  it('should work via dir alias', () => {
    const lsOutput = COMMAND_REGISTRY['dir']([], { cmdPath: 'C:\\' });
    const dirOutput = COMMAND_REGISTRY['ls']([], { cmdPath: 'C:\\' });
    expect(lsOutput.lines).toEqual(dirOutput.lines);
  });
});

describe('Cd command', () => {
  it('should navigate to a subfolder', () => {
    const output = COMMAND_REGISTRY['cd'](['Software_Engineering'], { cmdPath: 'C:\\' });
    expect(output.newCmdPath).toBe('C:\\Software_Engineering');
  });

  it('should navigate up with ..', () => {
    const output = COMMAND_REGISTRY['cd'](['..'], { cmdPath: 'C:\\Software_Engineering' });
    expect(output.newCmdPath).toBe('C:\\');
  });

  it('should navigate to root with \\', () => {
    const output = COMMAND_REGISTRY['cd'](['\\'], { cmdPath: 'C:\\Software_Engineering' });
    expect(output.newCmdPath).toBe('C:\\');
  });

  it('should navigate to another drive with absolute path', () => {
    const output = COMMAND_REGISTRY['cd'](['D:\\'], { cmdPath: 'C:\\' });
    expect(output.newCmdPath).toBe('D:\\');
  });

  it('should navigate to a nested absolute path', () => {
    const output = COMMAND_REGISTRY['cd'](['D:\\Systems_Data'], { cmdPath: 'C:\\' });
    expect(output.newCmdPath).toBe('D:\\Systems_Data');
  });

  it('should stay in same directory with .', () => {
    const output = COMMAND_REGISTRY['cd'](['.'], { cmdPath: 'C:\\Software_Engineering' });
    expect(output.newCmdPath).toBe('C:\\Software_Engineering');
  });

  it('should show XP error for invalid path', () => {
    const output = COMMAND_REGISTRY['cd'](['NonExistent'], { cmdPath: 'C:\\' });
    expect(output.lines.some((l) => l.includes('The system cannot find the path specified'))).toBe(
      true,
    );
    expect(output.newCmdPath).toBeUndefined();
  });

  it('should work via chdir alias', () => {
    const cdOutput = COMMAND_REGISTRY['chdir'](['Software_Engineering'], { cmdPath: 'C:\\' });
    const expected = COMMAND_REGISTRY['cd'](['Software_Engineering'], { cmdPath: 'C:\\' });
    expect(cdOutput.newCmdPath).toBe(expected.newCmdPath);
  });

  it('should show error when no path provided', () => {
    const output = COMMAND_REGISTRY['cd']([], { cmdPath: 'C:\\' });
    expect(output.newCmdPath).toBe('C:\\');
  });
});

describe('Cat command', () => {
  it('should show project metadata for valid slug', () => {
    const output = COMMAND_REGISTRY['cat'](['icarus-server-manager'], { cmdPath: 'C:\\' });
    expect(output.lines.some((l) => l.includes('Icarus Server Manager'))).toBe(true);
    expect(output.lines.some((l) => l.includes('TypeScript'))).toBe(true);
    expect(output.lines.some((l) => l.includes('Node.js'))).toBe(true);
  });

  it('should show DevOps academy metadata for devops slug', () => {
    const output = COMMAND_REGISTRY['cat'](['docker-basics'], { cmdPath: 'C:\\' });
    expect(output.lines.some((l) => l.includes('Docker Basics'))).toBe(true);
    expect(output.lines.some((l) => l.includes('Docker'))).toBe(true);
  });

  it('should show XP error for non-existent slug', () => {
    const output = COMMAND_REGISTRY['cat'](['nonexistent'], { cmdPath: 'C:\\' });
    expect(output.lines.some((l) => l.includes('The system cannot find the file specified'))).toBe(
      true,
    );
  });

  it('should work via type alias', () => {
    const catOutput = COMMAND_REGISTRY['type'](['icarus-server-manager'], { cmdPath: 'C:\\' });
    const typeOutput = COMMAND_REGISTRY['cat'](['icarus-server-manager'], { cmdPath: 'C:\\' });
    expect(catOutput.lines).toEqual(typeOutput.lines);
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
