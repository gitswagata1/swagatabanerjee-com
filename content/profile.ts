/**
 * Single source of truth for swagatabanerjee.com.
 * Every section, the AI assistant and Mini Swagata read from this file.
 * Rule: never invent facts. Anything missing is a string starting with "[PLACEHOLDER"
 * (or "[CONFIRM") and is rendered visibly until it is filled in.
 */

export const isPlaceholder = (s: string | undefined | null) =>
  !s || s.trimStart().startsWith("[PLACEHOLDER");

export type SectionId =
  | "hero"
  | "experience"
  | "projects"
  | "google"
  | "recognition"
  | "journey"
  | "community"
  | "skills"
  | "about"
  | "contact";

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}

export interface Role {
  company: string;
  title: string;
  period: string;
  summary?: string;
  bullets: string[];
}

export interface Project {
  index: string;
  slug: string;
  name: string;
  tagline: string;
  context: string;
  problem?: string;
  role?: string;
  built: string[];
  impact?: string[];
  origin?: string;
  research?: string;
  /** Stages left to right; each stage lists the parts at that step. Only what the content above states. */
  architecture?: string[][];
  learned?: string;
  stack: string[];
  links: { label: string; href: string }[];
  hasDemo?: boolean;
}

export interface JourneyStop {
  id: string;
  label: string;
  term?: string;
  items: string[];
}

