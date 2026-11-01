
import lesson1 from './lesson1'
import lesson2 from './lesson2'
import lesson3 from './lesson3'
import lesson4 from './lesson4'

// Reunir todas las lecciones
export const lessons = [
  lesson1,
  lesson2,
  lesson3,
  lesson4
]

// Obtener una lección por su ID
export const getLesson = (id) =>
  lessons.find((lesson) => lesson.id === id)

// Separar el número del título y su descripción
// "Tema 1: Dios te ama"
// { kicker: "Tema 1", headline: "Dios te ama" }

export function splitTitle(title) {
  const i = title.indexOf(':')

  return i === -1
    ? { kicker: '', headline: title }
    : {
        kicker: title.slice(0, i).trim(),
        headline: title.slice(i + 1).trim()
      }
}
