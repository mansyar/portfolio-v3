# Specification: Track 2B — Command Prompt

**Track:** `command-prompt_20260512`
**Type:** Feature
**Description:** Functional terminal emulator with command parsing, history, and filesystem navigation for the Luna OS Portfolio.

---

## Overview

A fully interactive Windows XP Command Prompt (cmd.exe) emulator as a React island within the Luna OS desktop. The CMD window provides a black terminal with green monospace text, a blinking cursor, and a command-line interface that navigates the same virtual filesystem (`FILE_SYSTEM`) already used by the Explorer (Track 2A). It supports 9 commands with arrow-key history navigation, XP-style error handling, and auto-scrolling output.

**Refs:** [PRD §5.1](./PRD.md#51-command-prompt-cmdexe) (link to docs/PRD.md) · [ROADMAP Track 2B](../../../docs/ROADMAP.md) · [TDD §7.1](./TDD.md#71-command-prompt) (link to docs/TDD.md) · [TDD §4.3](./TDD.md#43-virtual-filesystem-tree)

---

## Functional Requirements

### FR1 — Terminal UI

- Black background (`#000000`) with green (`#00aa00`) monospace text (Courier New / Consolas)
- Prompt format: `C:\MANSYAR>` (username: MANSYAR, current directory tracked)
- Blinking block cursor (`▌` or `█`) at the end of the input line
- Input area at the bottom; scrollable output area above
- Auto-scroll to bottom on new output
- Window chrome uses existing `WindowFrame` / `TitleBar` system (inherited from Track 1B)

### FR2 — Command Registry

A centralized command parser and registry in `src/lib/commands.ts`:

| Command    | Aliases | Description                                                      |
| ---------- | ------- | ---------------------------------------------------------------- |
| `help`     | `/?`    | Lists all available commands with brief descriptions             |
| `ls`       | `dir`   | Lists files/folders in the current directory                     |
| `cd`       | `chdir` | Change directory (supports `.`, `..`, `\`, absolute paths)       |
| `cat`      | `type`  | Displays file frontmatter metadata for MDX slugs                 |
| `clear`    | `cls`   | Clears the terminal output (re-shows welcome banner)             |
| `neofetch` | —       | Displays Tux ASCII art + comprehensive system information        |
| `open`     | —       | Opens a file/app: project slugs → `openWindow()`, .pdf → new tab |
| `whoami`   | —       | Displays current username (`mansyar\administrator`)              |
| `echo`     | —       | Outputs the provided text (no variable expansion in v1)          |

### FR3 — Filesystem Navigation (`cd`, `ls`, `cat`)

- Uses the same `FILE_SYSTEM` tree from `src/lib/constants.ts` and helpers from `src/lib/filesystem.ts`
- `cd` supports: `cd foldername`, `cd ..`, `cd \`, `cd C:\`, `cd D:\Systems_Data`
- `ls` shows files and folders in current directory with type indicators (drive, folder, file)
- `cat` on MDX slugs → shows frontmatter metadata from `PROJECTS_METADATA` / `DEVOPS_METADATA` in `src/lib/projects-data.ts`
- `cat` on non-existent file → XP error: `The system cannot find the file specified.`

### FR4 — Command History

- ↑ key: cycle backward through command history
- ↓ key: cycle forward through command history
- History stored in component state per session
- Empty input lines do not add to history
- History persists for the lifetime of the CMD window instance

### FR5 — `neofetch` Command

- Tux penguin ASCII art (simple 10-15 line representation)
- System info displayed:

```
MANSYAR@LUNA-OS
---------------
OS:         Luna OS XP Professional v1.0
Shell:      CMD.EXE v5.1
Uptime:     0 days, 0 hours, 5 minutes
Packages:   6 (npm), 3 (pnpm)
Terminal:   Windows XP Console
Resolution: 1440x900 (or dynamic)
DE:         Luna Theme
CPU:        Virtual x86
Memory:     512MB / 1024MB (or dynamic)
Disk:       3 drives (C:, D:, E:)
```

### FR6 — `open` Command

- `open icarus-server-manager` → opens Explorer window AND navigates it to the file's parent folder. Implementation: (1) find the file's slug in `FILE_SYSTEM` tree, (2) resolve its parent directory path (e.g., `C:\Software_Engineering\`), (3) open Explorer via `openWindow('explorer')`, (4) update `explorerPath` in the store to the parent directory
- `open resume.pdf` → `window.open('/resume.pdf', '_blank')`
- Unknown slug/file → XP error: `The system cannot find the file specified.`

### FR7 — Error Handling

- Unknown command → `'xyz' is not recognized as an internal or external command, operable program or batch file.`
- `cd` to invalid path → `The system cannot find the path specified.`
- `cat` on non-existent file → `The system cannot find the file specified.`
- `open` on non-existent file → `The system cannot find the file specified.`

### FR8 — Integration

- CMD window opened via desktop icon ("Command Prompt"), Start Menu item, or taskbar button
- `WindowLayer` renders `CmdPrompt` component instead of placeholder text for "cmd" window ID
- CMD button appears in taskbar when open (inherits existing taskbar behavior from Track 1B)
- Coexists with other windows (Explorer, Task Manager, etc.)
- CMD tracks its current working directory via `cmdPath` field in `WindowState` (analogous to Explorer's `explorerPath`)
- `cmdPath` is initialized to `C:\` when `openWindow('cmd')` is called and updated on every `cd` command

### FR9 — Welcome Banner

When the CMD window opens (and after `clear`/`cls`), it shows:

```
  __  __    _    ____  ____
 |  \/  |  / \  |  _ \|  _ \
 | |\/| | / _ \ | |_) | |_) |
 | |  | |/ ___ \|  __/|  __/
 |_|  |_/_/   \_\_|   |_|
      __  __    _    ____  ____
      \ \/ /   / \  |  _ \|  _ \
       \  /   / _ \ | |_) | |_) |
       /  \  / ___ \|  __/|  __/
      /_/\_\/_/   \_\_|   |_|

