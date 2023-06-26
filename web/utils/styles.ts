import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../tailwind.config.js'

export const tailwind = resolveConfig(tailwindConfig as any)
