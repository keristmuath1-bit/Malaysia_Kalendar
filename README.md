# 🇲🇾 Kalendar Malaysia Web App (Kalendar Kuda Digital)

Aplikasi web kalendar komuniti Malaysia moden berasaskan reka bentuk klasik **Kalendar Kuda**, 100% bebas daripada iklan dan penjejak privasi. Dibina khusus dengan reka bentuk autentik budaya tempatan, memaparkan empat sistem kalendar serentak, cuti umum mengikut negeri, cuti sekolah KPM, jadual gaji penjawat awam, dan tarikh perlumbaan kuda.

---

## ✨ Ciri-Ciri Utama

1. **Sistem 4 Kalendar Serentak:**
   - 📅 **Kalendar Masihi** (Nombor tarikh besar, mudah dibaca)
   - 🌙 **Kalendar Hijriah** (Tarikh & bulan Islam)
   - 🏮 **Kalendar Lunar Cina** (Tarikh bulan Cina & zodiak)
   - 🪔 **Kalendar Tamil** (Tarikh tradisi India)

2. **Cuti Sekolah KPM (Petak Kuning Autentik):**
   - Tarikh cuti sekolah diwarnakan dengan latar belakang kuning khas sama seperti kalendar fizikal sebenar (Kumpulan A & Kumpulan B).

3. **Cuti Umum & Perayaan (59 Lencana Transparan HD):**
   - Paparan ikon bendera negeri dan perayaan tradisi yang dipotong kemas tanpa latar belakang.
   - Boleh ditapis mengikut negeri di seluruh Malaysia.

4. **Jadual Gaji & Pencen Penjawat Awam:**
   - Penanda tarikh bayaran emolumen bulanan kerajaan & pesara dengan ilustrasi 3D wang Ringgit Malaysia & syiling emas telus berkualiti tinggi.

5. **Jadual Lumba Kuda (Race Fixtures):**
   - Ikon joki resolusi tinggi menandakan lokasi perlumbaan hujung minggu (Selangor Turf Club, Penang Turf Club, Perak Turf Club).

6. **Pelbagai Mod & Tema Paparan:**
   - 🐎 **Tema Kuda Autentik:** Warna kertas retro dengan teks merah/hijau/hitam tradisional.
   - 🌙 **Mod Gelap (Dark Mode):** Selesa untuk mata pada waktu malam.
   - ☀️ **Mod Cerah (Light Mode):** Paparan bersih dan moden.
   - 🔄 **Dwi-Gaya:** Mod Kalendar Kuda Klasik & Mod Grid Moden.

---

## 🛠️ Teknologi & Seni Bina

- **Teras:** 100% Vanilla JavaScript (ES Modules) & Vanilla CSS3.
- **Peralatan Pembangunan:** [Vite](https://vitejs.dev/) untuk build ultra-pantas (<150ms).
- **Storan Data Tempatan:** `localStorage` untuk simpanan pilihan tema & negeri pengguna.
- **Privasi:** Tiada analitik, tiada kuki pihak ketiga, tiada SDK iklan (bebas AdMob/telemetri).

---

## 🚀 Cara Pemasangan & Menjalankan Projek

### 1. Prasyarat
Pastikan anda telah memasang **Node.js** (versi 18 ke atas disyorkan).

### 2. Klon Repositori
```bash
git clone https://github.com/keristmuath1-bit/Malaysia_Kalendar.git
cd Malaysia_Kalendar
```

### 3. Pasang Dependensi
```bash
npm install
```

### 4. Jalankan Pelayan Pembangunan Tempatan
```bash
npm run dev
```
Buka pelayar web di `http://localhost:5173`.

### 5. Bina untuk Pengeluaran (Production Build)
```bash
npm run build
```
Fail pengeluaran sedia untuk dihoskan (Netlify, Vercel, GitHub Pages, Firebase) akan dijana dalam folder `dist/`.

---

## 📂 Struktur Direktori

```text
├── public/
│   ├── data/             # Fail JSON data cuti, kalendar lunar, hijriah, & jadual gaji
│   ├── festivals/        # 59 lencana perayaan & ilustrasi 3D telus
│   └── horse_racing.png  # Ikon joki lumba kuda
├── src/
│   ├── data/             # Sumber data modular
│   ├── style.css         # Reka bentuk visual & tema kalendar kuda
│   └── main.js           # Logik penjanaan kalendar, penapis, & interaktiviti
├── PROJECT_FLOW.md       # Aliran kerja & seni bina teknikal lengkap
├── ROADMAP.md            # Perancangan masa depan & fasa pembangunan
└── index.html            # Antara muka utama aplikasi
```

---

## 📄 Lesen & Hak Cipta
Hak cipta terpelihara © 2026. Dibangunkan untuk komuniti Malaysia dengan ❤️.
