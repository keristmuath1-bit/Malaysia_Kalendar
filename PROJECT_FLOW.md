# 🧭 PROJECT FLOW & LIVING ARCHITECTURE: Kalendar Malaysia Web App

> **Status Semasa:** ✅ FASA AKTIF SELESAI (STABIL & DEV-READY)  
> **Tarikh Kemas Kini Terakhir:** 2026-10-04  
> **Direktori Projek:** `/Users/halimroslan/.gemini/antigravity-ide/scratch/malaysia-calendar-web`  
> **Fail Rujukan Utama:** [`index.html`](file:///Users/halimroslan/.gemini/antigravity-ide/scratch/malaysia-calendar-web/index.html), [`src/main.js`](file:///Users/halimroslan/.gemini/antigravity-ide/scratch/malaysia-calendar-web/src/main.js), [`src/style.css`](file:///Users/halimroslan/.gemini/antigravity-ide/scratch/malaysia-calendar-web/src/style.css)

---

## 1. 🎯 Ringkasan Eksekutif & Skop Projek
Kalendar Malaysia Web App merupakan versi web moden, bebas iklan, dan pantas bagi aplikasi Kalendar Kuda Malaysia yang popular. Aplikasi ini mengekstrak dan memelihara 100% data autentik budaya Malaysia (cuti umum, cuti negeri, cuti sekolah KPM, tarikh Hijriah, kalendar lunar Cina 农历, tarikh panchangam Tamil, jadual gaji penjawat awam, pencen, serta jadual lumba kuda) dengan visual retro Kalendar Kuda fizikal dan mod Grid responsif.

---

## 2. 📊 Status Fasa & Kemajuan Terkini

| Fasa | Nama Modul / Tugasan | Status | Catatan / Output |
| :---: | :--- | :---: | :--- |
| **Fasa 1** | Seni Bina Web App & Enjin Vite | ✅ Selesai | Struktur asas HTML5, Vanilla JS, CSS3, moden & responsif. |
| **Fasa 2** | Ekstraksi Data Autentik 2026 | ✅ Selesai | 100% data cuti umum, negeri, sekolah (KA & KB), gaji & pencen. |
| **Fasa 3** | Penyingkiran Iklan (Ad-Free) | ✅ Selesai | Sifar iklan, sifar pelacak, privasi 100% terjamin. |
| **Fasa 4** | Aset Kuda Lumba HD Telus | ✅ Selesai | Dijana via `/chatgpt-page-generator` & subpixel alpha floodfill. |
| **Fasa 5** | 59 Lencana Perayaan & Bendera Negeri | ✅ Selesai | Imej telus dipadankan mengikut data `imageName` perayaan. |
| **Fasa 6** | Ilustrasi Hari Gaji Telus 3D | ✅ Selesai | Timbunan wang RM100, RM50 & syiling emas telus tanpa latar. |
| **Fasa 7** | Petak Kuning Cuti Sekolah KPM | ✅ Selesai | Latar belakang petak kuning (`#fff59d`/`#fff275`) untuk cuti sekolah. |
| **Fasa 8** | Keterbacaan Nombor Hari (Enlarged) | ✅ Selesai | Saiz nombor dinaikkan ke `2.35rem` (900 weight) untuk kemudahan baca. |
| **Fasa 9** | Penjajaran Lajur Ahad-Sabtu & Minggu | ✅ Selesai | Lajur Ahad ke Sabtu selaras dengan penomboran minggu fizikal. |
| **Fasa 10** | Nota / Acara Pengguna & Storan Tempatan | 🔄 Sedang Berjalan | Penambahan modal nota & storan kalendar peribadi. |
| **Fasa 11** | PWA & Eksport PDF/PNG Cetakan Kalendar | ⏳ Akan Datang | Service Worker offline & eksport layout kalendar dinding A4. |

---

## 3. 🏛️ Seni Bina Teknikal & Peraturan Emas (Golden Invariants)

- **Stack Teknologi:** Vanilla JavaScript (ES2022+), Vanilla CSS (Custom Design System), Vite 8.3+, JSON Data Engine.
- **Golden Invariants Wajib:**
  1. **Sifar Framework Berat:** Kekalkan 100% Vanilla JS dan Vanilla CSS tanpa kebergantungan React/Vue/Tailwind yang melambatkan pemuatan.
  2. **100% Autentik Budaya Malaysia:** Setiap tarikh mesti memaparkan tarikh Masihi, Hijriah, Lunar Cina menegak, dan Tamil selaras tradisi Kalendar Kuda.
  3. **Petak Kuning Cuti Sekolah:** Mana-mana tarikh yang tergolong dalam cuti sekolah (Kumpulan A atau B) WAJIB diwarnakan latar belakang kuning hangat dengan teks kontras tinggi.
  4. **Aset Imej Telus Berkualiti Tinggi:** Semua ilustrasi (kuda lumba, perayaan, gaji) WAJIB mempunyai latar belakang telus (RGBA) dengan sempadan licin tanpa latar belakang putih keras.
  5. **Penjanaan Imej Eksklusif `/chatgpt-page-generator`:** Penjanaan aset grafik baharu hanya dibenarkan melalui Chromium + ChatGPT DALL-E pipeline.

---

## 4. 📁 Peta Fail & Aset Kritikal

- [`index.html`](file:///Users/halimroslan/.gemini/antigravity-ide/scratch/malaysia-calendar-web/index.html): Struktur markup semantik, bar navigasi, kawalan tema, modal interaktif, dan strip 12 zodiak Cina.
- [`src/main.js`](file:///Users/halimroslan/.gemini/antigravity-ide/scratch/malaysia-calendar-web/src/main.js): Enjin logik utama (render Kalendar Kuda, Grid Moden, filter cuti negeri, semakan cuti sekolah, jadual gaji, penukaran tema, sokongan URL params).
- [`src/style.css`](file:///Users/halimroslan/.gemini/antigravity-ide/scratch/malaysia-calendar-web/src/style.css): Sistem reka bentuk lengkap merangkumi tema Kuda Autentik, Mod Gelap, Mod Cerah, kad responsif, dan tipografi multi-skrip.
- [`public/festivals/`](file:///Users/halimroslan/.gemini/antigravity-ide/scratch/malaysia-calendar-web/public/festivals/): Direktori 59 aset lencana cuti umum, cuti negeri, dan ilustrasi gaji telus ([`payday.png`](file:///Users/halimroslan/.gemini/antigravity-ide/scratch/malaysia-calendar-web/public/festivals/payday.png)).
- [`public/horse_racing@2x.png`](file:///Users/halimroslan/.gemini/antigravity-ide/scratch/malaysia-calendar-web/public/horse_racing@2x.png): Aset lumba kuda definisi tinggi dengan latar belakang telus.
- [`src/data/`](file:///Users/halimroslan/.gemini/antigravity-ide/scratch/malaysia-calendar-web/src/data/): Pangkalan data tempatan JSON (kalendar, perayaan, cuti sekolah KPM KA & KB, jadual gaji & pencen).

---

## 5. 📝 Log Keputusan Teknikal (Decisions & Mini-ADRs)

- **2026-10-04 - Keputusan 1: Pemilihan Enjin Web Tempatan (Vite)**
  - *Konteks:* Pengguna mengalami isu pemasangan APK ("problem parsing package") dan memohon menukar projek kepada aplikasi web di localhost.
  - *Keputusan:* Menggunakan Vite + Vanilla JS untuk pemuatan sepantas kilat (<200ms) dan kemudahan hosting/akses rentas peranti.
- **2026-10-04 - Keputusan 2: Penjanaan Imej via ChatGPT DALL-E & Subpixel Alpha Floodfill**
  - *Konteks:* Imej kuda asal beresolusi rendah dan berlatar putih kotak kasar.
  - *Keputusan:* Menjana ilustrasi vektor/3D definisi tinggi menggunakan `/chatgpt-page-generator` di latar belakang pelayar Chrome, kemudian memprosesnya dengan skrip Python `scipy.ndimage` untuk menghasilkan PNG telus 100% bersempadan licin.
- **2026-10-04 - Keputusan 3: Penjajaran Lajur Minggu Ahad-ke-Sabtu**
  - *Konteks:* Standard Kalendar Kuda memaparkan Ahad sebagai baris pertama (Row 0), menyebabkan minggu ISO Isnin-Ahad mengalihkan tarikh 1 November ke minggu sebelumnya.
  - *Keputusan:* Melaksanakan `getKudaWeekNumber` berasaskan lajur Ahad-ke-Sabtu, menyelaraskan penomboran minggu (Week 45 hingga Week 49) tepat seperti kalendar cetakan fizikal.

---

## 6. ⏭️ Tindakan Seterusnya (Next Action Items)

- [ ] Menambah pengurusan nota peribadi dan penggera tarikh dalam storan tempatan (LocalStorage).
- [ ] Menambah butang cetak / eksport ke PDF kalendar dinding format A4.
- [ ] Mendaftarkan Service Worker dan Web Manifest untuk sokongan PWA (Progressive Web App).
- [ ] Melaksanakan sokongan widget cuaca atau waktu solat pilihan bagi melengkapkan ekosistem kalendar tempatan.
