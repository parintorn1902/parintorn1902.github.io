# Parintorn Sanguanpong

> Senior Software Engineer | Full-Stack Developer | TypeScript & Golang Enthusiast

[![Portfolio](https://img.shields.io/badge/Portfolio-parintorn.com-blue?style=flat-square)](https://parintorn.com)
[![GitHub](https://img.shields.io/badge/GitHub-pixelboatt-black?style=flat-square&logo=github)](https://github.com/pixelboatt)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Parintorn%20S-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/parintorn-s-24579a179/)

## 👋 About Me

Hello! I'm a Senior Software Engineer specializing in full-stack development with **TypeScript** as my core language. I work extensively with **Node.js**, **React.js**, **React Native**, and **Golang**. I'm passionate about coding, exploring new technologies, and collaborating with others to build modern web and mobile experiences.

Currently working at **TechBerry Company Limited** since 2018, where I design and develop products, lead technical implementations, and mentor junior developers.

## 🚀 Tech Stack

### Frontend
- **React.js** - Next.js, Vite, Tailwind CSS, Shadcn-ui, Mantine UI, Chakra-UI, Material-UI
- **React Native** - Expo, React Native CLI, Nativewind, Reanimated, Native Modules
- **Mobile Publishing** - Play Store & App Store deployment

### Backend
- **Node.js** - Express, TypeORM, MongoDB, PostgreSQL, JWT, PM2
- **Golang** - Gin, GORM, PostgreSQL, MongoDB, REST API
- **Java** - Spring Boot, Spring MVC, Spring Data JPA, Spring Security

### Tools & Cloud
- **Development** - Cursor, VS Code, Android Studio, Docker, Postman
- **AI Tools** - Cursor AI, Claude Code, ChatGPT (Agent & Thinking Partner)
- **Cloud** - AWS Lightsail, Digital Ocean, Firebase, Google Maps Platform

## 💼 Experience

**Senior Software Engineer** @ TechBerry Company Limited (2018 - Present)
- Design & develop products using modern technologies
- Lead technical implementations and mentor junior developers
- Research new technologies and solutions to improve products
- Tech: React.js, React Native, Node.js, Golang, MongoDB, PostgreSQL, Docker

**Freelancer** (2015 - 2017)
- Outsourcing projects from partners
- Tech: PHP, HTML, CSS, JavaScript, Ajax, MySQL

## 🎯 Featured Projects

### [Netflix Clone](https://parintorn.com/netflix)
Next.js and Tailwind CSS making the ultimate Netflix clone website
- **Tech**: Next.js, Tailwind CSS, React
- [View Source](https://github.com/pixelboatt/my-netflix)

### [Basic CRUD & JWT](https://github.com/pixelboatt/basic-react-node-crud)
Next.js with Chakra-UI and RESTful Node.js service with authentication
- **Tech**: Next.js, Chakra-UI, Node.js, JWT

## 🌐 This Portfolio

This portfolio website is built with modern web technologies:

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 + native CSS
- **3D**: Three.js, with parallax camera travel and an articulated Blender character
- **Deployment**: GitHub Pages with GitHub Actions

### Tiny Planet design

The selected A design is a playful world of six connected islands on a black background. Scroll, swipe, use the journey slider, or select a station to travel through About, both projects, Tech Stack, Experience, and Contact.

Choose **Play as Boop** to explore: WASD/arrows walk, Space jumps, E inspects a nearby station, and dragging turns the camera. Phones have directional controls and a jump button. Falling returns Boop to the current island. Back to story resumes the presentation.

`src/data/portfolio.ts` remains authoritative. `src/components/tiny-planet/stops.ts` maps the content to the scene. Project screens show actual screenshots; station dialogs preserve project links, complete skills, experience, and contact details. The older Engine Room presentation remains in its own directory.

Reduced motion makes camera travel instant and disables ambient movement. Essential walking and jumping still respond to game controls. The render clock is capped at 45 fps, hidden tabs stop rendering, and dialogs pause the game. Portfolio details remain accessible if WebGL or model loading fails.

### Blender models

The workshop geometry is authored in Blender: a gyroscope core, detailed workstation, server rack, exploded tech stack, and career terminals. Screens and labels still use the portfolio data. Compressed GLB assets and their decoder are served locally.

Boop has rigid hip, knee, ankle, and shoulder joints. A distance-driven walking cycle uses two-bone inverse kinematics to plant the shoes, lift the returning foot, and swing the opposite arm. Jumping uses a separate tucked pose. Rebuild with `blender --background --python art/blender/build_boop.py`; the editable file is `art/blender/boop.blend` and the runtime asset is `public/models/boop.glb`.

Run the model/gait checks with `node --experimental-strip-types --test tests/boop.test.mjs` (Node 22.6+). They validate exported joints, floor contact, foot sliding, stopping, and the jump pose.

See [the editable Blender source and export workflow](art/blender/README.md). On phones, the models have a dedicated viewport above the scrollable portfolio content.

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

This site is automatically deployed to GitHub Pages via GitHub Actions on every push to the `master` branch.

## 📫 Get in Touch

- **Website**: [parintorn.com](https://parintorn.com)
- **GitHub**: [@pixelboatt](https://github.com/pixelboatt)
- **LinkedIn**: [Parintorn S](https://www.linkedin.com/in/parintorn-s-24579a179/)

---

**Building modern web experiences with code** 🚀
