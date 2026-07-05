# Portfolio Website - Technical Documentation

> **Repository:** pixelboatt.github.io | **Owner:** Parintorn Sanguanpong | **Domain:** https://parintorn.com

---

## Overview

React 19 + TypeScript + Vite + Tailwind CSS 4 single-page portfolio with cyberpunk aesthetic and Matrix rain animation. Deployed automatically via GitHub Actions to GitHub Pages.

**Tech Stack:** React 19.2.0 • TypeScript 5.9.3 • Vite 7.2.4 • Tailwind CSS 4.1.17 • Framer Motion 12.23.24

---

## Architecture

```
App
├── MatrixRain (Background)
├── Navigation (Fixed header)
└── main
    ├── Hero
    ├── Projects
    ├── Technologies
    ├── Experience
    └── Contact
```

**Sections:** Hero → #projects → #technologies → #experience → #contact (smooth scroll navigation)

---

## Key Files

**Configuration:**
- `vite.config.ts` - Vite + Tailwind v4 plugin
- `src/index.css` - Tailwind v4 @theme config (colors, fonts, animations)
- `.github/workflows/deploy.yml` - Auto-deploy on push to master

**Source:**
- `src/data/portfolio.ts` - **ALL content data** (projects, experience, skills, personal info)
- `src/components/*.tsx` - React components
- `src/hooks/useMousePosition.ts` - Mouse tracking for hover effects

**Assets:**
- `public/images/` - Project preview images

---

## Data Structure (`src/data/portfolio.ts`)

```typescript
// Personal Info
export const personalInfo = {
  name: "Parintorn Sanguanpong",
  title: "Senior Software Engineer",
  description: "...",
  github: "https://github.com/pixelboatt",
  linkedin: "https://www.linkedin.com/in/parintorn-s-24579a179/",
  email: "parintorn1902@gmail.com",
};

// Projects
export interface Project {
  projectId: number;
  projectName: string;
  projectDesc: string;
  projectPreviewImage: string;  // filename in public/images/
  projectDemoLink?: string;
  projectSourceLink?: string;
  tags?: string[];
}

// Experience
export interface Experience {
  period: string;
  position: string;
  workplace: string;
  detail: string[];
  wfh: boolean;
  techStacks: string[];
}
```

---

## Styling (Tailwind v4)

**Important:** Tailwind v4 uses CSS-based configuration in `src/index.css` via `@theme` directive (no `tailwind.config.js`).

### Custom Colors
```css
@theme {
  --color-cyber-primary: #00ff41;      /* Matrix green */
  --color-cyber-secondary: #00d9ff;    /* Cyan blue */
  --color-cyber-accent: #ff2a6d;       /* Hot pink */
  --color-cyber-dark: #0a0e27;
  --color-cyber-darker: #05070f;
  --color-cyber-card: #0f1629;
}
```
Usage: `bg-cyber-darker`, `text-cyber-primary`, `border-cyber-primary`

### Custom Animations
```css
@theme {
  --animate-glow: glow 2s ease-in-out infinite alternate;
  --animate-float: float 3s ease-in-out infinite;
  --animate-spin-slow: spin 5s linear infinite;
}
```

### Custom Classes
```css
@layer components {
  .glow-text { /* Matrix green text shadow */ }
  .glass-card { /* Glassmorphism backdrop blur */ }
}
```

---

## Development

### Setup
```bash
git clone https://github.com/pixelboatt/pixelboatt.github.io.git
cd pixelboatt.github.io
npm install
npm run dev  # http://localhost:5173
```

### Commands
```bash
npm run dev      # Dev server with hot reload
npm run build    # Production build
npm run preview  # Preview build locally
npm run lint     # ESLint
```

### Add New Project
1. Add image to `public/images/my-project.png`
2. Edit `src/data/portfolio.ts`:
   ```typescript
   export const projects: Project[] = [
     {
       projectId: 3,
       projectName: "My Project",
       projectDesc: "Description...",
       projectPreviewImage: "my-project.png",
       projectDemoLink: "https://demo.com",
       projectSourceLink: "https://github.com/user/repo",
       tags: ["React", "TypeScript"],
     },
   ];
   ```
3. Test: `npm run dev`
4. Deploy: `git add . && git commit -m "Add project" && git push origin master`

### Update Content
- **Projects:** `src/data/portfolio.ts` → `projects` array
- **Experience:** `src/data/portfolio.ts` → `experiences` array
- **Skills:** `src/data/portfolio.ts` → `skills` object
- **Technologies:** `src/data/portfolio.ts` → `technologies` object

### Customize Styles
Add to `src/index.css`:
```css
@theme {
  --color-custom: #hex;
  --animate-custom: name 2s ease infinite;
}

@keyframes name {
  0% { /* ... */ }
  100% { /* ... */ }
}

@layer components {
  .my-class {
    @apply bg-cyber-dark text-cyber-primary;
  }
}
```

---

## Deployment

**Auto-deploys on push to `master` branch** (~2-3 min)

**Process:** Push → GitHub Actions → Build → Deploy to GitHub Pages

**URLs:**
- https://parintorn.com
- https://pixelboatt.github.io

---

## Troubleshooting

**Build fails:**
- Check TypeScript errors in terminal
- Run `npm run lint`

**Tailwind classes not working:**
- Verify `src/index.css` has `@import "tailwindcss";`
- Verify `vite.config.ts` has `tailwindcss()` plugin
- Clear cache: `rm -rf dist node_modules/.vite && npm run build`

**Deployment fails:**
- Check GitHub Actions logs (Actions tab)
- Verify repo permissions: Settings → Actions → General → "Read and write permissions"

---

## Quick Reference

### File Structure
```
src/
├── components/          # React components
├── data/portfolio.ts    # ALL CONTENT DATA HERE
├── hooks/
├── App.tsx
├── index.css           # Tailwind v4 @theme config
└── main.tsx
public/images/          # Project preview images
vite.config.ts          # Build config
```

### Important Notes
- **Tailwind v4:** Configuration in `src/index.css` using `@theme` (NOT tailwind.config.js)
- **Content:** Centralized in `src/data/portfolio.ts`
- **Deployment:** Automatic on push to master
- **Dev server:** `npm run dev` on http://localhost:5173

---

**Version:** 2.4 (Essential) | **Updated:** Dec 3, 2025
