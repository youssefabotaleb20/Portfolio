import useDecode from '../hooks/useDecode.js'
import useInView from '../hooks/useInView.js'

// Heading text that decodes when it scrolls into view. The real text stays
// in the accessible name so screen readers never hear the glyph noise.
export default function Decode({ text, as: Tag = 'span', className = '', duration = 800, delay = 0 }) {
  const [ref, inView] = useInView()
  const shown = useDecode(text, inView, { duration, delay })
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </Tag>
  )
}
