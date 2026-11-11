// Grouped exactly like the CV's Core Expertise. `layer` ties a group to a
// plate of the stack (see layers.js); groups without one stay neutral.
export const SKILL_GROUPS = [
  { group: 'Frontend', layer: 'frontend', skills: ['React', 'Next.js', 'JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Framer Motion', 'React Router', 'TanStack Query', 'Responsive design', 'Multilingual sites with i18next', 'Figma', 'Sketch', 'SEO and web performance', 'Accessibility'] },
  { group: 'Mobile', layer: 'mobile', skills: ['React Native', 'Cross-platform iOS and Android apps', 'Push notifications', 'App Store and Google Play publishing'] },
  { group: 'Backend', layer: 'backend', skills: ['Node.js', 'Express', 'Python (Flask, Django, FastAPI)', 'PHP', 'REST APIs', 'OpenAPI and Swagger docs', 'Authentication (JWT, bcrypt, OAuth, cookie sessions)', 'API security (Helmet, rate limiting, Zod validation)', 'Microservices', 'Serverless functions', 'WebSockets', 'Stripe payments', 'Transactional email'] },
  { group: 'Databases', layer: 'data', skills: ['SQL', 'MySQL', 'MongoDB', 'MongoDB Atlas', 'TiDB Cloud', 'Django ORM', 'Mongoose'] },
  { group: 'Cloud and DevOps', layer: 'cloud', skills: ['Docker', 'Docker Compose', 'Kubernetes', 'Red Hat OpenShift', 'Istio', 'IBM Cloud', 'CI/CD', 'GitHub Actions', 'Scheduled jobs (cron)', 'Uptime monitoring', 'Vercel', 'Render', 'Firebase', 'GitHub Pages'] },
  { group: 'AI and data', layer: 'ai', skills: ['LLM integration (Claude and OpenAI APIs)', 'Claude tool use', 'Model Context Protocol (MCP) servers', 'Prompt engineering', 'AI chatbots', 'Generative AI', 'IBM Watson', 'Pandas', 'NumPy'] },
  { group: 'Testing and practice', skills: ['Unit testing (Vitest, pytest, Supertest)', 'React Testing Library', 'End-to-end testing with Playwright', 'API mocking (MSW)', 'Linting (ESLint, Ruff)', 'Agile and Scrum', 'Git and GitHub', 'Vite', 'Software development life cycle'] },
  { group: 'Other', skills: ['Java', 'Swift and Xcode', 'UI/UX design', 'Data visualisation'] },
  { group: 'Soft skills', skills: ['Problem solving', 'Fast learning', 'Attention to detail', 'Teamwork', 'Client communication'] },
]

// Services offered. `projects` lists project ids that show the service.
export const SERVICES = [
  { name: 'Web apps', layer: 'frontend', line: 'Fast, responsive React and Next.js sites and web apps.', projects: ['united-group', 'taskflow', 'lumen', 'essence', 'pulsar'] },
  { name: 'Mobile apps', layer: 'mobile', line: 'Cross-platform iOS and Android apps with React Native.', projects: [], pending: 'TaskFlow Mobile is in the works' },
  { name: 'Backend and APIs', layer: 'backend', line: 'Node.js, Python and PHP backends, documented REST APIs and databases.', projects: ['taskflow', 'cedar', 'quill', 'united-group'] },
  { name: 'Deployment and DevOps', layer: 'cloud', line: 'Docker, Kubernetes, CI/CD with GitHub Actions, and Vercel hosting.', projects: ['cedar', 'taskflow', 'lumen'] },
  { name: 'AI features', layer: 'ai', line: 'Chatbots and LLM features built on the Claude and OpenAI APIs.', projects: ['quill'] },
]
