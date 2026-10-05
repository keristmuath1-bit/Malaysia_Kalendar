# 🗺️ ROADMAP: Kalendar Malaysia Web App

> **Visi Projek:** Menjadi aplikasi web kalendar komuniti Malaysia #1 yang paling pantas, autentik, bebas iklan, dan sarat dengan nilai visual budaya tempatan.

---

## 🏁 Milestone 1: Pembangunan Teras & Penyingkiran Iklan (v1.0) — ✅ SELESAI
- [x] Pengekstrakan data APK: cuti umum, cuti negeri, cuti sekolah KPM KA & KB, tarikh lunar & hijriah.
- [x] Pembersihan menyeluruh 100% daripada kod iklan (Google AdMob, UnityAds, InMobi, Liftoff) & telemetri.
- [x] Pembinaan UI dwi-mod: Kalendar Kuda retro autentik & Kalendar Grid Moden.
- [x] Sistem 3 tema warna: Tema Kuda (Kertas Autentik), Mod Gelap (Dark Mode), dan Mod Cerah (Light Mode).
- [x] Penapis cuti mengikut negeri di Malaysia (Johor, Kedah, Kelantan, Melaka, Negeri Sembilan, Pahang, Perak, Perlis, Pulau Pinang, Sabah, Sarawak, Selangor, Terengganu, WP KL, WP Labuan, WP Putrajaya).

---

## 🎨 Milestone 2: Peningkatan Visual & Ilustrasi Autentik (v1.1) — ✅ SELESAI
- [x] Penjanaan grafik lumba kuda joki definisi tinggi berlatar belakang telus via `/chatgpt-page-generator`.
- [x] Penjanaan ilustrasi hari gaji 3D Ringgit Malaysia & syiling emas telus berkualiti tinggi.
- [x] Pengekstrakan dan penyepaduan 59 ikon lencana perayaan & bendera negeri berlatar telus.
- [x] Pewarnaan petak kuning autentik untuk semua tarikh Cuti Sekolah KPM.
- [x] Pembesaran saiz label nombor hari (2.35rem, weight 900) bagi keterbacaan maksimum.
- [x] Penjajaran lajur jadual Ahad-ke-Sabtu dan formula penomboran minggu fizikal.

---

## 📱 Milestone 2.5: Optimasi Mobile & Strip Zodiak Tradisional (v1.1.5) — ✅ SELESAI
- [x] Pembetulan sifar overflow pill bulan (padding 15px simetri, `flex: 0 0 auto`, `min-width: max-content`).
- [x] Drawer togol autohide kawalan sekunder (`#toggleFilterBtn` & `#toolbarCollapsible`) menjimatkan ~175px ruang menegak mobile.
- [x] Penunjuk titik aktif `#filterActiveDot` apabila penapis carian atau tahun bukan lalai dipilih.
- [x] Strip 12 Zodiak & Umur Cina ultra-minimalis (~90px tinggi, lebar 68px/kolum) berasaskan rujukan cetakan Kalendar Kuda sebenar.
- [x] Grid 3-baris nombor monospaced dwi-kolum (`年 岁 年 岁`), sorotan kuning cerah `#ffea00` pada Kuda 2026, dan auto-centering interaktif.
- [x] Validasi visual rentas peranti (Mobile 390px, 500px, Tablet 820px, Desktop) dengan sifar ralat konsol.

---

## 📝 Milestone 3: Produktiviti & Acara Peribadi (v1.2) — 🔄 AKTIF
- [ ] Sistem catatan nota harian dan senarai peringatan tersimpan di pelayar (LocalStorage).
- [ ] Pengiraan baki hari (*countdown timer*) ke cuti perayaan terdekat atau hari gaji seterusnya.
- [ ] Notifikasi pelayar (Web Push / Local Notification) untuk tarikh penting dan hari gaji.

---

## 🖨️ Milestone 4: Cetakan & Keupayaan Luar Talian (v2.0) — ⏳ AKAN DATANG
- [ ] Mod Cetak Kalendar Dinding Format A4 (PDF / Gambar Resolusi Tinggi).
- [ ] PWA (Progressive Web App): Pemasangan terus ke desktop atau telefon pintar tanpa Play Store.
- [ ] Mod Luar Talian (Offline Mode) dengan Service Worker caching.
