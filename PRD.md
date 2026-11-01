# PRD.md — Interactive Portfolio Website: Adinda Wira Zahra Tsabitah

**Versi:** 1.0 · **Tanggal:** 1 Nov 2026 · **Status:** Siap dikerjakan
**Dokumen terkait:** `AGENT.md` (cara kerja agent), `DESIGN.md` (visual & motion)

---

## 1. Ringkasan

Website portfolio satu halaman, **interaktif dan animatif** (2D + 3D), **mobile-first**, untuk **Adinda Wira Zahra Tsabitah** — IT Enthusiast, lulusan S1 Sistem Informasi (UPN "Veteran" Jawa Timur). Situs menampilkan profil, pengalaman, proyek (UI/UX, web, mobile, desktop), dan kontak dengan kesan **premium, bersih, dan hidup**: hero dengan potret yang berubah menjadi partikel cair saat disentuh, orbit 3D teknologi, scroll animation halus, dan footer sinematik "tirai".

Gaya visual mengacu pada referensi Dribbble *Ethan Personal Portfolio Landing Page* (kartu bulat, gradient biru lembut, tipografi besar tipis).

## 2. Tujuan & Metrik

| Tujuan | Metrik sukses |
|---|---|
| Menjadi etalase profesional untuk melamar kerja/magang/freelance | Rekruter menemukan: siapa, apa keahlian, 3 proyek unggulan, cara kontak **< 30 detik** |
| Memberi kesan teknis & kreatif | Hero liquid + orbit 3D berfungsi mulus (≥ 55 fps mid-range) |
| Dapat diakses semua perangkat | Tidak ada horizontal scroll 320–1920 px; Lighthouse A11y ≥ 95 |
| Cepat | Lighthouse Perf mobile ≥ 85 / desktop ≥ 95; LCP < 2.5 s |
| Konversi | Klik CTA kontak/Linktree/Email terukur (event opsional) |

## 3. Target Pengguna

1. **Rekruter/HR & hiring manager** (utama): scanning cepat, banyak di desktop & HP.
2. **Dosen/mentor/komunitas** (Bangkit, kampus): ingin melihat rekam jejak & proyek.
3. **Klien/kolaborator**: butuh bukti kemampuan UI/UX & web/mobile.

Skenario: membuka dari tautan di CV/LinkedIn/Instagram bio → umumnya **HP** → harus langsung impresif tapi ringan.

## 4. Ruang Lingkup

**In scope (MVP):** Preloader · Navbar (+floating pill, menu mobile, toggle ID/EN) · Hero (liquid portrait) · About + stats · Services + Tech Orbit 3D · Experience timeline · Portfolio grid + modal detail · Credentials · CTA card · Cinematic footer · SEO dasar · A11y · reduced-motion & fallback.

**Out of scope:** CMS/admin, blog, autentikasi, e-commerce, analytics kompleks, dark mode penuh (Should), halaman multi-route.

**Prioritas (MoSCoW)** ditandai pada tiap requirement: **M**ust / **S**hould / **C**ould.

## 5. Informasi Teknis Singkat

React + Vite + TypeScript, Tailwind v4, shadcn/ui, GSAP + ScrollTrigger, Lenis, Framer Motion, three + R3F + drei. Detail & aturan ada di AGENT.md.

## 6. Konten (Sumber: `PORTO BITI.md`)

> Aturan: **jangan menambah fakta**. Item bertanda `TODO(confirm)` harus dikonfirmasi pemilik sebelum rilis. Semua string disimpan di `content/i18n/{id,en}.ts`.

### 6.1 Identitas & Kontak (`content/site.ts`)

