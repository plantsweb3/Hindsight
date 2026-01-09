// Trading 101 Module Exports
// Local data files for Trading 101 content

import { newcomerModule } from './newcomer'
import { apprenticeModule } from './apprentice'
import { apprenticeQuizzes, getApprenticeQuizByLessonSlug } from './apprentice-quizzes'
import { traderModule } from './trader'
import { traderQuizzes, getTraderQuizByLessonSlug } from './trader-quizzes'
import { specialistModule } from './specialist'
import { specialistQuizzes, getSpecialistQuizByLessonSlug } from './specialist-quizzes'
import { masterModule } from './master'
import { masterQuizzes, getMasterQuizByLessonSlug } from './master-quizzes'

// Export individual modules
export { newcomerModule }
export { apprenticeModule, apprenticeQuizzes, getApprenticeQuizByLessonSlug }
export { traderModule, traderQuizzes, getTraderQuizByLessonSlug }
export { specialistModule, specialistQuizzes, getSpecialistQuizByLessonSlug }
export { masterModule, masterQuizzes, getMasterQuizByLessonSlug }

// All Trading 101 modules
export const trading101Modules = {
  'newcomer': newcomerModule,
  'apprentice': apprenticeModule,
  'trader': traderModule,
  'specialist': specialistModule,
  'master': masterModule,
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
    // Use snake_case and return slug strings for navigation
    prev_lesson: lessonIndex > 0 ? module.lessons[lessonIndex - 1].slug : null,
    next_lesson: lessonIndex < module.lessons.length - 1 ? module.lessons[lessonIndex + 1].slug : null
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

// All Trading 101 quizzes
export const trading101Quizzes = {
  'apprentice': apprenticeQuizzes,
  'trader': traderQuizzes,
  'specialist': specialistQuizzes,
  'master': masterQuizzes,
}

// Get quiz for a specific Trading 101 lesson
export function getTrading101LessonQuiz(moduleSlug, lessonId) {
  const quizData = trading101Quizzes[moduleSlug]
  if (!quizData || !quizData.lessonQuizzes) return null

  const lessonQuiz = quizData.lessonQuizzes[lessonId]
  if (!lessonQuiz) return null

  // Transform to match Quiz component expected format
  return {
    title: lessonQuiz.lessonTitle || 'Lesson Quiz',
    lessonSlug: `trading101-${moduleSlug}-${lessonId}`,
    questions: lessonQuiz.questions.map(q => ({
      id: q.id,
      question: q.question,
      type: 'multiple-choice',
      options: q.options.map((opt, idx) =>
        typeof opt === 'string'
          ? { id: String.fromCharCode(97 + idx), text: opt }
          : opt
      ),
      correctAnswer: typeof q.correctAnswer === 'number'
        ? String.fromCharCode(97 + q.correctAnswer)
        : q.correctAnswer,
      explanation: q.explanation
    }))
  }
}

// Get final test for a Trading 101 module
export function getTrading101FinalTest(moduleSlug) {
  const quizData = trading101Quizzes[moduleSlug]
  if (!quizData || !quizData.finalTest) return null

  const finalTest = quizData.finalTest
  return {
    title: finalTest.title || 'Final Assessment',
    moduleSlug: `trading101-${moduleSlug}-final`,
    passingScore: finalTest.passingScore || 80,
    questions: finalTest.questions.map(q => ({
      id: q.id,
      question: q.question,
      type: 'multiple-choice',
      options: q.options.map((opt, idx) =>
        typeof opt === 'string'
          ? { id: String.fromCharCode(97 + idx), text: opt }
          : opt
      ),
      correctAnswer: typeof q.correctAnswer === 'number'
        ? String.fromCharCode(97 + q.correctAnswer)
        : q.correctAnswer,
      explanation: q.explanation
    }))
  }
}
