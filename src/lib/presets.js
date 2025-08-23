const modules = import.meta.glob('./presets/*.json', { eager: true })

export const presets = Object.values(modules).map((module) => module.default || module)
