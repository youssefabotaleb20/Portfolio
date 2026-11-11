import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

// Headline that rises word by word from behind a mask when it scrolls in.
export function Words({ text, as: Tag = 'span', className = '', delay = 0, immediate = false, wordClass }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  const MotionTag = motion[Tag] ?? motion.span
  const view = immediate ? { animate: 'in' } : { whileInView: 'in', viewport: { once: true, margin: '0px 0px -12% 0px' } }
  return (
    <MotionTag className={className} aria-label={text} initial={reduce ? 'in' : 'out'} {...view} transition={{ staggerChildren: 0.07, delayChildren: delay }}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <span className="rv">
            <motion.span
              className={wordClass?.(w, i)}
              variants={{ out: { y: '112%', rotate: 5 }, in: { y: 0, rotate: 0 } }}
              transition={{ duration: 1, ease: EASE }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </MotionTag>
  )
}

// Block that fades up once when it scrolls in.
export function Rise({ children, className = '', delay = 0, as = 'div', y = 28, ...rest }) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] ?? motion.div
  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

export { EASE }
