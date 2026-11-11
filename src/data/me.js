// ─── Personal info ────────────────────────────────────────────
// Single source of truth for everything about Youssef. Mirrors the CV.

const base = import.meta.env.BASE_URL

export const ME = {
  name:      'Youssef Abotaleb',
  firstName: 'Youssef',
  lastName:  'Abotaleb',
  role:      'Full-stack software developer',
  focus:     'Web, mobile and cloud applications',
  city:      'Cairo, Egypt',
  photo:     `${base}me.webp`,
  cv:        `${base}Youssef_Abotaleb_CV.pdf`,

  intro:
    'I build web, mobile and cloud applications for clients worldwide, from the first screen to the last deploy.',

  // The CV's professional summary, in the first person.
  summary: [
    'I build responsive frontends with React and Next.js, cross-platform mobile apps with React Native, and backends and APIs with Node.js, Python (Django, FastAPI) and PHP.',
    'I ship with Docker, Kubernetes, GitHub Actions and Vercel, and add AI features such as chatbots and LLM integrations with the Claude and OpenAI APIs. I care about clean, maintainable, well-tested code.',
  ],

  experience: [
    {
      title: 'Freelance full-stack developer',
      scope: 'Web, mobile and cloud',
      org:   'Self-employed (Upwork, Fiverr, direct clients)',
      when:  '2024 to present',
      points: [
        'Built and launched the corporate website for United Group for Financial Consultations (unitedgroupeg.com) in Arabic and English with React, PHP and MySQL.',
        'Handled projects end to end, from UI/UX design and React or React Native frontends to Node.js, Python and PHP backends, databases and cloud deployment.',
      ],
    },
  ],

  education: [
    {
      title: 'Computer Science and Engineering',
      org:   'German University in Cairo (GUC)',
    },
    {
      title: 'IBM Full Stack Software Developer Professional Certificate',
      org:   'IBM via Coursera',
      note:  'Covered React, Node.js and Express, Python with Flask and Django, Docker, Kubernetes and OpenShift, microservices and serverless, and a full-stack capstone project.',
    },
  ],

  languages: [
    { name: 'Arabic', level: 'Native' },
    { name: 'English', level: 'Fluent' },
  ],

  // ─── Contact & social links ────────────────────────────────
  email:    'youssef.mohamed9666@gmail.com',
  github:   'https://github.com/youssefabotaleb20',
  linkedin: 'https://www.linkedin.com/in/youssef-abotaleb-996a7528a',
  upwork:   'https://www.upwork.com/freelancers/~0182b696a1456d9faa?mp_source=share',
  fiverr:   'https://www.fiverr.com/s/LdZ90ej',
}
