# Portfolio Website - Technical Documentation

> **Repository:** parintorn1902.github.io
> **Type:** React TypeScript Source Code with GitHub Actions Deployment
> **Owner:** Parintorn Sanguanpong
> **Domain:** https://parintorn.com
> **Documentation Version:** 2.1
> **Last Updated:** November 24, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Repository Structure](#repository-structure)
3. [Technology Stack](#technology-stack)
4. [Architecture](#architecture)
5. [Components](#components)
6. [Data Structures](#data-structures)
7. [Styling & Design](#styling--design)
8. [Features](#features)
9. [Build & Deployment](#build--deployment)
10. [Development Guide](#development-guide)

---

## Overview

This repository contains the **source code** of a personal portfolio website. It is a **single-page application (SPA)** built with React 19, TypeScript, Vite, and Tailwind CSS, featuring a cyberpunk/hacker aesthetic with matrix rain animations.

**Repository Type:** Source code repository with automatic GitHub Actions deployment to GitHub Pages.

### Key Characteristics

- **Type:** Single Page Application (SPA)
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 3 + Custom CSS
- **Animations:** Framer Motion
- **Deployment:** GitHub Pages via GitHub Actions
- **Navigation:** Smooth scroll (no URL routing)
- **Responsive:** Mobile-first design
- **Theme:** Cyberpunk/Hacker aesthetic with Matrix rain effect

---

## Repository Structure

```
parintorn1902.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml                 # GitHub Actions deployment workflow
├── public/
│   ├── images/                        # Static images (project previews, etc.)
│   │   ├── favicon.png               # Site favicon (PNG version)
│   │   ├── netflix-preview.png       # Netflix project preview
│   │   └── student-management-preview.png # CRUD project preview
│   ├── favicon.svg                    # Site favicon (SVG)
│   └── vite.svg                       # Vite logo
├── images/                             # Additional images directory at root
├── favicon.svg                         # Favicon (also at root level)
├── src/
│   ├── components/                    # React components
│   │   ├── Contact.tsx               # Contact section component
│   │   ├── Experience.tsx            # Experience/timeline component
│   │   ├── Hero.tsx                  # Hero/landing section
│   │   ├── MatrixRain.tsx            # Matrix rain background effect
│   │   ├── Navigation.tsx            # Header navigation
│   │   ├── Projects.tsx              # Projects showcase
│   │   └── Technologies.tsx          # Tech stack display
│   ├── data/
│   │   └── portfolio.ts              # Portfolio data (projects, experience, etc.)
│   ├── hooks/
│   │   └── useMousePosition.ts       # Mouse position tracking hook
│   ├── App.tsx                       # Main application component
│   ├── index.css                     # Global styles, Tailwind imports
│   ├── main.tsx                      # Application entry point
│   └── vite-env.d.ts                 # Vite type definitions
├── index.html                         # HTML entry point
├── package.json                       # Dependencies and scripts
├── package-lock.json                  # Locked dependency versions
├── tsconfig.json                      # TypeScript configuration
├── tsconfig.app.json                  # TypeScript app configuration
├── tsconfig.node.json                 # TypeScript node configuration
├── vite.config.ts                     # Vite build configuration
├── tailwind.config.js                 # Tailwind CSS configuration
├── postcss.config.js                  # PostCSS configuration
├── eslint.config.js                   # ESLint flat config
├── .gitignore                         # Git ignore rules
├── CLAUDE.md                          # This documentation
└── README.md                          # Project introduction
```

---

## Technology Stack

### Frontend Framework

- **React 19.2.0** - Latest React with improved concurrent features
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Vite 7.2.4** - Fast build tool and dev server
- **Framer Motion 12.23.24** - Animation library

### Styling

- **Tailwind CSS 3** - Utility-first CSS framework (v3.4.18)
- **PostCSS** - CSS transformation (v8.5.6)
- **Autoprefixer** - Automatic vendor prefixes (v10.4.22)
- **Custom CSS** - Matrix rain animations and effects

### Icons & UI

- **react-icons** - Comprehensive icon library (v5.5.0)

### Development Tools

- **TypeScript ESLint 8.46.4** - Code linting
- **Vite Plugin React 5.1.1** - Fast Refresh support
- **ESLint 9.39.1** - JavaScript linter
- **@types/node 24.10.1** - Node.js type definitions
- **@types/react 19.2.5** - React type definitions
- **@types/react-dom 19.2.3** - React DOM type definitions

### Deployment

- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Static site hosting
- **Custom Domain** - parintorn.com (via DNS CNAME)

---

## Architecture

### Application Structure

This is a **single-page application** without traditional routing. The page consists of multiple sections that are accessed via smooth scrolling.

#### Component Hierarchy

```
App
├── MatrixRain (Background)
├── Navigation (Fixed header)
└── main (Content)
    ├── Hero
    ├── Projects
    ├── Technologies
    ├── Experience
    └── Contact
```

#### Page Sections

1. **Hero** - Landing section with introduction
2. **#projects** - Project showcase
3. **#technologies** - Tech stack display
4. **#experience** - Work experience timeline
5. **#contact** - Contact information and links

### Navigation System

**Type:** Anchor-based smooth scroll

**Implementation:**
```typescript
// Smooth scrolling enabled globally in App.tsx
document.documentElement.style.scrollBehavior = 'smooth';
```

**Features:**
- Fixed header navigation
- Smooth scroll to sections
- Mobile-responsive menu
- Active section highlighting (optional)

---

## Components

### 1. **App Component** (`src/App.tsx`)

**Purpose:** Root component that orchestrates the entire application

**Structure:**
```tsx
<div className="relative min-h-screen overflow-x-hidden">
  <MatrixRain />
  <Navigation />
  <main className="relative z-10">
    <Hero />
    <Projects />
    <Technologies />
    <Experience />
    <Contact />
  </main>
</div>
```

**Features:**
- Sets up smooth scrolling behavior
- Manages global layout structure
- Z-index layering for background and content
- Cleanup on unmount

---

### 2. **MatrixRain Component** (`src/components/MatrixRain.tsx`)

**Purpose:** Animated background effect with falling characters (Matrix-style)

**Features:**
- Canvas-based animation
- Cyberpunk aesthetic
- Optimized performance
- Responsive to window resizing
- **Opacity: 0.3** (updated from 0.08 for better visibility)

**Implementation Details:**
- Uses HTML5 Canvas API
- Characters: Katakana, Latin, numbers
- Green color scheme (#0F0)
- Continuous animation loop
- Background positioned at z-index 0

---

### 3. **Navigation Component** (`src/components/Navigation.tsx`)

**Purpose:** Fixed header navigation bar

**Features:**
- Fixed positioning (stays at top on scroll)
- Scroll-triggered effects (blur, shadow)
- Logo with profile image
- Navigation menu items
- Social media links (GitHub, LinkedIn)
- Mobile-responsive hamburger menu

**Navigation Links:**
- Projects → scrolls to #projects
- Technologies → scrolls to #technologies
- Experience → scrolls to #experience
- Contact → scrolls to #contact

**Social Links:**
- GitHub: https://github.com/parintorn1902
- LinkedIn: https://www.linkedin.com/in/parintorn-s-24579a179/

**Mobile Behavior:**
- Hamburger menu on small screens
- Full-screen overlay menu
- Touch-friendly interactions

---

### 4. **Hero Component** (`src/components/Hero.tsx`)

**Purpose:** Landing section with introduction

**Content:**
- Name: "Parintorn Sanguanpong"
- Title: "Senior Software Engineer"
- Description: Professional introduction
- Tagline: "Building modern web experiences with code"

**Layout:**
- Centered content
- Responsive typography
- Large, impactful text
- Animated entrance effects (Framer Motion)

**Data Source:** `src/data/portfolio.ts` - `personalInfo` object

---

### 5. **Projects Component** (`src/components/Projects.tsx`)

**Purpose:** Showcase portfolio projects with previews

**Features:**
- Responsive grid layout
- Project cards with hover effects
- Preview images
- Links to live demos and source code
- Technology tags

**Data Source:** `src/data/portfolio.ts` - `projects` array

**Project Card Structure:**
- Preview image (from public/images/)
- Project name (title)
- Description
- Technology tags (badges)
- Live Demo button (if available)
- View Source button (GitHub link)

**Current Projects:**
1. **Netflix Clone**
   - Next.js + Tailwind CSS
   - Demo: https://parintorn.com/netflix
   - Source: https://github.com/parintorn1902/my-netflix

2. **Basic CRUD & JWT**
   - Next.js + Chakra-UI + Node.js
   - Source: https://github.com/parintorn1902/basic-react-node-crud

**Interactions:**
- Hover: Scale up, add glow effect
- Click: Open link in new tab

---

### 6. **Technologies Component** (`src/components/Technologies.tsx`)

**Purpose:** Display front-end and back-end technology stack

**Layout:**
- Two-column grid (desktop)
- Single column (mobile)
- Icons with animations
- Categorized tech lists

**Categories:**

**Front-End:**
- **React.js** ecosystem:
  - Next.js, Vite, Tailwind CSS
  - Shadcn-ui, Mantine UI, Chakra-UI, Material-UI, AntDesign, Semantic-UI, Bulma
  - Prisma
- **React Native**:
  - React Native CLI, Expo
  - Nativewind, Reanimated
  - Native Modules, Expo Modules
  - App publishing (Play Store, App Store)

**Back-End:**
- **Node.js**:
  - Express, CORS, TypeORM, MongoDB, JWT
  - Multer, ShellJS, BcryptJS, Axios, FS-Extra, PM2
- **Golang**:
  - Gin, GORM
  - PostgreSQL, MongoDB
  - JWT, REST API
- **Java**:
  - Spring Boot, Spring MVC, Spring Data JPA
  - PostgreSQL, MongoDB
  - Spring Security, JWT, Lombok

**Data Source:** `src/data/portfolio.ts` - `technologies` object

**Animations:**
- React icon: Spinning animation
- Node icon: Bounce animation (optional)
- Entrance animations via Framer Motion

---

### 7. **Experience Component** (`src/components/Experience.tsx`)

**Purpose:** Display work experience timeline with skills

**Sections:**

**1. Skills Overview:**

**Programming:**
- TypeScript, Modern JavaScript, JSDoc
- Golang, RESTful API, Docker
- JSON, OOP, Promise, Async/Await

**Tools:**
- Cursor, VS Code, Android Studio
- Postman, Docker, FileZilla, Termius
- DBeaver, Robo 3T

**AI Tools:**
- Cursor AI, Claude Code
- ChatGPT (Agent & Thinking Partner)
- AI-Assisted Development, Prompt Engineering
- AI for Design & Brainstorming

**Cloud:**
- AWS Lightsail, Digital Ocean
- Google Maps Platform, Firebase
- Play Console, App Store Connect

**2. Work Experience Timeline:**

**Visual Design:**
- Vertical timeline with animated dots
- Experience cards with details
- Work location indicators (office/remote icons)
- Technology stack badges

**Current Experiences:**

1. **Senior Software Engineer** @ TechBerry Company Limited
   - Period: 2018 - Present
   - Responsibilities:
     - Design & develop products using modern technologies
     - Continue release product and support issues
     - Research new technologies and solutions to improve products
     - Lead technical implementations and mentor junior developers
   - Work Location: Office
   - Tech Stack: React.js, React Native, Node.js, Golang, MongoDB, PostgreSQL, Docker

2. **Freelancer** @ Home
   - Period: 2015 - 2017
   - Responsibilities:
     - Outsourcing projects from partners
   - Work Location: Home (Remote)
   - Tech Stack: PHP, HTML, CSS, JS, Ajax, MySQL

**Data Source:** `src/data/portfolio.ts` - `experiences` array, `skills` object

---

### 8. **Contact Component** (`src/components/Contact.tsx`)

**Purpose:** Contact information and social links

**Content:**
- **GitHub:** https://github.com/parintorn1902 (@parintorn1902)
- **LinkedIn:** https://www.linkedin.com/in/parintorn-s-24579a179/ (parintorn-s)

**Features:**
- Interactive cards with mouse tracking light effects
- Glassmorphism design with backdrop blur
- Icon links with hover effects and color transitions
- Responsive grid layout (2 columns on desktop, 1 on mobile)
- Hover animations (slide right effect)
- Terminal-style border and styling
- Footer with copyright and design attribution

**Special Effects:**
- **ContactCard component**: Custom card with mouse position tracking
- Radial gradient follows mouse position on hover
- Background glow effect (rgba(0, 255, 65, 0.15))
- Smooth transitions and animations

**Data Source:** `src/data/portfolio.ts` - `personalInfo` object

**Note:** Email is stored in `personalInfo.email` but not displayed in the Contact component UI. Contact is limited to GitHub and LinkedIn links.

---

### 9. **Custom Hook: useMousePosition** (`src/hooks/useMousePosition.ts`)

**Purpose:** Track mouse position relative to a specific element for interactive effects

**Signature:**
```typescript
useMousePosition(ref: RefObject<HTMLElement | null>)
```

**Returns:**
```typescript
{
  mousePosition: {
    x: number;  // Mouse X coordinate relative to element
    y: number;  // Mouse Y coordinate relative to element
  },
  isHovering: boolean;  // Whether mouse is over the element
}
```

**Features:**
- Tracks mouse position relative to the referenced element (not global position)
- Uses element's `getBoundingClientRect()` to calculate relative coordinates
- Provides hover state tracking (`isHovering`)
- Handles `mousemove`, `mouseenter`, and `mouseleave` events
- Automatic cleanup on unmount

**Usage:**
```typescript
const cardRef = useRef<HTMLDivElement>(null);
const { mousePosition, isHovering } = useMousePosition(cardRef);

// Use in component
<div ref={cardRef}>
  {isHovering && (
    <div style={{
      background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ...)`
    }} />
  )}
</div>
```

**Used In:**
- ContactCard component (mouse tracking light effect)
- Interactive card effects
- Cursor-following animations

---

## Data Structures

### Portfolio Data (`src/data/portfolio.ts`)

This file contains all the content data for the portfolio in a centralized, type-safe format.

#### Personal Information

```typescript
export const personalInfo = {
  name: "Parintorn Sanguanpong",
  title: "Senior Software Engineer",
  description: "Hello, I'm a Senior Software Engineer specializing in full-stack development...",
  tagline: "Building modern web experiences with code",
  location: "Thailand",
  github: "https://github.com/parintorn1902",
  linkedin: "https://www.linkedin.com/in/parintorn-s-24579a179/",
  email: "parintorn1902@gmail.com",
};
```

#### Project Interface & Data

```typescript
export interface Project {
  projectId: number;
  projectName: string;
  projectDesc: string;
  projectPreviewImage: string;  // Filename in public/images/
  projectDemoLink?: string;     // Optional live demo URL
  projectSourceLink?: string;   // Optional GitHub repo URL
  tags?: string[];              // Technology tags
}

export const projects: Project[] = [
  {
    projectId: 1,
    projectName: "Netflix Clone",
    projectDesc: "Next.js and Tailwind.css making the ultimate Netflix clone website",
    projectPreviewImage: "netflix-preview.png",
    projectDemoLink: "https://parintorn.com/netflix",
    projectSourceLink: "https://github.com/parintorn1902/my-netflix",
    tags: ["Next.js", "Tailwind CSS", "React"],
  },
  {
    projectId: 2,
    projectName: "Basic CRUD & JWT",
    projectDesc: "Next.js with Chakra-UI and RESTful Node.js service with authentication",
    projectPreviewImage: "student-management-preview.png",
    projectSourceLink: "https://github.com/parintorn1902/basic-react-node-crud",
    tags: ["Next.js", "Chakra-UI", "Node.js", "JWT"],
  },
];
```

#### Experience Interface & Data

```typescript
export interface Experience {
  period: string;           // "YYYY - YYYY" or "YYYY - Present"
  position: string;         // Job title
  workplace: string;        // Company name
  detail: string[];         // Array of responsibility strings
  wfh: boolean;            // Work from home indicator
  techStacks: string[];    // Array of technology names
}

export const experiences: Experience[] = [
  {
    period: "2018 - Present",
    position: "Senior Software Engineer",
    workplace: "TechBerry Company Limited",
    detail: [
      "Design & develop products using modern technologies",
      "Continue release product and support issues",
      "Research new technologies and solutions to improves the products",
      "Lead technical implementations and mentor junior developers",
    ],
    wfh: false,
    techStacks: ["React.js", "React Native", "Node.js", "Golang", "MongoDB", "PostgreSQL", "Docker"],
  },
  {
    period: "2015 - 2017",
    position: "Freelancer",
    workplace: "Home",
    detail: ["Outsourcing projects from partners"],
    wfh: true,
    techStacks: ["PHP", "HTML", "CSS", "JS", "Ajax", "MySQL"],
  },
];
```

#### Skills Data

```typescript
export const skills = {
  programming: [
    "Typescript", "Modern Javascript", "JSDoc", "Golang",
    "RESTful API", "Docker", "JSON", "OOP", "Promise", "Async/Await",
  ],
  tools: [
    "Cursor", "VS Code", "Android Studio", "Postman", "Docker",
    "FileZilla", "Termius", "DBeaver", "Robo 3T",
  ],
  ai: [
    "Cursor AI", "Claude Code", "ChatGPT (Agent & Thinking Partner)",
    "AI-Assisted Development", "Prompt Engineering", "AI for Design & Brainstorming",
  ],
  cloud: [
    "AWS Lightsail", "Digital Ocean", "Google Maps Platform",
    "Firebase", "Play Console", "App Store Connect",
  ],
};
```

#### Technologies Structure

```typescript
export const technologies = {
  frontend: {
    category: "Front-End",
    icon: "react",
    techs: [
      {
        name: "React.js",
        items: ["Next.js", "Vite", "Tailwind.css", "Shadcn-ui", "Mantine UI", ...]
      },
      {
        name: "React Native",
        items: ["React Native CLI", "Expo", "Nativewind", ...]
      }
    ]
  },
  backend: {
    category: "Back-End",
    icon: "node",
    techs: [
      { name: "Node.js", items: ["Express", "CORS", "TypeORM", ...] },
      { name: "Golang", items: ["Gin", "GORM", ...] },
      { name: "Java", items: ["Spring Boot", ...] }
    ]
  }
};
```

---

## Styling & Design

### Color Palette (Cyberpunk Theme)

**Custom Tailwind Colors (defined in `tailwind.config.js`):**
```javascript
cyber: {
  primary: '#00ff41',      // Matrix green - primary accent
  secondary: '#00d9ff',    // Cyan blue - secondary accent
  accent: '#ff2a6d',       // Hot pink - tertiary accent
  dark: '#0a0e27',         // Dark blue background
  darker: '#05070f',       // Darkest background
  card: '#0f1629',         // Card background
}
```

**Matrix Effect:**
```css
--matrix-color: #0F0;             /* Bright green */
--matrix-opacity: 0.3;            /* Background opacity */
```

**Usage in Tailwind:**
- `bg-cyber-darker` - Darkest background (#05070f)
- `bg-cyber-dark` - Dark background (#0a0e27)
- `bg-cyber-card` - Card background (#0f1629)
- `text-cyber-primary` - Matrix green text (#00ff41)
- `border-cyber-primary` - Matrix green borders

**Theme Characteristics:**
- Dark cyberpunk aesthetic
- Matrix-style green accents
- High contrast for readability
- Neon glow effects on hover
- Futuristic, tech-focused design

### Typography

**Font Families (defined in `tailwind.config.js` and imported in `index.css`):**
```javascript
fontFamily: {
  mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
  sans: ['Inter', 'system-ui', 'sans-serif'],
}
```

**Google Fonts Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap');
```

**Font Strategy:**
- **Primary**: JetBrains Mono (monospace) - Used for most text, maintaining cyberpunk theme
- **Secondary**: Inter (sans-serif) - Used for cleaner, more readable sections
- High readability with multiple font weights (300-800)

**Font Sizes (Tailwind):**
- `text-6xl` / `text-5xl`: Hero titles (3rem - 4rem / 48px - 64px)
- `text-3xl` / `text-2xl`: Section headers (1.875rem - 3rem / 30px - 48px)
- `text-xl`: Subsection titles (1.25rem / 20px)
- `text-lg`: Emphasized body (1.125rem / 18px)
- `text-base`: Default body (1rem / 16px)
- `text-sm`: Small text (0.875rem / 14px)

### Responsive Breakpoints

Based on Tailwind CSS defaults:

| Breakpoint | Min Width | Classes | Use Case |
|------------|-----------|---------|----------|
| `sm` | 640px | `sm:` | Small tablets, large phones |
| `md` | 768px | `md:` | Tablets (portrait) |
| `lg` | 1024px | `lg:` | Tablets (landscape), small desktops |
| `xl` | 1280px | `xl:` | Desktop screens |
| `2xl` | 1536px | `2xl:` | Large desktops |

**Common Responsive Patterns:**
```tsx
// Mobile-first approach
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### Animations

#### Framer Motion Animations

**Entrance Animations:**
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
```

**Hover Effects:**
```tsx
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

**Scroll-Triggered Animations:**
- Fade in on scroll
- Stagger animations for lists
- Parallax effects (optional)

**Common Animation Patterns:**
- Cards: Scale up on hover
- Buttons: Slight scale + glow
- Icons: Rotate or bounce
- Sections: Fade in from bottom

#### Tailwind Custom Animations

**Custom Animations (defined in `tailwind.config.js`):**
```javascript
animation: {
  'glow': 'glow 2s ease-in-out infinite alternate',
  'float': 'float 3s ease-in-out infinite',
  'scan': 'scan 8s linear infinite',
  'glitch': 'glitch 1s linear infinite',
  'typing': 'typing 3.5s steps(40, end)',
  'blink': 'blink 0.7s infinite',
  'spin-slow': 'spin 5s linear infinite',
}
```

**Keyframes:**
- **glow**: Text shadow pulsing effect (0-30px glow)
- **float**: Vertical floating motion (-20px)
- **scan**: Vertical scanning line effect (top: 0% → 100%)
- **glitch**: Glitch distortion effect (±2px)
- **typing**: Typewriter effect (width animation)
- **blink**: Cursor blinking effect
- **spin-slow**: Slow rotation (5s per rotation)

**Usage:**
```tsx
<div className="animate-glow">Glowing text</div>
<div className="animate-float">Floating element</div>
```

#### CSS Custom Classes (defined in `index.css`)

**Utility Classes:**
```css
.glow-text      // Text with matrix green glow shadow
.glow-box       // Box with matrix green glow shadow
.glass-card     // Glassmorphism card with backdrop blur
.terminal-border // Terminal-style border with accent color
```

**Custom Scrollbar:**
- Width: 10px
- Track: Dark background (`bg-cyber-darker`)
- Thumb: Matrix green with opacity (`bg-cyber-primary/30`)
- Hover: Increased opacity (`bg-cyber-primary/50`)

**Selection Style:**
- Background: Matrix green (`bg-cyber-primary`)
- Text: Dark background (`text-cyber-darker`)

#### CSS Animations

**Matrix Rain:**
- Canvas-based animation
- Continuous falling characters
- Green color (#0F0)
- Opacity 0.3

**Transitions:**
```css
transition: all 0.3s ease;
transition: transform 0.2s ease-in-out;
```

**Hover Glows:**
- Box shadow animations
- Color transitions
- Border glows

---

## Features

### 1. Matrix Rain Background

**Implementation:** `src/components/MatrixRain.tsx`

**Features:**
- HTML5 Canvas animation
- Cyberpunk aesthetic with falling characters
- Optimized for performance
- Responsive to window resize
- **Opacity: 0.3** (updated for better visibility)

**Technical Details:**
- Characters: Katakana (カタカナ), Latin, numbers
- Color: Bright green (#0F0)
- Animation: Continuous loop
- Z-index: 0 (background layer)

---

### 2. Smooth Scroll Navigation

**Features:**
- Anchor-based navigation
- Smooth scroll behavior
- Fixed header
- Mobile hamburger menu
- Section highlighting (optional)

**Implementation:**
```typescript
// Global smooth scroll
document.documentElement.style.scrollBehavior = 'smooth';

// Scroll to section
const element = document.getElementById('projects');
element?.scrollIntoView({ behavior: 'smooth' });
```

**Benefits:**
- No page reloads
- Smooth user experience
- Works on all modern browsers

---

### 3. Responsive Design

**Approach:** Mobile-first

**Features:**
- Breakpoint-based layouts
- Responsive typography
- Touch-friendly interactions
- Hamburger menu for mobile
- Optimized images

**Testing:** Works on phones, tablets, desktops (320px - 2560px)

---

### 4. Interactive Project Cards

**Features:**
- Hover effects (scale, glow)
- Preview images
- Technology tags
- External links (demo, source)
- Responsive grid layout

**Interactions:**
- **Hover:** Scale up (1.05x), add glow
- **Click:** Open demo/source in new tab
- **Mobile:** Touch-friendly tap areas

**Data-Driven:**
- All projects defined in `src/data/portfolio.ts`
- Easy to add/remove projects
- Type-safe with TypeScript

---

### 5. Animated Timeline

**Features:**
- Vertical timeline design
- Animated dots/markers
- Experience cards
- Work location icons (home/office)
- Technology badges

**Visual Hierarchy:**
- Timeline line provides structure
- Dots mark each experience
- Cards contain detailed information
- Icons add visual interest

**Animations:**
- Dots: Pulse or fade in
- Cards: Slide in from side
- Badges: Stagger animation

---

### 6. Social Media Integration

**Platforms:**
- **GitHub:** Code repositories and open source
- **LinkedIn:** Professional network
- **Email:** Direct contact

**Locations:**
- Navigation header (desktop)
- Mobile menu
- Contact section

**Implementation:**
- Icon links from react-icons
- Open in new tab (`target="_blank"`)
- Security: `rel="noopener noreferrer"`

---

### 7. SEO Optimizations

**Meta Tags in `index.html`:**
```html
<meta name="description" content="Parintorn Sanguanpong - Senior Software Engineer. Specialized in React.js, React Native, Node.js, Golang, and modern web technologies." />
<meta name="keywords" content="Parintorn, Sanguanpong, Senior Software Engineer, JavaScript, React, Node.js, Golang, Web Developer, Portfolio" />
<meta name="author" content="Parintorn Sanguanpong" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Parintorn Sanguanpong - Senior Software Engineer" />
<meta name="theme-color" content="#05070f" />
```

**Benefits:**
- Better search engine indexing
- Social media preview cards (Open Graph)
- Improved discoverability
- Professional appearance in search results

---

### 8. TypeScript Type Safety

**Features:**
- Full TypeScript coverage in `src/`
- Type definitions for all data structures
- Compile-time error checking
- Better IDE support (autocomplete, refactoring)
- Interfaces for components and data

**Configuration:**
- Strict mode enabled
- Separate configs for app and Vite
- Type checking before build

**Benefits:**
- Catch errors early
- Self-documenting code
- Safer refactoring
- Better developer experience

---

### 9. Performance Optimizations

**Code Splitting:**
- Vendor chunks (React, Framer Motion)
- Automatic chunk splitting by Vite

**Build Optimizations:**
- esbuild minification (fast)
- No sourcemaps in production
- Tree shaking (remove unused code)
- CSS extraction and minification

**Runtime Optimizations:**
- React 19 concurrent features
- Optimized re-renders
- Efficient canvas animation (Matrix rain)

---

## Build & Deployment

### Build Configuration (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',  // GitHub Pages base path
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'animation-vendor': ['framer-motion'],
        },
      },
    },
  },
})
```

**Build Output Structure:**
```
dist/
├── index.html                          # Entry point (transformed)
├── favicon.svg                         # Favicon
├── vite.svg                           # Vite logo
├── assets/
│   ├── index-[hash].js                # Main app bundle
│   ├── react-vendor-[hash].js         # React vendor chunk
│   ├── animation-vendor-[hash].js     # Framer Motion chunk
│   └── index-[hash].css               # Compiled CSS
└── images/
    └── [project preview images]
```

**Bundle Characteristics:**
- ES modules format
- Content hash naming (cache busting)
- Code splitting (vendor chunks separate from app code)
- CSS extraction
- Minified with esbuild (fast, efficient)

---

### GitHub Actions Deployment (`.github/workflows/deploy.yml`)

**Trigger Events:**
- Push to `master` branch
- Manual dispatch (workflow_dispatch)

**Workflow Jobs:**

#### 1. Build Job

```yaml
- Checkout repository
- Setup Node.js 20 with npm cache
- Install dependencies (npm ci)
- Build project (npm run build → creates dist/)
- Add .nojekyll file (prevents Jekyll processing)
- Setup GitHub Pages
- Upload artifact (dist/ folder)
```

#### 2. Deploy Job

```yaml
- Deploy artifact to GitHub Pages
- Set environment URL
```

**Key Configuration:**

```yaml
on:
  push:
    branches:
      - master  # Triggers on push to master
  workflow_dispatch:  # Allows manual triggering

permissions:
  contents: read
  pages: write
  id-token: write
```

**Features:**
- Automatic deployment on push
- npm cache for faster builds (caches node_modules)
- Artifact-based deployment (clean, reliable)
- Proper permissions (read contents, write pages)
- .nojekyll file prevents GitHub Pages from ignoring files starting with `_`

---

### Deployment Flow

**Complete Flow:**

1. **Developer pushes to master branch**
2. **GitHub Actions triggered automatically**
3. **Build job runs:**
   - Installs Node.js and dependencies
   - Runs TypeScript compilation (`tsc -b`)
   - Runs Vite build
   - Creates optimized dist/ folder
   - Adds .nojekyll file
4. **Upload artifact:**
   - Uploads dist/ folder as GitHub Pages artifact
5. **Deploy job runs:**
   - Deploys artifact to GitHub Pages
   - Site goes live at https://parintorn1902.github.io
6. **Custom domain (parintorn.com) points to GitHub Pages**

**Deployment Time:** ~2-3 minutes total

---

### Custom Domain Configuration

**DNS Setup:**
```
Type: CNAME
Name: @ (or www)
Value: parintorn1902.github.io
```

**GitHub Pages Settings:**
- Custom domain: parintorn.com
- Enforce HTTPS: Enabled (automatic)
- Source: GitHub Actions deployment

**URLs:**
- Primary: https://parintorn.com
- GitHub: https://parintorn1902.github.io

---

## Development Guide

### Local Development Setup

**Prerequisites:**
- Node.js 20+ (LTS recommended)
- npm (comes with Node.js)

**Installation:**

```bash
# Clone repository
git clone https://github.com/parintorn1902/parintorn1902.github.io.git
cd parintorn1902.github.io

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:5173
```

**Development Commands:**

```bash
npm install          # Install dependencies
npm run dev         # Start dev server (hot reload)
npm run build       # Build for production
npm run preview     # Preview production build locally
npm run lint        # Run ESLint
```

**Development Server:**
- URL: http://localhost:5173
- Hot Module Replacement (HMR)
- Fast refresh for React components
- TypeScript type checking in IDE

---

### Project Structure Best Practices

**Components:**
- One component per file
- Use TypeScript (.tsx extension)
- Export as default
- Define Props interface above component
- Use functional components with hooks

**Example:**
```tsx
// src/components/MyComponent.tsx
interface MyComponentProps {
  title: string;
  count?: number;
}

function MyComponent({ title, count = 0 }: MyComponentProps) {
  return <div>{title}: {count}</div>;
}

export default MyComponent;
```

**Data:**
- Centralized in `src/data/portfolio.ts`
- Type-safe interfaces
- Easy to update content
- Separation of data and presentation

**Styles:**
- Tailwind utility classes preferred
- Custom CSS in `src/index.css` for:
  - Global styles
  - Animations
  - Custom utilities
- Responsive-first approach

**Assets:**
- Images in `public/images/`
- Icons via react-icons library
- Fonts via Google Fonts or system fonts
- Static files in `public/` (copied to dist/)

---

### Adding Content

#### Adding a New Project

**Steps:**

1. **Add project image** to `public/images/`:
   ```bash
   # Copy image to public/images/
   cp my-project-preview.png public/images/
   ```

2. **Update `src/data/portfolio.ts`:**
   ```typescript
   export const projects: Project[] = [
     // ... existing projects
     {
       projectId: 3,  // Increment ID
       projectName: "My New Project",
       projectDesc: "Description of the project and technologies used",
       projectPreviewImage: "my-project-preview.png",
       projectDemoLink: "https://demo.example.com",  // Optional
       projectSourceLink: "https://github.com/username/repo",  // Optional
       tags: ["React", "TypeScript", "Tailwind"],  // Optional
     },
   ];
   ```

3. **Test locally:**
   ```bash
   npm run dev
   # Check http://localhost:5173/#projects
   ```

4. **Build and deploy:**
   ```bash
   git add .
   git commit -m "Add new project: My New Project"
   git push origin master
   # GitHub Actions will auto-deploy
   ```

---

#### Updating Work Experience

**Edit `src/data/portfolio.ts`:**

```typescript
export const experiences: Experience[] = [
  {
    period: "2023 - Present",
    position: "Lead Software Engineer",
    workplace: "New Company",
    detail: [
      "Lead team of 5 developers",
      "Architected microservices infrastructure",
      "Improved performance by 40%",
    ],
    wfh: false,  // true for remote work
    techStacks: ["TypeScript", "Node.js", "React", "Docker", "Kubernetes"],
  },
  // ... other experiences
];
```

**Commit and push:**
```bash
git add src/data/portfolio.ts
git commit -m "Update work experience"
git push origin master
```

---

#### Updating Skills or Technologies

**Edit `src/data/portfolio.ts`:**

**Skills:**
```typescript
export const skills = {
  programming: [
    "TypeScript",  // Add new skills
    "Rust",        // Add new skills
    // ... existing skills
  ],
  tools: [
    "Neovim",     // Add new tools
    // ... existing tools
  ],
  ai: [
    "GitHub Copilot",  // Add new AI tools
    // ... existing AI tools
  ],
  cloud: [
    "Vercel",     // Add new cloud platforms
    // ... existing platforms
  ],
};
```

**Technologies:**
```typescript
export const technologies = {
  frontend: {
    category: "Front-End",
    icon: "react",
    techs: [
      {
        name: "React.js",
        items: [
          "Next.js 14",    // Update versions
          "Remix",         // Add new frameworks
          // ... existing items
        ],
      },
    ],
  },
  backend: {
    // ... similar updates
  },
};
```

---

### Customizing Styles

#### Tailwind Configuration (`tailwind.config.js`)

**Current Configuration:**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          primary: '#00ff41',
          secondary: '#00d9ff',
          accent: '#ff2a6d',
          dark: '#0a0e27',
          darker: '#05070f',
          card: '#0f1629',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'scan': 'scan 8s linear infinite',
        'glitch': 'glitch 1s linear infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink 0.7s infinite',
        'spin-slow': 'spin 5s linear infinite',
      },
      backdropBlur: {
        xs: '2px',  // Extra small blur for subtle effects
      },
    },
  },
  plugins: [],
}
```

**Extended Features:**
- **Colors**: Complete `cyber` palette with 6 shades
- **Fonts**: JetBrains Mono (mono) and Inter (sans) families
- **Animations**: 7 custom animations (glow, float, scan, glitch, typing, blink, spin-slow)
- **Backdrop Blur**: Extra small blur (`xs: 2px`) for glassmorphism effects

**Customization Tips:**
- Add custom colors to the `cyber` palette
- Extend font families for different aesthetics
- Create custom animations and keyframes
- Adjust breakpoints, spacing, and other theme values

#### Global Styles (`src/index.css`)

**Current Global Styles:**
```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-cyber-darker text-cyber-primary font-mono;
    overflow-x: hidden;
    scrollbar-gutter: stable;
  }

  ::selection {
    @apply bg-cyber-primary text-cyber-darker;
  }

  /* Custom scrollbar styles */
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    @apply bg-cyber-darker;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-cyber-primary/30 hover:bg-cyber-primary/50;
    border-radius: 5px;
  }
}

