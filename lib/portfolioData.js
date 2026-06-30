// Central data for Ekamnoor Singh's portfolio (sourced from resume)

export const SIKH_IMAGE =
  "https://customer-assets.emergentagent.com/job_198f53df-b098-4d39-8ad3-92a180cfd1e7/artifacts/4tzjohot_image.png";

export const RESUME_URL =
  "https://customer-assets.emergentagent.com/job_ai-engineer-hub-60/artifacts/5smnb5ju_EKAMNOOR_SINGH_CV_WEBBEE_GLOBAL.pdf";

export const PROFILE = {
  name: "Ekamnoor Singh",
  firstName: "Ekamnoor",
  roles: [
    "Full Stack AI Engineer",
    "Distributed Systems Builder",
    "Agentic AI Developer",
    "Hackathon Winner",
  ],
  location: "Gurdaspur, Punjab, India",
  available: "Open to SDE / AI Engineering Internships",
  greeting: "Hello World, from Punjab to the Cloud",
  tagline:
    "I architect scalable, high-performance systems and intelligent AI products \u2014 rooted in the values of Punjab, building for the world.",
  summary:
    "Computer Science Engineering student (graduating 2028) with hands-on experience architecting distributed systems, concurrency, multi-threading and synchronization. Proficient in DSA and software design with Python, C++ and JavaScript. Award-winning hackathon contributor focused on performance optimization and reliability engineering \u2014 seeking a Software / AI Engineering internship to build scalable, production-grade systems.",
  contact: {
    email: "ekamnoor.career@gmail.com",
    linkedin: "https://www.linkedin.com/in/ekamnoor-singh-aspiringaiengineer",
    github: "https://github.com/GitWithEkam",
  },
 
  stats: [
    { label: "B.Tech CGPA", value: "8.33" },
    { label: "Deployed Projects", value: "3+" },
    { label: "Hackathons Won", value: "2x" },
    { label: "Community Built", value: "500+" },
    { label: "Grad Year", value: "2028" },
  ],
  experience: [
    {
      role: "Front-End AI Engineering Intern",
      org: "FlyRank AI",
      place: "Remote \u00b7 Chicago, US",
      period: "07/2026 \u2013 Present",
      points: [
        "Architecting scalable, high-performance AI-powered web apps using React.js, JavaScript, HTML & CSS.",
        "Collaborating with cross-functional teams applying software engineering best practices.",
      ],
    },
  ],
  education: [
    {
      degree: "B.Tech, Computer Science Engineering",
      org: "Sardar Beant Singh State University",
      period: "2024 \u2013 2028 (Expected)",
      detail: "CGPA: 8.33 \u00b7 Focus on Distributed Systems, Concurrency, DSA & Software Design.",
    },
    {
      degree: "Senior Secondary (PCM)",
      org: "SZSFS Khalsa Senior Secondary Public School",
      period: "2020 \u2013 2022",
      detail: "96.8% \u00b7 Ranked 1st \u00b7 Student of the Year 2022.",
    },
  ],
  projects: [
    {
      title: "PitchRoute",
      subtitle: "AI-Powered B2B Sales Assistant",
      description:
        "Architected a distributed AI sales assistant with intelligent query routing between GPT-4o and GPT-4o-mini, concurrent request handling and multi-threading \u2014 improving cost efficiency by 40%.",
      tags: ["React", "FastAPI", "MongoDB", "OpenAI API", "Tailwind"],
      metric: "+40% cost efficiency",
      icon: "Rocket",
      github: "https://github.com/GitWithEkam",
      demo: "https://pitch-route.emergent.host/",
    },
    {
      title: "AI Virtual University Assistant",
      subtitle: "Automated Student Support \u00b7 SBSSU",
      description:
        "Built an AI assistant automating student support and admission inquiries. Designed n8n workflows to retrieve info and capture leads, with prompt engineering to minimize hallucinations.",
      tags: ["n8n", "OpenAI API", "Google Sheets", "JavaScript"],
      metric: "Lead capture automated",
      icon: "Bot",
      github: "https://github.com/GitWithEkam",
      demo: "https://ekam-singh.app.n8n.cloud/webhook/205f5268-35b4-4063-9b4d-340f73237100/chat",
    },
    {
      title: "Smart Attendance Lite",
      subtitle: "Offline-First Attendance System",
      description:
        "Designed an enterprise-grade, offline-first attendance system solving concurrency challenges with synchronization mechanisms and distributed-system conflict resolution.",
      tags: ["Full-Stack", "MongoDB", "Distributed Systems", "Concurrency"],
      metric: "Conflict-free sync",
      icon: "Database",
      github: "https://github.com/GitWithEkam",
      demo: null,
    },
  ],
  achievements: [
    { title: "1st Place \u2014 CODE STORM 2026", org: "Tech4Hack & Thoughtworks", icon: "Trophy" },
    { title: "Runner-up \u2014 Iron Labs AI x AIC Delhi", org: "Agentic AI \u00b7 GTM Track", icon: "Medal" },
    { title: "Student of the Year 2022", org: "96.8% \u00b7 Ranked 1st", icon: "Star" },
    { title: "Selected Contributor \u2014 ECSOC 2026", org: "Elite Coders Summer of Code", icon: "Code2" },
    { title: "Head Boy & Mr. Allrounder 2020", org: "Student Council Leadership", icon: "Crown" },
    { title: "Gold Medalist \u2014 Global e-Camp 2019", org: "National Recognition", icon: "Award" },
  ],
  techStack: [
    { group: "Languages", icon: "Code2", items: ["Python", "JavaScript", "C++", "Go (learning)", "HTML", "CSS"] },
    { group: "Frameworks", icon: "Layers", items: ["React.js", "Node.js", "FastAPI", "Flask", "Django", "Tailwind CSS"] },
    { group: "AI / ML", icon: "BrainCircuit", items: ["OpenAI API", "Agentic AI", "Gemini", "Claude", "Prompt Engineering", "n8n Automation"] },
    { group: "Data & Tools", icon: "Wrench", items: ["MongoDB", "Git & GitHub", "VS Code", "Vercel", "Netlify", "Google Workspace"] },
  ],
  leadership: [
    { title: "Co-Founder & Project Head", org: "Riveting Readers", detail: "Founded & scaled Punjab's first online reading club to 500+ members.", period: "2021 \u2013 2024" },
    { title: "Community Development Member (G-65)", org: "Sukrit Trust", detail: "Seva-driven community development initiatives.", period: "2020 \u2013 2024" },
  ],
  languages: [
    { name: "Punjabi", level: "Native" },
    { name: "Hindi", level: "Native" },
    { name: "English", level: "Professional" },
  ],
};

