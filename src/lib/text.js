// Normaliza texto para comparar: minúsculas, sin tildes, sin puntuación (conserva : , . -)
export function normalize(str = '') {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9:,.\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const UNITS = {
  cero: 0, uno: 1, una: 1, un: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9,
  diez: 10, once: 11, doce: 12, trece: 13, catorce: 14, quince: 15, dieciseis: 16, diecisiete: 17,
  dieciocho: 18, diecinueve: 19, veinte: 20, veintiuno: 21, veintiun: 21, veintidos: 22, veintitres: 23,
  veinticuatro: 24, veinticinco: 25, veintiseis: 26, veintisiete: 27, veintiocho: 28, veintinueve: 29
}
const TENS = { treinta: 30, cuarenta: 40, cincuenta: 50, sesenta: 60, setenta: 70, ochenta: 80, noventa: 90 }
const ORDINALS = { primero: 1, primera: 1, segundo: 2, segunda: 2, tercero: 3, tercera: 3 }

// "juan tres dieciseis" -> "juan 3 16"; "treinta y uno" -> "31"
export function wordsToDigits(text) {
  const tokens = normalize(text).split(' ')
  const out = []
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (t in TENS) {
      if (tokens[i + 1] === 'y' && tokens[i + 2] in UNITS && UNITS[tokens[i + 2]] < 10) {
        out.push(String(TENS[t] + UNITS[tokens[i + 2]]))
        i += 2
      } else out.push(String(TENS[t]))
    } else if (t in UNITS) out.push(String(UNITS[t]))
    else if (t in ORDINALS) out.push(String(ORDINALS[t]))
    else out.push(t)
  }
  return out.join(' ')
}