@layer components {
  .glow-text {
    text-shadow: 0 0 10px theme('colors.cyber.primary'),
                 0 0 20px theme('colors.cyber.primary'),
                 0 0 30px theme('colors.cyber.primary');
  }

  .glow-box {
    box-shadow: 0 0 10px theme('colors.cyber.primary'),
                0 0 20px theme('colors.cyber.primary');
  }

  .glass-card {
    @apply bg-cyber-card/30 backdrop-blur-md border border-cyber-primary/20 rounded-lg;
  }

  .terminal-border {
    @apply border border-cyber-primary/50 relative;
  }
}
```

**Add more custom classes:**
```css
@layer components {
  .custom-gradient {
    background: linear-gradient(135deg, theme('colors.cyber.primary'), theme('colors.cyber.secondary'));
  }
}
```

#### Component Styles

**Use Tailwind utility classes:**
```tsx
<div className="bg-gray-900 text-green-500 p-4 rounded-lg hover:scale-105 transition">
  Content
</div>
```

---

### TypeScript Configuration

**Main Config (`tsconfig.json`):**
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

**App Config (`tsconfig.app.json`):**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    // ... more options
  },
  "include": ["src"]
}
```

**Node Config (`tsconfig.node.json`):**
```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    // ... for Vite config
  },
  "include": ["vite.config.ts"]
}
```

