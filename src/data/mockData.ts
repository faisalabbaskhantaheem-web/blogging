import { Article, Category, User, Comment } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'tech',
    name: 'Technology',
    slug: 'technology',
    description: 'Explore the latest gadgets, software tools, and digital breakthroughs shaping the future.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    color: 'from-blue-500 to-indigo-600',
    count: 14
  },
  {
    id: 'ai',
    name: 'AI & ML',
    slug: 'ai-ml',
    description: 'Machine learning developments, generative models, and how AI is changing industry landscapes.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
    color: 'from-purple-500 to-pink-600',
    count: 12
  },
  {
    id: 'programming',
    name: 'Programming',
    slug: 'programming',
    description: 'Learn modern software design patterns, framework tips, and code optimizations.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    color: 'from-emerald-500 to-teal-600',
    count: 18
  },
  {
    id: 'business',
    name: 'Business',
    slug: 'business',
    description: 'Essential trends, management models, and scaling tips for modern enterprises.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    color: 'from-amber-500 to-yellow-600',
    count: 8
  },
  {
    id: 'design',
    name: 'Product Design',
    slug: 'product-design',
    description: 'UI/UX best practices, graphic identities, typography pairings, and layouts.',
    image: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=600&auto=format&fit=crop&q=80',
    color: 'from-rose-500 to-orange-600',
    count: 11
  },
  {
    id: 'finance',
    name: 'Finance & Markets',
    slug: 'finance-markets',
    description: 'Investments, economic strategies, decentralization, and corporate wealth management.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
    color: 'from-cyan-500 to-blue-600',
    count: 6
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    email: 'faisalabbaskhantaheem@gmail.com', // Let's use user email in metadata as admin
    name: 'Faisal Abbas',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    bio: 'Founder of JB Blogging. Tech analyst, full-stack creator, and design evangelist based in SF.',
    coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&auto=format&fit=crop&q=80',
    followersCount: 2402120,
    followingCount: 380,
    socialLinks: {
      twitter: 'faisal_abbas_tech',
      github: 'faisalabbas',
      linkedin: 'faisal-abbas-dev',
      website: 'faisalabbas.me'
    },
    followers: ['user-1', 'user-2', 'user-3'],
    following: ['user-1', 'user-2'],
    joinedDate: '2026-01-15'
  },
  {
    id: 'user-1',
    email: 'sarah.l@jbblog.com',
    name: 'Sarah Lindqvist',
    role: 'author',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'AI Researcher at BrainLabs. Writing about neural architectures, ethical machine learning, and human-computer symbiosis.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    followersCount: 890,
    followingCount: 220,
    socialLinks: {
      twitter: 'sarahl_ai',
      github: 'sarah_neuro',
      website: 'sarahl.brainlabs.ai'
    },
    followers: ['user-admin', 'user-2'],
    following: ['user-admin', 'user-3'],
    joinedDate: '2026-02-10'
  },
  {
    id: 'user-2',
    email: 'marcus.v@jbblog.com',
    name: 'Marcus Vance',
    role: 'author',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Senior Design Systems Developer. Obsessed with custom CSS variables, layout rhythms, and accessible typography.',
    coverImage: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80',
    followersCount: 1105,
    followingCount: 450,
    socialLinks: {
      twitter: 'marcuscodesign',
      github: 'marcusv',
      linkedin: 'marcusvance-ux'
    },
    followers: ['user-admin', 'user-1'],
    following: ['user-admin', 'user-1', 'user-3'],
    joinedDate: '2026-02-28'
  },
  {
    id: 'user-3',
    email: 'elena.rodriguez@jbblog.com',
    name: 'Elena Rodriguez',
    role: 'author',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'Venture Capitalist & Financial Columnist. Writing deeply researched deep dives into macroeconomic shifts, fintech, and bootstrap formulas.',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
    followersCount: 3120,
    followingCount: 120,
    socialLinks: {
      twitter: 'elenar_cap',
      website: 'rodriguezpartners.com'
    },
    followers: ['user-admin', 'user-1', 'user-2'],
    following: ['user-admin'],
    joinedDate: '2026-03-05'
  },
  {
    id: 'user-reader',
    email: 'reader@jbblog.com',
    name: 'John Doe',
    role: 'reader',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Avid reader and tech enthusiast. Always learning new things and sharing resources.',
    followersCount: 5,
    followingCount: 24,
    socialLinks: {},
    followers: [],
    following: ['user-admin', 'user-1', 'user-2'],
    joinedDate: '2026-04-12'
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'the-future-of-generative-ai-2026-breakthroughs',
    title: 'The Future of Generative AI: Breakthroughs Expected in late 2026',
    excerpt: 'Deep learning is shifting from conversational text completions to real-time multi-modal action workflows, sensory reasoning, and edge-native local computation models.',
    content: 'We explore how neural network architectures are evolving in 2026 to incorporate agentic control systems directly inside weights...',
    contentBlocks: [
      {
        type: 'paragraph',
        value: 'As we navigate through 2026, the artificial intelligence landscape is witnessing a massive tectonic shift. In previous years, Generative AI models were seen primarily as conversational tools. They responded to prompts, predicted next tokens, and helped users compile snippets. However, the paradigm is scaling up rapidly. Today, models are becoming agentic reasoners, capable of multi-step logical execution, real-time tool orchestration, and autonomous feedback loops.'
      },
      {
        type: 'heading1',
        value: 'From Passive Completers to Active Agents'
      },
      {
        type: 'paragraph',
        value: 'The central milestone of 2026 is the convergence of Large Language Models (LLMs) with system-level control theory. Instead of just generating HTML or text, modern AI agents possess the autonomy to formulate hypotheses, compile local code, inspect the console for warnings, correct syntax errors in real-time, and deploy finished software systems.'
      },
      {
        type: 'quote',
        value: 'Artificial general intelligence will not arrive as a single massive system in a central sever park, but as millions of highly coordinated, localized reasoning agents running on serverless, edge-optimized pipelines.'
      },
      {
        type: 'heading2',
        value: 'Edge Computing and Local Sensory Reasoning'
      },
      {
        type: 'paragraph',
        value: 'Privacy directives and low-latency mandates have forced model providers to focus heavily on local-first networks. Rather than routing video frames or sensor inputs to a central API, next-gen mobile platforms feature specialized matrix coprocessors.'
      },
      {
        type: 'image',
        value: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1000&auto=format&fit=crop&q=80',
        extra: 'The complexity of neural connections in generative artificial intelligence layers.'
      },
      {
        type: 'paragraph',
        value: 'Let us take a look at a typical serverless orchestrator initialization written in TypeScript for the Gemini 2.x-3.x APIs:'
      },
      {
        type: 'code',
        value: `import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function runGenerativeWorkflow() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: 'Formulate a secure authentication rule for persistent document databases.',
    config: {
      temperature: 0.2,
      maxOutputTokens: 1024,
    }
  });

  console.log('Reasoning Pathway Outcome:', response.text);
}

runGenerativeWorkflow();`,
        extra: 'typescript'
      },
      {
        type: 'paragraph',
        value: 'The implications of this shift are profound. It will require developers to specialize as systems synthesizers, orchestrating AI agent groups instead of hand-writing repetitive boilerplate code. The web layout itself will adapt live to consumer contexts, bringing personalized experiences to a level never witnessed before.'
      }
    ],
    category: 'AI & ML',
    tags: ['AI', 'GenerativeAI', 'Vite', 'TypeScript', '2026Tech'],
    authorId: 'user-1',
    authorName: 'Sarah Lindqvist',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1000&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&auto=format&fit=crop&q=80',
    publishDate: '2026-06-15',
    readingTime: '5 min read',
    views: 4210,
    likes: 384,
    likedBy: ['user-admin', 'user-reader'],
    bookmarkedBy: ['user-admin'],
    commentsCount: 3,
    status: 'published',
    reactions: { like: 240, heart: 110, fire: 30, brain: 4 }
  },
  {
    id: 'art-2',
    slug: 'building-gorgeous-uis-with-tailwind-css-v4',
    title: 'Designing Ultra-Fast Layouts with Tailwind CSS v4',
    excerpt: 'Exploring CSS-first theme blocks, CSS variables-backed design tokens, lightning-fast compilation, and elegant spacing hierarchies using Tailwind v4.',
    content: 'Tailwind CSS v4 reinvents the compilation engine with high Performance CSS directives...',
    contentBlocks: [
      {
        type: 'paragraph',
        value: 'Designing for the modern web requires speed, not just in rendering assets, but inside developer tools. Tailwind CSS v4 delivers a radical evolution, swapping out the traditional JS configurations for direct, CSS-based thematic controls.'
      },
      {
        type: 'heading1',
        value: 'The Modern CSS @theme Paradigm'
      },
      {
        type: 'paragraph',
        value: 'In Tailwind v4, we no longer need complex tailwind.config.js files. Instead, all configurations are written inside your main global CSS stylesheet. This leverages pure CSS custom properties beneath the compiler, resulting in blazing fast build times and seamless web-inspector debugging.'
      },
      {
        type: 'code',
        value: `@import "tailwindcss";

@theme {
  --color-brand-primary: #2563eb;
  --color-brand-secondary: #1e40af;
  --color-accent: #60a5fa;
  --font-sans: "Inter", system-ui, sans-serif;
  --layer-header: 100;
}`,
        extra: 'css'
      },
      {
        type: 'paragraph',
        value: 'This makes changing themes on-the-fly extremely lightweight. Because Tailwind classes are linked directly to standard CSS variable namespaces, updating a class simply shifts a variable scoped at the container level.'
      },
      {
        type: 'heading2',
        value: 'Balancing Typography and Layout Negative Space'
      },
      {
        type: 'paragraph',
        value: 'The mark of an enterprise-level, agency-designed website is not its loudness, but its quiet layout rhythm. Standard templates crowd cards next to headers. High-end platforms leverage generous paddings (e.g. py-16 or tracking-tight) combined with deep high-contrast text layers.'
      },
      {
        type: 'quote',
        value: 'Excellent spacing is the silent voice of premium UI. When a website feels clean, it is the result of systematic padding combined with deliberate contrast scales.'
      }
    ],
    category: 'Product Design',
    tags: ['TailwindCSS', 'CSS', 'UIUX', 'FrontendDevelopment'],
    authorId: 'user-2',
    authorName: 'Marcus Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&auto=format&fit=crop&q=80',
    publishDate: '2026-06-10',
    readingTime: '4 min read',
    views: 3125,
    likes: 215,
    likedBy: ['user-1'],
    bookmarkedBy: ['user-reader'],
    commentsCount: 2,
    status: 'published',
    reactions: { like: 120, heart: 45, fire: 42, brain: 8 }
  },
  {
    id: 'art-3',
    slug: 'scaling-startups-bootstrap-vs-venture-capital-now',
    title: 'Scaling Startups: The 2026 Guide to Bootstrap vs Venture Rounds',
    excerpt: 'Analyzing cost structures, interest rates, capital efficiency dynamics, and why profitable self-sustaining models are outperforming high-burn hyper-scaling vectors in current market shifts.',
    content: 'We take a look at modern seed curves, EBITDA requirements for Series A, and alternative debt facilities...',
    contentBlocks: [
      {
        type: 'paragraph',
        value: 'For years, startup culture was synonymous with venture fuel. "Burn to scale" was the mantra, and profitability was viewed as a remote horizon. In late 2025 and moving into 2026, we have visible macro validation that the landscape has irreversibly corrected.'
      },
      {
        type: 'heading1',
        value: 'The Death of the Unlimited Runway'
      },
      {
        type: 'paragraph',
        value: 'With global cost-of-capital stabilizing at levels higher than the pre-pandemic decade, investors have re-grounded valuation formulas in absolute free cash flows. The Series A landscape is no longer driven by sheer monthly active user counts. It is driven by net retention percentages, healthy acquisition cost unit economics, and cash burn efficiency ratio margins.'
      },
      {
        type: 'image',
        value: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80',
        extra: 'Modern tech analytics dashboard analyzing venture growth capital efficiency.'
      },
      {
        type: 'heading2',
        value: 'The Rise of "Efficient Scale"'
      },
      {
        type: 'paragraph',
        value: 'Founders have realized that retaining control and cultivating a capital-efficient cash flow machine yields higher personal options. A company generating $8M in ARR growing at 65% with 25% adjusted EBITDA margins often yields substantially higher return metrics to founders than a highly diluted series-B burning $15M a year.'
      }
    ],
    category: 'Finance & Markets',
    tags: ['Startups', 'VentureCapital', 'Bootstrap', 'Econ2026', 'Finance'],
    authorId: 'user-3',
    authorName: 'Elena Rodriguez',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&auto=format&fit=crop&q=80',
    publishDate: '2026-06-08',
    readingTime: '6 min read',
    views: 5219,
    likes: 492,
    likedBy: ['user-admin', 'user-1', 'user-this-is-not-real'],
    bookmarkedBy: ['user-1', 'user-2'],
    commentsCount: 1,
    status: 'published',
    reactions: { like: 310, heart: 98, fire: 62, brain: 22 }
  },
  {
    id: 'art-4',
    slug: 'react-19-server-components-use-hook-survival-guide',
    title: 'React 19 Server Components and the new "use" Hook',
    excerpt: 'A critical survival guide for developers migrating to React 19, mastering promise unwrapping, progressive forms interactions, and optimized state actions.',
    content: 'React 19 brings exciting runtime changes, simplifying how promises resolve at render time...',
    contentBlocks: [
      {
        type: 'paragraph',
        value: 'React 19 has officially stabilized worldwide, bringing a massive shift in how we handle data transport across client-server barriers. The highlights center around the capability to unwrap promises inside rendering, unified form actions, and native useOptimistic states.'
      },
      {
        type: 'heading1',
        value: 'Mastering the new "use" API'
      },
      {
        type: 'paragraph',
        value: 'The new use utility allows us to load promises or context conditionally inside components. We can invoke it inside standard JSX loops, conditional blocks, or early returns, breaking previous Hook limitations.'
      },
      {
        type: 'code',
        value: `import { use } from 'react';

const fetchArticlesCount = fetch('/api/stats').then(res => res.json());

export function StatsDisplay() {
  const data = use(fetchArticlesCount);
  return (
    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
      <span className="text-sm font-semibold">Active Posts:</span>
      <span className="font-mono ml-2 text-blue-600">{data.count}</span>
    </div>
  );
}`,
        extra: 'typescript'
      },
      {
        type: 'heading2',
        value: 'How Form Actions Simplify Pending States'
      },
      {
        type: 'paragraph',
        value: 'No longer do you need multiple state booleans for loading, posting, and error variables inside form handles. React 19 introduces form action functions which trigger transition boundaries natively. Pair them with useFormStatus or useActionState to capture state seamlessly!'
      }
    ],
    category: 'Programming',
    tags: ['React19', 'JavaScript', 'WebDev', 'TypeScript', 'Vite'],
    authorId: 'user-admin',
    authorName: 'Faisal Abbas',
    authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
    publishDate: '2026-06-18',
    readingTime: '4 min read',
    views: 6512,
    likes: 541,
    likedBy: ['user-1', 'user-2', 'user-reader'],
    bookmarkedBy: ['user-1'],
    commentsCount: 2,
    status: 'published',
    reactions: { like: 390, heart: 80, fire: 50, brain: 21 }
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    articleId: 'art-1',
    authorName: 'William Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=80&auto=format&fit=crop&q=80',
    authorEmail: 'will@chen.me',
    content: 'Fascinating breakdown about multi-modal reasoning! Edge coprocessors are indeed the game changer for high-security applications like banking bots.',
    date: '2026-06-16',
    approved: true,
    isSpam: false
  },
  {
    id: 'comm-2',
    articleId: 'art-1',
    authorName: 'Mia Jorgensen',
    authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&auto=format&fit=crop&q=80',
    authorEmail: 'mia@jorg.dk',
    content: 'Love this perspective! I am currently working on local LLM compression tools and the latency reductions on Apple Neural Engine and Tensor units is stunning.',
    date: '2026-06-16',
    approved: true,
    isSpam: false
  },
  {
    id: 'comm-3',
    articleId: 'art-1',
    authorName: 'Spam Bot 99',
    authorAvatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=80&auto=format&fit=crop&q=80',
    authorEmail: 'spambot99@xyz-casino.ru',
    content: 'CLICK HERE TO SECURE CHIP PRIZES FAST WITHOUT VIRUS TODAY!',
    date: '2026-06-17',
    approved: false, // Pending moderation
    isSpam: true
  },
  {
    id: 'comm-4',
    articleId: 'art-2',
    authorName: 'Hana Tanaka',
    authorAvatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=80&auto=format&fit=crop&q=80',
    authorEmail: 'hana@tanaka.tokyo',
    content: 'Moving configuration variables to native CSS has reduced our bundle configuration files by thousands of redundant JSON lines. v4 is really elegant!',
    date: '2026-06-11',
    approved: true,
    isSpam: false
  },
  {
    id: 'comm-5',
    articleId: 'art-3',
    authorName: 'Roger Sterling',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
    authorEmail: 'roger@sterlingco.partners',
    content: 'Elena has laid out the cold, hard truths of late seed capital. Highly profitable bootstrapped frameworks are regaining absolute leverage.',
    date: '2026-06-09',
    approved: true,
    isSpam: false
  }
];