| Field | Nilai |
|---|---|
| Nama lengkap | Adinda Wira Zahra Tsabitah |
| Nama tampil nav | Adinda Tsabitah |
| Tagline | IT Enthusiast |
| Pendidikan | S1 Sistem Informasi — Universitas Pembangunan Nasional "Veteran" Jawa Timur |
| Email | iamzahrabit@gmail.com |
| Telepon | 0812 3323 1554 (tampil di section kontak saja; `TODO(confirm)` boleh dipublikasikan) |
| Linktree | https://linktr.ee/iamzahrabit |
| Instagram | @zhrbit_ |
| GitHub | https://github.com/zhrbit (dari tautan proyek) ; org capstone: https://github.com/Capstone-Project-SKEGO-App |
| Bahasa | Indonesia, Inggris, Korea |

### 6.2 Statistik (4 angka, count-up)

| Nilai | Label ID | Label EN |
|---|---|---|
| 3,82 | IPK | GPA |
| 149 | SKS | Credits (SKS) |
| 10+ | Sertifikat | Certificates |
| 3 | Bahasa (Indonesia · Inggris · Korea) | Languages |

### 6.3 Copy utama (draf — boleh dipoles tanpa mengubah fakta)

**Hero**
- ID eyebrow: "Portfolio" · EN: "Portfolio"
- Headline: **I'M / ADINDA** (sama di kedua bahasa)
- Role block: **INFORMATION / SYSTEMS / GRADUATE** (ID: **LULUSAN / SISTEM / INFORMASI**)
- Ghost text: **IT ENTHUSIAST**
- Intro ID: "Halo, saya Adinda, lulusan Sistem Informasi yang antusias membangun pengalaman digital yang bermakna — dari UI/UX, web, mobile, hingga data."
- Intro EN: "Hello, I'm Adinda, an Information Systems graduate passionate about building meaningful digital experiences — from UI/UX and web to mobile and data."
- Follow Me desc ID: "Saya merancang dan membangun produk digital yang rapi, berguna, dan menyenangkan dipakai." EN: "I design and build digital products that feel clear, useful, and enjoyable."
- CTA: "Let's Discuss" / "Ayo Diskusi"; nav CTA: "Get in touch" / "Hubungi"
- Hint sentuh: "Sentuh & geser potret" / "Touch & drag the portrait"; hint desktop: "Gerakkan kursor di atas potret" / "Move across the portrait"

**About**
- H2 ID: "Rasa ingin tahu tinggi, dibangun untuk teknologi." · EN: "Curious by nature, built for technology."
- Paragraf ID: "Lulusan S1 Sistem Informasi dengan rasa ingin tahu tinggi, adaptif, dan antusias mempelajari hal-hal baru di bidang teknologi informasi. Memiliki kemampuan berpikir analitis, pemecahan masalah, komunikasi, dan koordinasi yang baik. Terbiasa bekerja kolaboratif maupun mandiri, berpengalaman memimpin dan mengelola tim, serta mudah beradaptasi dengan berbagai lingkungan dan tantangan. Di luar teknologi, tertarik mempelajari bahasa asing dan wawasan lintas budaya."
- Paragraf EN: terjemahan setia dari ID di atas (agent menerjemahkan; jangan menambah klaim).