---

## Maintenance Guide

### Updating Dependencies

**Check for updates:**
```bash
npm outdated
```

**Update all packages:**
```bash
npm update
```

**Update specific package:**
```bash
npm install react@latest react-dom@latest
npm install framer-motion@latest
```

**Update dev dependencies:**
```bash
npm install -D vite@latest @vitejs/plugin-react@latest
npm install -D typescript@latest
```

**After updating:**
```bash
# Test build
npm run build

# Test locally
npm run preview

# Commit if everything works
git add package.json package-lock.json
git commit -m "Update dependencies"
git push origin master
```

---

### Troubleshooting

#### Build Fails

**Symptom:** `npm run build` fails with TypeScript errors

**Solution:**
1. Check error messages for type issues
2. Fix type errors in code
3. Ensure all imports are correct
4. Run `npm run lint` to check for other issues

**Common Issues:**
- Missing type definitions: `npm install -D @types/node`
- Import errors: Check file paths and extensions
- TypeScript version mismatch: Update TypeScript

---

#### Deployment Fails

**Symptom:** GitHub Actions workflow fails

**Solution:**
1. Check GitHub Actions logs (Actions tab on GitHub)
2. Look for error in build or deploy job
3. Common issues:
   - npm install failed: Check package.json
   - Build failed: TypeScript errors (see above)
   - Deploy failed: Check permissions in repo settings

