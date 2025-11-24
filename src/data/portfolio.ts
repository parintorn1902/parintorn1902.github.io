// Portfolio Data - Extracted from existing portfolio

export const personalInfo = {
  name: "Parintorn Sanguanpong",
  title: "Senior Software Engineer",
  description: "Hello, I'm a Senior Software Engineer specializing in full-stack development. With TypeScript as my core language, I work extensively with Node.js, React.js, and React Native, along with Golang. I love coding, exploring new technologies, and collaborating with others.",
  tagline: "Building modern web experiences with code",
  location: "Thailand",
  github: "https://github.com/parintorn1902",
  linkedin: "https://www.linkedin.com/in/parintorn-s-24579a179/",
  email: "parintorn1902@gmail.com",
};

export interface Project {
  projectId: number;
  projectName: string;
  projectDesc: string;
  projectPreviewImage: string;
  projectDemoLink?: string;
  projectSourceLink?: string;
  tags?: string[];
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

export interface Experience {
  period: string;
  position: string;
  workplace: string;
  detail: string[];
  wfh: boolean;
  techStacks: string[];
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

export const skills = {
  programming: [
    "Typescript",
    "Modern Javascript",
    "JSDoc",
    "Golang",
    "RESTful API",
    "Docker",
    "JSON",
    "OOP",
    "Promise",
    "Async/Await",
  ],
  tools: [
    "Cursor",
    "VS Code",
    "Android Studio",
    "Postman",
    "Docker",
    "FileZilla",
    "Termius",
    "DBeaver",
    "Robo 3T",
  ],
  ai: [
    "Cursor AI",
    "Claude Code",
    "ChatGPT (Agent & Thinking Partner)",
    "AI-Assisted Development",
    "Prompt Engineering",
    "AI for Design & Brainstorming",
  ],
  cloud: [
    "AWS Lightsail",
    "Digital Ocean",
    "Google Maps Platform",
    "Firebase",
    "Play Console",
    "App Store Connect",
  ],
};

export const technologies = {
  frontend: {
    category: "Front-End",
    icon: "react",
    techs: [
      {
        name: "React.js",
        items: [
          "Next.js",
          "Vite",
          "Tailwind.css",
          "Shadcn-ui",
          "Mantine UI",
          "Chakra-UI",
          "Material-UI",
          "AntDesign",
          "Semantic-UI",
          "Bulma",
          "Prisma",
        ],
      },
      {
        name: "React Native",
        items: [
          "React Native CLI",
          "Expo",
          "Nativewind",
          "Reanimated",
          "Native Modules",
          "Expo Modules",
          "Publish to Play Store and App Store",
        ],
      },
    ],
  },
  backend: {
    category: "Back-End",
    icon: "node",
    techs: [
      {
        name: "Node.js",
        items: [
          "Express",
          "CORS",
          "TypeORM",
          "MongoDB",
          "JWT",
          "Multer",
          "ShellJS",
          "BcryptJS",
          "Axios",
          "FS-Extra",
          "PM2",
        ],
      },
      {
        name: "Golang",
        items: [
          "Gin",
          "GORM",
          "PostgreSQL",
          "MongoDB",
          "JWT",
          "REST API",
        ],
      },
      {
        name: "Java",
        items: [
          "Spring Boot",
          "Spring MVC",
          "Spring Data JPA",
          "PostgreSQL",
          "MongoDB",
          "Spring Security",
          "JWT",
          "Lombok",
        ],
      },
    ],
  },
};
