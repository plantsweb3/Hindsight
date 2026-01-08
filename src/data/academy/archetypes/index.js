// Archetype Modules
import { narrativeFrontRunnerModule } from './narrative-front-runner'
import { narrativeFrontRunnerQuizzes } from './narrative-front-runner-quizzes'

// Export individual modules
export { narrativeFrontRunnerModule, narrativeFrontRunnerQuizzes }

// All archetype modules
export const archetypeModules = {
  'narrative-front-runner': narrativeFrontRunnerModule,
}

// All archetype quizzes
export const archetypeQuizzes = {
  'narrative-front-runner': narrativeFrontRunnerQuizzes,
}

// Get module by archetype ID
export function getArchetypeModule(archetypeId) {
  return archetypeModules[archetypeId] || null
}

// Get quizzes by archetype ID
export function getArchetypeQuizzes(archetypeId) {
  return archetypeQuizzes[archetypeId] || null
}

// Get all available archetype IDs
export function getAvailableArchetypes() {
  return Object.keys(archetypeModules)
}

// Check if an archetype has a module
export function hasArchetypeModule(archetypeId) {
  return archetypeId in archetypeModules
}
