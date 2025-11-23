# Portfolio Website - Technical Documentation

> **Repository:** parintorn1902.github.io
> **Type:** GitHub Pages Deployment Repository
> **Owner:** Parintorn Sanguanpong
> **Domain:** https://parintorn.com
> **Last Updated:** October 8, 2022

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
10. [Development Notes](#development-notes)

---

## Overview

This repository contains the **production build** of a personal portfolio website. It is a **single-page application (SPA)** built with React, Vite, and Tailwind CSS, deployed on GitHub Pages.

**Important:** This repository contains **only the compiled build output**. The source code (React components, configuration files, etc.) is not included in this repository. All files are minified and bundled for production deployment.

### Key Characteristics

- **Type:** Static website (HTML, CSS, JS)
- **Framework:** React 18 (compiled)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 3 + Custom CSS
- **Deployment:** GitHub Pages
- **Navigation:** Smooth scroll (no URL routing)
- **Responsive:** Mobile-first design

---

## Repository Structure

```
/home/user/parintorn1902.github.io/
├── index.html                      # Entry point
├── README.md                       # Minimal readme
├── CLAUDE.md                       # This documentation
├── assets/                         # Compiled JavaScript and CSS
│   ├── index.1351db88.js          # Main application bundle (~46KB)
│   ├── vendor.c4c1e6a5.js         # React & vendor libraries (~143KB)
│   └── index.540fbe58.css         # Compiled Tailwind CSS (~19KB)
└── images/                        # Static image assets
    ├── favicon.png                # Site icon (9.8KB)
    ├── netflix-preview.png        # Project preview (744KB)
    └── student-management-preview.png  # Project preview (12KB)
```

### File Details

| File | Size | Purpose |
|------|------|---------|
| `index.html` | 668 bytes | Main HTML file with React root mount point |
| `index.1351db88.js` | 46KB | Application code (compiled React components) |
| `vendor.c4c1e6a5.js` | 143KB | React, ReactDOM, and dependencies |
| `index.540fbe58.css` | 19KB | Tailwind CSS + custom styles |
| **Total bundle** | **~208KB** | Uncompressed total |

---

## Technology Stack

### Frontend Framework

- **React 18** - UI library
- **React Hooks** - State management (useState, useRef, useEffect)
- **JSX** - Component templating

### Build Tools

- **Vite** - Fast build tool and dev server
- **ES Modules** - Modern JavaScript module system
- **Content Hashing** - Cache busting for assets

### Styling

- **Tailwind CSS 3** - Utility-first CSS framework
- **Custom CSS** - Animations and special effects
- **Google Fonts** - Inter font family (400, 700, 800 weights)

### Icons

- **react-icons** - Icon library
  - `react-icons/ai` - GitHub icon
  - `react-icons/fa` - General icons
  - `react-icons/md` - Material Design icons

### Deployment

- **GitHub Pages** - Static site hosting
- **Custom Domain** - parintorn.com (via DNS CNAME)

---

## Architecture

### Application Structure

This is a **single-page application** without traditional routing. The page consists of multiple sections that are accessed via smooth scrolling.

#### Page Sections (Anchor IDs)

1. **Hero/Home** - Landing section (no ID)
2. **#projects** - Project showcase
3. **#technologies** - Tech stack display
4. **#about** - Work experience and skills

### Navigation System

**Type:** Anchor-based smooth scroll (no React Router)

**Mechanism:**
```javascript
// Pseudo-code from compiled bundle
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  const offset = element.getBoundingClientRect().top + window.scrollY;
  window.scroll({
    top: offset - 50,  // 50px offset for fixed header
    behavior: "smooth"
  });
};
```

**Features:**
- Fixed header compensation (50px offset)
- Smooth scroll behavior
- Works on both desktop and mobile menus

---

## Components

### Overview

All components are compiled into `/assets/index.1351db88.js`. Component names below are inferred from the minified code.

### Component Hierarchy

```
App (J)
├── MobileMenu (O)
│   └── Hamburger Toggle
├── SnowflakeAnimation (T)
├── Header/Navbar (E)
│   ├── Logo with Profile Image
│   ├── Navigation Links (desktop)
│   └── Social Media Links
└── Main Content
    ├── Hero (B)
    ├── Projects (A)
    │   └── ProjectCard(s)
    ├── Technologies (I)
    └── About (S)
        └── ExperienceTimelineCard (f)
```

---

### Detailed Component Breakdown

#### 1. **App Component** (`J`)

**Purpose:** Root component that renders the entire application

**Structure:**
- Snowflake animation background
- Fixed header
- Main content sections
- Mobile menu overlay

---

#### 2. **Header/Navbar** (`E`)

**Purpose:** Fixed navigation bar at the top of the page

**Features:**
- Fixed positioning (z-index: 20)
- Dynamic blur effect on scroll (activates at 40px scroll)
- Profile image logo
- Navigation menu items
- Social media links (GitHub, LinkedIn)
- Height: 68px

**Scroll Behavior:**
```javascript
// Triggers at scrollY > 40
if (scrollTop > 40) {
  header.classList.add(
    "backdrop-filter",
    "backdrop-blur-sm",
    "bg-[#181818aa]",
    "shadow-md"
  );
}
```

**Desktop Navigation Items:**
- Projects → scrolls to #projects
- Technologies → scrolls to #technologies
- About → scrolls to #about

**Social Links:**
- GitHub: https://github.com/parintorn1902
- LinkedIn: https://www.linkedin.com/in/parintorn-s-24579a179/

---

#### 3. **Mobile Menu** (`O`)

**Purpose:** Responsive mobile navigation overlay

**Features:**
- Hamburger toggle button (position: fixed, top-right)
- Full-screen overlay menu
- Animated menu items (fadeInRight animation)
- Staggered animation delays (0.35s, 0.4s, 0.45s, 0.5s)
- Body scroll lock when menu is open
- Social media links at bottom

**Visibility:** Hidden on desktop (max-width: 767px triggers display)

**Toggle Mechanism:**
- Opens/closes with hamburger icon
- Adds `menu-open` class to body
- Toggles `full-menu` and `menu-list-open` classes

---

#### 4. **Hero/Landing Section** (`B`)

**Purpose:** Welcome section with introduction and illustration

**Layout:**
- 3-column grid on desktop
- 1-column on mobile
- Left: Text content (2 columns)
- Right: SVG illustration (1 column)

**Content:**
```
Title: "Welcome To My Personal Portfolio"
Description: "Hello, I'm a Full Stack JavaScript Developer.
I'm familiar with Node.js, React.js, React Native. I love coding
and learning something new and also enjoy working with other people."
```

**SVG Illustration:**
- Custom character illustration (200x206px)
- Animated elements:
  - Human head (bobbing up/down, 0.5s loop)
  - Human hands (vertical movement, 0.2s loop)
  - Clouds (horizontal translation, 20s loop)

---

#### 5. **Projects Section** (`A`)

**Purpose:** Showcase portfolio projects with previews

**Layout:**
- 2-column grid (desktop)
- 1-column grid (mobile)
- Project cards with hover effects

**Project Card Structure:**
```
┌─────────────────────┐
│  Preview Image      │ ← 208px height, object-cover
├─────────────────────┤
│  Project Name       │ ← Yellow/gold color (#eab021)
│  Description        │
│  [Live Demo]        │ ← Purple button (if available)
│  [View Source]      │ ← Border button (if available)
└─────────────────────┘
```

**Interactions:**
- Hover: scale(1.05) transform
- Buttons open links in new tab (target="_blank")
- Shadow effect (shadow-2xl)

---

#### 6. **Technologies Section** (`I`)

**Purpose:** Display front-end and back-end technology stack

**Layout:**
- 2-column grid (desktop)
- 1-column grid (mobile)
- Double border styling

**Columns:**

**Front-End** (Yellow/gold border, #eab021)
- Icon: React icon (spinning animation, 5s loop)
- Technologies:
  - React.js
    - Next.js, CRA, Styled-components, Tailwind.css
    - Chakra-UI, Material-UI, AntDesign, Semantic-UI, Bulma
  - React Native
    - React Native CLI, Expo, React Native Paper
    - Native Android, Play Store publishing

**Back-End** (Purple border, #7952B3)
- Icon: Node.js icon (bouncing animation)
- Technologies:
  - Node.js
    - Express, CORS, TypeORM, MongoDB, JWT, Multer
    - ShellJS, BcryptJS, Axios, FS-Extra, PM2
  - Java
    - Spring Boot, Spring MVC, Spring Data JPA
    - PostgreSQL, MongoDB, Spring Security, JWT, Lombok

---

#### 7. **About Section** (`S`)

**Purpose:** Display skills, tools, and work experience

**Subsections:**

**Overviews:**
1. **Skills**
   - Modern Javascript, JSDoc, Typescript
   - RESTful API, Docker, JSON, OOP
   - Promise, Async/Await

2. **Tools**
   - VS Code, Android Studio, Postman
   - Docker, FileZilla, Termius, DBeaver, Robo 3T

3. **Clouds**
   - AWS Lightsail, Digital Ocean
   - Google Maps Platform, Firebase, Play Console

**Work Experiences:**
- Timeline layout with animated dots
- Vertical timeline with gold accent line (#f8bb0f)

---

#### 8. **Experience Timeline Card** (`f`)

**Purpose:** Individual work experience entry

**Structure:**
```
┌─ Timeline (vertical gold line)
│
●  ← Animated ping dot (purple)
│
└─ Card Content:
   ├─ Position (bold, xl)
   ├─ Workplace + Home/Office Icon
   ├─ Period + Calendar Icon
   ├─ Detail text/list
   └─ Tech Stack Badges (rounded pills)
```

**Props:**
- `period` - Date range (e.g., "2018 - Present")
- `position` - Job title
- `workplace` - Company name
- `detail` - Description (JSX supported)
- `wfh` - Boolean for work-from-home indicator
- `techStacks` - Array of technology names

**Animations:**
- Pulsing dot (animate-ping)
- Purple background (#7952b3)

---

#### 9. **Topic Header** (`p`)

**Purpose:** Reusable section title component

**Structure:**
```
──────  ← Gradient line (purple to gold, 75px wide, 4px height)

Section Title  ← Large semibold text (text-5xl)
```

**Usage:**
- Projects section
- Technologies section
- About section

---

#### 10. **Button Components**

**Primary Button** (`D`)
- Background: Purple (#7952B3)
- Hover: Darker purple (#5e3996)
- Use: "Live Demo" links

**Secondary Button** (`P`)
- Style: Border only (transparent bg)
- Hover: Fill with #eee, text turns black
- Use: "View Source" links

---

#### 11. **Snowflake Animation** (`T`)

**Purpose:** Decorative background effect

**Details:**
- 10 snowflake elements (❅ ❆ ❄)
- CSS keyframe animations
- Fall animation: 15s linear
- Shake animation: 3s ease-in-out (lateral movement)
- Infinite loop
- Positioned absolutely, z-index: 0
- Opacity: 0.25

---

## Data Structures

### Project Data

**Type:** Array of Project Objects

**Schema:**
```javascript
{
  projectId: number,              // Unique identifier
  projectName: string,            // Display name
  projectDesc: string,            // Short description
  projectPreviewImage: string,    // Filename from /images/
  projectDemoLink?: string,       // Optional live demo URL
  projectSourceLink?: string      // Optional GitHub repo URL
}
```

**Current Projects:**

```javascript
[
  {
    projectId: 1,
    projectName: "Netflix Clone",
    projectDesc: "Next.js and Tailwind.css making the ultimate Netflix clone website",
    projectPreviewImage: "netflix-preview.png",
    projectDemoLink: "https://parintorn.com/netflix",
    projectSourceLink: "https://github.com/parintorn1902/my-netflix"
  },
  {
    projectId: 2,
    projectName: "Basic CRUD & JWT",
    projectDesc: "Next.js with Chakra-UI and RESTful Node.js service with authentication",
    projectPreviewImage: "student-management-preview.png",
    projectSourceLink: "https://github.com/parintorn1902/basic-react-node-crud"
  }
]
```

---

### Work Experience Data

**Type:** Array of Experience Objects

**Schema:**
```javascript
{
  period: string,          // "YYYY - YYYY" or "YYYY - Present"
  position: string,        // Job title
  workplace: string,       // Company name
  detail: JSX | string,    // Description (can contain HTML)
  wfh: boolean,           // Work from home indicator
  techStacks: string[]    // Array of technology names
}
```

**Current Experiences:**

```javascript
[
  {
    period: "2018 - Present",
    position: "Full Stack JavaScript Developer",
    workplace: "TechBerry Company Limited",
    detail: (
      <ul>
        <li>- Design & develop products</li>
        <li>- Continue release product and support issues</li>
        <li>- Research new technologies and solutions to improves the products</li>
      </ul>
    ),
    wfh: false,  // Office work
    techStacks: [
      "React.js",
      "React Native",
      "Node.js",
      "MongoDB",
      "PostgreSQL",
      "Docker"
    ]
  },
  {
    period: "2015 - 2017",
    position: "Freelancer",
    workplace: "Home",
    detail: (
      <ul>
        <li>- Outsourcing projects from partners</li>
      </ul>
    ),
    wfh: true,  // Work from home
    techStacks: [
      "PHP",
      "HTML",
      "CSS",
      "JS",
      "Ajax",
      "MySQL"
    ]
  }
]
```

---

## Styling & Design

### Color Palette

```css
:root {
  --primaryColor: #7952b3;      /* Purple - main brand color */
  --secondaryColor: #f8bb0f;    /* Gold/Yellow - accent color */
  --fontColor: #e1e8eb;         /* Light gray - text color */
  --bgColor: #222831;           /* Dark gray - background */
}
```

**Usage:**
- **Purple (#7952B3)**: Buttons, badges, borders, accents
- **Gold (#F8BB0F)**: Timeline, section accents, project titles
- **Dark Background (#181818)**: Radial gradient base
- **Dark Gray (#222831)**: Content background, overlays
- **Light Gray (#E1E8EB)**: Text color

### Typography

**Font Family:** Inter (Google Fonts)
- Weights: 400 (regular), 700 (bold), 800 (extra bold)

**Font Sizes:**
- `text-5xl`: 3rem (48px) - Section headers
- `text-xl`: 1.25rem (20px) - Subsection titles
- `text-lg`: 1.125rem (18px) - Body text emphasis
- `text-base`: 1rem (16px) - Default body
- `text-sm`: 0.875rem (14px) - Small text

**Letter Spacing:** 0.025em (global)

### Background

**Type:** Radial gradient

```css
background-image: radial-gradient(#222831 50%, #181818 100%);
```

Creates a subtle depth effect with lighter center fading to darker edges.

### Responsive Breakpoints

Based on Tailwind CSS defaults:

| Breakpoint | Max Width | Classes | Use Case |
|------------|-----------|---------|----------|
| `sm` | 639px | `sm:` | Mobile phones |
| `md` | 767px | `md:` | Tablets (portrait) |
| `lg` | 1023px | `lg:` | Tablets (landscape) |
| Desktop | > 1024px | Default | Desktop screens |

**Common Responsive Patterns:**

```css
/* Default: Desktop (3 columns) */
grid-cols-3

/* Tablet: 1 column */
md:grid-cols-1

/* Mobile: 1 column */
sm:grid-cols-1
```

---

### Animations

#### CSS Keyframe Animations

**1. Snowflake Animations**

```css
/* Fall animation */
@keyframes snowflakes-fall {
  0% { top: -10px }
  100% { top: 2000px }
}
/* Duration: 15s, linear */

/* Shake animation (lateral movement) */
@keyframes snowflakes-shake {
  0% { transform: translate(0) }
  50% { transform: translate(80px) }
  100% { transform: translate(0) }
}
/* Duration: 3s, ease-in-out */
```

**2. Human Character Animations**

```css
/* Head bobbing */
@keyframes human-head {
  0% { transform: translateY(5px) }
  100% { transform: translateY(10px) }
}
/* Duration: 0.5s, linear, infinite alternate */

/* Right hand */
@keyframes human-right-hand {
  0% { transform: translateY(1px) }
  100% { transform: translateY(3px) }
}
/* Duration: 0.2s, linear, infinite alternate */

/* Left hand (0.1s delay) */
@keyframes human-left-hand {
  0% { transform: translateY(2px) }
  100% { transform: translateY(0) }
}
/* Duration: 0.2s, linear, infinite alternate */
```

**3. Cloud Animations**

```css
/* Cloud 1 - simple horizontal */
@keyframes cloud1 {
  0% { transform: translate3d(-45px, 0, 0) }
  100% { transform: translate3d(70px, 10px, 0) }
}
/* Duration: 20s, linear, infinite */

/* Cloud 2 - complex path */
@keyframes cloud2 {
  0% { transform: translate3d(35px, 0, 0) }
  33% { transform: translate3d(0, -5px, 0) }
  66% { transform: translate3d(-30px, -5px, 0) }
  100% { transform: translate3d(-60px, 15px, 0) }
}
/* Duration: 20s, linear, infinite */
```

**4. Mobile Menu Animation**

```css
@keyframes fadeInRight {
  0% {
    opacity: 0;
    transform: translate(20px, 20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0, 0);
  }
}
/* Duration: 0.3s, ease, with staggered delays */
/* Item delays: 0.35s, 0.4s, 0.45s, 0.5s */
```

**5. Page Fade-In**

```css
@keyframes fade-in {
  0% { opacity: 0 }
  100% { opacity: 1 }
}
/* Duration: 0.25s, ease-in */
/* Applied to entire app on load */
```

#### Tailwind Animations

```css
animate-ping       /* Pulsing dot: scale + fade */
animate-spin-slow  /* Icon rotation: 5s */
animate-bounce     /* Vertical bounce: 1s */
animate-fade-in    /* Opacity fade: 0.25s */
```

---

### Hover Effects

**Navigation Links:**
```css
.nav-menu-item:hover::after {
  /* Animated underline that slides in from left */
  transform: translate(0);
  transition: transform 0.2s ease-in;
}
```

**Project Cards:**
```css
.project-card:hover {
  transform: scale(1.05);
  transition: transform 0.15s;
}
```

**Buttons:**
```css
/* Primary button hover */
background: #7952B3 → #5e3996 (darker purple)

/* Secondary button hover */
border + transparent → filled #eee + black text
```

---

### Shadows

```css
shadow-md     /* Header on scroll: 0 4px 6px rgba(0,0,0,0.1) */
shadow-2xl    /* Project cards: 0 25px 50px rgba(0,0,0,0.25) */
```

---

### Border Styles

**Timeline:** Vertical gold line (1px wide, #f8bb0f)

**Technology sections:** Double border (4px width)
- Front-End: Gold (#eab021)
- Back-End: Purple (#7952B3)

**Tech stack badges:** Rounded pill (2px white border)

**Accent lines:** Gradient (purple to gold, 4px height)

---

## Features

### 1. Dynamic Scroll Header

**Behavior:**
- Default: Transparent background, no blur
- Scrolled (>40px): Blurred background, shadow, semi-transparent dark bg

**Implementation:**
```javascript
useEffect(() => {
  const handleScroll = () => {
    if (scrollY > 40) {
      header.add("backdrop-blur-sm", "bg-[#181818aa]", "shadow-md");
    } else {
      header.remove("backdrop-blur-sm", "bg-[#181818aa]", "shadow-md");
    }
  };
  document.addEventListener("scroll", handleScroll);
});
```

---

### 2. Smooth Scroll Navigation

**Mechanism:**
- Anchor-based (no URL hash changes)
- Smooth scroll behavior
- 50px offset for fixed header clearance

**Sections:**
- #projects
- #technologies
- #about

**Works in:**
- Desktop navigation menu
- Mobile menu overlay

---

### 3. Responsive Mobile Menu

**Features:**
- Hamburger icon toggle
- Full-screen overlay (100vh)
- Blurred background (backdrop-filter: blur(3px))
- Animated list items (fadeInRight)
- Body scroll lock when open

**States:**
```javascript
// Closed
visibility: hidden

// Open
visibility: visible
width: 100%
height: 100vh
background: #222831ee
backdrop-filter: blur(3px)
```

---

### 4. Inline SVG Illustration

**Location:** Hero section

**Features:**
- Custom-drawn character (200x206px)
- Multiple animated elements
- Embedded directly in JSX (no external file)
- Complex vector paths

**Animated Elements:**
- Human head, hands, clothing
- Clouds moving in background

---

### 5. Project Cards

**Interactive Elements:**
- Preview image (object-cover, top-aligned)
- Project name (gold color)
- Description text
- Action buttons (conditional rendering)
  - Live Demo (if `projectDemoLink` exists)
  - View Source (if `projectSourceLink` exists)

**Hover Effect:**
- Scale up to 105%
- Transition: 0.15s

---

### 6. Animated Timeline

**Features:**
- Vertical gold timeline bar
- Pulsing animated dots
- Experience cards with tech badges
- Work location icons (home/office)
- Period and position details

**Visual Hierarchy:**
- Timeline provides visual connection
- Dots create focal points
- Cards contain detailed information

---

### 7. Technology Showcase

**Layout:**
- Split into Front-End and Back-End
- Bordered sections with double lines
- Icon animations (spin vs bounce)

**Color Coding:**
- Front-End: Gold border + spinning React icon
- Back-End: Purple border + bouncing Node.js icon

---

### 8. Social Media Integration

**Platforms:**
- GitHub: https://github.com/parintorn1902
- LinkedIn: https://www.linkedin.com/in/parintorn-s-24579a179/

**Locations:**
- Desktop: Header right side
- Mobile: Bottom of overlay menu

**Icons:** From react-icons library

---

### 9. SEO Optimizations

**Meta Tags:**
```html
<meta name="description" content="This is my personal portfolio website !">
<meta name="theme-color" content="#181818">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Parintorn Sanguanpong</title>
```

**Semantic HTML:**
- Proper heading hierarchy
- Meaningful section IDs
- Alt text on images
- ARIA labels on buttons

**Performance:**
- Minified assets
- Content hashing for cache busting
- Module preloading
- Optimized bundle splitting

---

### 10. External Link Handling

**Security:**
- `target="_blank"` for external links
- `rel="noopener"` for security (inferred from React defaults)

**Use Cases:**
- Project demo links
- GitHub repository links
- Social media profiles

---

## Build & Deployment

### Build Configuration

**Tool:** Vite

**Output Structure:**
```
dist/
├── index.html
├── assets/
│   ├── index.[hash].js      # App code
│   ├── vendor.[hash].js     # Dependencies
│   └── index.[hash].css     # Styles
└── images/
    └── [image files]
```

**Bundle Characteristics:**
- ES modules format
- Content hash naming (e.g., `index.1351db88.js`)
- Code splitting (vendor vs app)
- CSS extraction
- Asset optimization

**File Sizes:**
| Asset | Size |
|-------|------|
| App JS | ~46KB |
| Vendor JS | ~143KB |
| CSS | ~19KB |
| **Total** | **~208KB** |

**Estimated GZIP:** ~65KB

---

### Deployment Method

**Platform:** GitHub Pages

**Type:** User/Organization Pages
- Repository: `parintorn1902.github.io`
- Branch: `main` (root directory)
- Auto-deploy on push

**Custom Domain:**
- Domain: parintorn.com
- DNS: CNAME record → parintorn1902.github.io
- HTTPS: Enabled (GitHub Pages default)

**URL Structure:**
- Primary: https://parintorn.com
- GitHub: https://parintorn1902.github.io

---

### Deployment History (Git Commits)

| Date | Commit | Change |
|------|--------|--------|
| Oct 8, 2022 | 74e6855 | fix tiny icon on mobile |
| Sep 17, 2022 | b2b0b76 | update information |
| Sep 11, 2022 | 04c527b | update domain |
| Sep 3, 2022 | e93dcf1 | improve SEO |
| Sep 2, 2022 | f84dd5c | enhance website after Chrome Lighthouse test |
| Aug 28, 2022 | d432445 | update mobile header color |

**Pattern:** Regular updates with focus on optimization and bug fixes

---

### Performance Optimizations

Based on git history, the following optimizations were made:

1. **Chrome Lighthouse Testing** (Sep 2, 2022)
   - Enhanced website based on Lighthouse recommendations
   - SEO improvements

2. **SEO Enhancements** (Sep 3, 2022)
   - Meta tags
   - Semantic HTML
   - Performance tuning

3. **Mobile Optimizations**
   - Icon size fixes
   - Header color updates
   - Responsive design refinements

---

## Development Notes

### Important Considerations

#### 1. **Repository Type**

This is a **deployment repository**, not a development repository.

- ✅ Contains: Compiled build output
- ❌ Missing: Source code, package.json, config files

**Implication:** To make changes, you need the original source repository (not included here).

---

#### 2. **Source Code Location**

The source code likely exists in a separate private repository or local development environment.

**Inferred Source Structure:**
```
[source-repo]/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── Projects.jsx
│   │   ├── Technologies.jsx
│   │   ├── About.jsx
│   │   ├── ExperienceCard.jsx
│   │   ├── MobileMenu.jsx
│   │   └── ...
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── images/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

#### 3. **Making Updates**

To update this website:

1. Make changes in source repository
2. Run build command: `vite build`
3. Copy `dist/` contents to this repository
4. Commit and push to main branch
5. GitHub Pages auto-deploys

**Typical Workflow:**
```bash
# In source repo
npm run build

# Copy to deployment repo
cp -r dist/* /path/to/parintorn1902.github.io/

# Commit and push
cd /path/to/parintorn1902.github.io/
git add .
git commit -m "Update content"
git push origin main
```

---

#### 4. **Content Updates**

Since this is compiled code, content changes require:

1. **Editing source files** (not in this repo)
2. **Rebuilding** with Vite
3. **Redeploying** to GitHub Pages

**Content Files (in source repo):**
- Project data: Likely in `src/data/projects.js` or inline in `Projects.jsx`
- Experience data: Likely in `src/data/experiences.js` or inline in `About.jsx`
- Personal info: Likely in `src/data/profile.js` or inline in `Hero.jsx`

---

#### 5. **Technology Migration**

**Historical Note:** The website migrated from Next.js to Vite (March 8, 2022)

**Reasons (inferred):**
- Faster build times
- Simpler deployment (static export)
- No server-side rendering needed (portfolio is static)
- Better developer experience for SPA

---

#### 6. **Dependencies (Inferred)**

Based on compiled code analysis:

**Production:**
```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "react-icons": "^4.0.0"
}
```

**Development:**
```json
{
  "vite": "^3.0.0",
  "tailwindcss": "^3.0.0",
  "postcss": "^8.0.0",
  "autoprefixer": "^10.0.0"
}
```

---

#### 7. **Browser Compatibility**

**Target Browsers:**
- Modern browsers (ES6+ support)
- Uses ES modules (no legacy fallback in this build)

**Features Used:**
- CSS Grid
- Flexbox
- CSS custom properties
- Backdrop filter
- ES6+ JavaScript

**Minimum Browser Versions:**
- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 79+

---

#### 8. **Accessibility**

**Features:**
- Semantic HTML tags
- ARIA labels on interactive elements
- Keyboard navigation (default browser behavior)
- Sufficient color contrast (light text on dark bg)
- Responsive font sizes

**Potential Improvements:**
- Focus indicators on interactive elements
- Skip navigation link
- Reduced motion preferences
- Screen reader testing

---

#### 9. **Performance Metrics**

**Current Bundle:**
- Initial load: ~208KB (uncompressed)
- GZIP estimated: ~65KB
- Images: 766KB total (largest: netflix-preview.png at 744KB)

**Optimization Opportunities:**
- Image optimization (WebP format, compression)
- Lazy loading for images
- Code splitting for sections
- Service worker for caching

---

#### 10. **Custom Domain Setup**

**DNS Configuration:**
```
Type: CNAME
Name: @ (or www)
Value: parintorn1902.github.io
```

**GitHub Pages Settings:**
- Custom domain: parintorn.com
- Enforce HTTPS: Enabled
- Source: main branch, / (root)

---

## Maintenance Guide

### Adding a New Project

1. Locate project data in source repository
2. Add new project object:
   ```javascript
   {
     projectId: 3,
     projectName: "New Project",
     projectDesc: "Description here",
     projectPreviewImage: "new-preview.png",
     projectDemoLink: "https://example.com",
     projectSourceLink: "https://github.com/username/repo"
   }
   ```
3. Add preview image to `public/images/`
4. Rebuild and redeploy

---

### Updating Work Experience

1. Locate experience data in source repository
2. Add/edit experience object:
   ```javascript
   {
     period: "2023 - Present",
     position: "Senior Developer",
     workplace: "New Company",
     detail: <ul><li>- Responsibilities</li></ul>,
     wfh: false,
     techStacks: ["Tech1", "Tech2"]
   }
   ```
3. Rebuild and redeploy

---

### Changing Colors

1. Edit Tailwind config or CSS variables:
   ```css
   :root {
     --primaryColor: #newcolor;
     --secondaryColor: #newcolor;
   }
   ```
2. Update Tailwind classes in components
3. Rebuild and redeploy

---

### Adding New Sections

1. Create new component in source repo
2. Import and add to App component
3. Add navigation link to Header
4. Update mobile menu
5. Rebuild and redeploy

---

## Conclusion

This portfolio website is a well-crafted, performant single-page application built with modern web technologies. It demonstrates:

- **Technical Skills:** React, Tailwind CSS, Vite, responsive design
- **Design Skills:** Clean UI, smooth animations, thoughtful UX
- **Professional Experience:** Full-stack JavaScript development
- **Deployment:** GitHub Pages with custom domain

**Strengths:**
- Fast load times
- Smooth animations
- Responsive design
- Clean code structure
- SEO optimized

**Future Enhancements:**
- Image optimization
- Blog section
- Contact form
- Dark/light mode toggle
- More projects

---

## Quick Reference

### Key Files
- Entry: `/index.html`
- App Bundle: `/assets/index.1351db88.js`
- Styles: `/assets/index.540fbe58.css`
- Images: `/images/`

### Key URLs
- Website: https://parintorn.com
- GitHub: https://github.com/parintorn1902
- LinkedIn: https://www.linkedin.com/in/parintorn-s-24579a179/

### Key Technologies
- React 18
- Vite
- Tailwind CSS 3
- GitHub Pages

### Key Colors
- Purple: #7952B3
- Gold: #F8BB0F
- Dark BG: #181818 / #222831
- Light Text: #E1E8EB

---

**Document Version:** 1.0
**Created:** November 23, 2025
**Author:** Claude AI (Code Analysis)
**Purpose:** Technical documentation for portfolio website codebase
