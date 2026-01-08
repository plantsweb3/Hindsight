// Archetype Modules
import { narrativeFrontRunnerModule } from './narrative-front-runner'
import { narrativeFrontRunnerQuizzes } from './narrative-front-runner-quizzes'
import { diamondHandsModule } from './diamond-hands'
import { diamondHandsQuizzes } from './diamond-hands-quizzes'
import { lossAverseModule } from './loss-averse'
import { lossAverseQuizzes } from './loss-averse-quizzes'
import { copyTraderModule } from './copy-trader'
import { copyTraderQuizzes } from './copy-trader-quizzes'
import { technicalAnalystModule } from './technical-analyst'
import { technicalAnalystQuizzes } from './technical-analyst-quizzes'
import { fomoTraderModule } from './fomo-trader'
import { fomoTraderQuizzes } from './fomo-trader-quizzes'

// Export individual modules
export { narrativeFrontRunnerModule, narrativeFrontRunnerQuizzes }
export { diamondHandsModule, diamondHandsQuizzes }
export { lossAverseModule, lossAverseQuizzes }
export { copyTraderModule, copyTraderQuizzes }
export { technicalAnalystModule, technicalAnalystQuizzes }
export { fomoTraderModule, fomoTraderQuizzes }

// All archetype modules
export const archetypeModules = {
  'narrative-front-runner': narrativeFrontRunnerModule,
  'diamond-hands': diamondHandsModule,
  'loss-averse': lossAverseModule,
  'copy-trader': copyTraderModule,
  'technical-analyst': technicalAnalystModule,
  'fomo-trader': fomoTraderModule,
}

// All archetype quizzes
export const archetypeQuizzes = {
  'narrative-front-runner': narrativeFrontRunnerQuizzes,
  'diamond-hands': diamondHandsQuizzes,
  'loss-averse': lossAverseQuizzes,
  'copy-trader': copyTraderQuizzes,
  'technical-analyst': technicalAnalystQuizzes,
  'fomo-trader': fomoTraderQuizzes,
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
