# Initial Concept

A high-performance, retro-themed portfolio website for a Software Engineer specializing in DevOps and Data Engineering. The site features a Windows XP "Luna" aesthetic on desktop and transitions to a "Safe Mode/BIOS" terminal interface on mobile to ensure accessibility and performance. Built with Astro (Hybrid), React, Tailwind CSS, Nano Stores, and MDX, deployed on Cloudflare Pages.

---

# Product Definition

## Product Vision

A nostalgic yet high-performance portfolio that showcases a DevOps & Data Engineer's skills through the lens of Windows XP's iconic "Luna" interface. The site immerses visitors in a fully functional desktop environment — complete with draggable windows, a Start Menu, file explorer, and command prompt — while ensuring full accessibility on mobile devices through a BIOS-style Safe Mode terminal.

## Target Audience

- **Primary:** Technical recruiters and hiring managers evaluating DevOps & Data Engineering candidates
- **Secondary:** Developers and tech enthusiasts who appreciate retro computing aesthetics
- **Tertiary:** Anyone looking for an unconventional, memorable portfolio experience

## Core Features

### Desktop Mode (≥ 768px viewport)

- **Windows XP Luna Desktop:** Bliss wallpaper, desktop icons, taskbar with Start Menu
- **Window Manager:** State-driven draggable, resizable, minimizable/maximizable windows powered by Nano Stores
- **File Explorer:** Virtual filesystem with `C:\`, `D:\`, `E:\` drives, folder navigation, MDX content rendering, and special views for My Documents and Recycle Bin
- **My Documents:** Explorer view at `D:\My_Documents` with Resume.pdf (opens in new tab), Certs folder (placeholder), and Contact.txt (contact info card with clickable links)
- **Recycle Bin:** Explorer view at `\Recycle_Bin` with deleted/archived file styling — grayed-out icon, strikethrough name, disabled Restore button — for legacy project items
- **Command Prompt:** Functional terminal emulator with `ls`, `cd`, `cat`, `neofetch`, and other shell commands
- **Task Manager:** Processes tab showing skill entries + Performance tab with live-animated skill graphs
- **Knowledge Base:** MDX article browser styled as the classic XP Knowledge Base pane
- **Start Menu:** Two-column layout with pinned apps, system folders, and Shut Down button
- **Pong:** Canvas-based Pong game with difficulty selection (Easy/Medium/Hard), AI opponent with configurable speed/accuracy, first-to-5 scoring, W/S or Arrow keys controls, and rAF-powered game loop
- **Minesweeper:** Canvas-based 9×9 Minesweeper with 10 mines, left-click reveal, right-click flag, flood-fill, timer, mine counter, and canvas-drawn smiley face button

### Mobile Safe Mode (< 768px viewport)

- **BIOS Boot Sequence:** Animated 2-second line-by-line branding text on initial load, skipable via reduced motion settings.
- **Terminal Menu:** Numbered text-based navigation (`[1] Projects [2] Knowledge Base [3] Contact [4] Desktop Mode [5] Restart`).
- **CRT Visual Effects:** Scanline overlay and screen curvature
- **Full Content Access:** All project and article bodies rendered as monospace text blocks, preserving deep-linking and browser history.
- **Desktop Override:** Opt-in "Desktop Mode" button to force the full XP interface on mobile viewports.

### SEO & Structured Data

- **MetaTags Component:** Astro component injecting `<title>`, `<meta name="description">`, Open Graph tags (og:title, og:description, og:image, og:type), and JSON-LD Person schema with name, jobTitle, and url into `<head>`
- **OG Image:** `/og-preview.png` referenced in meta tags for social media preview cards

### Error Handling

- **404 Error Page:** Windows XP BSOD-themed page with STOP: 0x000000FE error code, fake memory dump indicator, and "Press any key to restart" link to homepage
- **Noscript Fallback:** Plain HTML links to all portfolio projects for users with JavaScript disabled

### Content & Data

- **Project MDX Files:** Detailed project write-ups with frontmatter (repo URL, tech stack, status)
- **Articles MDX:** Variative articles spanning Software Engineering, AI, DevOps, and more
- **GitHub API Sync:** Build-time data fetching for live star counts and commit dates
- **Resume:** PDF file accessible via My Documents — opens in a new browser tab on click

## User Experience Principles

1. **Authenticity First:** Design mirrors 2001-era Windows XP pixel-for-pixel — 3D borders, blue gradients, Tahoma font
2. **Performance is Non-Negotiable:** TBT < 100ms, zero-JS by default via Astro, interactive "Islands" only where needed
3. **Mobile as First-Class Citizen:** The Safe Mode experience is not a downgrade — it's a deliberate, themed alternative
4. **Deep-Linkable State:** Every open window and active application is reflected in the URL for sharing and bookmarking
5. **Keyboard Accessible:** Full keyboard navigation, ARIA roles, and screen reader support

## Success Metrics

| Metric                    | Target                    |
| ------------------------- | ------------------------- |
| Total Blocking Time (TBT) | < 100ms                   |
| Lighthouse Performance    | > 90                      |
| Design Authenticity       | Pixel-accurate XP chrome  |
| Mobile Load Time          | Fully navigable in < 1.5s |
| Build Time                | < 60 seconds              |

## Constraints & Boundaries

- **Out of Scope:** Two-player Pong, larger Minesweeper boards, sound effects, leaderboards, touch/mobile support, state persistence, tab-completion in CLI (v1), real-time collaboration, custom window themes
- **Platform:** Cloudflare Pages (free tier) — no backend server, purely static + edge
- **Performance Budget:** All JS bundles must be under 100KB total gzipped
