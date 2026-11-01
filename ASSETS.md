# ASSETS.md — Daftar aset & sumbernya

Semua aset di repo ini berasal dari **milik pemilik portofolio sendiri** (Adinda Wira Zahra Tsabitah) atau dibuat sendiri untuk proyek ini. Tidak ada gambar, foto, ikon, atau mockup pihak ketiga yang disalin dari internet, Dribbble, atau situs lain.

---

## 1. Aset dari pemilik (via `PORTO BITI.pdf`)

Sumber: `PORTO BITI.pdf` (13 slide, 1440×810, dibuat di Canva oleh pemilik) yang diletakkan di root project.
Semua gambar di bawah diekstrak dari PDF tersebut, lalu dipotong, dikomposisi ulang, dan dikonversi ke WebP oleh skrip build aset. **Tidak ada yang diunduh dari sumber luar.**

| Aset hasil | Sumber di PDF | Perlakuan |
|---|---|---|
| `public/images/adinda-hero.webp` | hal. 1 — foto studio berlatar putih (1600×2400) | Background putih di-*key out* (flood-fill dari tepi, toleransi 236) sehingga menghasilkan alpha asli, lalu crop 4:5 dan resize 1120×1400. Konversi WebP q88 → **104 KB** |
| `public/images/adinda-hero-mobile.webp` | idem | Resize 720×900, WebP q86 → **54 KB** |
| `public/images/adinda-about-640.webp` | hal. 1 — foto taman berbunga (1600×2400) | Crop 4:3.2 (anchor atas), WebP q82 |
| `public/images/adinda-about-1024.webp` | idem | idem |
| `public/images/adinda-about-1600.webp` | idem | idem |
| `public/projects/skego-mobile.webp` | hal. 11 — mockup 2 ponsel SKEGO | Dikomposisi di kartu gelap 1200×900 |
| `public/projects/catering-nabila.webp` | hal. 8 — 3 layar iPhone Catering Nabila | idem |
| `public/projects/repair-ranger.webp` | hal. 9 — 3 layar aplikasi Repair Ranger | Grid 3 kolom di kartu gelap |
| `public/projects/tap-on-mi.webp` | hal. 10 — mockup laptop Tap-On Mi | Dikomposisi di kartu gelap |
| `public/projects/absentku.webp` | hal. 7 — 3 layar iPhone AbsentKu | idem |
| `public/projects/laundry-spatu.webp` | hal. 6 — tangkapan layar dashboard Laundry S'patu | Grid 2×2 di kartu gelap |
| `public/og-image.png` | hero + foto hal. 1 | Dibuat sendiri dengan Pillow: gradient resmi DESIGN.md §3, grid tipis, tipografi, dan potret |

`PORTO BITI.pdf` sendiri **tidak** ikut di-bundle; ia hanya bahan sumber.

## 2. Dibuat sendiri untuk proyek ini

| Aset | Keterangan |
|---|---|
| `public/favicon.svg` | Monogram SVG, gradient biru sesuai token DESIGN.md §3 |
| `public/404.html` | Halaman 404 mandiri (CSS inline, tanpa dependensi) |
| `public/robots.txt`, `public/sitemap.xml`, `public/site.webmanifest` | Konfigurasi statis |
| `src/components/ui/brand-icons.tsx` | Ikon Instagram, GitHub, Linktree — SVG inline sederhana (DESIGN.md §12), bukan logo berwarna |
| `src/components/three/orbit-fallback.tsx` | Ilustrasi isometrik SVG untuk fallback Tech Orbit |
| Dekorasi CTA card | Lingkaran konsentris CSS + noise SVG `feTurbulence` (string konstan, bukan file) |

## 3. Font

| Aset | Sumber | Lisensi |
|---|---|---|
| `public/fonts/poppins-{300,400,500,600,700}.woff2` | Google Fonts API (subset **latin** saja) | **SIL Open Font License 1.1** — Poppins © Indian Type Foundry |

Di-*self-host* sesuai AGENT.md §10 (`font-display: swap`, dua file utama di-preload). Tidak ada permintaan ke `fonts.googleapis.com` saat runtime.

## 4. Yang MASIH DIBUTUHKAN dari pemilik — `TODO(asset)`

| Aset | Kenapa | Dampak sementara |
|---|---|---|
| **Foto hero cut-out transparan resolusi tinggi** | Efek `LiquidPortrait` paling bagus dengan alpha asli. Versi sekarang hasil key-out otomatis dari foto studio berlatar putih — rambut dan tepi halus kemungkinan kasar di layar besar | Efek tetap berjalan; kualitas tepi bisa lebih baik |
| **File CV PDF** (`public/cv/Adinda-CV.pdf`) | Tombol "Unduh CV" di section About | Tombol dirender dalam keadaan `disabled` dan tidak mengarah ke mana pun |
| Foto About resolusi lebih tinggi (opsional) | Saat ini 1600×1280 dari PDF | Cukup untuk layar 2× sampai lebar ±800 px |

## 5. Catatan kejujuran

- `reference/motion-footer.tsx` dan `reference/liquid-sculpture-hero.tsx` **tidak disertakan** bersama project, sehingga `src/components/ui/motion-footer.tsx` dan `src/components/liquid/liquid-engine.ts` adalah **implementasi mandiri** yang mengikuti spesifikasi AGENT.md §5.1/§5.2, bukan adaptasi dari file asli. Keduanya diberi catatan provenance di header file.
- Karena itu, perbaikan bug paste yang diminta AGENT.md §5.1 #9 (`bg-background]`, `shadow-m]`) dan §5.2 #7 (string `\n` terpotong) tidak berlaku — kode baru tidak mengandung bug tersebut. `tests/source-hygiene.test.ts` memverifikasi kedua pola itu tidak muncul di `src/`.
- **Potret hero di-key out otomatis**, bukan cut-out profesional. Latar putih studio dihapus dengan flood-fill dari tepi (toleransi 236) lalu di-feather 1,4 px. Hasilnya bersih pada siluet, tetapi tepi rambut kemungkinan lebih kasar daripada cut-out manual. Cut-out transparan resolusi tinggi tetap diminta sebagai `TODO(asset)`.
- Cover proyek dikomposisi ulang di atas kartu gelap 1200×900 dari tangkapan layar di PDF. Untuk Repair Ranger sumbernya hanya layar aplikasi ±330×717 (tanpa mockup perangkat), jadi cover itu memakai tiga layar berjajar, bukan mockup.