**Permissions:**
- Go to Settings → Actions → General
- Check "Read and write permissions"
- Enable "Allow GitHub Actions to create and approve pull requests" (if needed)

---

#### Styling Issues

**Symptom:** Tailwind classes not working

**Solution:**
1. Check `tailwind.config.js` content paths:
   ```javascript
   content: [
     "./index.html",
     "./src/**/*.{js,ts,jsx,tsx}",
   ],
   ```
2. Ensure `src/index.css` imports Tailwind:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
3. Clear build cache:
   ```bash
   rm -rf dist node_modules/.vite
   npm run build
   ```

---

#### Animation Issues

**Symptom:** Framer Motion animations not working

**Solution:**
1. Check Framer Motion version compatibility
2. Ensure imports are correct:
   ```tsx
   import { motion } from 'framer-motion';
   ```
3. Check browser console for errors
4. Test in different browsers

**Matrix Rain Issues:**
1. Check canvas element exists
2. Check browser console for errors
3. Adjust opacity in `MatrixRain.tsx`
4. Test on different screen sizes

---

## Migration History

### From Build Artifacts to Source Code (November 2025)

**Previous State:**
- Repository contained only build artifacts (dist/)
- Manual build and deployment process
- No source code version control
- No CI/CD pipeline

**Migration Changes:**
- Added full React TypeScript source code
- Implemented GitHub Actions workflow
- Removed build artifacts from repository
- Added `.gitignore` for node_modules and dist
- Configured automatic builds and deployments

