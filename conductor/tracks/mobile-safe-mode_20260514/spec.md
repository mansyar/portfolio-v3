# Specification: Mobile Safe Mode (Track 4A)

## Overview

Implement a mobile-first "Safe Mode" experience for viewports < 768px. This mode replaces the complex Windows XP desktop with a high-contrast, text-based BIOS/Terminal interface. It includes an animated boot sequence, a numbered menu for navigation, and full access to portfolio content (projects and articles) in a retro terminal aesthetic.

## Functional Requirements

- **Automatic Trigger:** Detect viewport width and switch to "Safe Mode" when < 768px.
- **BIOS Boot Sequence:**
  - Animated line-by-line text on initial load.
  - Custom branding text (e.g., "MANSYAR OS v1.0", "Loading PORTFOLIO.SYS").
  - Fixed duration of 2 seconds for the entire sequence.
- **Terminal Menu:**
  - Numbered navigation list: `[1] Projects`, `[2] Knowledge Base`, `[3] About`, `[4] Contact`.
  - Support for both **Tapping (Touch)** and **Keyboard Input (Numbers)**.
  - **Persistent Prompt:** A visible `C:\>` prompt at the bottom of the screen to capture keyboard input and trigger the mobile keyboard.
- **Content Rendering:**
  - Render Project and Article content using **Monospace HTML** (preserving basic bolding/links but using terminal fonts).
  - Provide a `[0] Back` option to return to the main menu.
- **System Controls:**
  - `[5] Desktop Mode`: A link to force the desktop view (with a mobile-unfriendly disclaimer).
  - `[6] Restart`: An option to re-trigger the BIOS boot animation.
- **URL State Persistence:**
  - Synchronize the active menu/article with the URL (e.g., `?safe=projects&slug=icarus`).
  - Support browser back/forward navigation within Safe Mode.

## Non-Functional Requirements

- **Performance:** Safe Mode must load and become navigable in < 1.5 seconds (excluding boot animation).
- **Visual Style:**
  - High-contrast Green-on-Black palette (`#00ff41`).
  - Subtle CRT effects: Scanlines and slight screen curvature.
  - Tahoma/Monospace font stack.
- **Accessibility:**
  - Full screen reader support for the text-based interface.
  - Support `prefers-reduced-motion` to skip the boot animation.

## Acceptance Criteria

- [ ] Viewport < 768px triggers Safe Mode immediately.
- [ ] BIOS boot animation runs for exactly 2 seconds before showing the menu.
- [ ] Tapping menu items or typing numbers navigates correctly.
- [ ] Content is readable and styled as monospace HTML.
- [ ] `[0] Back` button returns to the previous menu level.
- [ ] URL updates correctly and allows deep-linking to specific articles/projects.
- [ ] CRT effects are visible but do not hinder readability.
- [ ] "Switch to Desktop" and "Restart" functions work as intended.
