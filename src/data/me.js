// ─── Personal info ────────────────────────────────────────────
// Single source of truth for everything about Youssef.

const base = import.meta.env.BASE_URL

export const ME = {
  name:      'Youssef Abotaleb',
  firstName: 'Youssef',
  lastName:  'Abotaleb',
  role:      'Full-stack developer',
  focus:     'Web, mobile and cloud apps',
  city:      'Cairo, Egypt',
  photo:     `${base}me.webp`,
  cv:        `${base}Youssef_Abotaleb_CV.pdf`,

  intro:
    'I build web, mobile and cloud applications for clients worldwide: responsive React and Next.js frontends, React Native apps, and Node.js, Python and PHP backends.',

  bio: [
    "I'm a full-stack developer who cares as much about how a product feels as about how it is built. I handle projects end to end, from UI and UX design to the frontend, the backend, the database and the deployment.",
    'I studied Computer Science and Engineering at the German University in Cairo and hold the IBM Full Stack Software Developer Professional Certificate. I work directly with clients from the first brief to launch.',
  ],

  traits: ['Problem solving', 'Fast learning', 'Attention to detail', 'Teamwork', 'Client communication'],
  languages: ['Arabic, native', 'English, fluent'],

  education: [
    {
      title: 'Computer Science and Engineering',
      org:   'German University in Cairo (GUC)',
    },
    {
      title: 'IBM Full Stack Software Developer Professional Certificate',
      org:   'IBM via Coursera',
      note:  'React, Node.js and Express, Python with Flask and Django, Docker, Kubernetes and OpenShift, microservices, serverless, and a full-stack capstone.',
    },
  ],

  // ─── Contact & social links ────────────────────────────────
  email:    'youssef.mohamed9666@gmail.com',
  github:   'https://github.com/youssefabotaleb20',
  linkedin: 'https://www.linkedin.com/in/youssef-abotaleb-996a7528a',
  upwork:   'https://www.upwork.com/freelancers/~0182b696a1456d9faa?mp_source=share',
  fiverr:   'https://www.fiverr.com/s/LdZ90ej',
}