**Services (5 baris — turunan dari pengalaman nyata)**
1. UI/UX Design — antarmuka aplikasi di Figma (Catering Nabila, Repair Ranger).
2. Web Development — website & game web (Tap-On Mi).
3. Mobile & Desktop Apps — aplikasi Android dan desktop (SKEGO Mobile, AbsentKu, Laundry S'patu).
4. Data Mining — eksplorasi & analisis data. `TODO(confirm)` detail alat.
5. Cloud & Information Security — Cloud Computing learning path (Bangkit) dan evaluasi keamanan informasi (magang).
Setiap deskripsi maks 2 kalimat, hanya berdasar fakta di atas.

**Experience (`content/experience.ts`)**
| Institusi | Peran/Program | Deskripsi (turunan sumber) | Periode |
|---|---|---|---|
| Universitas Pembangunan Nasional "Veteran" Jawa Timur | S1 Sistem Informasi | IPK 3,82 · 149 SKS | `TODO(confirm)` |
| Bangkit Academy — MSIB (Studi Independen) | Learning Path: Cloud Computing | Program studi independen; capstone **SKEGO Mobile** | `TODO(confirm)` |
| Dinas Komunikasi dan Informatika Provinsi Jawa Timur | Magang — Bidang Persandian dan Keamanan Informasi | Terlibat dalam evaluasi keamanan informasi | `TODO(confirm)` |

**CTA card:** "Let's build something together." / "Mari kita bangun sesuatu bersama." + "Terima kasih" sebagai penutup kecil.

**Footer:** heading "Let's work together?" / "Ayo bekerja sama?"; marquee: IT Enthusiast ✦ UI/UX Design ✦ Web & Mobile ✦ Cloud Computing ✦ Data Mining ✦ Information Security.

### 6.4 Proyek (`content/projects.ts`) — 6 kartu

```ts
export interface Project {
  slug: string;
  title: string;
  category: "UI/UX" | "Web" | "Mobile" | "Desktop";
  context: { id: string; en: string };   // mata kuliah / program
  summary: { id: string; en: string };
  links: { label: string; href: string }[];
  cover: string;      // /projects/<slug>.webp
  year?: number;      // tampilkan hanya jika diisi
  needsConfirm?: string[];
}
```

| # | slug | Judul | Kategori | Konteks | Ringkasan (sumber) | Tautan |
|---|---|---|---|---|---|---|
| 1 | skego-mobile | SKEGO Mobile | Mobile | Capstone — MSIB Bangkit Academy | Aplikasi mobile pengelola tugas cerdas yang membantu pelajar memprioritaskan tugas, merencanakan secara cerdas, dan tetap produktif tanpa membuang waktu. | GitHub org (Capstone-Project-SKEGO-App) |
| 2 | catering-nabila | Catering Nabila | UI/UX | Mata Kuliah Analisis Desain Sistem Informasi | Aplikasi pesan antar makanan dengan fitur inovatif perhitungan nutrisi dan rekomendasi menu berbasis aplikasi mobile. | Figma: figma.com/design/BMzt1LtcW9bsnrMkGVueI7/Catering-Nabila |
| 3 | repair-ranger | Repair Ranger | UI/UX | Mata Kuliah E-Business | Platform praktis dan hemat biaya yang menghubungkan pengguna dengan penyedia jasa tukang di Indonesia; memudahkan pencarian tukang sesuai kategori. | Figma: figma.com/design/MU6QhcJgsOdxhLO1n9aFFG/E-BUSS-TUKANG |
| 4 | tap-on-mi | Tap-On Mi | Web | Mata Kuliah Pemrograman Website | Website game *Tower Block* yang dirancang ulang dengan menu penjelas game dan tampilan yang senada dengan menu. | GitHub: github.com/zhrbit/Tap-On-Mi-Game |
| 5 | absentku | AbsentKu | Desktop | Mata Kuliah Interaksi Manusia Komputer | Aplikasi absensi TK dengan akses untuk guru dan wali murid; wali murid dapat memantau perkembangan anak di sekolah secara real-time. | — |
| 6 | laundry-spatu | Laundry S'patu | Desktop | `TODO(confirm)` | `TODO(confirm)` — sumber hanya mencantumkan label "Desktop"; minta deskripsi ke pemilik. Tampilkan ringkasan singkat netral sampai dikonfirmasi. | — |

> Catatan: pada sumber, deskripsi "Aplikasi Absensi TK…" tampak milik AbsentKu; pemetaan dengan "Laundry S'patu" perlu dikonfirmasi (`needsConfirm`). Link Figma lengkap (dengan `node-id`) ada di `reference/PORTO_BITI.md`.

### 6.5 Testimonials
Tidak ada data → section **tidak dirender**. Jangan membuat testimoni palsu. Struktur data tetap disiapkan (`content/testimonials.ts`, default `[]`).

## 7. Functional Requirements

### 7.1 Global
| ID | Requirement | Prio |
|---|---|---|
| G-01 | Single-page dengan anchor `#home #about #service #experience #portfolio #contact`; scroll mulus; `scroll-margin-top` mengikuti tinggi nav | M |
| G-02 | Toggle bahasa **ID/EN** (default ID), tersimpan di `localStorage`, set `<html lang>` | M |
| G-03 | Preloader ≤ 1.6 s, dilewati pada kunjungan ulang sesi & reduced-motion | S |
| G-04 | Custom cursor (hanya `pointer: fine`) | C |
| G-05 | Dark mode (token siap) | C |
| G-06 | Halaman 404 sederhana & `robots.txt`, `sitemap.xml` | S |

### 7.2 Navbar
| ID | Requirement | Prio |
|---|---|---|
| N-01 | Nav di dalam kartu hero (brand, 6 link, CTA, toggle bahasa) | M |
| N-02 | Floating nav pill muncul saat scroll up setelah hero, sembunyi saat scroll down | S |
| N-03 | Scroll-spy menandai link aktif | M |
| N-04 | Mobile: hamburger → fullscreen sheet, focus trap, `Esc`, body scroll lock, stagger link | M |

### 7.3 Hero
| ID | Requirement | Prio |
|---|---|---|
| H-01 | Headline "I'M ADINDA", role block 3 baris, intro, tombol "Let's Discuss" → scroll ke `#contact`, blok Follow Me (4 ikon) | M |
| H-02 | Ghost text "IT ENTHUSIAST" di belakang potret dengan parallax scroll | M |
| H-03 | **LiquidPortrait**: potret cut-out → ±35–100rb partikel GPU; hover/sentuh membuatnya cair & kembali elastis | M |
| H-04 | Intro: partikel merakit diri saat load (nonaktif bila reduced-motion/low-power) | S |
| H-05 | Fallback gambar statis bila WebGL2 tidak ada / context lost / reduced-motion | M |
| H-06 | Chip melayang (IPK 3,82 · Bangkit Academy · UI/UX) dengan parallax pointer (≥ md) | S |
| H-07 | Hint interaksi (berbeda desktop vs sentuh), hilang setelah interaksi pertama | S |
| H-08 | Responsif: layout bertumpuk di mobile sesuai DESIGN §7.1 | M |

### 7.4 About
| ID | Requirement | Prio |
|---|---|---|
| A-01 | Foto dengan clip-path reveal + tilt (desktop) | M |
| A-02 | Heading, paragraf, tombol "Baca Selengkapnya" (modal profil), "Unduh CV" (jika file ada) | M |
| A-03 | 4 stat dengan count-up sekali | M |

### 7.5 Services + 3D
| ID | Requirement | Prio |
|---|---|---|
| S-01 | Daftar 5 layanan bernomor dengan hover state | M |
| S-02 | **Tech Orbit 3D** (R3F): icosahedron pusat + objek mengorbit berlabel, parallax pointer + rotasi mengikuti scroll | M |
| S-03 | Lazy-load, mount saat dekat viewport, dispose saat jauh, fallback SVG statis | M |
| S-04 | Marquee chip teknologi (2 baris berlawanan) | C |

### 7.6 Experience
| ID | Requirement | Prio |
|---|---|---|
| E-01 | Timeline 3 item dengan garis tergambar saat scroll dan titik menyala | M |
| E-02 | Judul kiri sticky di desktop | S |

### 7.7 Portfolio
| ID | Requirement | Prio |
|---|---|---|
| P-01 | Grid 2 kolom desktop/tablet, 1 kolom mobile; 6 kartu gelap seperti DESIGN §6.4 | M |
| P-02 | Hover: zoom gambar, tilt 3D, kursor "View" (desktop) | S |
| P-03 | Klik membuka modal detail (gambar, konteks, ringkasan, tautan); mobile = bottom sheet | M |
| P-04 | Filter kategori dengan animasi layout | C |
| P-05 | Konten dibaca dari `content/projects.ts`; tombol tautan hanya muncul bila ada `href` | M |

### 7.8 Credentials / Testimonials
| ID | Requirement | Prio |
|---|---|---|
| C-01 | Credentials card: bahasa (chip tanpa level), sertifikat "10+", learning path Cloud Computing | M |
| C-02 | Testimonials hanya dirender jika data tidak kosong | M |

### 7.9 CTA & Footer
| ID | Requirement | Prio |
|---|---|---|
| F-01 | CTA card biru dengan tombol Email & Linktree, dekorasi parallax | M |
| F-02 | **Cinematic Footer** (komponen `motion-footer`) beradaptasi: giant text ADINDA, marquee, heading, 3 tombol magnetik, back-to-top | M |
| F-03 | Curtain fixed hanya di ≥1024 px & tinggi ≥700 & pointer fine; selain itu footer statis | M |
| F-04 | Tombol "Copy email" dengan toast "Tersalin" | C |

### 7.10 SEO & Meta
| ID | Requirement | Prio |
|---|---|---|
| SEO-01 | `<title>`: "Adinda Wira Zahra Tsabitah — IT Enthusiast Portfolio"; meta description ≤ 160 char (ID & EN) | M |
| SEO-02 | Open Graph + Twitter card + OG image 1200×630 | M |
| SEO-03 | JSON-LD `Person` (name, jobTitle "IT Enthusiast", alumniOf UPN "Veteran" Jawa Timur, sameAs: Instagram/GitHub/Linktree) | S |
| SEO-04 | Favicon set, `theme-color` `#ECEDF0` | S |

## 8. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Performa | Lighthouse mobile ≥ 85 / desktop ≥ 95; LCP < 2.5 s; CLS < 0.1; INP < 200 ms; JS awal ≤ 200 KB gzip (tanpa three) |
| Animasi | ≥ 55 fps rata-rata di mid-range Android; semua loop dijeda saat offscreen/tab hidden |
| Responsif | 320–1920 px tanpa horizontal scroll; landscape phone & tablet teruji |
| Aksesibilitas | WCAG 2.2 AA; keyboard penuh; skip link; reduced-motion; kontras teruji |
| Kompatibilitas | Chrome/Edge/Firefox/Safari 2 versi terakhir; iOS Safari 16+; Android Chrome 110+; fitur WebGL2 dengan fallback |
| Keamanan/Privasi | Tidak ada secret di client; tidak ada tracker pihak ketiga default; email/telepon tidak ditempel di meta tag |
| Kualitas | TS strict, lint bersih, test unit + e2e, console bersih |
| Maintainability | Konten terpisah di `content/`, README cara mengganti teks/gambar/tautan |

## 9. Perilaku Lintas Perangkat

| Fitur | Mobile (<768) | Tablet (768–1023) | Desktop (≥1024) |
|---|---|---|---|
| Navigasi | Hamburger fullscreen | Nav kartu + pill | Nav kartu + floating pill |
| Hero liquid | density .35, sentuh/drag | density .6, sentuh/hover | density 1, hover |
| Chip melayang | Tidak | Ya | Ya |
| Orbit 3D | 4 objek / fallback low-power | 6 objek | 8 objek + label |
| Grid proyek | 1 kolom | 2 kolom | 2 kolom |
| Tilt/magnetic/cursor | Tidak | Tidak | Ya (pointer fine) |
| Smooth scroll (Lenis) | Native | Native | Lenis |
| Footer | Statis | Statis | Curtain |

## 10. Aset yang Dibutuhkan dari Pemilik

1. **Foto hero cut-out transparan** (PNG/WebP, setengah badan, latar bersih) — *wajib untuk efek liquid*.
2. Foto kedua untuk About (boleh berlatar).
3. Screenshot/mockup 6 proyek (atau izin membuat placeholder abstrak).
4. File CV PDF (opsional).
5. Konfirmasi: periode pendidikan/magang/MSIB, deskripsi **Laundry S'patu**, daftar teknologi per proyek, izin menampilkan nomor telepon.
6. Preferensi bahasa default (ID/EN).

Selama aset belum ada, agent memakai placeholder berlabel `TODO(asset)`.

## 11. Rencana Kerja & Milestone

| Fase | Output | Checkpoint |
|---|---|---|
| 0 | Setup project, token, font, struktur folder | ★ rencana disetujui |
| 1 | Primitif motion + layout (nav, menu, preloader) | ★ screenshot 390/768/1440 |
| 2 | Hero statis → LiquidPortrait + fallback | ★ demo interaksi |
| 3 | About, Services + Orbit 3D, Experience | ★ |
| 4 | Portfolio + modal, Credentials, CTA | |
| 5 | Footer cinematic, i18n, SEO | |
| 6 | QA (Lighthouse, a11y, reduced-motion, no-WebGL), README, ASSETS.md | ★ laporan akhir |

## 12. Kriteria Penerimaan (Acceptance)

1. Dibuka di 390×844: hero tampil lengkap tanpa scroll horizontal; potret bisa disentuh/di-drag hingga "mencair" lalu kembali; scroll vertikal tetap lancar.
2. Dibuka di 820×1180 (tablet): grid proyek 2 kolom, orbit 3D tampil, nav tidak patah.
3. Dibuka di 1440×900: ghost text di belakang potret, hover potret → cair, nav pill muncul saat scroll up, footer curtain terbuka saat scroll ke dasar.
4. Matikan WebGL (flag browser): hero dan orbit menampilkan fallback statis, tanpa error console.
5. Aktifkan `prefers-reduced-motion`: tidak ada marquee/parallax/tilt/partikel; reveal hanya fade.
6. Navigasi keyboard penuh; fokus terlihat; modal proyek menjebak & mengembalikan fokus.
7. Switch ID ↔ EN tidak merusak layout dan memperbarui `<html lang>`.
8. Tidak ada teks sampel komponen sumber (SOBERS, Volvox, Forma®, "Download iOS/Android") tersisa.
9. Tidak ada klaim konten di luar sumber; semua `TODO(confirm)` terdaftar di laporan.
10. Lighthouse sesuai target §8.

## 13. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Dua konteks WebGL (hero + orbit) di HP lemah | Jank/crash | Mount orbit lazy & dispose; fallback low-power; density rendah di mobile |
| Foto hero tidak transparan/berkualitas rendah | Efek liquid jelek | Minta cut-out; sediakan panduan (latar polos, rambut detail); fallback `imageBackground` (flat key) |
| CORS pada `getImageData` | Engine gagal | Aset lokal same-origin |
| `position: fixed` footer rusak oleh transform parent | Curtain gagal | Footer anak langsung root; larangan transform pada wrapper |
| `100vh` mobile bergeser | Hero/footer terpotong | Gunakan `svh/dvh` + footer statis di mobile |
| Konten ambigu (Laundry S'patu, periode) | Info salah | Tandai `TODO(confirm)`; jangan mengarang |
| Animasi berlebihan | Mual/aksesibilitas | Reduced-motion + durasi/jarak terkontrol |

## 14. Pertanyaan Terbuka

1. Bahasa default: Indonesia (diasumsikan) — setuju?
2. Apakah nomor telepon boleh dipublikasikan?
3. Apakah proyek **Laundry S'patu** dan **AbsentKu** dua proyek terpisah? Apa deskripsi/teknologi masing-masing?
4. Apakah ada sertifikat spesifik yang ingin ditonjolkan (judul & penerbit) untuk menggantikan angka "10+"?
5. Apakah ingin dark mode di rilis pertama?
