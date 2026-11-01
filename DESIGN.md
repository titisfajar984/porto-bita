# DESIGN.md — Visual, Layout & Motion Spec

> Referensi gaya: Dribbble "Ethan Personal Portfolio Landing Page" (`reference/ethan-reference.png`). Ambil **bahasa desainnya** (komposisi, ritme, material), bukan nama/foto/teksnya. Konten Adinda ada di PRD.md.

---

## 1. Karakter Visual

**Kata kunci:** clean · airy · confident · soft-blue · editorial · tactile.

Ciri khas yang harus terbaca dalam 2 detik:
1. **Halaman abu muda** dengan **kartu putih/biru berujung bulat besar** yang bertumpuk rapi (bukan section full-bleed).
2. **Hero:** headline raksasa **tipis (Light)** huruf kapital "I'M / ADINDA" di kiri, **foto cut-out** di tengah *menimpa* **ghost text** raksasa transparan, blok judul **bold kapital 3 baris** di kanan bawah, paragraf pendek di kiri bawah, tombol pill biru.
3. **Gradient biru lembut** naik dari bawah kartu (putih → biru muda) + **grid garis sangat tipis** di latar.
4. **Angka statistik besar & tipis**, label kecil abu.
5. **Kartu proyek gelap** (foto mockup, overlay gradient bawah, judul kiri-bawah, meta kanan-bawah).
6. Aksen tunggal: **biru royal** untuk tombol/ikon/kutipan.

**Hindari:** neon, gradient ungu/pink, drop shadow tebal, emoji di UI, lebih dari satu warna aksen, radius campur-aduk, stock photo generik.

## 2. Anatomi Halaman (urutan)

```
[Preloader]
[Page canvas abu #ECEDF0]
  ├─ Card 1  HERO        (nav di dalam kartu)
  ├─ Card 2  ABOUT       (gradient biru→putih, foto + teks + stats)
  ├─ Card 3  SERVICES    (judul besar + 3D Tech Orbit + daftar layanan)
  ├─ Card 4  EXPERIENCE  (timeline)
  ├─ Block   PORTFOLIO   (judul + grid 2×3 kartu gelap)
  ├─ Card 5  CREDENTIALS (bahasa, sertifikat) / TESTIMONIALS (hanya jika ada data)
  ├─ Card 6  CTA biru    ("Let's build something together")
[Cinematic Footer — tirai, navy gelap]
```

Jarak antar kartu: 16 px (mobile) · 20 px (tablet) · 24 px (desktop). Padding halaman: 12 / 20 / 28 px. `max-width` konten: **1360 px**, center.

## 3. Token Warna (CSS variables di `:root`)

```css
:root {
  --page:        #ECEDF0;   /* kanvas halaman */
  --card:        #FFFFFF;
  --background:  #FFFFFF;   /* token shadcn */
  --foreground:  #0B0C10;   /* teks utama */
  --muted-foreground: #6B7280;
  --border:      rgba(11,12,16,.08);
  --primary:     #2A4BD7;   /* biru royal: tombol, ikon, kutipan */
  --primary-foreground: #FFFFFF;
  --primary-deep:#1B35A8;   /* hover/pressed, CTA card */
  --secondary:   #8FB4FF;   /* biru muda aksen aurora */
  --blue-50:     #F3F7FF;
  --blue-100:    #E3EDFF;
  --blue-200:    #CFE0FF;
  --blue-300:    #BCD4FF;   /* dasar gradient hero */
  --ink-card:    #16171B;   /* kartu proyek gelap */
  --destructive: #E5484D;   /* hanya hati footer */
  --radius-card: 28px;      /* desktop */
}
@media (max-width: 1023px) { :root { --radius-card: 24px; } }
@media (max-width: 639px)  { :root { --radius-card: 20px; } }

/* Footer selalu gelap */
.footer-dark {
  --background:#0A0F24; --foreground:#F3F5FF; --muted-foreground:#98A2C3;
  --border:rgba(243,245,255,.12); --primary:#7FA2FF; --secondary:#4C6FFF; --destructive:#FF6B7A;
}
```

