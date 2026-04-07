import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiNodedotjs,
  SiExpress, SiTailwindcss, SiPhp, SiPython, SiHtml5, SiCss,
  SiGit, SiGithub,
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa'

const ICONS = {
  SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiNodedotjs,
  SiExpress, SiTailwindcss, SiPhp, SiPython, SiHtml5,
  SiCss3: SiCss,
  SiGit, SiGithub, FaJava,
}

import { SKILLS } from '../data/skills.js'

export default function TechStack() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section id="skills" className="snap-section flex items-center" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 w-full py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold section-heading inline-block">
            Tech Stack
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl">
            Technologies I use to bring ideas to life — from UI to infrastructure.
          </p>
        </motion.div>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-6">
          {SKILLS.map((skill, i) => {
            const IconComponent = ICONS[skill.icon]
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.35, delay: i * 0.05, ease: 'backOut' }}
                className="flex flex-col items-center gap-2 group cursor-default"
              >
                <div
                  className="glass-card w-14 h-14 flex items-center justify-center skill-icon group-hover:border-white/20"
                  style={{ '--icon-color': skill.color }}
                >
                  {IconComponent ? (
                    <IconComponent
                      size={28}
                      style={{ color: skill.color }}
                    />
                  ) : (
                    <span className="text-xs text-gray-400">{skill.name}</span>
                  )}
                </div>
                <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                  {skill.name}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
