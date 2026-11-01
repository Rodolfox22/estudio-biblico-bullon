export const KEYS = {
  config: 'bible_study_config',
  favorites: 'bible_study_favorites',
  verseCache: 'bible_study_verse_cache',
  translations: 'bible_study_translations',
  responses: (lessonId) => `bible_study_responses_${lessonId}`,
  decision: (lessonId, id) => (id ? `bible_study_decision_${lessonId}_${id}` : `bible_study_decision_${lessonId}`)
}

export function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false // cuota llena o almacenamiento bloqueado
  }
}

export function getLessonProgress(lesson) {
  const answers = read(KEYS.responses(lesson.id), {})
  const ids = lesson.blocks.filter((b) => b.type === 'question').map((q) => q.id)
  const answered = ids.filter((id) => (answers[id] || '').trim().length > 0).length
  const total = ids.length
  return { answered, total, pct: total ? Math.round((answered / total) * 100) : 0 }
}