**Gradient resmi**

- `--grad-hero`: `linear-gradient(180deg,#FFFFFF 0%,#F6F9FF 38%,#DCE9FF 72%,#BCD4FF 100%)`
- `--grad-about`: `linear-gradient(180deg,#BCD4FF 0%,#E3EDFF 38%,#FFFFFF 78%)`
- `--grad-cta`: `linear-gradient(135deg,#2A4BD7 0%,#1B35A8 100%)` + noise 4%.
- Overlay kartu proyek: `linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.72) 100%)`.

Dark mode **tidak wajib** (MVP terang). Jika ditambah (Should), tema gelap = kanvas `#0B0D14`, kartu `#12141C`, gradient biru diganti navy; semua token lewat variabel.

## 4. Tipografi

Font tunggal: **Poppins** (self-host). Bobot: 300, 400, 500, 600, 700.

| Peran | Spesifikasi |
|---|---|
| Display hero ("I'M / ADINDA") | 300, UPPERCASE, `clamp(64px, 12.5vw, 176px)` desktop (≈ 168 px @1440), tablet `clamp(72px, 14vw, 128px)`, mobile `clamp(56px, 19vw, 88px)`; `line-height .92`; `letter-spacing -0.045em` |
| Role block ("INFORMATION / SYSTEMS / GRADUATE") | 700, UPPERCASE, `clamp(26px, 3.4vw, 52px)`, `line-height 1.02`, `letter-spacing -0.02em`, rata kiri |
| Ghost text | 600–700, UPPERCASE, `clamp(120px, 20vw, 320px)`, warna `rgba(11,12,16,.045)`, nowrap, terpotong tepi kartu |
| H2 section | 500, `clamp(28px, 3.4vw, 48px)`, `line-height 1.12`, `ls -0.02em` |
| H3 / judul kartu | 500, 16–20 px |
| Body | 400, 14–16 px (`clamp(14px,1.05vw,16px)`), `line-height 1.6`, warna `--muted-foreground` |
| Stat angka | 300, `clamp(48px, 6vw, 84px)`, `ls -0.03em`, tabular-nums |
| Label kecil / eyebrow | 500, 11–12 px, UPPERCASE, `ls .12em` |
| Nav link | 500, 12–13 px |
| Tombol | 500, 13–14 px |

Satu frasa aksen per heading boleh diberi `color: var(--primary)` (tanpa serif).

## 5. Spacing, Grid, Radius, Shadow

- Skala spasi: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Padding dalam kartu: mobile 20–24 · tablet 32 · desktop 40–56.
- Grid: mobile 4 kol · tablet 8 kol · desktop 12 kol (gutter 16/20/24).
- Radius: kartu `--radius-card`; gambar dalam kartu 20–24 px; pill `999px`; chip `999px`; input 14 px.
- Shadow kartu: `0 1px 0 rgba(255,255,255,.8) inset, 0 20px 60px -30px rgba(25,45,120,.25)`. Tanpa border keras; boleh `1px solid rgba(255,255,255,.7)` untuk kesan glass.
- Grid latar hero: garis 1 px `rgba(20,40,110,.05)`, sel 56 px, mask vertikal (`transparent → black 25% → black 70% → transparent`).

## 6. Komponen

### 6.1 Navbar (di dalam kartu hero)
- Kiri: nama (`Adinda Tsabitah`, 14–15 px/600). Tengah-kanan: Home · About · Service · Experience · Portfolio · Contact (12–13 px/500, opacity .75 → 1 hover; underline 1 px menggeser dari kiri).
- Kanan: pill biru **"Get in touch / Hubungi"** (tinggi 36 px) + tombol toggle **ID/EN** (pill kecil).
- Scroll state: setelah melewati hero, muncul **floating nav pill** tengah-atas (fixed, `backdrop-blur-xl`, `bg-white/70`, border putih, radius 999) berisi link + CTA; menyembunyikan diri saat scroll turun cepat, muncul saat scroll naik.
- Link aktif = titik biru 4 px di bawah teks (scroll-spy).
- **Mobile (<768):** brand + tombol hamburger 44×44 (glass pill). Menu = **fullscreen sheet** (`bg-[--blue-50]`, radius bawah 32), link `text-4xl` weight 300, stagger masuk 60 ms, tombol tutup, info kontak di bawah.

