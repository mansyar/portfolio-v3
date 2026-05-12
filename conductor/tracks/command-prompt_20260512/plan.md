# Implementation Plan: Track 2B — Command Prompt

**Track:** `command-prompt_20260512`
**Type:** Feature
**Depends on:** Track 1B (Window Manager), Track 2A (Explorer + Content — provides filesystem + projects-data.ts)

---

## Phase 1: Command Registry & Parser

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
- [ ] Task 1.5: Implement `cat`/`type` command (file content display)
  - [ ] Write tests: cat on valid MDX slug shows metadata, cat on missing file shows XP error
  - [ ] Implement cat using PROJECTS_METADATA / DEVOPS_METADATA from src/lib/projects-data.ts
- [ ] Task 1.6: Implement `clear`/`cls` command
  - [ ] Write tests: clear/cls handler returns signal to clear output buffer
  - [ ] Implement clear/cls handler (returns special CLEAR signal)
- [ ] Task 1.7: Implement `neofetch` command (ASCII art + system info)
  - [ ] Write tests: neofetch returns Tux ASCII art lines + system info fields
  - [ ] Implement neofetch with Tux ASCII art and formatted system info block
- [ ] Task 1.8: Implement `open` command (navigate Explorer to project folder)
  - [ ] Write tests: open with valid slug opens Explorer + navigates to parent folder, open with .pdf opens new tab, unknown slug errors
  - [ ] Implement open: find slug in FILE_SYSTEM → resolve parent path → openWindow('explorer') → set explorerPath to parent; .pdf → window.open(); else XP error
- [ ] Task: Conductor - User Manual Verification 'Phase 1 — Command Registry & Parser' (Protocol in workflow.md)

---

## Phase 2: Terminal UI Component & Integration

- [ ] Task 2.1: Create `CmdPrompt.tsx` — terminal shell component
  - [ ] Write tests: CmdPrompt renders with black background, green #00aa00 text, C:\MANSYAR> prompt visible
  - [ ] Implement CmdPrompt: black div, scrollable output area, input at bottom, XP-style console font styling
- [ ] Task 2.2: Wire command execution + output rendering
  - [ ] Write tests: pressing Enter calls parseCommand, output lines rendered below prompt, chained commands work
  - [ ] Wire onKeyDown handler → parseCommand → render output lines as styled div sequence
- [ ] Task 2.3: Add MARP ASCII art welcome banner
  - [ ] Write tests: MARP banner appears on initial render and after clear/cls
  - [ ] Implement MARP ASCII art banner lines as initial output content, restore on clear
- [ ] Task 2.4: Implement command history (↑/↓ arrow keys)
  - [ ] Write tests: ↑ cycles backward through history, ↓ cycles forward, empty history works, boundaries handled
  - [ ] Implement history state array with arrow key navigation using component state
- [ ] Task 2.5: Implement blinking cursor and auto-scroll
  - [ ] Write tests: cursor element renders with CSS blink animation class, auto-scroll triggers on new output
  - [ ] Implement CSS @keyframes for cursor blink, useRef + scrollIntoView for auto-scroll bottom
- [ ] Task 2.6: Wire CmdPrompt into WindowLayer + fix placeholder text
  - [ ] Write tests: opening "cmd" window renders CmdPrompt component, other windows render their content
  - [ ] Replace placeholder `'Command Prompt — Coming Soon in Track 2D'` with `<CmdPrompt windowId="cmd" />` for window ID 'cmd'
  - [ ] Verify CMD opens from desktop icon "Command Prompt", Start Menu item, and taskbar button
- [ ] Task: Conductor - User Manual Verification 'Phase 2 — Terminal UI Component & Integration' (Protocol in workflow.md)
