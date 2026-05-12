/**
 * Command Prompt — command registry, parser, and type definitions.
 *
 * All commands are registered in `COMMAND_REGISTRY` with their canonical name.
 * Aliases (e.g., `dir` → `ls`, `cls` → `clear`) share the same handler reference.
 */

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

// ── Placeholder Handlers ────────────────────────────────────────────
// Full implementations are added in Tasks 1.3–1.8.

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

const handlerLs: CommandHandler = () => {
  return { lines: ['(filesystem implementation — Task 1.4)'] };
};

const handlerCd: CommandHandler = () => {
  return { lines: ['(filesystem implementation — Task 1.4)'] };
};

const handlerCat: CommandHandler = () => {
  return { lines: ['(metadata implementation — Task 1.5)'] };
};

const handlerClear: CommandHandler = () => {
  return { lines: [], clear: true };
};

const handlerNeofetch: CommandHandler = () => {
  return { lines: ['(neofetch implementation — Task 1.7)'] };
};

const handlerOpen: CommandHandler = () => {
  return { lines: ['(open implementation — Task 1.8)'] };
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