### 6.2 Tombol
| Varian | Gaya |
|---|---|
| Primary pill | `bg-primary text-white h-11 px-5 rounded-full`, ikon panah-serong 14 px di kanan (`ArrowUpRight`), hover: bg `--primary-deep`, ikon bergeser (+2,-2) px, `translateY(-1px)` |
| Ghost pill | border `rgba(11,12,16,.14)`, teks foreground, hover isi `foreground` teks putih |
| Icon circle | 32–40 px, border tipis, ikon 16 px, hover bg primary + ikon putih |
| Glass pill (footer) | gradient `foreground 3%→1%`, border `foreground 8%`, `backdrop-blur 16px`, inset highlight 1 px |
State wajib: default, hover, focus-visible (ring 2 px `--primary` offset 3), active (`scale .98`), disabled.

### 6.3 Chip / badge
Pill 28–32 px, bg `white/70`, border `rgba(11,12,16,.08)`, teks 12 px/500, ikon opsional.

### 6.4 Kartu proyek
- Rasio gambar `4/3` (mobile) / `1/1` sampai `5/4` (desktop, ikuti referensi), radius 22 px, latar `--ink-card`.
- Gambar `object-cover` dengan mockup berlatar gelap; overlay gradient bawah.
- Teks: judul 16–18 px/500 putih (kiri-bawah), kategori 12 px putih 70%, **meta** (konteks/tahun bila ada) 13 px putih kanan-bawah; ikon `ArrowUpRight` dalam lingkaran glass kanan-atas.
- Hover (desktop): gambar `scale 1.05` 0.8 s, overlay menebal, panah berputar −45° → 0°, **tilt 3D** maks 6° (perspective 900 px), kursor custom berubah jadi bubble "View".
- Mobile: tidak ada hover; reveal saat masuk viewport; seluruh kartu tappable.

### 6.5 Stat
4 kolom desktop, 2×2 mobile; garis pemisah vertikal 1 px `--border` (tersembunyi di mobile); angka count-up sekali saat masuk viewport.

### 6.6 Quote / Testimonial (hanya bila data ada)
Kartu abu muda (`#F4F5F8`) radius 20, tanda kutip biru 40 px, foto bulat-persegi 88 px, nama 500, peran 12 px abu.

## 7. Spesifikasi Section

### 7.1 HERO (Card 1)
Tinggi kartu: `min-height: clamp(640px, 88svh, 820px)` desktop; tablet `min(86svh, 860px)`; mobile `auto` (konten mengalir, min 680 px).

**Layer (z-index):**
| z | Elemen |
|---|---|
| 0 | `--grad-hero` + grid + aurora blob biru (blur 80 px, breathe 8 s) |
| 1 | **Ghost text** "IT ENTHUSIAST" (sebagian terpotong kanan-kiri, di belakang kepala) |
| 2 | **LiquidPortrait** (cut-out Adinda, bottom-aligned, tinggi ≈ 86–92% kartu) |
| 3 | Chip melayang (2.5D parallax): "IPK 3,82", "Bangkit Academy", "UI/UX" — posisi sekitar bahu/kepala, desktop & tablet saja |
| 4 | Teks, nav, tombol, social |

**Desktop (≥1024):**
- Nav di atas (padding 24 px 32 px).
- Kiri atas-tengah: "I'M" / "ADINDA" (dua baris, rata kiri, mulai ±y 18% kartu).
- Kanan atas: blok **Follow Me** (label 13 px/600, 4 ikon lingkaran: Instagram, GitHub, Linktree(`Link2`), Email) + 1 kalimat 12 px abu (maks 3 baris, lebar 230 px).
- Kiri bawah: tombol pill biru **"Let's Discuss"** lalu paragraf intro (lebar maks 340 px, 13–14 px) — paragraf di bawah tombol seperti referensi.
- Kanan bawah: blok role 3 baris tebal.
- Portrait di tengah, tinggi ~88% kartu, sedikit offset kiri 2%.

