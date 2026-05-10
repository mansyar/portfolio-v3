# Product Guidelines

## Brand Voice & Tone

### Personality

The Luna OS portfolio speaks with the confidence and competence of a seasoned systems engineer. The tone is:

- **Professional but Playful:** Technical precision meets nostalgic delight. We take our craft seriously, but we don't take ourselves too seriously.
- **Nostalgic & Authentic:** The XP aesthetic isn't a gimmick — it's a loving homage. Every pixel, every gradient, every 3D border should feel earned.
- **Clear & Direct:** Technical writing for engineers. No fluff, no buzzwords. State facts clearly.

### Writing Style

- Use active voice: "The build pipeline fetches live data" not "Live data is fetched by the build pipeline"
- Keep copy concise: labels, tooltips, and descriptions should be short and scannable
- Technical terms (DevOps, CI/CD, Terraform) should be used precisely and correctly
- Error messages should match XP's style: informative but slightly cryptic ("The system cannot find the path specified.")

### Microcopy Guidelines

- Window titles: Capitalize each word ("Command Prompt", "Task Manager", "My Documents")
- Button labels: Short action verbs ("Shut Down", "OK", "Cancel")
- Directory paths: Use Windows convention with backslashes (`C:\Software_Engineering`)
- CLI output: Match XP's exact error message formatting

## Visual Design Principles

### Authenticity Over Abstraction

- The design must be recognizably Windows XP Luna at a glance
- Use actual XP gradients, color values, and border styles — not approximations
- Every interactive element should have the correct 3D raised/inset appearance
- Icons should be inspired by XP originals but custom-drawn to avoid copyright

### Performance-Conscious Aesthetics

- CSS gradients and box-shadows over images wherever possible
- SVG icons over PNG — crisp at any scale, small file size
- Font subsetting to include only Latin characters for Tahoma
- Animations use `transform` and `opacity` only (GPU-composited properties)

### Mobile is Not an Afterthought

- The Safe Mode terminal is a deliberate, themed experience — not a fallback
- All content must be fully accessible on mobile without JavaScript
- CRT scanline and curvature effects are subtle enough to not impede readability

### State Should Be Visible

- Every open window is reflected in the URL for deep-linking
- Window positions, sizes, and focus state are preserved across navigation
- The taskbar always shows all open windows accurately

## UX Principles

### The Desktop Metaphor

- Visitors should feel like they're using a real operating system
- Window behavior (drag, resize, minimize, maximize, close) must feel physically responsive
- Double-click to open, single-click to select — matching OS conventions
- Right-click context menus are out of scope for v1 (but the foundation should support them)

### Fitts's Law & Target Sizing

- Desktop icons: minimum 32×32px with 8px padding
- Taskbar buttons: minimum 24px height
- Title bar close/minimize/maximize buttons: minimum 16×16px clickable area
- Resize handles: 8px hit zone from window edges and corners

### Feedback & Responsiveness

- Every action produces immediate visual feedback (hover highlight, click effect, window animation)
- Window open: 150ms ease-out scale animation
- Window close: 120ms ease-in scale animation
- Minimize: 200ms ease-in slide toward taskbar
- Desktop icon double-click: brief color inversion (XP-style)

### Reduced Motion

- All animations disabled when `prefers-reduced-motion: reduce` is active
- Safe Mode boot sequence is the only exception (it conveys essential state)

## Accessibility Guidelines

- All windows use `role="dialog"` with `aria-label`
- Taskbar uses `role="toolbar"`; Start Menu uses `role="menu"`; Desktop uses `role="application"`
- Tab order: desktop icons → taskbar → open windows (in z-index order)
- Enter activates focused element; Escape closes menus and windows
- Focus must always be visible with a clear outline
- Safe Mode green-on-black text must pass WCAG AA contrast ratio
- All decorative XP chrome elements must use `aria-hidden="true"`

## Content Guidelines

### Project MDX Files

- Each project entry must include: title, slug, drive location, description, repo URL, language, tech stack, and status
- Frontmatter fields are populated at build time with GitHub API data (stars, commits, last push date)
- Content should describe the engineering challenges, architecture decisions, and personal contributions

### DevOps Academy Articles

- Categorized by topic (Linux, Docker, CI/CD, etc.)
- Sorted by `order` field within each category
- Written as educational reference material — clear, practical, and example-driven
- Styled as Windows XP Help and Support Center articles

## Technical Boundaries

- No backend server — pure static site with Cloudflare edge logic
- All dynamic data comes from GitHub API at build time, cached for offline resilience
- JavaScript is only used for interactive islands (windows, CLI, graphs)
- The static desktop view must render and be crawlable without JavaScript
- URL search params are the only persistence mechanism (no localStorage, no cookies)
