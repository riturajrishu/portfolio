import {
  FaReact,
  FaNodeJs,
  FaDocker,
  FaGithub,
  FaLinux,
  FaDatabase,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiThreedotjs,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiFirebase,
  SiTypescript,
  SiJavascript,
} from "react-icons/si";

/* ─────────────── NAV LINKS ─────────────── */
export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Journey", href: "#journey" },
  { label: "Projects", href: "#projects" },
  { label: "Achievements", href: "#achievements" },
  { label: "Gallery", href: "#gallery" },
  { label: "GitHub", href: "#github" },
  { label: "Contact", href: "#contact" },
];

/* ─────────────── PERSONAL INFO ─────────────── */
export const personalInfo = {
  name: "Ritu Raj",
  title: "Full Stack Developer",
  taglines: [
    "Building digital experiences that matter",
    "Crafting scalable & elegant solutions",
    "Turning ambitious ideas into reality",
    "Engineering the future of the web",
  ],
  bio: `I'm a passionate Full Stack Developer who thrives at the intersection of design and engineering. With a strong foundation in modern web technologies, I build performant, accessible, and visually stunning applications that solve real-world problems. From architecting robust backends to crafting pixel-perfect frontends, I bring ideas to life with clean code and creative thinking.`,
  email: "rituraj@example.com",
  github: "https://github.com/rituraj",
  linkedin: "https://linkedin.com/in/rituraj",
  resumeUrl: "/resume.pdf",
};

/* ─────────────── STATS ─────────────── */
export const stats = [
  { label: "Projects Completed", value: 25, suffix: "+" },
  { label: "Technologies Used", value: 15, suffix: "+" },
  { label: "Achievements", value: 10, suffix: "+" },
  { label: "Years Experience", value: 1, suffix: "+" },
];

/* ─────────────── SKILLS ─────────────── */
export type SkillCategory = "frontend" | "backend" | "tools";

export interface Skill {
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  level: number; // 0-100
  category: SkillCategory;
}

export const skills: Skill[] = [
  { name: "React", icon: FaReact, level: 92, category: "frontend" },
  { name: "Next.js", icon: SiNextdotjs, level: 88, category: "frontend" },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    level: 90,
    category: "frontend",
  },
  { name: "Three.js", icon: SiThreedotjs, level: 75, category: "frontend" },
  {
    name: "TypeScript",
    icon: SiTypescript,
    level: 85,
    category: "frontend",
  },
  {
    name: "JavaScript",
    icon: SiJavascript,
    level: 95,
    category: "frontend",
  },
  { name: "Node.js", icon: FaNodeJs, level: 90, category: "backend" },
  { name: "Express.js", icon: SiExpress, level: 88, category: "backend" },
  { name: "MongoDB", icon: SiMongodb, level: 85, category: "backend" },
  { name: "MySQL", icon: SiMysql, level: 80, category: "backend" },
  { name: "GitHub", icon: FaGithub, level: 90, category: "tools" },
  { name: "Docker", icon: FaDocker, level: 72, category: "tools" },
  { name: "Firebase", icon: SiFirebase, level: 78, category: "tools" },
  { name: "Linux", icon: FaLinux, level: 80, category: "tools" },
  { name: "Databases", icon: FaDatabase, level: 85, category: "tools" },
];

/* ─────────────── PROJECTS ─────────────── */
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  category: "web" | "mobile" | "fullstack";
  featured: boolean;
  features: string[];
}