**Tablet (768–1023):** nav tetap; "I'M ADINDA" diperkecil; portrait tengah (tinggi 70%); role block kanan-bawah 2–3 baris; paragraf + tombol kiri bawah; ikon social pindah ke baris di bawah nav (kanan).

**Mobile (<768):** urutan visual:
1. Nav (brand + hamburger)
2. "I'M / ADINDA" (kiri, overlap bagian atas portrait)
3. Portrait (lebar ±105% kartu, bottom fade ke gradient; tinggi ±52svh)
4. Role block (3 baris, kiri) + tombol pill (kanan sejajar) 
5. Paragraf intro, lalu ikon social horizontal
Ghost text 62% ukuran desktop. Chip melayang disembunyikan; hint "Sentuh & geser potret" 11 px uppercase dengan dot berdenyut di bawah portrait (hilang setelah interaksi pertama).

**Liquid effect:** lihat §10.

### 7.2 ABOUT (Card 2)
Gradient `--grad-about`. Layout desktop: grid 12 kol — foto kiri (5 kol, radius 24, rasio 4/3.2), teks kanan (6 kol, offset 1): eyebrow "About Me", H2 *"Rasa ingin tahu tinggi, dibangun untuk teknologi."* (ID) / *"Curious by nature, built for technology."* (EN), paragraf, tombol "Baca Selengkapnya" (membuka modal profil lengkap) + ghost "Unduh CV" (jika ada). Di bawahnya **stat row** 4 angka (lihat PRD §6.2).
Tablet: foto atas (full width), teks bawah. Mobile: foto → heading → paragraf → tombol → stat 2×2.
Foto: **clip-path reveal** + tilt halus; chip kecil "S1 Sistem Informasi" di sudut foto.

### 7.3 SERVICES (Card 3) — "What I Do" + 3D
Heading besar kiri-atas (`Building digital solutions that bring ideas to life`), paragraf kanan 14 px (referensi: heading kiri, teks pendek kanan).
Desktop: dua kolom — kiri **daftar layanan** (5 baris accordion-ringan: nomor 01–05, judul 20 px, deskripsi 1–2 kalimat, garis pemisah; hover: baris naik, panah muncul), kanan **Tech Orbit 3D** (kanvas persegi ±520 px, di dalam "panel" radius 28 bg `--blue-50` dengan grid tipis).
Tablet: orbit di atas (tinggi 360), daftar di bawah. Mobile: orbit tinggi 280 (atau fallback statis), daftar vertikal.
Chip tech di bawah orbit (marquee horizontal 2 baris berlawanan arah).

### 7.4 EXPERIENCE (Card 4)
Kiri (sticky di desktop): eyebrow + H2 "Education & Experience". Kanan: timeline vertikal dengan garis 1 px; titik biru 10 px menyala saat dilewati (`scrub`); tiap item: periode (bila ada), institusi 18 px/500, peran 14 px, 1–2 kalimat, chip. Tiga item: Universitas, MSIB Bangkit Academy, Magang Diskominfo Jatim.
Mobile: garis di kiri 12 px, konten kolom tunggal.

### 7.5 PORTFOLIO (Block)
Header: kiri "Portfolio" (eyebrow) + H2 *"Bringing ideas to life through design & code"*; kanan paragraf pendek 12–13 px (rata kanan di desktop).
Grid: **desktop 2 kolom × 3 baris** (gap 20), tablet 2 kolom (gap 16), mobile 1 kolom (gap 16). 6 kartu (PRD §6.4).
Filter chip (UI/UX · Web · Mobile · Desktop) opsional (Should) dengan `layout` animation.
Klik → **modal/drawer detail** (`Dialog`): gambar besar, deskripsi, konteks, peran, tautan (Figma/GitHub), tombol tutup; transisi: scale .96→1 + fade 0.35 s; mobile = bottom sheet penuh dengan drag-to-close.

