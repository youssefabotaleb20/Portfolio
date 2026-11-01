import { motion } from 'framer-motion'
import { SKILL_GROUPS } from '../data/skills.js'

// Laid out as a bill of materials: group, parts, quantity.
export default function Skills() {
  return (
    <section id="skills" className="border-t border-rule bg-ink text-ground">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-8 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(40px,6vw,88px)] font-extrabold leading-[0.88] tracking-[-0.03em]">
            Bill of materials
          </h2>
          <p className="mono text-[#9aa5b1]">Grouped exactly as on my CV</p>
        </div>

        <div className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="mono border-b border-[#3a4552] text-[#9aa5b1]">
                <th scope="col" className="w-[22%] py-3 pr-6 font-normal">Group</th>
                <th scope="col" className="py-3 pr-6 font-normal">Parts</th>
                <th scope="col" className="w-20 py-3 text-right font-normal">Qty</th>
              </tr>
            </thead>
            <tbody>
              {SKILL_GROUPS.map((g, i) => (
                <motion.tr
                  key={g.group}
                  initial={{ opacity: 0.2 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-8% 0px' }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="group border-b border-[#26303b] align-baseline"
                >
                  <th scope="row" className="py-5 pr-6 font-display text-[22px] font-bold leading-tight transition-colors group-hover:text-cut">
                    {g.group}
                  </th>
                  <td className="py-5 pr-6 text-[16px] leading-relaxed text-[#c9d0d8]">
                    {g.skills.join('  ·  ')}
                  </td>
                  <td className="mono tabular py-5 text-right text-cut">{String(g.skills.length).padStart(2, '0')}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
