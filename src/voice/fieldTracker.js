// Recuerda el último campo de texto enfocado, porque al tocar el botón del micrófono
// en móvil el campo puede perder el foco antes de que llegue el dictado.
let lastField = null

export const isTextField = (el) =>
  !!el &&
  (el.tagName === 'TEXTAREA' ||
    (el.tagName === 'INPUT' && ['text', 'search', ''].includes(el.type)))

export function initFieldTracker() {
  document.addEventListener('focusin', (e) => {
    if (isTextField(e.target)) lastField = e.target
  })
}

export function getTargetField() {
  const active = document.activeElement
  if (isTextField(active)) return active
  if (lastField && lastField.isConnected) return lastField
  return null
}

// Inserta texto en la posición del cursor y avisa a React (evento "input").
export function insertAtCursor(el, text) {
  const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  const setValue = Object.getOwnPropertyDescriptor(proto, 'value').set
  const start = el.selectionStart ?? el.value.length
  const end = el.selectionEnd ?? el.value.length
  const before = el.value.slice(0, start)
  const after = el.value.slice(end)

  let piece = text
  if (!before.trim() || /[.!?¿¡]\s*$/.test(before)) piece = piece.charAt(0).toUpperCase() + piece.slice(1)
  if (before && !/\s$/.test(before)) piece = ' ' + piece
  if (after && !/^\s/.test(after)) piece += ' '

  setValue.call(el, before + piece + after)
  const pos = (before + piece).length
  el.setSelectionRange?.(pos, pos)
  el.dispatchEvent(new Event('input', { bubbles: true }))
}
