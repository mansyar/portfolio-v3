# Implementation Plan: Track 2B — Command Prompt

**Track:** `command-prompt_20260512`
**Type:** Feature
**Depends on:** Track 1B (Window Manager), Track 2A (Explorer + Content — provides filesystem + projects-data.ts)

---

## Phase 1: Command Registry & Parser [checkpoint: 8605e1e]

- [x] Task 1.1: Add `cmdPath` to `WindowState` in `src/stores/windows.ts` `344638c`
  - [ ] Write tests: cmdPath is set to 'C:\' on openWindow('cmd'), undefined for other windows, updates on cd
  - [ ] Add `cmdPath?: string` to `WindowState` interface, initialize to `C:\` in `buildWindowState` for 'cmd' window
- [x] Task 1.2: Create `src/lib/commands.ts` — command type definitions, registry, and parser function `9b64a84`
  - [x] Write tests for Command enum, CommandHandler type, registry map, and parseCommand() (parses 'cmd arg1 arg2')
  - [x] Implement Command type (enum or string union), CommandHandler type signature, registry, and parseCommand()
- [x] Task 1.3: Implement `help`, `echo`, `whoami` commands `fda502d`
  - [x] Write tests: help lists all commands with descriptions, echo outputs text verbatim, whoami shows 'mansyar\administrator'
  - [x] Implement help (formatted multi-line list), echo (pass-through), whoami ('mansyar\administrator')
- [x] Task 1.4: Implement `ls`/`dir` and `cd` commands (filesystem navigation) `92cfec8`
  - [x] Write tests: ls lists children, cd navigates (supports .., \, absolute paths), invalid path throws XP error
  - [x] Implement ls/dir (calls getChildren, formats output) and cd (calls resolvePath, reads/updates cmdPath in WindowState)
- [x] Task 1.5: Implement `cat`/`type` command (file content display) `54fe628`
  - [x] Write tests: cat on valid MDX slug shows metadata, cat on missing file shows XP error
  - [x] Implement cat using PROJECTS_METADATA / DEVOPS_METADATA from src/lib/projects-data.ts
- [x] Task 1.6: Implement `clear`/`cls` command `54fe628`
  - [x] Write tests: clear/cls handler returns signal to clear output buffer
  - [x] Implement clear/cls handler (returns special CLEAR signal)
- [x] Task 1.7: Implement `neofetch` command (ASCII art + system info) `54fe628`
  - [x] Write tests: neofetch returns Tux ASCII art lines + system info fields
  - [x] Implement neofetch with Tux ASCII art and formatted system info block
- [x] Task 1.8: Implement `open` command (navigate Explorer to project folder) `54fe628`
  - [x] Write tests: open with valid slug opens Explorer + navigates to parent folder, open with .pdf opens new tab, unknown slug errors
  - [x] Implement open: find slug in FILE_SYSTEM → resolve parent path → openWindow('explorer') → set explorerPath to parent; .pdf → window.open(); else XP error
- [x] Task: Conductor - User Manual Verification 'Phase 1 — Command Registry & Parser' (Protocol in workflow.md) `8605e1e`

---

## Phase 2: Terminal UI Component & Integration [checkpoint: f1378a5]

- [x] Task 2.1: Create `CmdPrompt.tsx` — terminal shell component `055a914`
  - [x] Write tests: CmdPrompt renders with black background, green #00aa00 text, C:\MANSYAR> prompt visible
  - [x] Implement CmdPrompt: black div, scrollable output area, input at bottom, XP-style console font styling
- [x] Task 2.2: Wire command execution + output rendering `f1378a5`
  - [x] Write tests: pressing Enter calls parseCommand, output lines rendered below prompt, chained commands work
  - [x] Wire onKeyDown handler → parseCommand → render output lines as styled div sequence
- [x] Task 2.3: Add MARP ASCII art welcome banner `f1378a5`
  - [x] Write tests: MARP banner appears on initial render and after clear/cls
  - [x] Implement MARP ASCII art banner lines as initial output content, restore on clear
- [x] Task 2.4: Implement command history (↑/↓ arrow keys) `f1378a5`
  - [x] Write tests: ↑ cycles backward through history, ↓ cycles forward, empty history works, boundaries handled
  - [x] Implement history state array with arrow key navigation using component state
- [x] Task 2.5: Implement blinking cursor and auto-scroll `f1378a5`
  - [x] Write tests: cursor element renders with CSS blink animation class, auto-scroll triggers on new output
  - [x] Implement CSS @keyframes for cursor blink, useRef + scrollIntoView for auto-scroll bottom
- [x] Task 2.6: Wire CmdPrompt into WindowLayer + fix placeholder text `f1378a5`
  - [x] Write tests: opening "cmd" window renders CmdPrompt component, other windows render their content
  - [x] Replace placeholder `'Command Prompt — Track 2B'` with `<CmdPrompt windowId="cmd" />` for window ID 'cmd'
  - [x] Verify CMD opens from desktop icon "Command Prompt", Start Menu item, and taskbar button
- [x] Task: Conductor - User Manual Verification 'Phase 2 — Terminal UI Component & Integration' (Protocol in workflow.md) `f1378a5`

---

## Phase: Review Fixes

- [x] Task: Apply review suggestions `87a8cd8`
