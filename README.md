# Estudio Bíblico (PWA)

Estudio bíblico interactivo: lecciones con preguntas, versículos en ventana emergente, respuestas que se guardan solas, favoritos, comandos de voz y funcionamiento sin conexión.

**Stack:** React + Vite (JavaScript) · Tailwind CSS · `vite-plugin-pwa` · `localStorage` · Web Speech API.

## Ejecutar

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # genera /dist (con service worker y manifest)
npm run preview    # prueba la versión de producción
```

> El service worker (instalación y offline) solo se activa en la versión de producción (`build` + `preview`), no en `npm run dev`.

## Fuente de los versículos (importante)

`bible-api.com` (Tim Morgan) **no incluye ninguna versión en español**: solo inglés, latín, portugués, rumano, etc. Por eso la app usa la **Free Use Bible API de AO Lab** (`https://bible.helloao.org/api`), que no necesita clave y sí tiene versiones en español.

- Versión por defecto: **Reina-Valera 1909** (`spa_r09`).
- **RVR1960 no está disponible**: tiene derechos de autor (Sociedades Bíblicas Unidas) y esta API solo sirve textos libres. La app lo avisa en la ventana del versículo y en Configuración.
- El menú de versiones se llena solo con las versiones en español que la API ofrezca (`available_translations.json`) y se guarda para uso offline.
- Si quieres cambiar de API, todo está aislado en `src/lib/bible.js`.

## Cómo funciona

| Tema | Dónde |
|---|---|
| Lecciones (editables) | `src/data/lessons.js` |
| Libros bíblicos y abreviaturas en español | `src/data/books.js` |
| Interpretación de citas (`Lam. 3:22-23`, `Juan 3 16`…) | `src/lib/reference.js` |
| API + caché de versículos | `src/lib/bible.js` |
| Comandos y dictado por voz | `src/voice/` y `src/components/VoiceControl.jsx` |
| Temas de color (3 paletas × claro/oscuro) | `src/index.css` |

**Claves de `localStorage`:** `bible_study_responses_<idLección>`, `bible_study_decision_<idLección>`, `bible_study_favorites`, `bible_study_config`, `bible_study_verse_cache`, `bible_study_translations`.

**Añadir una lección:** agrega un objeto a `lessons` con `id`, `title`, `image`, `sections`, `versesSection` y `decision`. La imagen puede ser una ruta en `public/img/` o una URL (por ejemplo de Unsplash).

## Comandos de voz

Toca el micrófono flotante (se pide permiso la primera vez). Funciona en **Chrome, Edge y Safari recientes**; Firefox no incluye reconocimiento de voz. El reconocimiento necesita internet.

- **Dictado:** toca una respuesta y habla; el texto se inserta donde está el cursor.
- Una frase es **comando solo si es exactamente el comando**; cualquier otra cosa se dicta.

| Di… | Hace… |
|---|---|
| “Siguiente” / “Siguiente pregunta” | Enfoca la siguiente pregunta |
| “Anterior” | Enfoca la pregunta anterior |
| “Ir a lección 2” / “Ir a lección el pecado nos aparta” | Abre esa lección |
| “Abrir versículo Juan 3:16” (también “Juan tres dieciséis”) | Abre el versículo |
| “Cerrar” | Cierra la ventana del versículo |
| “Volver al inicio” | Va a la portada |
| “Favoritos” | Abre tus favoritos |

## Uso sin conexión

- La app, las fuentes y las imágenes locales se guardan con el service worker.
- Los versículos que consultes quedan guardados en el dispositivo.
- En **Configuración → Descargar versículos** se bajan de una vez todas las citas de las lecciones en la versión elegida.
- Los favoritos guardan el texto al marcarlos.

## Desplegar en GitHub Pages

1. Crea el repositorio en GitHub (por ejemplo `estudio-biblico`) y sube el código.
2. En `package.json`, cambia `/estudio-biblico/` del script `deploy` por el nombre exacto de tu repositorio (con barras al inicio y al final).
3. Ejecuta:

   ```bash
   npm run deploy
   ```

   Esto compila con `BASE_PATH` y publica `dist` en la rama `gh-pages`.
4. En GitHub: **Settings → Pages → Branch: `gh-pages` / root**.
5. Tu app quedará en `https://TU-USUARIO.github.io/estudio-biblico/`.

Para otros hosts en la raíz del dominio (Netlify, Vercel, Cloudflare Pages) basta con `npm run build` y publicar `dist`. La navegación usa `#/` (hash), así que no hace falta configurar redirecciones.

## Personalizar

- **Colores:** variables CSS por tema en `src/index.css`.
- **Iconos de la app:** `public/icons/` (192, 512 y maskable) y `public/favicon.svg`.
- **Nombre y colores del manifest:** `vite.config.js`.