// Interactive color themes \u2014 Kesari (Punjab) default + switchable palettes
export const THEMES = [
  {
    id: "kesari",
    name: "Kesari Punjab",
    primary: "#FF9A1F",
    primaryRgb: "255,154,31",
    secondary: "#3B82F6",
    secondaryRgb: "59,130,246",
    accent: "#FFD24A",
    accentRgb: "255,210,74",
    bg: "#070A14",
    bgGradient:
      "radial-gradient(900px circle at 12% 8%, rgba(255,154,31,0.16), transparent 42%), radial-gradient(900px circle at 88% 92%, rgba(59,130,246,0.18), transparent 45%), radial-gradient(700px circle at 70% 20%, rgba(255,210,74,0.10), transparent 40%), #070A14",
    particles: ["#FF9A1F", "#FFD24A", "#3B82F6"],
    star: "#FFE6B0",
  },
  {
    id: "khalsa",
    name: "Royal Blue",
    primary: "#2563EB",
    primaryRgb: "37,99,235",
    secondary: "#F59E0B",
    secondaryRgb: "245,158,11",
    accent: "#60A5FA",
    accentRgb: "96,165,250",
    bg: "#040A1F",
    bgGradient:
      "radial-gradient(900px circle at 15% 10%, rgba(37,99,235,0.22), transparent 45%), radial-gradient(900px circle at 85% 90%, rgba(245,158,11,0.14), transparent 45%), #040A1F",
    particles: ["#2563EB", "#60A5FA", "#F59E0B"],
    star: "#CFE0FF",
  },
  {
    id: "neon",
    name: "Cyber Neon",
    primary: "#22D3EE",
    primaryRgb: "34,211,238",
    secondary: "#E879F9",
    secondaryRgb: "232,121,249",
    accent: "#A5F3FC",
    accentRgb: "165,243,252",
    bg: "#05030F",
    bgGradient:
      "radial-gradient(900px circle at 12% 12%, rgba(34,211,238,0.18), transparent 42%), radial-gradient(900px circle at 88% 88%, rgba(232,121,249,0.20), transparent 45%), #05030F",
    particles: ["#22D3EE", "#E879F9", "#A5F3FC"],
    star: "#C7F9FF",
  },
  {
    id: "emerald",
    name: "Emerald Matrix",
    primary: "#10B981",
    primaryRgb: "16,185,129",
    secondary: "#A3E635",
    secondaryRgb: "163,230,53",
    accent: "#6EE7B7",
    accentRgb: "110,231,183",
    bg: "#03120C",
    bgGradient:
      "radial-gradient(900px circle at 14% 10%, rgba(16,185,129,0.20), transparent 44%), radial-gradient(900px circle at 86% 90%, rgba(163,230,53,0.14), transparent 45%), #03120C",
    particles: ["#10B981", "#6EE7B7", "#A3E635"],
    star: "#C7FFE6",
  },
  {
    id: "amethyst",
    name: "Royal Amethyst",
    primary: "#A855F7",
    primaryRgb: "168,85,247",
    secondary: "#F472B6",
    secondaryRgb: "244,114,182",
    accent: "#C4B5FD",
    accentRgb: "196,181,253",
    bg: "#0A0518",
    bgGradient:
      "radial-gradient(900px circle at 12% 10%, rgba(168,85,247,0.20), transparent 44%), radial-gradient(900px circle at 88% 90%, rgba(244,114,182,0.16), transparent 45%), #0A0518",
    particles: ["#A855F7", "#C4B5FD", "#F472B6"],
    star: "#E9D5FF",
  },
];