export const profile = {
  site: {
    url: "https://swagatabanerjee.com",
    brandStory: "I take AI out of the demo and into the real world — 15 factories so far.",
    concept: "A professional portfolio with a playful soul.",
  },

  identity: {
    name: "Swagata Banerjee",
    shortName: "Swagata",
    initials: "SB",
    title: "Forward Deployed Engineering Manager, Gen AI",
    company: "Micro Turners Group",
    headline: ["Build.", "Design.", "Lead."],
    subline:
      "I ship AI from prototype to production — currently inside a 15-plant automotive manufacturing group.",
    positioning:
      "Works where user insight, technical feasibility and stakeholder trust meet. Builds, designs and leads rather than choosing between them.",
    openTo: "PM · Forward Deployed Engineer · SDE — AI-native products (2027)",
    statusShort: "Open to PM / FDE roles · 2027",
    education: {
      degree: "B.Tech Computer Science & Engineering",
      school: "Vellore Institute of Technology, Vellore",
      period: "Aug 2023 – Mar 2027",
    },
    location: "India",
    timeZone: "Asia/Kolkata",
    timeZoneLabel: "IST",
    personalBrand: "Learn AI with Swagata — AI training sessions",
  },

  // Phone number is deliberately not here: it lives only in the résumé PDFs.
  contact: {
    email: "theswagata1@gmail.com",
    linkedin: "https://linkedin.com/in/theswagata1",
    github: "https://github.com/gitswagata1",
    githubUser: "gitswagata1",
    headline: "Say hi. Bring the problem. I'll bring the AI.",
  },

  resumes: [
    { id: "pm", label: "Résumé — PM", href: "/resume/swagata-banerjee-pm.pdf", ready: false },
    { id: "eng", label: "Résumé — Engineering", href: "/resume/swagata-banerjee-engineering.pdf", ready: false },
  ],

  photos: {
    heroInline: [
      { src: "[PLACEHOLDER — /public/photos/hero-1]", alt: "Swagata" },
      { src: "[PLACEHOLDER — /public/photos/hero-2]", alt: "Swagata at work" },
    ],
    gallery: [] as { src: string; alt: string; caption: string }[],
  },

  stats: [
    { value: 15, label: "plants" },
    { value: 52.3, prefix: "₹", suffix: " Cr", decimals: 1, label: "data analysed" },
    { value: 2000, suffix: "+", label: "users" },
    { value: 600, suffix: "+", label: "community" },
    { value: 120, suffix: "+", label: "GCP labs" },
  ] satisfies Stat[],

  ticker: [
    "Amazon WoW 2026",
    "Google Girl Hackathon Team India",
    "McKinsey Forward",
    "Google Cloud Arcade Facilitator",
    "Top 90 SIH 2024",
    "AIR 303 VITEEE",
    "2× NPTEL Gold",
  ],

  experience: [
    {
      company: "Micro Turners Group",
      title: "Forward Deployed Engineering Manager, Gen AI",
      period: "May 2026 – Present",
      summary:
        "Joined as a Forward Deployed AI Engineer intern reporting directly to the Managing Director; now Forward Deployed Engineering Manager, Gen AI. MT Group is a 15-plant automotive manufacturer — two/four-wheeler parts, pipes, bearings. Startup-style mandate across AI/digital transformation, procurement intelligence and strategic delivery.",
      bullets: [
        "Own end-to-end delivery of AI/LLM automation from prototype to production; partner directly with the Managing Director and VP of Purchase to turn ambiguous operational problems into deployed software.",
        "Architected and delivered the MT Central Intelligence Platform in 3 phased releases, scoping with procurement and plant teams so each phase went live independently.",
        "Built RAG-based LLM analysis pipelines and a Material Code Intelligence Engine (hybrid DuckDB + LLM retrieval) for auditable sourcing intelligence.",
        "Distilled live SAP procurement data into a single weekly report, replacing manual supplier research with data-backed sourcing recommendations.",
        "Coordinated procurement, plant operations and IT; reported scope, risks and dependencies weekly to the MD; escalated blockers ahead of delivery dates.",
      ],
    },
    {
      company: "ByGrowth Academy",
      title: "Founder",
      period: "Jan 2025 – Mar 2026",
      bullets: [
        "Founded an EdTech startup; grew it from zero to 2,000+ active users, owning scope, release planning and go-to-market end to end.",
        "Planned the release calendar and held every launch to committed dates.",
        "Managed budget, vendor costs and user support; tracked weekly usage to prioritise releases.",
      ],
    },
  ] satisfies Role[],

  projects: [
    {
      index: "01",
      slug: "mt-central-intelligence-platform",
      name: "MT Central Intelligence Platform",
      tagline: "Manufacturing intelligence with an embedded LLM copilot, across 15 plants.",
      context: "Micro Turners, 2026",
      problem:
        "Purchase decisions across 15 plants relied on manual supplier research and scattered SAP data.",
      role: "[PLACEHOLDER — my role on this project, in my own words]",
      built: [
        "Manufacturing-intelligence dashboard with an embedded LLM copilot (Swagata.ai), live SAP procurement integration and an inventory-management engine.",
        "Material Code Intelligence Engine (hybrid DuckDB + LLM retrieval).",
        "AI Agent system including a production-ready Marketing Agent for bearing-distributor discovery (FastAPI, Kubernetes, PostgreSQL).",
      ],
      impact: [
        "₹52.3 Cr of procurement data analysed",
        "293 materials, 49 vendors, 181 alerts surfaced",
        "Weekly data-backed sourcing report for the purchase team",
        "Delivered in 3 independent phases",
      ],
      origin:
        "Started by learning the full procurement workflow (PR → PO → MIGO → MIRO) and market research for the MD.",
      architecture: [["Live SAP procurement data"], ["Material Code Intelligence Engine", "DuckDB + LLM retrieval"], ["RAG-based LLM analysis"], ["Dashboard + LLM copilot", "Weekly sourcing report", "Alerts"]],
      learned: "[PLACEHOLDER — what I learned]",
      stack: ["Python", "Streamlit", "DuckDB", "LLMs", "RAG", "SAP", "FastAPI", "Kubernetes", "PostgreSQL"],
      links: [],
      hasDemo: true,
    },
    {
      index: "02",
      slug: "bridgeup",
      name: "BridgeUp",
      tagline: "Adaptive Python learning platform.",
      context: "VIT-backed, Jul 2026",
      problem: "First-year students arrive at very different Python levels.",
      role: "[PLACEHOLDER — my role on this project]",
      built: [
        "8 modules, 99 lessons.",
        "In-browser code execution (Pyodide/WebAssembly).",
        "Adaptive placement testing and a lesson-aware LLM tutor.",
        "Test-gated progression with per-student tracking; role-based dashboards.",
        "Privacy-preserving federated-learning engine with differential privacy, so raw student data stays on-device.",
      ],
      impact: ["[PLACEHOLDER — usage or outcome numbers]"],
      architecture: [["Vanilla-JS SPA"], ["Pyodide (in-browser Python)", "Lesson-aware LLM tutor", "On-device federated learning"], ["Supabase / Postgres"], ["Role-based dashboards"]],
      learned: "[PLACEHOLDER — what I learned]",
      stack: ["JavaScript", "Supabase/PostgreSQL", "Pyodide", "LLMs"],
      links: [],
    },
    {
      index: "03",
      slug: "one-percent-better-everyday",
      name: "1% Better Everyday",
      tagline: "Serverless habit platform.",
      context: "Lean In, Mar 2026",
      problem: "[PLACEHOLDER — the problem this solves]",
      role: "Project Lead",
      built: [
        "Production-grade serverless platform, 7+ modules on AWS Lambda + DynamoDB.",
        "End-to-end JWT auth via AWS Cognito.",
        "Event-driven API Gateway architecture that scales horizontally.",
      ],
      impact: ["[PLACEHOLDER — usage or outcome numbers]"],
      architecture: [["Client"], ["API Gateway", "Cognito (JWT auth)"], ["AWS Lambda (7+ modules)"], ["DynamoDB", "CloudWatch"]],
      learned: "[PLACEHOLDER — what I learned]",
      stack: ["AWS Lambda", "DynamoDB", "Cognito", "API Gateway", "CloudWatch"],
      links: [],
    },
    {
      index: "04",
      slug: "autosource",
      name: "AutoSource",
      tagline: "Explainable multi-agent procurement analyst for MSMEs.",
      context: "Final-year project",
      problem: "[PLACEHOLDER — the problem this solves]",
      role: "[PLACEHOLDER — my role on this project]",
      built: ["Multi-agent system that explains its procurement analysis for small manufacturers."],
      research:
        "Reproducible benchmark for agentic failure modes; targets F1 ≥ 0.90 on extraction and ≥ 95% normalization correctness vs a single-LLM baseline.",
      learned: "[PLACEHOLDER — what I learned]",
      stack: ["Multi-agent systems", "LLMs"],
      links: [],
    },
    {
      index: "05",
      slug: "cryptoguard-ai",
      name: "CryptoGuard AI",
      tagline: "Crypto-security project.",
      context: "2026",
      problem: "[PLACEHOLDER — the problem this solves]",
      role: "[PLACEHOLDER — my role on this project]",
      built: [
        "Crypto-security project.",
        "Invention disclosure (patent) in progress with the VIT IPR & Technology Transfer Cell.",
      ],
      learned: "[PLACEHOLDER — what I learned]",
      stack: ["[PLACEHOLDER — stack]"],
      links: [{ label: "GitHub", href: "https://github.com/gitswagata1/cryptoguard-ai" }],
    },
    {
      index: "06",
      slug: "google-girl-hackathon",
      name: "Google Girl Hackathon build",
      tagline: "Gemini API app, delivered to a fixed deadline as part of Team India.",
      context: "2025",
      problem: "[PLACEHOLDER — the problem this solves]",
      role: "[PLACEHOLDER — my role on this project]",
      built: [
        "Gemini API app prototyped in Google AI Studio, scoped and delivered to a fixed deadline as part of Team India.",
      ],
      learned: "[PLACEHOLDER — what I learned]",
      stack: ["Gemini API", "Google AI Studio"],
      links: [],
    },
  ] satisfies Project[],

  google: {
    items: [
      {
        title: "Google Girl Hackathon, Team India",
        period: "Feb–Apr 2025",
        detail: "Cleared a 3-stage global selection.",
      },
      {
        title: "Google Cloud Arcade Facilitator",
        period: "Mar–Jun 2025",
        detail:
          "120+ hands-on GCP labs, 80+ skill badges (BigQuery, Kubernetes, AI/ML, Vertex AI); top global milestone tier.",
      },
      { title: "Google Cloud Certified", period: "", detail: "" },
    ],
    contributions: "[PLACEHOLDER — merged Google contributions: repo + PR links]",
    badgeCount: 80,
    badgeSuffix: "+",
    badges: [] as { src: string; name: string; date: string }[],
  },

  recognition: [
    {
      title: "Amazon — Women of the World (WoW) Program",
      period: "Jun 2026 – Present",
      detail: "Global development program for women in technology.",
    },
    {
      title: "McKinsey & Company — Forward Program, Network Level, AI & Digital",
      period: "Jun 2025 – Present",
      detail:
        "Selected from thousands of global applicants; applied McKinsey's 7-step problem-solving to 5+ real business cases; entered the McKinsey Network and AI & Digital essentials team; Forward Champion.",
    },
    { title: "Top 90, Smart India Hackathon 2024", period: "2024", detail: "" },
    { title: "AIR 303, VITEEE", period: "", detail: "" },
    { title: "2× Gold, NPTEL", period: "", detail: "" },
    { title: "NTSE & NSTSE Scholar", period: "", detail: "" },
  ],

  community: [
    {
      org: "Innovators Quest (IQuest), VIT",
      role: "Chairperson",
      period: "Jan 2025 – Present",
      detail:
        "Grew from core member to Chairperson of a 600+ member technical community; run the annual hackathon and competition calendar end to end (scope, dates, owners, financials, vendors, faculty approvals); events include Sustain-a-thon (SDG), Gravitas events and iFest (speaker sessions, workshops, designathon + hackathon).",
    },
    { org: "Lean In", role: "Project Lead, 1% Better Everyday", period: "Apr 2026 – Present", detail: "" },
    { org: "Gen Z Leadership Circle", role: "Owner", period: "Mar 2026 – Present", detail: "" },
    { org: "Bangalore Leadership Circle", role: "Manager", period: "Feb 2026 – Present", detail: "" },
    { org: "Learn AI with Swagata", role: "AI training sessions", period: "", detail: "" },
  ],

  // Hidden entirely while empty — never faked.
  talks: [] as { title: string; audience: string; date: string; photo?: string }[],
  testimonials: [] as { quote: string; name: string; role: string }[],
  writing: [] as { title: string; href: string }[],

  certifications: [
    "Google Cloud (certification + 80+ badges)",
    "AWS APAC – Solutions Architecture",
    "Tata – GenAI Powered Data Analytics",
    "AI Product Manager (HelloPM)",
    "Forward Deployed Engineer (Scaler)",
    "McKinsey Forward – AI & Digital",
    "AI Fluency",
    "Claude 101",
  ],

  skills: [
    {
      group: "Languages & frameworks",
      items: ["Python", "C++ (OOP)", "Rust", "JavaScript", "TypeScript", "React.js", "Node.js", "HTML", "CSS"],
    },
    {
      group: "AI/ML & data",
      items: ["LLMs", "RAG", "NLP", "Multi-agent systems", "Harness engineering", "APIs", "BigQuery", "DuckDB", "Power BI"],
    },
    {
      group: "Cloud & infra",
      items: [
        "AWS Lambda",
        "DynamoDB",
        "Cognito",
        "API Gateway",
        "CloudWatch",
        "GCP (Vertex AI, Kubernetes)",
        "Kubernetes",
        "SAP",
        "Supabase/PostgreSQL",
        "PostgreSQL",
        "Serverless & event-driven architecture",
      ],
    },
    {
      group: "Product & delivery",
      items: [
        "Technical discovery",
        "Solution architecture",
        "PRD writing",
        "Agile delivery",
        "Scoping",
        "Scheduling",
        "Stakeholder management",
        "Risk & dependency tracking",
        "Budget tracking",
        "MECE problem solving",
      ],
    },
    { group: "Tools", items: ["Jira", "Notion", "Figma", "Gantt charts", "Google Workspace"] },
  ],

  journey: {
    beforeVit: {
      id: "before-vit",
      label: "Before VIT",
      items: [
        "NTSE & NSTSE Scholar",
        "VITEEE AIR 303",
        "[PLACEHOLDER — school projects, achievements, photos]",
      ],
    } satisfies JourneyStop,
    semesters: [
      { id: "sem-1", label: "Sem 1", term: "Fall 2023", items: ["Joined VIT Vellore, CSE.", "[PLACEHOLDER]"] },
      { id: "sem-2", label: "Sem 2", term: "Winter 2024", items: ["[PLACEHOLDER]"] },
      {
        id: "sem-3",
        label: "Sem 3",
        term: "Fall 2024",
        items: ["Top 90, Smart India Hackathon 2024. [CONFIRM — semester]"],
      },
      {
        id: "sem-4",
        label: "Sem 4",
        term: "Winter 2025",
        items: [
          "Founded ByGrowth Academy",
          "Became IQuest Chairperson",
          "Google Girl Hackathon Team India",
          "Google Cloud Arcade Facilitator",
        ],
      },
      {
        id: "sem-5",
        label: "Sem 5",
        term: "Fall 2025",
        items: ["McKinsey Forward Program, AI & Digital.", "[PLACEHOLDER]"],
      },
      {
        id: "sem-6",
        label: "Sem 6",
        term: "Winter 2026",
        items: [
          "Shipped 1% Better Everyday on AWS",
          "Lean In, Gen Z and Bangalore Leadership Circle roles",
          "Joined Micro Turners (May)",
          "Selected for Amazon WoW (Jun)",
        ],
      },
      {
        id: "sem-7",
        label: "Sem 7",
        term: "Fall 2026",
        items: [
          "Forward Deployed Engineering Manager, Gen AI",
          "Shipped BridgeUp",
          "CryptoGuard AI patent disclosure",
          "AutoSource",
        ],
      },
      { id: "sem-8", label: "Sem 8", term: "Winter 2027", items: ["Graduation and what's next"] },
    ] satisfies JourneyStop[],
  },

  about: {
    textMessage: [
      { k: "Name", v: "Swagata" },
      { k: "Job", v: "building AI that real factories actually use" },
      { k: "Good at", v: "turning messy problems into shipped products" },
      { k: "Bad at", v: "[PLACEHOLDER — honest and funny]" },
      { k: "Currently", v: "[PLACEHOLDER]" },
      { k: "Favourites", v: "[PLACEHOLDER — food / book / song / place]" },
    ],
    now: "[PLACEHOLDER — what I'm doing now]",
    story: [
      "[PLACEHOLDER — where I started, in my own words]",
      "[PLACEHOLDER — what drives me]",
      "[PLACEHOLDER — what I want to build next]",
    ],
  },

  sixtySecond: {
    topProjectSlugs: ["mt-central-intelligence-platform", "bridgeup", "one-percent-better-everyday"],
    topAchievements: [
      "Amazon — Women of the World (WoW) Program, 2026",
      "Google Girl Hackathon, Team India — cleared a 3-stage global selection",
      "McKinsey Forward Program — AI & Digital, Forward Champion",
      "Top 90, Smart India Hackathon 2024",
      "AIR 303, VITEEE",
    ],
  },

  avatar: {
    details: "[PLACEHOLDER — hairstyle, glasses?, favourite outfit colour, a laptop or chai cup as a prop]",
    greeting: "Hi, I'm Swagata 👋 Want a quick tour?",
    tourYes: "Show me",
    tourNo: "I'll explore",
    tourOrder: ["experience", "projects", "google", "journey", "contact"] as SectionId[],
    lines: {
      experience: "This is where I build AI for 15 factories",
      projects: "My favourite things I've made",
      google: "My little Google corner ✨",
      journey: "Sem 1 to Sem 8 — come along",
      contact: "Let's build something together",
    } as Partial<Record<SectionId, string>>,
  },

  chat: {
    label: "Ask Swagata's AI",
    placeholder: "Ask Swagata's AI…",
    maxChars: 500,
    starters: [
      "What did she build at Micro Turners?",
      "Show me her AI projects",
      "Why hire her as an FDE?",
      "Tell me about BridgeUp",
      "What's her Google story?",
    ],
    fallback: "I'm napping — email Swagata instead!",
    rateLimited: "That's a lot of questions. Give me a few minutes — or email Swagata instead.",
    intro: "Hi, I'm Swagata's AI. She takes AI out of the demo and into the real world — 15 factories so far. Ask me anything about her work.",
    sectionLabels: {
      hero: "Back to top",
      experience: "See experience",
      projects: "See projects",
      google: "See the Google corner",
      recognition: "See recognition",
      journey: "See the journey",
      community: "See leadership & community",
      skills: "See skills",
      about: "About Swagata",
      contact: "Get in touch",
    } as Record<SectionId, string>,
    systemPrompt:
      "You are the assistant on Swagata Banerjee's portfolio. Answer questions about Swagata using ONLY the provided profile data. Speak about her in the third person, warmly and concisely (2–4 sentences unless asked for more). If the answer isn't in the data, say you don't know and suggest emailing theswagata1@gmail.com. Never invent employers, numbers, dates or skills. Decline unrelated requests politely and steer back to Swagata's work. When relevant, end with one section link using the format [[section:projects]].",
  },

  nav: [
    { label: "Work", href: "/#projects" },
    { label: "Journey", href: "/#journey" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],

  sheets: {
    hero: "SHEET 01 / HERO",
    highlights: "SHEET 02 / HIGHLIGHTS",
    experience: "SHEET 03 / EXPERIENCE",
    projects: "SHEET 04 / PROJECTS",
    google: "SHEET 05 / GOOGLE",
    recognition: "SHEET 06 / RECOGNITION",
    journey: "SHEET 07 / JOURNEY",
    community: "SHEET 08 / COMMUNITY",
    skills: "SHEET 09 / SKILLS",
    about: "SHEET 10 / ABOUT",
    contact: "SHEET 11 / CONTACT",
  },
};

export type Profile = typeof profile;