**Benefits:**
- Full version control of source code
- Automatic deployments on push
- Type safety with TypeScript
- Modern development workflow
- Better collaboration potential
- Easier maintenance and updates

**Deployment Changes:**
- **Old:** Manual build → push dist/ to master
- **New:** Push source to master → GitHub Actions builds → auto-deploy

---

## Browser Compatibility

**Target Browsers:**
- Chrome/Edge 90+ (2021+)
- Firefox 88+ (2021+)
- Safari 14+ (2020+)
- Mobile browsers:
  - iOS Safari 14+
  - Chrome Android 90+

**Modern Features Used:**
- ES2020+ JavaScript
- CSS Grid & Flexbox
- CSS Custom Properties (variables)
- Canvas API (Matrix rain)
- Smooth scrolling
- ES Modules

**Fallbacks:**
- Graceful degradation for older browsers
- Core content accessible without JavaScript (semantic HTML)
- No IE11 support (not needed for modern portfolio)

---

## Security Considerations

**External Links:**
- All external links use `target="_blank"`
- Security: `rel="noopener noreferrer"` prevents tab nabbing

**Dependencies:**
- Regular updates via npm
- No known vulnerabilities
- Minimal dependency footprint

**GitHub Pages Security:**
- HTTPS by default (free SSL)
- No backend or database (static files only)
- No user data collection
- No cookies or tracking

