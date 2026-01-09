// Archetype modules and lessons data
// Imports real content from archetype modules

import { archetypeModules } from '../../data/academy/archetypes'

// Map archetype modules to the structure expected by components
export const ARCHETYPE_MODULES = Object.fromEntries(
  Object.entries(archetypeModules).map(([key, module]) => [
    key,
    {
      id: module.id,
      title: module.name,
      subtitle: module.tagline?.toUpperCase() || '',
      description: module.description,
      icon: module.icon,
      lessons: module.lessons.map((lesson, index) => ({
        id: index + 1,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.description || '',
        content: lesson.content || '',
        readTime: lesson.readTime || 5,
        xp: lesson.xp || 100
      }))
    }
  ])
)

// Get archetype module by ID
export function getArchetypeModule(archetypeId) {
  return ARCHETYPE_MODULES[archetypeId] || null
}

// Get archetype lesson by module ID and lesson slug
export function getArchetypeLesson(archetypeId, lessonSlug) {
  const module = ARCHETYPE_MODULES[archetypeId]
  if (!module) return null

  const lessonIndex = module.lessons.findIndex(l => l.slug === lessonSlug)
  if (lessonIndex === -1) return null

  const lesson = module.lessons[lessonIndex]
  return {
    ...lesson,
    moduleId: archetypeId,
    moduleTitle: module.title,
    moduleIcon: module.icon,
    prevLesson: lessonIndex > 0 ? module.lessons[lessonIndex - 1] : null,
    nextLesson: lessonIndex < module.lessons.length - 1 ? module.lessons[lessonIndex + 1] : null
  }
}

// Get all archetype modules as array (for listing)
export function getAllArchetypeModules() {
  return Object.values(ARCHETYPE_MODULES).map(m => ({
    id: m.id,
    title: m.title,
    subtitle: m.subtitle,
    description: m.description,
    icon: m.icon,
    lessonCount: m.lessons.length
  }))
}
