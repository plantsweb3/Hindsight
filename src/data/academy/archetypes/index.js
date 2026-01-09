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
import { scalperModule } from './scalper'
import { scalperQuizzes } from './scalper-quizzes'
import { impulseTraderModule } from './impulse-trader'
import { impulseTraderQuizzes } from './impulse-trader-quizzes'

// Export individual modules
export { narrativeFrontRunnerModule, narrativeFrontRunnerQuizzes }
export { diamondHandsModule, diamondHandsQuizzes }
export { lossAverseModule, lossAverseQuizzes }
export { copyTraderModule, copyTraderQuizzes }
export { technicalAnalystModule, technicalAnalystQuizzes }
export { fomoTraderModule, fomoTraderQuizzes }
export { scalperModule, scalperQuizzes }
export { impulseTraderModule, impulseTraderQuizzes }

// All archetype modules
export const archetypeModules = {
  'narrative-front-runner': narrativeFrontRunnerModule,
  'diamond-hands': diamondHandsModule,
  'loss-averse': lossAverseModule,
  'copy-trader': copyTraderModule,
  'technical-analyst': technicalAnalystModule,
  'fomo-trader': fomoTraderModule,
  'scalper': scalperModule,
  'impulse-trader': impulseTraderModule,
}

// All archetype quizzes
export const archetypeQuizzes = {
  'narrative-front-runner': narrativeFrontRunnerQuizzes,
  'diamond-hands': diamondHandsQuizzes,
  'loss-averse': lossAverseQuizzes,
  'copy-trader': copyTraderQuizzes,
  'technical-analyst': technicalAnalystQuizzes,
  'fomo-trader': fomoTraderQuizzes,
  'scalper': scalperQuizzes,
  'impulse-trader': impulseTraderQuizzes,
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

// Archetype-specific dot colors for module cards
export const ARCHETYPE_DOT_COLORS = {
  'narrative-front-runner': { filled: '#a855f7', hollow: '#a855f7' }, // purple
  'diamond-hands': { filled: '#3b82f6', hollow: '#3b82f6' },          // blue
  'loss-averse': { filled: '#22c55e', hollow: '#22c55e' },            // green
  'copy-trader': { filled: '#06b6d4', hollow: '#06b6d4' },            // cyan
  'technical-analyst': { filled: '#6366f1', hollow: '#6366f1' },      // indigo
  'fomo-trader': { filled: '#f97316', hollow: '#f97316' },            // orange
  'impulse-trader': { filled: '#eab308', hollow: '#eab308' },         // yellow
  'scalper': { filled: '#ef4444', hollow: '#ef4444' }                 // red
}

// Get dot color class for an archetype
export function getArchetypeDotClass(archetypeId) {
  const classMap = {
    'narrative-front-runner': 'dot-archetype-purple',
    'diamond-hands': 'dot-archetype-blue',
    'loss-averse': 'dot-archetype-green',
    'copy-trader': 'dot-archetype-cyan',
    'technical-analyst': 'dot-archetype-indigo',
    'fomo-trader': 'dot-archetype-orange',
    'impulse-trader': 'dot-archetype-yellow',
    'scalper': 'dot-archetype-red'
  }
  return classMap[archetypeId] || 'dot-archetype-purple'
}