**GitHub Actions:**
- Secure workflow with minimal permissions
- No secrets required
- Read-only content access
- Write access only for Pages deployment

---

## Performance Metrics

**Build Output (Estimated):**
- Total bundle size: ~400KB (uncompressed)
- After GZIP: ~100KB
- First load: Fast (static files)
- Subsequent loads: Cached

**Lighthouse Scores (Target):**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

**Optimizations Applied:**
- Code splitting (vendor chunks)
- Minification (esbuild)
- CSS extraction
- No sourcemaps in production
- Efficient animations

---

## Future Enhancements

**Potential Features:**
- Blog section (with MDX support)
- Dark/light mode toggle (currently dark-only)
- Contact form with backend (Formspree, EmailJS)
- More interactive animations
- Project filtering by technology tags
- Resume download (PDF)
- Language switching (EN/TH)
- Testimonials section
- Certificate/achievements section

**Performance:**
- Image optimization (WebP with fallbacks)
- Lazy loading for images below the fold
- Service worker for offline support
- Progressive Web App (PWA) features
- Skeleton loading states

**Analytics:**
- Google Analytics or privacy-focused alternative
- Track page views and user engagement
- Monitor performance metrics

---

## Quick Reference

### Key Files

**Configuration:**
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS custom theme and animations
- `postcss.config.js` - PostCSS plugins configuration
- `eslint.config.js` - ESLint flat config (ES9 format)
- `tsconfig.json` - TypeScript root configuration (references)
- `tsconfig.app.json` - TypeScript app configuration (src/)
- `tsconfig.node.json` - TypeScript node configuration (Vite config)
- `.github/workflows/deploy.yml` - GitHub Actions deployment workflow
- `package.json` - Dependencies, scripts, and project metadata

