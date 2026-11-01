// Lección 1. Para editarla, cambia solo este archivo.
// `image`: ruta en public/img/ o URL (p. ej. Unsplash). `keywords` alimenta el buscador de la portada.

const tema1 = {
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
}

export default tema1
