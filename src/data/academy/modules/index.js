// Trading 101 Module Exports
// Local data files for Trading 101 content

import { newcomerModule } from './newcomer'

// Export individual modules
export { newcomerModule }

// All Trading 101 modules
export const trading101Modules = {
  'newcomer': newcomerModule,
}

// Get module by slug
export function getTrading101Module(moduleSlug) {
  return trading101Modules[moduleSlug] || null
}

// Get lesson by module slug and lesson slug
export function getTrading101Lesson(moduleSlug, lessonSlug) {
  const module = trading101Modules[moduleSlug]
  if (!module) return null

  const lessonIndex = module.lessons.findIndex(l => l.slug === lessonSlug)
  if (lessonIndex === -1) return null

  const lesson = module.lessons[lessonIndex]
  return {
    ...lesson,
    module_slug: moduleSlug,
    module_title: module.title,
    module_icon: module.icon,
    reading_time: lesson.readTime,
    prevLesson: lessonIndex > 0 ? module.lessons[lessonIndex - 1] : null,
    nextLesson: lessonIndex < module.lessons.length - 1 ? module.lessons[lessonIndex + 1] : null
  }
}

// Check if a module has local data
export function hasLocalModule(moduleSlug) {
  return moduleSlug in trading101Modules
}

// Get all available module slugs with local data
export function getLocalModuleSlugs() {
  return Object.keys(trading101Modules)
}
