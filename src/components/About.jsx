import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ME } from '../data/me.js'

function Photo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="flex justify-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-48 h-56 md:w-80 md:h-96"
      >
        {/* Pulsing glow */}
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.92, 1.04, 0.92] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/40 to-cyan-400/40 blur-2xl -z-10"
        />

        {/* Gradient border frame */}
        <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-br from-purple-500 to-cyan-400">
          <div className="w-full h-full rounded-2xl overflow-hidden">
            <img
              src={ME.photo}
              alt={ME.name}
              className="w-full h-full object-cover object-top"
              draggable={false}
            />
          </div>
        </div>

        {/* Corner accent dots */}
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-cyan-400"
        />
        <motion.span
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-purple-500"
        />
      </motion.div>
    </motion.div>
  )
}

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="about" className="snap-section flex items-center" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 w-full py-20">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold section-heading inline-block md:pt-10">
            About Me
          </h2>
        </motion.div>

        {/* Two-column: photo + bio */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-10 md:mb-14 overflow-x-hidden">
          {inView && <Photo />}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-5 md:space-y-6"
          >
            <div className="space-y-4">
              {ME.bio.map((para, i) => (
                <p key={i} className={`leading-relaxed ${i === 0 ? 'text-gray-200 text-lg' : 'text-gray-400'}`}>
                  {i === 0 && (
                    <><span className="text-white font-semibold">{ME.name}</span>{' — '}</>
                  )}
                  {para}
                </p>
              ))}
            </div>

            {/* Trait pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {ME.traits.map((trait) => (
                <span
                  key={trait}
                  className="text-sm px-4 py-1.5 rounded-full border border-white/10 text-gray-400 bg-white/[0.03]"
                >
                  {trait}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats row — full width */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ME.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <div className="text-3xl font-black gradient-text-blue mb-1">{stat.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
