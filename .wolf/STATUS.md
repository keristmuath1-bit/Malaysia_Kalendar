---
description: session handoff, regenerate with /handoff when a quest finishes
budget_tokens: 1000
---
# STATUS — Kalendar Malaysia Web App

> Single source of truth for resuming work. Read this FIRST when starting a session.
> Last updated: 2026-10-04

---

## ✅ Done

- **Core Web Architecture:** Vite 8 + Vanilla JS + CSS responsive web app running on `http://localhost:5173/`.
- **Ad Removal:** 100% clean of all ads (AdMob, UnityAds, InMobi, Liftoff) and trackers.
- **Malaysian Data Engine:** Extracted all authentic 2026 data (National & state holidays, KPM School Holidays Group A & B, public servant paydays, pensions, Hijri dates, vertical Chinese lunar dates, Tamil dates, 12 Chinese Zodiac animals strip).
- **High-Definition Assets via `/chatgpt-page-generator`:**
  - `horse_racing@2x.png`: High-definition racing horse with jockey on pure transparent background.
  - `payday.png` & `payday_thumb.png`: 3D Malaysian Ringgit banknote stack and gold coins transparently cropped.
- **Festival & State Flag Icons:** 59 authentic transparent festival and state flag badges mapped to cell details.
- **School Holiday Highlight:** Yellow petak (`#fff59d` / `#fff275`) for school holidays with optimized high-contrast text.
- **Day Number Legibility:** Enlarged day labels (`2.35rem`, 900 font-weight) for effortless reading.
- **Column Alignment:** Sunday-to-Saturday columns matching physical Kalendar Kuda with accurate week numbering (Week 45-49 for Nov 2026).
- **URL Params Support:** Support `?month=11&year=2026&theme=kuda` for direct navigation and testing.
- **Responsive UI/UX Multi-Device Architecture:**
  - **Mobile Portrait (360px–540px) 100% Fit (Zero Horizontal Scroll):**
    - Removed min-width constraints (`min-width: 0 !important; width: 100% !important; table-layout: fixed !important;`).
    - Entire month (all 7 weekdays + 5/6 week columns) fits 100% of phone width without requiring horizontal scroll, matching physical Kalendar Kuda and Calendar2U reference design.
    - Proportional cell typography: large day numbers (`1.45rem`), vertical Chinese lunar dates (`0.52rem`), Hijri dates (`0.52rem`), Tamil dates (`0.46rem`), and racing horse / festival icons (`24px`).
    - Authentic Kalendar Kuda top header banner (`.kuda-banner-header`) showing Chinese lunar era (丙午年), English month & year (NOVEMBER 2026), and Islamic Hijri / Tamil month titles.
    - Clean empty cells for dates outside the active month, keeping user focus exclusively on current month dates.
    - Hidden scroll hints on portrait mobile since the view fits seamlessly without scrolling.
    - Mobile bottom-sheet drawer modal with top drag-indicator pill and touch drag-to-dismiss gesture (>80px pull down).
    - Touch swipe gesture detection for instant month-to-month navigation.
    - Symmetrical 4-column year pills (2024, 2025, 2026, 2027) and 2-column view toggles without text clipping.
    - Full-width 3-column theme switcher (🐴 Kuda, 🌙 Gelap, ☀️ Cerah).
    - Auto-centering active month pills via `scrollIntoView({ inline: 'center' })`.
  - **Tablet (601px–1024px):**
    - Full-width fixed-layout Kalendar Kuda table fitting tablet viewport cleanly without horizontal scroll.
    - Balanced 2-column adaptive layout for secondary views (Cuti Panjang, Cuti Sekolah, Jadual Gaji & Pencen).
    - Flexible salary tables container (`minmax(320px, 1fr)`) adapting cleanly to portrait and landscape orientations.
  - **Desktop (>1024px):**
    - Spacious multi-column typography, ultra-crisp authentic Kalendar Kuda table, and zero horizontal scroll.
  - **Touch Ergonomics (`pointer: coarse`):**
    - Enforced WCAG >=42px touch targets on all interactive buttons, pills, dropdowns, and active cell feedback.
- **Git & GitHub Repository:** Repository initialized, complete source committed and pushed to `https://github.com/keristmuath1-bit/Malaysia_Kalendar` on branch `main`.

---

## 🚀 Next phase

**Goal:** Implement user personal notes & memo storage, countdown timers for upcoming holidays, and printable A4 wall calendar export.

### Acceptance criteria
1. User can click any day cell, write a custom note/reminder, and persist it in `localStorage`.
2. A badge or indicator appears on cells that have user notes.
3. Countdown card showing days left until next public holiday or payday.
4. Export or print-friendly view for A4 wall calendar layout.

### Files to create / edit
| Type | File | Content |
|---|---|---|
| edit | `src/main.js` | Note persistence, reminder modal, countdown calculations |
| edit | `src/style.css` | Print styles (`@media print`), note indicator badges |
| new | `public/manifest.json` | PWA manifest for desktop/mobile install |

### Closed decisions
- **Vanilla Stack:** Kept 100% Vanilla JS/CSS for zero dependencies and sub-200ms load times.
- **Sunday-to-Saturday Layout:** Traditional Malaysian Kalendar Kuda columns start on Sunday (Row 0=Sun, Row 6=Sat).
- **Image Generation:** Only use `/chatgpt-page-generator` (Chromium + ChatGPT DALL-E) followed by Python subpixel alpha floodfill.

---

## 📁 Active architecture

- **Stack:** Vite, Vanilla JavaScript (ES2022+), Vanilla CSS, Python (PIL/scipy for image alpha processing).
- **Key files:** `index.html`, `src/main.js`, `src/style.css`, `public/festivals/`, `src/data/`.
- **Patterns:** State-driven rendering, CSS custom properties design tokens, zero external UI libraries.

---

## 🔧 Useful commands

```bash
# Run local dev server
npm run dev -- --host --port 5173

# Production build
npm run build

# OpenWolf scan
openwolf scan

# OpenWolf find symbol
openwolf find createKudaDayCell
```