**Source Code:**
- `src/App.tsx` - Main application component
- `src/main.tsx` - Application entry point
- `src/data/portfolio.ts` - Centralized content data
- `src/index.css` - Global styles, custom CSS classes, font imports
- `src/components/*.tsx` - All React components
- `src/hooks/useMousePosition.ts` - Custom mouse tracking hook

**Entry:**
- `index.html` - HTML entry point with meta tags
- `public/` - Static assets (images, favicon, vite.svg)
- `favicon.svg` - Favicon at root level

---

### Key Commands

```bash
# Development
npm install              # Install dependencies
npm run dev             # Start dev server (http://localhost:5173)

# Production
npm run build           # Build for production (creates dist/)
npm run preview         # Preview production build locally

# Quality
npm run lint            # Run ESLint

# Deployment
git push origin master  # Push to GitHub → triggers auto-deployment
```

---

### Key URLs

**Live Sites:**
- Primary: https://parintorn.com
- GitHub Pages: https://parintorn1902.github.io

**Repository:**
- GitHub: https://github.com/parintorn1902/parintorn1902.github.io

**Social:**
- GitHub Profile: https://github.com/parintorn1902
- LinkedIn: https://www.linkedin.com/in/parintorn-s-24579a179/
- Email: parintorn1902@gmail.com

