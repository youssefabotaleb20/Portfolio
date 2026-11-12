// The six layers of the stack. Every colour on the site comes from here:
// a project or skill is tinted by the layer it belongs to.
export const LAYERS = [
  { id: 'frontend', name: 'Frontend', color: '#f6c58f' },
  { id: 'mobile', name: 'Mobile', color: '#f39c8c' },
  { id: 'backend', name: 'Backend', color: '#e283b4' },
  { id: 'ai', name: 'AI and data', color: '#a98bf0' },
  { id: 'data', name: 'Databases', color: '#6fa3f7' },
  { id: 'cloud', name: 'Cloud and DevOps', color: '#6fd6cf' },
]

export const layerColor = (id) => LAYERS.find((l) => l.id === id)?.color ?? '#b9b6c4'
