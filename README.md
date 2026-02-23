# 🐕 Ladrando Ideas — Sitio Web del Podcast

Sitio web oficial del podcast **Ladrando Ideas**. Estética cyberpunk/neon con player de Spotify, formulario de preguntas, dark/light mode y WhatsApp directo.

---

## 🚀 Correr en local

```bash
# 1. Instala dependencias
npm install

# 2. Corre el servidor
npm run dev

# 3. Abre en Chrome
http://localhost:3000
```

---

## 📁 Estructura

```
ladrando-ideas/
├── public/
│   └── index.html       ← toda la página (HTML + CSS + JS)
├── .gitignore
├── package.json
├── vercel.json          ← config de deploy
└── README.md
```

---

## 🌐 Deploy en Vercel

### Opción A — Desde GitHub (recomendado)
1. Sube este repo a GitHub
2. Ve a [vercel.com](https://vercel.com) → **Add New Project**
3. Importa tu repo de GitHub
4. Vercel detecta automáticamente que es un sitio estático
5. Click **Deploy** — listo en ~30 segundos
6. Cada `git push` hace deploy automático ✨

### Opción B — CLI directo
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 🔧 Subir a GitHub (primeros pasos)

```bash
# Dentro de la carpeta ladrando-ideas/
git init
git add .
git commit -m "🐕 Initial commit - Ladrando Ideas website"

# Crea un repo en github.com y luego:
git remote add origin https://github.com/TU_USUARIO/ladrando-ideas.git
git branch -M main
git push -u origin main
```

---

## ✏️ Pendientes de personalizar

| Qué | Estado |
|-----|--------|
| Spotify embed + links | ✅ `0So9xpkBJmSJrPwqkKh5Bp` |
| Instagram link | ✅ `@ladrandoideas` |
| TikTok link | ✅ `@ladrando.ideas` |
| WhatsApp | ✅ `3338155238` |
| TikTok video embed | ⏳ Pasa el link de un video para incrustarlo |
| Formulario preguntas | ⏳ Conectar a Formspree/Airtable |
| Newsletter | ⏳ Conectar a Formspree/Mailchimp |

### Conectar formularios con Formspree (gratis)
1. Ve a [formspree.io](https://formspree.io) → crea cuenta
2. Crea dos forms: uno para preguntas y uno para newsletter
3. En `index.html` busca `// FORM_ENDPOINT` y reemplaza el `setTimeout` con:
```js
fetch('https://formspree.io/f/TU_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ dato: valor })
})
.then(() => { /* mostrar éxito */ })
```

### Incrustar video de TikTok
En `index.html` busca `TU_VIDEO_ID` y reemplaza con el ID del video.
El ID está al final de la URL: `tiktok.com/@ladrando.ideas/video/7123456789012345678`
El embed usa: `https://www.tiktok.com/embed/v2/7123456789012345678`

---

## 🎨 Features incluidos

- 🌙☀️ **Dark/Light mode** — toggle en nav, persiste en localStorage
- 🐾 **Huellitas animadas** — una a la vez, efecto de pisada real con JS
- 🎵 **Spotify player** — show completo con todos los episodios
- 💬 **WhatsApp** — botón en nav + flotante con pulso
- 📱 **Responsive** — mobile first
- ✨ **Scroll reveal** — elementos aparecen al hacer scroll
- 🎙️ **Formulario de preguntas** — la audiencia manda temas para el pod
- 📬 **Newsletter** — captura de emails

---

## 🛠️ Stack

- HTML5 + CSS3 + JavaScript vanilla
- Google Fonts: Orbitron, Share Tech Mono, Rajdhani
- Sin frameworks, sin dependencias de runtime
- Deploy: Vercel (static)
