# PRD: Windows XP DevOps Portfolio (Luna OS)

**Author:** @mansyar  
**Version:** 1.2  
**Target Platform:** Cloudflare Pages (Free Tier)  
**Tech Stack:** Astro (Hybrid), React, Tailwind CSS, Nano Stores, MDX.

---

## 1. Executive Summary
A high-performance, retro-themed portfolio for a Software Engineer specializing in DevOps and Data Engineering. The site utilizes a **Windows XP "Luna"** aesthetic on desktop and transitions to a **"Safe Mode/BIOS"** terminal interface on mobile to ensure accessibility and performance.

---

## 2. Technical Stack & Infrastructure

| Layer | Technology | Reason |
| :--- | :--- | :--- |
| **Framework** | **Astro (Hybrid)** | Zero-JS by default; SSR capability for functional CLI/Search. |
| **Interactivity** | **React** | Handles draggable windows and complex state as "Islands." |
| **State Management** | **Nano Stores + URL Params** | Ultra-lightweight state for window Z-index and deep-linking. |
| **Styling** | **Tailwind CSS** | Custom Luna theme gradients and classic 3D borders. |
| **Content** | **MDX** | Project and DevOps notes rendered as interactive articles. |
| **Automation** | **GitHub Actions** | CRON-scheduled builds (every 24h) to sync GitHub API data. |

---

## 3. UI/UX Architecture

### 3.1 The Desktop Experience
*   **Wallpaper:** Bliss.webp (Optimized AVIF/WebP).
*   **Taskbar:** Bottom-aligned with a blue gradient. Features a **Classic Start Menu** containing:
    *   `Resume.exe` (Opens My Documents)
    *   `Control Panel` (Opens Task Manager)
    *   `Command Prompt` (Opens CLI)
    *   `Shut Down...` (Triggers BIOS/Goodbye overlay)
*   **Window Manager:** State-driven dragging, minimizing, and focusing using Nano Stores.

### 3.2 The Mobile Experience (Safe Mode)
*   **Trigger:** Viewport width < 768px.
*   **Visuals:** High-contrast black/green terminal aesthetic.
*   **Interaction:** Simplified text-based list navigation; no draggable windows.

---

## 4. File System & Content Mapping

### 🖥️ Desktop Icons
| Icon | Type | Content / Action |
| :--- | :--- | :--- |
| **My Computer** | Folder | Opens Explorer for `C:\Software_Engineering` and `D:\Systems_Data`. |
| **My Documents** | Folder | Contains `Resume.pdf`, `Certs/` folder, and contact info. |
| **Help & Support** | App | `E:\DevOps_Academy` (Notes from `devops-from-scratch` repo). |
| **Command Prompt** | App | Functional React terminal for CLI navigation. |
| **Recycle Bin** | Archive | Links to `mansyar.github.io` (Legacy) and old repositories. |

### 📂 Directory Details
*   **C:\Software_Engineering:** Features `icarus-server-manager` and `portable-mc-manager`.
*   **D:\Systems_Data:** Features `tubular-bexus-osw` and data-heavy system logs.
*   **E:\DevOps_Academy:** MDX files styled as the "Windows Help and Support Center" pane.

---

## 5. Specialized Application Specs

### 5.1 Command Prompt (cmd.exe)
*   **Functional CLI:** A React island implementing basic shell commands:
    *   `ls`: List current "directory" files (projects).
    *   `cd [folder]`: Navigate the project structure.
    *   `cat [file]`: Preview project descriptions in text format.
    *   `neofetch`: Display a stylized "system info" summary of @mansyar.

### 5.2 Task Manager (Control Panel)
*   **Performance Tab:** Real-time (simulated) CPU/RAM graphs representing Skill Levels.
*   **Processes Tab:** Lists technical stack (e.g., `python.exe`, `terraform.svc`, `react.dll`).

### 5.3 Help & Support Center
*   **UI:** Classic blue/white pane with a search bar and sidebar.
*   **Content:** Renders MDX files from the `devops-from-scratch` repository into readable "Help Articles."

---

## 6. DevOps & Deployment Strategy

1.  **Data Sync:** Astro fetches GitHub repo stats during build time using `Astro.fetchContent` or custom loaders.
2.  **Asset Pipeline:** Images are converted to WebP; icons remain high-quality SVGs.
3.  **Deployment:** 
    *   Automatic deploy on `git push`.
    *   CRON Job via GitHub Actions triggers a build at 00:00 UTC daily to update commit counts/repo data.
4.  **Edge Logic:** Cloudflare Functions handle the URL Search Param parsing for window state persistence.

---

## 7. Success Metrics
*   **Performance:** < 100ms TBT (Total Blocking Time).
*   **Authenticity:** Design mirrors 2001-era Windows XP pixel-for-pixel (3D borders, blue gradients).
*   **Utility:** Mobile "Safe Mode" must be fully navigable in under 1.5 seconds.