---

### Key Technologies

**Frontend:**
- React 19.2.0 + TypeScript 5.9.3
- Vite 7.2.4
- Tailwind CSS 3.4.18
- Framer Motion 12.23.24
- React Icons 5.5.0

**Development:**
- ESLint 9.39.1 + TypeScript ESLint 8.46.4
- PostCSS 8.5.6 + Autoprefixer 10.4.22
- Vite Plugin React 5.1.1

**Deployment:**
- GitHub Actions (CI/CD)
- GitHub Pages (Hosting)
- Node.js 20 (build environment)

**Theme:**
- Cyberpunk/Hacker aesthetic
- Matrix rain effect with Canvas API
- Dark mode with custom cyber color palette
- JetBrains Mono + Inter fonts
- Custom animations and glassmorphism effects

---

### Key Data Locations

**Content Updates:**
- Projects: `src/data/portfolio.ts` → `projects` array
- Experience: `src/data/portfolio.ts` → `experiences` array
- Skills: `src/data/portfolio.ts` → `skills` object
- Technologies: `src/data/portfolio.ts` → `technologies` object
- Personal Info: `src/data/portfolio.ts` → `personalInfo` object

**Images:**
- Project previews: `public/images/`
- Favicon: `public/favicon.svg`

---

## Conclusion

This portfolio website showcases modern web development practices using React 19, TypeScript, Vite, and Tailwind CSS. It features a unique cyberpunk aesthetic with Matrix rain effects, smooth animations, and a fully automated CI/CD pipeline via GitHub Actions.

**Key Strengths:**
- Modern, type-safe codebase
- Automated build and deployment
- Responsive, mobile-first design
- Unique visual design (cyberpunk theme)
- SEO optimized
- Fast performance
- Easy to maintain and update
- Centralized data management

**Developer Experience:**
- Fast development server with HMR
- TypeScript for type safety
- ESLint for code quality
- Simple deployment (push to master)
- Clear project structure

**Maintained By:** Parintorn Sanguanpong

---

**Documentation Version:** 2.1 (Updated Source Code Edition)
**Last Updated:** November 24, 2025 (Revised)
**Purpose:** Comprehensive technical documentation for portfolio website source code

**Recent Updates:**
- Updated all version numbers to match package.json (React 19.2.0, Vite 7.2.4, TypeScript 5.9.3)
- Added complete Tailwind custom color palette (cyber theme)
- Documented all custom animations and keyframes
- Added custom CSS classes documentation (glow-text, glow-box, glass-card, terminal-border)
- Updated Contact component documentation (removed email display, added mouse tracking effects)
- Enhanced useMousePosition hook documentation with full API details
- Added eslint.config.js to file structure
- Updated typography section with JetBrains Mono and Inter fonts
- Added custom scrollbar and selection styles documentation

---

*For questions, contributions, or feedback, please contact via GitHub or email.*