### 7.6 CREDENTIALS / TESTIMONIALS (Card 5)
Jika `testimonials.length === 0` (default): tampilkan **Credentials**: kiri "Languages" (chip: Bahasa Indonesia, English, 한국어 — tanpa level) dan "Certificates" (angka besar `10+` + kalimat), kanan "Learning Path": Cloud Computing (Bangkit). Jangan tampilkan section testimoni kosong.

### 7.7 CTA Card (biru)
`--grad-cta`, radius card, teks putih. Heading besar 300–500 weight `clamp(32px,4.6vw,64px)` *"Let's build something together."*, paragraf 1 kalimat, tombol putih pill + ghost putih (Email / Linktree). Dekorasi: lingkaran konsentris transparan + noise; foto kecil bundar mengintip dari sudut kanan-bawah (seperti referensi) bila aset tersedia. Parallax lembut pada dekorasi.

### 7.8 FOOTER — Cinematic Curtain
Gunakan `CinematicFooter` (adaptasi AGENT.md §5.1), tema navy, giant text **ADINDA** (outline tipis + gradient), marquee miring −2° di atas, heading tengah, 3 tombol glass pill magnetik (Email, Linktree, GitHub), baris bawah: copyright · badge "Crafted with ❤ by Adinda" · tombol back-to-top.
- Desktop (≥1024 & tinggi ≥700): curtain fixed + clip-path + scrub.
- Selain itu: footer statis `min-h-[100svh]`, animasi reveal biasa.
`<main>` di atasnya: `rounded-b-[32px]`, `z-10`, shadow bawah lembut agar "tirai" terbaca.

## 8. Breakpoint & Aturan Responsif

| Nama | Lebar | Perilaku inti |
|---|---|---|
| base (mobile) | 320–639 | 1 kolom, hamburger, hero bertumpuk, particle density 0.35, orbit 4 objek/fallback, tanpa hover/cursor/magnetic/Lenis |
| sm | 640–767 | masih mobile layout, tipografi sedikit lebih besar, grid proyek tetap 1 kolom (atau 2 kolom bila ≥ 700) |
| md (tablet) | 768–1023 | grid 8 kol, grid proyek 2 kol, hero 2.5-layer, particle 0.6, orbit 6 objek |
| lg (desktop) | 1024–1279 | layout penuh, curtain footer, Lenis, cursor custom, particle 1.0 |
| xl | 1280–1535 | container 1360, tipografi maksimum hampir tercapai |
| 2xl | ≥1536 | container tetap 1360 center, kanvas halaman tampak di kiri-kanan |

Aturan tambahan: landscape phone (tinggi < 500) → hero tidak dipaksa `svh`, konten mengalir; zoom 200% tidak memecah layout; teks tidak terpotong untuk `ID` maupun `EN` (ID ±15% lebih panjang).

## 9. Motion System

### 9.1 Token (`lib/motion-tokens.ts`)
```ts
export const EASE = {
  outExpo: "expo.out",                  // GSAP
  outQuart: "power4.out",
  inOut: "power3.inOut",
  elastic: "elastic.out(1, 0.35)",
  css: { outExpo: "cubic-bezier(.16,1,.3,1)", inOutSoft: "cubic-bezier(.65,0,.35,1)" },
};
export const DUR = { fast: .3, base: .6, slow: 1.1, hero: 1.4 };
export const STAGGER = { tight: .06, base: .12, loose: .18 };
export const REVEAL = { y: 48, blur: 6 };  // px
```