export const projects: Project[] = [
  {
    id: "neuraldocs",
    title: "NeuralDocs — AI RAG Platform",
    description:
      "Full-stack document intelligence system powered by RAG architecture with Gemini AI, enabling natural language queries over uploaded documents.",
    longDescription:
      "A production-grade Retrieval-Augmented Generation platform that lets users upload documents and interact with them through natural language. Features vector-based semantic search, real-time chat with document context, and multi-format support.",
    image: "/projects/neuraldocs.webp",
    techStack: ["Next.js", "Node.js", "MongoDB", "Gemini AI", "LangChain"],
    liveUrl: "#",
    githubUrl: "https://github.com/rituraj",
    category: "fullstack",
    featured: true,
    features: [
      "RAG-powered document Q&A",
      "Vector embedding search",
      "Multi-format document support",
      "Real-time streaming responses",
    ],
  },
  {
    id: "wishcraft",
    title: "WishCraft — Birthday Platform",
    description:
      "A cinematic, personalized birthday celebration platform with real-time collaboration, AI-generated messages, and interactive wish pages.",
    longDescription:
      "An immersive full-stack application for creating and sharing personalized birthday experiences. Features collaborative wish boards, AI-assisted message generation, scheduled reveals, and a stunning cinematic UI.",
    image: "/projects/wishcraft.webp",
    techStack: [
      "Next.js",
      "Tailwind CSS",
      "Framer Motion",
      "MongoDB",
      "Node.js",
    ],
    liveUrl: "#",
    githubUrl: "https://github.com/rituraj",
    category: "web",
    featured: true,
    features: [
      "Collaborative wish boards",
      "AI message generation",
      "Cinematic animations",
      "Scheduled birthday reveals",
    ],
  },
  {
    id: "chatapp",
    title: "Real-Time Chat Application",
    description:
      "WhatsApp-style chat application with real-time messaging, delivery status tracking, video/audio calling, and push notifications.",
    longDescription:
      "A feature-rich real-time communication platform built with Socket.io and WebRTC. Supports text messaging, file sharing, delivery status (double ticks), voice/video calls, and Firebase Cloud Messaging for push notifications.",
    image: "/projects/chatapp.webp",
    techStack: [
      "React",
      "Socket.io",
      "WebRTC",
      "Node.js",
      "Firebase",
      "Zustand",
    ],
    liveUrl: "#",
    githubUrl: "https://github.com/rituraj",
    category: "fullstack",
    featured: true,
    features: [
      "Real-time messaging with Socket.io",
      "Video & audio calling (WebRTC)",
      "Message delivery status tracking",
      "Push notifications via FCM",
    ],
  },
  {
    id: "portfolio3d",
    title: "3D Developer Portfolio",
    description:
      "Award-winning 3D animated portfolio website with Three.js particles, glassmorphism UI, and cinematic transitions.",
    longDescription:
      "A premium developer portfolio featuring interactive 3D backgrounds, custom cursor effects, smooth scroll animations, and enterprise-level UI design with glassmorphism cards and neon gradient accents.",
    image: "/projects/portfolio.webp",
    techStack: [
      "Next.js",
      "Three.js",
      "Framer Motion",
      "Tailwind CSS",
      "TypeScript",
    ],
    liveUrl: "#",
    githubUrl: "https://github.com/rituraj",
    category: "web",
    featured: false,
    features: [
      "3D animated particle background",
      "Glassmorphism card design",
      "Custom cursor effects",
      "Smooth scroll animations",
    ],
  },
  {
    id: "adminpanel",
    title: "Enterprise Admin Dashboard",
    description:
      "Full-featured admin panel with employee management, payroll processing, analytics, and role-based access control.",
    longDescription:
      "A comprehensive admin dashboard for enterprise resource management. Features employee CRUD operations, payroll automation, data visualization with charts, dark/light theme toggle, and granular RBAC.",
    image: "/projects/admin.webp",
    techStack: ["React", "Node.js", "Express", "MySQL", "Chart.js"],
    liveUrl: "#",
    githubUrl: "https://github.com/rituraj",
    category: "fullstack",
    featured: false,
    features: [
      "Employee & payroll management",
      "Interactive analytics dashboard",
      "Role-based access control",
      "Dark/light theme toggle",
    ],
  },
];

/* ─────────────── ACHIEVEMENTS ─────────────── */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: "hackathon" | "competition" | "certification" | "academic";
  icon: string;
}

export const achievements: Achievement[] = [
  {
    id: "a6",
    title: "1st Position — Tech Mind (3x Champion)",
    description: "Achieved a remarkable hat-trick by securing 1st place in the 'Tech Mind' technical event for the third consecutive year at GIET's Annual Techno-Cultural Festival.",
    date: "2026",
    category: "competition",
    icon: "👑",
  },
  {
    id: "a5",
    title: "Certified KYP Learning Facilitator",
    description: "Successfully cleared the OnCET Process & Proficiency Tests to become a certified Learning Facilitator under the Bihar Skill Development Mission (BSDM).",
    date: "2025",
    category: "certification",
    icon: "📜",
  },
  {
    id: "a4",
    title: "1st Position — Tech Mind Event",
    description: "Defended the championship title by securing 1st place in the 'Tech Mind' event at the GIET Annual Techno-Cultural Festival.",
    date: "2025",
    category: "competition",
    icon: "🥇",
  },
  {
    id: "a3",
    title: "1st Position — Tech Mind Event",
    description: "Emerged as the winner in the 'Tech Mind' technical competition during the Annual Techno-Cultural Festival organized by GIET.",
    date: "2024",
    category: "competition",
    icon: "🥇",
  },
  {
    id: "a2",
    title: "KYP Wizard Competition Qualifier",
    description: "Successfully qualified for the state-level KYP Wizard Competition organized on World Youth Skills Day.",
    date: "2022",
    category: "competition",
    icon: "🎯",
  },
  {
    id: "a1",
    title: "District Topper — KYP Examination",
    description: "Secured the highest rank in the district for the Kushal Yuva Program (KYP) examination conducted by the Bihar Skill Development Mission.",
    date: "2022",
    category: "academic",
    icon: "🏆",
  },
];

/* ─────────────── DEVELOPER JOURNEY ─────────────── */
export interface JourneyMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  skills: string[];
}

