// Archetype modules and lessons data
// Imports real content from archetype modules

import { archetypeModules, archetypeQuizzes } from '../../data/academy/archetypes'

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
        id: lesson.id, // Preserve original lesson ID for quiz matching
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.description || '',
        content: lesson.content || '',
        readTime: lesson.readTime || 5,
        xp: lesson.xp || 100,
        order: index + 1
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

// Get quiz for a specific archetype lesson
export function getArchetypeLessonQuiz(archetypeId, lessonId) {
  const quizData = archetypeQuizzes[archetypeId]
  if (!quizData || !quizData.lessonQuizzes) return null

  const lessonQuiz = quizData.lessonQuizzes[lessonId]
  if (!lessonQuiz) return null

  // Transform to match Quiz component expected format
  return {
    title: lessonQuiz.lessonTitle || lessonQuiz.title || 'Lesson Quiz',
    lessonSlug: `archetype-${archetypeId}-${lessonId}`,
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

// Get final test for an archetype module
export function getArchetypeFinalTest(archetypeId) {
  const quizData = archetypeQuizzes[archetypeId]
  if (!quizData || !quizData.finalTest) return null

  const finalTest = quizData.finalTest
  return {
    title: finalTest.title || 'Final Assessment',
    moduleSlug: `archetype-${archetypeId}-final`,
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
