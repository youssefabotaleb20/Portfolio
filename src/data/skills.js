// Grouped exactly like the CV's Core Expertise.
export const SKILL_GROUPS = [
  { group: 'Frontend', skills: ['React', 'Next.js', 'JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Framer Motion', 'Responsive design', 'Figma', 'SEO and web performance', 'Accessibility'] },
  { group: 'Mobile', skills: ['React Native', 'iOS and Android', 'Push notifications', 'App Store and Google Play publishing'] },
  { group: 'Backend', skills: ['Node.js', 'Express', 'Python (Flask, Django)', 'PHP', 'REST APIs', 'Microservices', 'Serverless', 'Stripe payments'] },
  { group: 'Databases', skills: ['SQL', 'MySQL', 'MongoDB', 'Django ORM'] },
  { group: 'Cloud and DevOps', skills: ['Docker', 'Kubernetes', 'OpenShift', 'Istio', 'IBM Cloud', 'CI/CD', 'GitHub Actions', 'Vercel', 'Render', 'Firebase', 'GitHub Pages'] },
  { group: 'AI and data', skills: ['LLM integration (Claude, OpenAI)', 'Prompt engineering', 'AI chatbots', 'Generative AI', 'IBM Watson', 'Pandas', 'NumPy'] },
  { group: 'Testing and practice', skills: ['Unit testing', 'React Testing Library', 'Agile and Scrum', 'Git and GitHub', 'Vite', 'SDLC'] },
  { group: 'Other', skills: ['Java', 'UI/UX design', 'Data visualisation'] },
]

// Services offered. `projects` lists project codes that show the service;
// an empty list means the proof project is still being built.
export const SERVICES = [
  { name: 'Web apps', line: 'Fast, responsive React and Next.js sites and web apps.', projects: ['YA100', 'YA101', 'YA102', 'YA103', 'YA104', 'YA105'] },
  { name: 'Mobile apps', line: 'Cross-platform iOS and Android apps with React Native.', projects: [] },
  { name: 'Backend and APIs', line: 'Node.js, Python and PHP backends, REST APIs and databases.', projects: ['YA100', 'YA105'] },
  { name: 'Deployment and DevOps', line: 'Docker, CI/CD with GitHub Actions, Vercel, Render and cloud hosting.', projects: [] },
  { name: 'AI features', line: 'Chatbots and LLM features built on the Claude and OpenAI APIs.', projects: [] },
]
