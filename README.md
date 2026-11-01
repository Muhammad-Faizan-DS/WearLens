<div align="center">

# WearLens

### Try it on. Live.
**Point your camera. See the garment on you in real time.**

[**▶ Live demo**](https://wear-lens.vercel.app) · [**Try-on shop**](https://wear-lens.vercel.app/try-on/)

![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## ⚡ What's inside

| | Feature | Status |
|---|---|---|
| 🎥 | **Live try-on.** Your camera is streamed over WebRTC to Decart's Lucy VTON model, and the garment comes back on you in real time. | ✅ Working |
| 🛍️ | **Try-on shop** (`/try-on/`) with a product catalogue; pick a piece and it swaps onto you live. | ✅ Working |
| 🧵 | **Scroll-driven 3D landing page.** A Three.js shirt moves through the story as you scroll (GSAP + lazy-loaded 3D chunk). | ✅ Working |
| 🧑‍🎨 | **AI stylist** and **wardrobe** experience. | 🎨 Design prototype with sample content |
| 🏬 | **Embeddable try-on widget for stores.** | 🎨 Design prototype (the embed snippet is a placeholder) |

## 🔐 Built so the API key stays private

The browser never sees the permanent Decart key. A serverless function (`api/realtime-token.ts`) mints a **short-lived client token** that:

- expires in **60 seconds**
- works **only with the try-on model**
- caps a session at **3 minutes**, so one visitor can't run up the bill

## 🚀 Run it locally

```bash
git clone https://github.com/Muhammad-Faizan-DS/WearLens.git
cd WearLens
npm install
cp .env.example .env.local     # then set DECART_API_KEY (get one at platform.decart.ai)
npm run dev
```

Open **http://localhost:3000**, then go to **/try-on/** to use the live camera try-on. The code only reads `DECART_API_KEY`; the other keys in `.env.example` are left over from the project template.

Deploys to Vercel as-is (`vercel.json` is included). Add `DECART_API_KEY` under Project Settings → Environment Variables.

## 🧱 Stack

**React 19 · TypeScript · Vite · Tailwind CSS 4 · Three.js · GSAP · Decart realtime SDK · Vercel serverless**

## 📁 Project map

```
WearLens/
├── src/                  # landing page, 3D scenes, try-on shop UI
│   ├── components/       # LiveTryOn, TryOnProductPage, 3D scenes, sections
│   └── data/products.ts  # try-on catalogue (prices are placeholders)
├── try-on/index.html     # entry for the /try-on/ shop page
├── api/realtime-token.ts # mints short-lived Decart tokens
└── public/               # product shots and 3D models
```

## 🗺️ Next

- Photo-upload try-on
- Wire the stylist to a real model
- A genuine embeddable store widget

---

<div align="center">

Built by [**Muhammad Faizan**](https://github.com/Muhammad-Faizan-DS)

</div>
