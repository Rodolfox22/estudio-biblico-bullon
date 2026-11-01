// Lecciones del estudio. Para añadir una, agrega un objeto a este array.
// `image` puede ser una ruta local (public/img/...) o una URL (p. ej. Unsplash).
// `keywords` es opcional y se usa en el buscador de la portada.

export const lessons = [
  {
    id: 'tema-1',
    title: 'Tema 1: Dios te ama',
    image: 'img/tema-1.svg',
    keywords: ['amor', 'carácter de Dios', 'padre', 'hijos', 'gracia', 'misericordia'],
    sections: [
      {
        title: 'Hoy pensemos un poco en el maravilloso carácter de Dios',
        questions: [
          { id: 't1-s1-q1', text: '¿Cómo describe la Biblia el carácter de Dios?', bibleRef: '1 Juan 4:8' },
          { id: 't1-s1-q2', text: '¿Cómo trata Dios a quienes se equivocan?', bibleRef: 'Salmos 103:8-10' },
          { id: 't1-s1-q3', text: '¿Qué tan grande es el amor de Dios por ti?', bibleRef: 'Juan 3:16' }
        ]
      },
      {
        title: 'Recuerda: Dios quiere hijos, no esclavos',
        questions: [
          { id: 't1-s2-q1', text: '¿Qué tipo de relación desea Dios tener contigo?', bibleRef: 'Romanos 8:15' }
        ]
      },
      {
        title: '¿Has notado que nada nos puede separar del amor de Dios?',
        questions: [
          { id: 't1-s3-q1', text: '¿Qué cosas menciona Pablo que no podrán separarnos del amor de Dios?', bibleRef: 'Romanos 8:38-39' }
        ]
      }
    ],
    versesSection: ['Génesis 3:8-10', 'Jeremías 31:3', 'Efesios 2:4-5', 'Lam. 3:22-23'],
    decision: {
      text: 'Antes de continuar, ¿no te gustaría inclinar el rostro y agradecer a Dios tan grande amor?',
      checkboxLabel: 'Sí, quiero agradecer a Dios'
    }
  },
  {
    id: 'tema-2',
    title: 'Tema 2: El pecado nos aparta',
    image: 'img/tema-2.svg',
    keywords: ['pecado', 'ley', 'separación', 'perdón', 'arrepentimiento', 'culpa'],
    sections: [
      {
        title: '¿Qué es el pecado según la Biblia?',
        questions: [
          { id: 't2-s1-q1', text: '¿Cómo define la Biblia el pecado?', bibleRef: '1 Juan 3:4' },
          { id: 't2-s1-q2', text: '¿Quiénes han pecado y quedan lejos de la gloria de Dios?', bibleRef: 'Romanos 3:23' }
        ]
      },
      {
        title: 'Lo que pasa cuando nos apartamos de Dios',
        questions: [
          { id: 't2-s2-q1', text: '¿Qué produce el pecado entre Dios y nosotros?', bibleRef: 'Isaías 59:1-2' },
          { id: 't2-s2-q2', text: '¿Cuál es la paga del pecado y cuál es el regalo de Dios?', bibleRef: 'Romanos 6:23' }
        ]
      },
      {
        title: 'Dios no nos deja solos con nuestra culpa',
        questions: [
          { id: 't2-s3-q1', text: '¿Qué promete Dios a quien confiesa sus pecados?', bibleRef: '1 Juan 1:9' }
        ]
      }
    ],
    versesSection: ['Salmos 51:1-2', 'Isaías 1:18', 'Miqueas 7:18-19', 'Romanos 5:8'],
    decision: {
      text: 'Dios te ofrece perdón y un nuevo comienzo. ¿Quieres hablar con Él ahora y pedirle que limpie tu corazón?',
      checkboxLabel: 'Sí, quiero pedir perdón a Dios'
    }
  },
  {
    id: 'tema-3',
    title: 'Tema 3: La salvación en Cristo',
    image: 'img/tema-3.svg',
    keywords: ['salvación', 'Jesús', 'cruz', 'gracia', 'fe', 'redención', 'vida eterna'],
    sections: [
      {
        title: 'Jesús vino a buscarte',
        questions: [
          { id: 't3-s1-q1', text: '¿A qué vino Jesús al mundo?', bibleRef: 'Lucas 19:10' },
          { id: 't3-s1-q2', text: '¿Con qué propósito envió Dios a su Hijo?', bibleRef: 'Juan 3:16-17' }
        ]
      },
      {
        title: 'La salvación es un regalo',
        questions: [
          { id: 't3-s2-q1', text: '¿Por qué somos salvos: por lo que hacemos o por la gracia de Dios?', bibleRef: 'Efesios 2:8-9' },
          { id: 't3-s2-q2', text: '¿En quién se encuentra la salvación?', bibleRef: 'Hechos 4:12' }
        ]
      },
      {
        title: 'Vivir con la certeza de la salvación',
        questions: [
          { id: 't3-s3-q1', text: '¿Qué puede saber con seguridad quien tiene al Hijo de Dios?', bibleRef: '1 Juan 5:11-13' }
        ]
      }
    ],
    versesSection: ['Isaías 53:5', 'Juan 14:6', 'Romanos 10:9-10', 'Tito 3:5', 'Filipenses 1:6'],
    decision: {
      text: 'Jesús tocó a la puerta de tu corazón. ¿Quieres aceptarlo hoy como tu Salvador?',
      checkboxLabel: 'Sí, quiero aceptar a Jesús como mi Salvador'
    }
  }
]

export const getLesson = (id) => lessons.find((l) => l.id === id)

// "Tema 1: Dios te ama" -> { kicker: "Tema 1", headline: "Dios te ama" }
export function splitTitle(title) {
  const i = title.indexOf(':')
  return i === -1
    ? { kicker: '', headline: title }
    : { kicker: title.slice(0, i).trim(), headline: title.slice(i + 1).trim() }
}
