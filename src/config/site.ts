export type SocialPlatform =
  | "github"
  | "linkedin"
  | "discord"
  | "instagram"
  | "x"
  | "spotify"
  | "email"
  | "other";

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  href: string;
};

export type Project = {
  name: string;
  description: string;
  technologies: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  status?: "in-progress" | "shipped" | "archived" | "concept";
};

export type Achievement = {
  title: string;
  description: string;
  date: string;
  href?: string;
};

export const siteConfig = {
  name: "Amare Carey",
  shortName: "Amare",
  title: "Amare Carey",
  description: "Amare Carey",
  url: "https://amarecarey.com",
  profileImage: "/images/pfp.png",
  audio: {
    tracks: [
      "/music/wildflower.mp3",
      "/music/death-bed.mp3",
      "/music/forever.mp3",
      "/music/love-is-in-the-air.mp3",
      "/music/thinking-out-loud.mp3",
      "/music/talking-to-the-moon.mp3",
      "/music/self-aware.mp3",
      "/music/end-of-beginning.mp3",
      "/music/follow-you.mp3",
      "/music/here-with-me.mp3",
    ],
    defaultVolume: 0.16,
    trackVolumes: {
      "/music/love-is-in-the-air.mp3": 0.5,
    },
    trackTitles: {
      "/music/wildflower.mp3": "Wildflower",
      "/music/death-bed.mp3": "Death Bed",
      "/music/forever.mp3": "Forever",
      "/music/love-is-in-the-air.mp3": "Love Is in the Air",
      "/music/thinking-out-loud.mp3": "Thinking Out Loud",
      "/music/talking-to-the-moon.mp3": "Talking to the Moon",
      "/music/self-aware.mp3": "Self Aware",
      "/music/end-of-beginning.mp3": "End of Beginning",
      "/music/follow-you.mp3": "Follow You",
      "/music/here-with-me.mp3": "Here With Me",
    },
  },
  status: {
    available: false,
    label: "",
  },
  hero: {
    introduction: "",
    tagline: "infinite and unlimited",
    age: "18",
    focus: [],
  },
  about: {
    paragraphs: [
      "I'm a software engineer drawn to the quieter side of building — precise interfaces, dependable systems, and work that feels considered rather than loud.",
      "My background sits at the intersection of engineering and design. I care about how things look, how they feel to use, and how they hold up once the novelty wears off.",
      "When I'm not writing code, I'm usually learning something adjacent — new tools, better ways to structure problems, or the small details that separate adequate software from something memorable.",
    ],
    education: [
      {
        school: "Your School / University",
        detail: "Degree or program — update this in site.ts",
        years: "20XX — 20XX",
      },
    ],
    details: [
      {
        label: "Based in",
        value: "Add your location",
      },
      {
        label: "Currently",
        value: "Building personal projects and sharpening fundamentals",
      },
      {
        label: "Seeking",
        value: "Collaborations, internships, and meaningful engineering work",
      },
    ],
  },
  projects: [
    {
      name: "Project One",
      description:
        "Replace this with a real project. Describe what it does, who it's for, and why it mattered to build.",
      technologies: ["Next.js", "TypeScript", "Supabase"],
      image: "/images/project-placeholder.svg",
      liveUrl: undefined,
      githubUrl: undefined,
      status: "concept" as const,
    },
    {
      name: "Project Two",
      description:
        "Another placeholder. Add a thumbnail, links, and a honest status when you're ready to share it.",
      technologies: ["React", "Node.js"],
      image: "/images/project-placeholder.svg",
      liveUrl: undefined,
      githubUrl: undefined,
      status: "in-progress" as const,
    },
  ] satisfies Project[],
  achievements: [
    {
      title: "Academic milestone",
      description:
        "Describe an award, scholarship, competition result, or academic highlight.",
      date: "2024",
      href: undefined,
    },
    {
      title: "Certification or course",
      description:
        "Add certifications, completed programs, or notable learning achievements here.",
      date: "2025",
      href: undefined,
    },
  ] as Achievement[],
  interests: [
    {
      title: "Systems & architecture",
      description: "Thoughtful data models, clean APIs, and maintainable structure.",
    },
    {
      title: "Interface craft",
      description: "Typography, motion restraint, and interfaces that feel inevitable.",
    },
    {
      title: "Learning in public",
      description: "Shipping small experiments and refining how I communicate technical ideas.",
    },
  ],
  socials: [
    {
      platform: "x",
      label: "Twitter",
      href: "https://x.com/honourlost",
    },
    {
      platform: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/amare.carey/?utm_source=ig_web_button_share_sheet",
    },
    {
      platform: "spotify",
      label: "Spotify",
      href: "https://open.spotify.com/user/31uli2w7inc4oegfdb2lygnntrha?si=695225eb336f4e07",
    },
  ] satisfies SocialLink[],
};

export type SiteConfig = typeof siteConfig;