### 9.2 Katalog animasi
| ID | Nama | Detail |
|---|---|---|
| M1 | **Preloader** | Counter 0→100 (font tabular, 12 px), panel putih naik (`yPercent -100`) 0.9 s `inOut`; total ≤ 1.6 s; lewati jika reduced-motion atau sudah tampil di sesi (`sessionStorage`). Hero timeline dimulai saat panel selesai. |
| M2 | **Hero intro** | Timeline: kartu fade+scale .98→1 → nav turun (y -16→0) → "I'M"/"ADINDA" **masked line reveal** (yPercent 110→0, stagger .12) → partikel portrait **merakit diri** (intro engine ±3 s) → role block slide-up + blur → paragraf, tombol, social stagger → chip melayang pop (scale .8→1, elastic). |
| M3 | **Ghost text drift** | `x` bergeser ±6% mengikuti scroll (`scrub 1`), lalu fade saat hero keluar. |
| M4 | **Portrait parallax** | Pointer: portrait & chip bergerak berlawanan (kedalaman 8/16/24 px) via `quickTo`; sentuh: nonaktif (diganti efek liquid). |
| M5 | **Reveal generik** | `y 48 → 0`, `opacity 0 → 1`, 0.9 s `outExpo`, `start: "top 85%"`, `once: true`. Teks heading: split per baris (bukan per huruf di mobile, demi perf). |
| M6 | **Image clip reveal** | `clip-path: inset(100% 0 0 0 round R)` → `inset(0 round R)` 1.1 s `inOut` + inner image `scale 1.2 → 1`. |
| M7 | **Count-up** | 0 → nilai, 1.6 s `outQuart`, desimal 2 digit untuk "3,82" (format locale), suffix "+" muncul di akhir. |
| M8 | **Marquee** | CSS keyframes, 40 s/loop desktop, 28 s mobile; pause on hover/focus; 2 set duplikat; berhenti total saat reduced-motion (tampilkan daftar statis). |
| M9 | **Magnetic** | Tombol utama desktop: translate `0.4×` offset kursor, rotasi ≤ 6°, lepas `elastic.out(1,.3)` 1.2 s. Nonaktif di sentuh. |
| M10 | **Tilt card** | `rotateX/Y` ≤ 6°, `perspective(900px)`, highlight specular mengikuti kursor (radial gradient putih 8%). |
| M11 | **Timeline draw** | Garis `scaleY 0→1` (`scrub`), titik menyala di tiap item. |
| M12 | **Services row hover** | Baris translateX 8 px, nomor jadi biru, panah fade-in, garis bawah menggambar. |
| M13 | **Orbit 3D** | Lihat §11. |
| M14 | **Portfolio stagger** | Kartu masuk berpasangan (kiri/kanan) delay .12; gambar `scale 1.15→1`. |
| M15 | **Modal** | Backdrop blur 8 px fade, panel `scale .96 → 1`, `y 16 → 0`; tutup = kebalikan 0.25 s. |
| M16 | **CTA card parallax** | Lingkaran dekoratif bergerak `±40px` berlawanan scroll. |
| M17 | **Curtain footer** | Sesuai komponen sumber: giant text `y 10vh→0, scale .8→1, opacity 0→1` scrub; heading + links stagger scrub. |
| M18 | **Nav pill** | Muncul y -24→0 saat scroll up setelah hero; sembunyi saat scroll down. |
| M19 | **Cursor custom** | Titik 8 px + cincin 36 px (lerp .18); state: default, link (cincin membesar 56), proyek (cincin jadi bubble biru "View"), teks (garis vertikal). Hanya `pointer: fine`; `mix-blend-mode: difference` dihindari agar kontras aman. |
| M20 | **Theme/lang switch** | Crossfade 0.4 s; tanpa reload. |

### 9.3 Reduced motion
Semua M2–M19 diganti **fade ≤ 250 ms** atau statis. Tidak ada parallax, tilt, magnetic, marquee, partikel intro/ambient, kursor kustom, Lenis.

## 10. Spesifikasi Liquid Portrait (3D/GPU)

- Sumber: PNG/WebP transparan Adinda → di-sampling jadi ±35–100 rb partikel (grid 640/800/1000 px sesuai density).
- Saat pointer/sentuh berada di atas portrait: partikel mengalir seperti cairan (swirl + curl-noise + wake), area yang disentuh "mencair", lalu kembali elastis ke foto tajam (`returnSpeed 1`).
- **Parameter preset**:

