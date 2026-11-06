// PLANTILLA DE LECCIÓN POR BLOQUES - TEMA 3
const tema3 = {
  id: 'tema-3',
  title: 'Tema 3: Podemos comenzar todo de nuevo',
  image: 'img/tema-3.svg',
  keywords: ['conversión', 'pecado', 'obras de la carne', 'frutos del Espíritu', 'Dios'],

  blocks: [
    {
      type: 'text',
      style: 'lead',
      content: 'Hoy hablaremos de la CONVERSIÓN, pero para entender qué es conversión, en primer lugar es necesario comprender la tragedia del ser humano.'
    },
    {
      type: 'verses',
      refs: ['Efesios 2:3', 'Romanos 3:10', 'Salmos 58:3', 'Isaías 1:6']
    },
    {
      type: 'list',
      ordered: false,
      items: [
        '**Observa que:**',
        'Todos nacemos pecadores.',
        'Por ser pecadores, nacemos separados de Dios.',
        'La naturaleza egoísta sólo desea cosas malas.',
        'Ser pecador es vivir en los deseos de la carne.'
      ]
    },
    {
      type: 'callout',
      title: 'HOMBRE (pecador)',
      text: 'Mata, roba, miente, adultera, etc.'
    },
    {
      type: 'callout',
      title: 'Pecado',
      text: 'Separación de Dios'
    },
    {
      type: 'callout',
      title: 'DIOS',
      text: 'Es santo'
    },
    {
      type: 'question',
      id: 't3-q1',
      text: 'Básicamente, ¿Qué es pecado?',
      bibleRef: '1 Juan 3:4'
    },
    {
      type: 'text',
      content: 'Pecado es también transgresión de la ley, pero antes de eso es vivir separado de Dios.'
    },
    {
      type: 'verses',
      refs: ['Gálatas 5:19-23']
    },
    {
      type: 'text',
      style: 'lead',
      content: '**OBSERVA:**'
    },
    {
      type: 'text',
      content: [
        '**Obras de la carne:** Prostitución, impureza, lascivia, idolatría, hechicería, enemistad, contiendas, crimen, ira, disensiones, partidos, envidias, borracheras, orgías y cosas semejantes.',
        '**Frutos del Espíritu:** Amor, gozo, paz, longanimidad, benignidad, bondad, fidelidad, mansedumbre, etc.'
      ]
    },
{
      type: 'section',
      title: 'Percibe que:'
    },
    {
      type: 'text',
      style: 'quote',
      content: [
        'Las obras de la carne son frutos, resultado o consecuencia de vivir en el pecado.',
        ' El ser humano no es pecador porque mata. Él mata porque es pecador. Si no fuese pecador, no mataría.',
        'El problema del hombre no sólo es robar, matar o adulterar. Eso es el fruto de su problema. Su verdadero problema es ser un pecador, es decir, **vivir apartado de Dios.**']
      
    },

    {
      type: 'verses',
      refs: ['Marcos 10:17-22', 'Juan 3:1-6']
    },
    {
      type: 'question',
      id: 't3-q2',
      text: '¿Puede alguien estar separado de Dios y a pesar de eso vivir una vida de aparente obediencia?'
    },
    {
      type: 'question',
      id: 't3-q3',
      text: '¿Puede alguien sólo, mudar su conducta automáticamente?',
      bibleRef: 'Jeremías 13:23'
    },
    {
      type: 'text',
      style: 'quote',
      content:'Obediencia, Filosofia, Buenas obras, Moralismo'
    },    
    {
      type: 'text',
      content:'¿Nos conducen a Dios?'
    },
    {
      type: 'text',
      style: 'quote',
      content:'"Es imposible que escapemos nosotros mismos del hoyo del pecado en el que estamos sumidos. Nuestro corazón es malo, y no lo podemos cambiar."',
      cite:'El Camino a Cristo, página 18'
    },
    {
      type: 'question',
      id: 't3-q4',
      text: '¿Qué promesa maravillosa presenta la Biblia?',
      bibleRef: '2 Pedro 1:4'
    },
    {
      type: 'banner',
      text: ['Quiere decir que nacemos con la naturaleza pecaminosa, pero podemos volvernos participantes de la naturaleza divina.',
        'HOMBRE', 'CRISTO', 'DIOS',
      '"Todo aquel que cree que Jesús es el Cristo, es nacido de Dios" (1 Juan 5:1)'
      ]
    },
    {
type: 'question',
      id: 't3-q5',
      text: '¿Qué sucede después de la conversión?',
      bibleRef: '2 Corintios 5:17'
    },
    {
      type: 'text',
      style: 'lead',
      content: 'Resumiendo'
    },
    {
      type: 'text',
      style: 'quote',
      content: [
        'Todos nacemos pecadores y nos gusta vivir lejos de Dios haciendo cosas erróneas.',
        ' Nadie puede cambiar su conducta auténticamente por sus propios esfuerzos.',
        'La única solución es Cristo. Él puede convertirnos en buenas criaturas, con nuevos sentimientos, impulsos y acciones']
    },
    {
      type: 'decision',
      text: '¿Te gustaría ser una nueva criatura en Cristo y comenzar todo de nuevo?',
      checkboxLabel: 'ACEPTO'
    }
  ]
}

export default tema3