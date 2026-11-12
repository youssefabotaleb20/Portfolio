// The six layers of the stack. Every colour on the site comes from here:
// a project or skill is tinted by the layer it belongs to.
export const LAYERS = [
  { id: 'frontend', name: 'Frontend', color: '#6ee7b7' },
  { id: 'mobile', name: 'Mobile', color: '#4fd1e8' },
  { id: 'backend', name: 'Backend', color: '#7aa2ff' },
  { id: 'ai', name: 'AI and data', color: '#e9d16f' },
  { id: 'data', name: 'Databases', color: '#f4a261' },
  { id: 'cloud', name: 'Cloud and DevOps', color: '#c8d1cc' },
]

export const layerColor = (id) => LAYERS.find((l) => l.id === id)?.color ?? '#b9b6c4'