| Perangkat | density | radius | strength | spread | turbulence | streaks | intro |
|---|---|---|---|---|---|---|---|
| Desktop | 1.0 | 200 | 1.0 | 1.0 | 1.0 | ya | ya |
| Tablet | 0.6 | 170 | 0.9 | 0.9 | 0.9 | ya | ya |
| Mobile | 0.35 | 120 | 0.8 | 0.8 | 0.8 | tidak | ringan |
| Reduced motion | – | – | – | – | – | – | tidak (statis) |

- Sentuh: `touch-action: pan-y` agar scroll vertikal tetap bekerja; efek aktif saat drag horizontal/tap.
- Aksesibilitas: canvas `aria-hidden`, `<img alt="Potret Adinda …">` tetap di DOM (sr-only atau fallback).
- Warna partikel mengikuti foto asli (tint netral); latar canvas transparan sehingga gradient/ghost text tetap tampak.

## 11. Spesifikasi Tech Orbit 3D (R3F)

**Konsep:** "planet" pusat berupa **icosahedron kaca-biru** (metalness .1, roughness .15, warna `#2A4BD7`, emissive lembut) dikelilingi 6–8 objek kecil mengorbit pada 2 lintasan miring: torus, octahedron, box rounded, sphere putih, ring tipis, dan "kapsul" (merepresentasikan UI/UX, Web, Mobile, Desktop, Data, Cloud, Security). Tiap objek membawa **label HTML** kecil (`Html` dari drei, tampil ≥ md) — teks asli: "UI/UX", "Web", "Mobile", "Desktop", "Data", "Cloud", "Security".

- Kamera: perspective fov 35, posisi `[0, 0, 7]`.
- Gerak: orbit lambat otomatis (0.08 rad/s) + `Float` (drei) amplitudo kecil; pointer parallax (`rotation.y/x` lerp .06); progress scroll menambah rotasi (`gsap` → `ref`).
- Cahaya: ambient .7, directional (3,4,5) putih, directional (-4,-2,-3) biru muda; tanpa HDR eksternal.
- Hover pada objek (desktop): scale 1.15 + label menonjol; klik tidak wajib.
- Latar canvas transparan di panel `--blue-50` + grid.
- Fallback: ilustrasi SVG isometrik statis dengan animasi CSS float 6 s.
- Perf: lihat AGENT.md §8.

## 12. Ikonografi & Ilustrasi
- `lucide-react`, `strokeWidth 1.5`, ukuran 16/20/24, warna `currentColor`.
- Ikon brand (Instagram, GitHub) pakai SVG inline sederhana (bukan logo berwarna).
- Placeholder gambar proyek: komposisi SVG/gradient buatan sendiri (frame perangkat abstrak) bertema gelap — **jangan** meniru mockup referensi.

## 13. Gambar & Media
- Hero portrait: PNG/WebP alpha ≤ 350 KB, 1400 px tinggi (+ varian 900 px untuk mobile via `mobileSrc`).
- Foto about: WebP ≤ 160 KB, `srcset`.
- Thumbnail proyek: WebP 1200×900, ≤ 140 KB.
- OG image 1200×630 dibuat dari komposisi hero (statis).

## 14. Checklist QA Visual

- [ ] Hero: ghost text terbaca di belakang kepala, portrait menimpa; tidak ada teks menabrak wajah di semua breakpoint.
- [ ] Kontras teks di atas gradient biru ≥ 4.5:1 (ukur di bagian paling biru).
- [ ] Kartu radius & jarak konsisten; tidak ada kartu "mepet" tepi layar di 320 px.
- [ ] Stat sejajar baseline; angka tidak melompat saat count-up (tabular-nums).
- [ ] Kartu proyek: judul tidak terpotong (ID & EN), overlay cukup gelap.
- [ ] Orbit 3D tidak menutupi teks; fallback tampil bila WebGL mati.
- [ ] Footer curtain tidak memotong konten; di mobile footer statis dan lengkap.
- [ ] Semua tombol punya hover/focus/active; ring fokus terlihat di background biru.
- [ ] Reduced-motion: tidak ada gerak berkelanjutan.