export const journeyMilestones: JourneyMilestone[] = [
  {
    id: "j1",
    year: "2022",
    title: "The Beginning — Hello World",
    description:
      "Started my coding journey with C, Python, and the fundamentals of computer science. Built first simple programs and discovered a passion for problem-solving.",
    skills: ["C", "Python", "DSA Basics"],
  },
  {
    id: "j2",
    year: "2023",
    title: "Frontend Foundations",
    description:
      "Dove deep into web development with HTML, CSS, and JavaScript. Built responsive websites, learned DOM manipulation, and explored CSS animations.",
    skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
  },
  {
    id: "j3",
    year: "2024",
    title: "React & Modern Frontend",
    description:
      "Mastered React ecosystem, state management, and component architecture. Started exploring Next.js and Tailwind CSS for production-grade applications.",
    skills: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
  },
  {
    id: "j4",
    year: "2025",
    title: "Full Stack Mastery",
    description:
      "Built complete full-stack applications with Node.js, Express, MongoDB. Integrated real-time features with Socket.io, WebRTC, and cloud services.",
    skills: ["Node.js", "Express", "MongoDB", "Socket.io", "WebRTC"],
  },
  {
    id: "j5",
    year: "2026",
    title: "AI & Advanced Engineering",
    description:
      "Integrating AI/ML capabilities into web applications. Building RAG systems, exploring Three.js for 3D web experiences, and contributing to open source.",
    skills: ["AI/ML", "Three.js", "Docker", "System Design", "Open Source"],
  },
];

/* ─────────────── EDUCATION ─────────────── */
export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  location: string;
  status?: string;
  description?: string;
}

export const educationList: Education[] = [
  {
    id: "e1",
    degree: "Matriculation (10th)",
    institution: "Vishashvi Public School",
    year: "2019 - 2020",
    location: "Patna, Bihar",
    description: "Completed foundational schooling with excellent academic standing. Developed an early interest in science, mathematics, and logical problem-solving that paved the way for my engineering journey.",
  },
  {
    id: "e2",
    degree: "Intermediate (+2)",
    institution: "A.B.S Inter College",
    year: "2020 - 2022",
    location: "Lalganj, Vaishali",
    description: "Completed higher secondary education with a focus on Mathematics and Science. Built a strong analytical foundation and began exploring the basics of computer science and programming concepts.",
  },
  {
    id: "e3",
    degree: "B.Tech in Computer Science and Engineering",
    institution: "Gandhi Institute for Education & Technology",
    year: "2022 - Present",
    location: "Baniatangi, Odisha",
    status: "Currently Pursuing",
    description: "Pursuing B.Tech in CSE with a strong focus on core concepts and practical applications. Gained knowledge in subjects like Data Structures, Algorithms, and DBMS. Actively involved in technical projects, web development, and mastering modern technologies like the MERN stack.",
  },
];

/* ─────────────── GITHUB STATS ─────────────── */
export const githubStats = {
  repositories: 35,
  totalCommits: 1200,
  contributions: 850,
  stars: 45,
  languages: [
    { name: "JavaScript", percentage: 35, color: "#f7df1e" },
    { name: "TypeScript", percentage: 28, color: "#3178c6" },
    { name: "Python", percentage: 12, color: "#3776ab" },
    { name: "CSS", percentage: 10, color: "#264de4" },
    { name: "HTML", percentage: 8, color: "#e34c26" },
    { name: "Other", percentage: 7, color: "#6b7280" },
  ],
};

/* ─────────────── GALLERY ─────────────── */
export interface GalleryImage {
  id: string;
  src: string;
  title: string;
  description: string;
  width: number;
  height: number;
}

export const galleryImages: GalleryImage[] = [
  {
    id: "g1",
    src: "https://res.cloudinary.com/dl89ty6uu/image/upload/v1777487412/DSC_7869_lee7vp.jpg",
    title: "Tech Mind 2026",
    description: "Completing the hat-trick! Winning the Tech Mind championship for the third consecutive year, setting a new benchmark for technical prowess.",
    width: 1200,
    height: 800,
  },
  {
    id: "g2",
    src: "https://res.cloudinary.com/dl89ty6uu/image/upload/v1777487857/3126066622031051_certificate_6__page-0001_by3h71.jpg",
    title: "KYP District Topper",
    description: "Awarded for securing the highest rank in the district during the Kushal Yuva Program (KYP) examination.",
    width: 1200,
    height: 850,
  },
  {
    id: "g3",
    src: "https://res.cloudinary.com/dl89ty6uu/image/upload/v1777487412/_DSC3348_uberne.jpg",
    title: "Tech Mind 2025",
    description: "Defending the title at Tech Mind 2025. A proud moment receiving the award for outstanding technical achievements.",
    width: 1200,
    height: 800,
  },
  {
    id: "g4",
    src: "https://res.cloudinary.com/dl89ty6uu/image/upload/v1777487843/3752961725091052_Certificate_3__page-0001_njqo7l.jpg",
    title: "Certified Learning Facilitator",
    description: "Official certification as a KYP Learning Facilitator, empowering the next generation with essential digital and life skills.",
    width: 1200,
    height: 850,
  },
  {
    id: "g5",
    src: "https://res.cloudinary.com/dl89ty6uu/image/upload/v1777487416/_DSC9175_bchs0k.png",
    title: "Tech Mind 2024",
    description: "Honored to secure the top position at the annual Tech Mind competition, showcasing innovative problem-solving and technical excellence.",
    width: 1200,
    height: 800,
  },
];