===============================================
 Welcome to Luna OS Command Prompt v1.0
 Type 'help' to see available commands.
===============================================

C:\MANSYAR>
```

---

## Non-Functional Requirements

- **Performance**: Minimal JS payload — terminal rendering is lightweight DOM manipulation
- **Accessibility**: `role="terminal"`, `aria-label="Command Prompt"`, focus on input, visible focus indicator
- **Authenticity**: Match XP cmd.exe aesthetics — black background, green `#00aa00` text, blinking cursor
- **No external dependencies**: No third-party terminal emulation libraries — pure React + Nano Stores
- **Animation respect**: Blinking cursor disabled when `prefers-reduced-motion: reduce` is active

---

## Acceptance Criteria

```
✅ CMD opens with "C:\MANSYAR>" prompt and blinking cursor on black background
✅ Type "help" lists all 9 commands with descriptions
✅ `ls`/`dir` lists current directory contents from virtual filesystem
✅ `cd` navigates through C:, D:, E: drives consistently with Explorer
✅ `cat icarus-server-manager` shows project metadata (title, description, tech stack, repo)
✅ `clear`/`cls` clears all output, returns to fresh prompt with welcome banner
✅ `neofetch` shows Tux ASCII art + complete system info
✅ `open icarus-server-manager` opens Explorer window navigated to `C:\Software_Engineering\`
✅ `open resume.pdf` opens PDF in new tab
✅ `whoami` displays "mansyar\administrator"
✅ `echo Hello World` outputs "Hello World"
✅ Unknown command shows XP-style error message
✅ ↑/↓ arrow keys cycle through command history
✅ Output auto-scrolls to bottom
✅ CMD works in multi-window context (coexists with Explorer, etc.)
✅ Visually matches XP Command Prompt aesthetic
✅ Welcome MARP ASCII art banner on open and after clear
```

---

## Out of Scope (v1)

- Tab-completion (explicitly called out in tech-stack.md)
- Pipe operators (`|`), redirects (`>`, `>>`)
- Batch file (`.bat`/`.cmd`) execution
- Environment variables / `%PATH%` expansion
- `color` command / color customization
- Resizable terminal independent of window resize
- Right-click paste in terminal
