# CEREBRUM — Kalendar Malaysia Web App

## 👤 Developer Preferences
- **Stack:** 100% Vanilla JS + Vanilla CSS. Never install React/Tailwind/Vue unless explicitly requested.
- **Visuals:** Rich, authentic retro Malaysian aesthetic with high fidelity, modern glassmorphism touches, and flawless responsiveness.
- **Image Generation:** STRICTLY use `/chatgpt-page-generator` (Chromium + ChatGPT DALL-E) only. NEVER use native `generate_image` or Gemini Image.

## 🛑 Do-Not-Repeat (Bugs & Pitfalls)
- Do NOT use ISO Monday-based week calculation for Kalendar Kuda columns. Always use Sunday-to-Saturday columns (`d - dayOfWeek`), or Sunday 1st will get orphaned into the previous week.
- Ensure school holiday yellow background uses `!important` to override default cell backgrounds in all themes (`kuda`, `light`, `dark`).
- Keep day number font size large (`2.35rem`) with `font-weight: 900` for clear readability.

## 📋 Decision Log
- **2026-10-04:** Adopted Vite dev server at `http://localhost:5173/` as primary local web app target.
- **2026-10-04:** Extracted 59 authentic transparent festival and state flag badges from APK assets to `public/festivals/`.
- **2026-10-04:** Generated custom 3D Ringgit banknote and gold coins graphic via `/chatgpt-page-generator` and floodfilled into `public/festivals/payday.png`.
