# AGENT.md — Adinda Portfolio (React · Interactive 2D + 3D · Mobile-first)

> Kamu adalah AI coding agent (Claude Code / Cursor / sejenisnya). Baca **PRD.md** (apa yang dibangun) dan **DESIGN.md** (tampilan + animasi) sampai selesai sebelum menulis kode. File ini menjelaskan **cara kerja**, aturan teknis, dan standar kualitas.

---

## 0. Misi

Bangun website portfolio personal satu halaman untuk **Adinda Wira Zahra Tsabitah (IT Enthusiast, lulusan S1 Sistem Informasi)** dengan:

- Gaya visual: **light, editorial, rounded-card, blue gradient** seperti referensi Dribbble "Ethan Personal Portfolio Landing Page" (screenshot ada di `reference/ethan-reference.png`).
- Animasi 2D: scroll reveal, parallax, marquee, magnetic button, count-up, tilt card, curtain footer (GSAP + ScrollTrigger + Lenis).
- Animasi 3D: (a) **liquid particle portrait** di hero (WebGL2 GPGPU, dari `liquid-sculpture-hero.tsx`), (b) **Tech Orbit 3D** di section Services (React Three Fiber).
- Responsif **mobile-first** → tablet → desktop, tanpa horizontal scroll di 320 px.
- Cepat, aksesibel, dan punya fallback untuk perangkat lemah / reduced-motion.

## 1. Urutan Prioritas Saat Ada Konflik

1. Keamanan & privasi → 2. Aksesibilitas → 3. Performa → 4. Kebenaran konten (jangan mengarang) → 5. Fidelitas visual DESIGN.md → 6. Kecanggihan efek.

Jika efek keren mengorbankan 1–3, **kurangi efeknya**, jangan kurangi kualitasnya, lalu catat di laporan akhir.

## 2. Sumber Kebenaran & Aset

Taruh file-file ini di `reference/` (jangan dikompilasi ke bundle):

| File | Fungsi |
|---|---|
| `reference/PORTO_BITI.md` | Sumber konten (nama, profil, pengalaman, proyek, kontak) |
| `reference/ethan-reference.png` | Referensi UI utama |
| `reference/motion-footer.tsx` | Komponen CinematicFooter (GSAP) — sumber asli |
| `reference/liquid-sculpture-hero.tsx` | Engine WebGL2 liquid particle — sumber asli |

Aset yang **harus disediakan user** (jika belum ada, pakai placeholder bertanda `TODO(asset)`; jangan unduh foto orang lain):

- `public/images/adinda-hero.png` — foto **cut-out transparan** (PNG/WebP alpha), setengah badan, rasio ± 4:5.
- `public/images/adinda-about.webp` — foto kedua (boleh berlatar), rasio ± 4:3.
- `public/projects/<slug>.webp` — screenshot/mockup tiap proyek (6 proyek, lihat PRD §6).
- `public/cv/Adinda-CV.pdf` — opsional.

## 3. Stack Wajib

| Kebutuhan | Pilihan |
|---|---|
| Build | **Vite + React (TypeScript, `strict: true`)** |
| Styling | **Tailwind CSS v4** (`@tailwindcss/vite`) + CSS variables token ala shadcn |
| UI primitives | **shadcn/ui** (struktur `src/components/ui`) + `lucide-react` |
| 2D motion | **GSAP + ScrollTrigger** (timeline & scroll), **Framer Motion** (micro-interaction, modal, layout) |
| Smooth scroll | **Lenis** (hanya pointer-fine; sinkron dengan GSAP ticker) |
| 3D | **three**, **@react-three/fiber**, **@react-three/drei** (lazy-loaded) |
| Test | Vitest + React Testing Library; Playwright (smoke test 3 viewport) |
| Lint | ESLint flat config + Prettier |

> Versi R3F harus cocok dengan React: R3F v9 untuk React 19, v8 untuk React 18. Cek `package.json` sebelum install.
> Jangan tambah library lain tanpa alasan tertulis di laporan.

### Setup (jalankan berurutan)

```bash
npm create vite@latest adinda-portfolio -- --template react-ts
cd adinda-portfolio
npm i tailwindcss @tailwindcss/vite
npx shadcn@latest init            # pilih: TypeScript, Tailwind v4, alias @/, base color neutral
npm i gsap lenis framer-motion three @react-three/fiber @react-three/drei lucide-react clsx tailwind-merge
npm i -D @types/three @types/node vitest @testing-library/react @testing-library/jest-dom jsdom @playwright/test
```

Pastikan:
- `vite.config.ts` punya plugin `@tailwindcss/vite` dan alias `"@": path.resolve(__dirname, "./src")`.
- `tsconfig.json` / `tsconfig.app.json` punya `"paths": { "@/*": ["./src/*"] }`.
- `src/lib/utils.ts` mengekspor `cn()` (dibuat oleh shadcn).
- **Kenapa `components/ui` penting:** shadcn CLI, alias `@/components/ui/*`, dan semua import di komponen yang disalin mengandalkan path ini. Jika project tidak memakainya, komponen sumber akan gagal di-resolve dan update shadcn berikutnya menaruh file di tempat berbeda. Buat foldernya dan jangan pindahkan.

## 4. Struktur Folder

```
reference/                     # sumber (tidak di-bundle)
public/
  images/  projects/  cv/  fonts/
src/
  app/            App.tsx, providers.tsx (Theme, Lenis, MotionConfig)
  components/
    ui/           motion-footer.tsx (adaptasi), button.tsx, dialog.tsx, dll (shadcn)
    motion/       Reveal, SplitText, Magnetic, Marquee, CountUp, TiltCard, Parallax, CustomCursor
    liquid/       liquid-engine.ts, LiquidPortrait.tsx   (hasil refactor dari reference)
    three/        TechOrbit.tsx, TechOrbitScene.tsx, orbit-fallback.tsx
    sections/     Hero, About, Services, Experience, Portfolio, Credentials, Testimonials, CtaCard, Footer
    layout/       Navbar, MobileMenu, Preloader, PageShell
  hooks/          useMediaQuery, useReducedMotion, useInViewOnce, useWebGL2, useLowPower, useIsTouch
  lib/            utils.ts, gsap.ts, lenis.ts, motion-tokens.ts, seo.ts
  content/        site.ts, projects.ts, experience.ts, services.ts, i18n/{id,en}.ts
  styles/         globals.css (token, font, util class)
tests/            unit + e2e
```

## 5. Integrasi Komponen yang Disediakan (WAJIB dibaca)

### 5.1 `motion-footer.tsx` → `src/components/ui/motion-footer.tsx`

Salin, lalu **adaptasi** (jangan biarkan teks contoh):

1. Ganti `SOBERS` → `ADINDA`; `© 2026 Volvox` → `© 2026 Adinda Wira Zahra Tsabitah`; badge "Crafted with ❤ by Volvox" → "Crafted with ❤ by Adinda".
2. Ganti `MarqueeItem` isi → `IT Enthusiast · UI/UX Design · Web & Mobile · Cloud Computing · Data Mining` (ambil dari `content/site.ts`, pisahkan dengan `✦`).
3. Ganti heading `Ready to begin?` → dari i18n (`footer.heading`, mis. "Let's work together?").
4. Ganti dua tombol **Download iOS / Android** → tombol **Email** (`mailto:`), **Linktree** / **GitHub** dengan ikon `lucide-react` (`Mail`, `Link2`, `Github`). Link sekunder (Privacy/Terms/Support) → **Instagram, GitHub, Linktree** atau hapus.
5. **Override token warna:** bungkus footer dengan class `dark` agar selalu navy gelap (`#0A0F24`) walau halaman terang — lihat DESIGN.md §3. Pastikan `--destructive`, `--primary`, `--secondary` terdefinisi di `globals.css`.
6. Font footer: ganti `Plus Jakarta Sans` import ke **Poppins** supaya konsisten (hapus `@import url(...)` di dalam STYLES; font di-load global).
7. **Curtain hanya di layar besar:** aktifkan efek `fixed` + `clip-path` hanya jika `(min-width: 1024px) and (min-height: 700px)` dan `pointer: fine`. Di bawah itu render footer **statis** (`relative`, `min-h-[100svh]`, tanpa `fixed`) karena konten footer tidak muat di viewport pendek dan `100vh` di mobile browser tidak stabil — gunakan `svh`.
8. **Jangan** taruh `CinematicFooter` di dalam elemen yang punya `transform`, `filter`, `will-change: transform`, atau `perspective` (merusak `position: fixed`). Footer harus anak langsung root layout, setelah `<main>`. `<main>` wajib `relative z-10 bg-[var(--page)]` dengan `rounded-b-[32px]` agar "tirai" terlihat.
9. **Perbaiki typo bawaan demo:** `bg-background]` → `bg-background`, `shadow-m]` → `shadow-md`.
10. Tambahkan `aria-label="Site footer"` dan pastikan semua link punya teks/aria-label. `MagneticButton` harus **no-op di perangkat sentuh** (`pointer: coarse`) dan reduced-motion.

### 5.2 `liquid-sculpture-hero.tsx` → refactor jadi **`LiquidPortrait`**

Komponen sumber adalah hero penuh (nav + headline sendiri). Layout kita berbeda, jadi:

1. **Simpan file asli utuh** di `reference/`. Jangan edit.
2. Pindahkan **`LiquidEngine`, shader string, helper (`compile`, `clamp`, `hexToRgb`)** persis ke `src/components/liquid/liquid-engine.ts` (export `LiquidEngine`, tipe `EngineOptions`, `Rect`). Jangan ubah logika shader/simulasi kecuali dibutuhkan untuk TypeScript strict.
3. Buat `LiquidPortrait.tsx` — komponen client yang:
   - Menerima props: `src`, `darkSrc?`, `mobileSrc?`, `alt`, `background` (hex, warna latar kartu hero di titik tampil), `interactive`, `strength`, `radius`, `particleDensity`, `particleSpread`, `turbulence`, `liquid`, `streaks`, `intro`, `ambient`, `className`.
   - Membuat `<canvas>` per engine (seperti sumber: canvas baru per engine), `<img>` fallback statis di bawahnya, `ResizeObserver` untuk menghitung `Rect` (portrait **bottom-aligned**, tinggi ≈ 100% container, lebar sesuai aspect), `IntersectionObserver` → `engine.setVisible()`, pointer events (`pointermove/down/up/leave/cancel`) di wrapper, `visibilitychange`, dan `matchMedia('(prefers-reduced-motion)')`.
   - Atribut `data-gl="on|off"` untuk crossfade canvas ↔ img fallback (seperti sumber).
   - **Mode alpha:** gambar PNG/WebP transparan → engine otomatis `alphaMode`. Wajib pakai file **lokal** (same-origin) agar `getImageData` tidak kena CORS.
   - Latar canvas **transparan** (`premultipliedAlpha`), sehingga gradient kartu + ghost text tetap terlihat.
4. Preset default hero: `interactive`, `strength 1`, `radius 200`, `particleDensity 1` (desktop) / `0.6` (tablet) / `0.35` (mobile), `particleSpread 1`, `turbulence 1`, `liquid 1`, `streaks true`, `restStyle "image"`, `intro true` (nonaktif jika reduced-motion), `ambient false`.
5. **Fallback berlapis:** tanpa WebGL2 / tanpa float render target / context lost / reduced-motion ekstrem / `Save-Data` → tampilkan `<img>` statis dengan parallax CSS ringan. Tidak boleh ada error di console.
6. Tidak ada `any` baru; tipe `HTMLElement` ref sesuai.
7. **Perbaiki bug paste** pada file sumber saat menyalin: string `headline: "Form that⏎answers back."` dan `text.split("⏎")` harus memakai escape `\n` (`"Form that\nanswers back."`, `split("\n")`). Jika kamu hanya memakai engine (bukan `SculptureHero`), pastikan tidak ada string literal yang terpotong baris.
8. `demo.tsx` bawaan tidak dipakai di produksi.

## 6. Aturan Kode

- Satu komponen = satu tanggung jawab; section menerima data dari `content/` (bukan hard-code di JSX).
- Semua copy di `content/i18n/{id,en}.ts`. Default bahasa **Indonesia**, toggle **EN/ID** di navbar (simpan di `localStorage`, set `<html lang>`).
- Tidak ada `any` kecuali di boundary yang terdokumentasi (mis. polymorphic `as`). Hindari `// @ts-ignore`.
- Import absolut `@/…`. Named export untuk komponen; default export hanya untuk page.
- Nama file `kebab-case.tsx`, komponen `PascalCase`.
- Tidak ada `console.log` tersisa.
- Gambar: `width`/`height`/`alt` selalu ada; `loading="lazy"` kecuali hero; format WebP/AVIF; sediakan `srcset` 640/1024/1600.
- Jangan `dangerouslySetInnerHTML` kecuali untuk `<style>` konstan milik sendiri (footer).

## 7. Aturan Animasi (engineering)

1. **GSAP:** plugin didaftarkan sekali di `lib/gsap.ts` (`typeof window !== "undefined"`). Semua animasi dibuat di dalam `gsap.context(() => {...}, scopeRef)` dan `ctx.revert()` di cleanup (aman StrictMode). Gunakan `useGSAP`-style helper sendiri bila perlu (tanpa dependensi tambahan).
2. **Lenis ↔ ScrollTrigger:** 
   ```ts
   lenis.on("scroll", ScrollTrigger.update);
   gsap.ticker.add((t) => lenis.raf(t * 1000));
   gsap.ticker.lagSmoothing(0);
   ```
   Lenis aktif hanya untuk `pointer: fine` + bukan reduced-motion. Di sentuh gunakan scroll native.
3. **Hanya** animasikan `transform`, `opacity`, `clip-path`, `filter` ringan. Dilarang animasi `top/left/width/height/margin`.
4. `will-change` dipasang saat animasi aktif, dilepas setelahnya.
5. `ScrollTrigger.refresh()` setelah font + gambar hero siap dan setelah `i18n` berganti.
6. Hindari `setTimeout` untuk sinkronisasi — pakai timeline/`onComplete`.
7. **Reduced motion** (`prefers-reduced-motion: reduce`): matikan Lenis, marquee, parallax, tilt, particle intro/ambient, orbit rotasi otomatis; ganti reveal jadi fade ≤ 250 ms; liquid portrait jadi gambar statis.
8. **Offscreen pause:** semua loop (marquee CSS, R3F, particle) dijeda via `IntersectionObserver` + `document.hidden`.
9. Token easing/durasi hanya dari `lib/motion-tokens.ts` (lihat DESIGN.md §9).

## 8. Aturan 3D (R3F — Tech Orbit)

- `React.lazy` + `Suspense`; fallback = ilustrasi statis (`orbit-fallback.tsx`, SVG/gradient). Impor three/drei **hanya** di chunk ini.
- Mount `<Canvas>` hanya saat section berada ≤ 200 px dari viewport; **unmount + dispose** saat jauh (batas WebGL context di mobile).
- `dpr={[1, 1.5]}` desktop, `dpr={1}` mobile; `frameloop="demand"` saat tidak terlihat; `powerPreference: "high-performance"`; `antialias` hanya desktop.
- **Tanpa HDR/environment dari CDN.** Pencahayaan: `ambientLight` + 2 `directionalLight` + `Lightformer` lokal bila butuh refleksi.
- Geometri sederhana (icosahedron/torus/octahedron/box/sphere) + `meshStandardMaterial`/`meshPhysicalMaterial`; **jangan** `MeshTransmissionMaterial` di mobile.
- Interaksi: parallax pointer (lerp di `useFrame`), rotasi terhubung progress scroll (nilai dari ScrollTrigger disimpan di `ref`, bukan state).
- Jumlah objek: desktop 8, tablet 6, mobile 4. Deteksi low-power (`hardwareConcurrency ≤ 4`, `deviceMemory ≤ 4`) → pakai fallback statis.
- Canvas `aria-hidden="true"`, `pointer-events` hanya aktif di desktop.

## 9. Responsif (mobile-first)

- Tulis class **tanpa prefix = mobile**, lalu `md:` (≥768), `lg:` (≥1024), `xl:` (≥1280), `2xl:` (≥1536).
- Uji wajib: **320, 360, 390, 430, 768, 820, 1024, 1280, 1440, 1920**, plus landscape phone (844×390) dan landscape tablet (1180×820).
- Gunakan `svh/dvh`, bukan `vh`, untuk hero/footer.
- Tap target ≥ 44×44 px. Teks body ≥ 15 px di mobile.
- Hover hanya di `@media (hover: hover)`.
- Cek safe-area (`env(safe-area-inset-*)`) untuk navbar & footer di iPhone.

## 10. Budget Performa

| Metrik | Target |
|---|---|
| Lighthouse Performance | mobile ≥ 85, desktop ≥ 95 |
| LCP | < 2.5 s (4G, mid-range) — gambar hero di-`preload` |
| CLS | < 0.1 |
| INP | < 200 ms |
| JS awal (gzip, tanpa three) | ≤ 200 KB |
| Chunk three/R3F | lazy, ≤ 220 KB gzip |
| FPS scroll | ≥ 55 fps rata-rata di mid-range Android |

Font: self-host Poppins (400/500/600/700 + 300) subset Latin, `font-display: swap`, preload 2 file utama.

## 11. Aksesibilitas (WCAG 2.2 AA)

- Skip link "Lewati ke konten" paling awal di DOM.
- Focus ring selalu terlihat (`focus-visible`), urutan tab logis.
- Menu mobile = dialog dengan focus trap, `Esc` menutup, scroll body terkunci.
- Kontras: body ≥ 4.5:1, teks besar ≥ 3:1 (periksa teks abu di atas gradient biru).
- Canvas/dekorasi `aria-hidden`; semua informasi penting tersedia sebagai teks HTML.
- Modal proyek: `role="dialog"`, `aria-modal`, kembalikan fokus ke pemicu.
- Jangan sampaikan makna hanya lewat warna.

## 12. Aturan Konten & Etika

- Gunakan **hanya** fakta dari `reference/PORTO_BITI.md`. **Jangan mengarang** testimoni, angka, tahun proyek, nama perusahaan, level bahasa, atau daftar teknologi. Tandai ketidakpastian dengan `TODO(confirm)` di `content/` dan daftarkan di laporan akhir.
- Nomor telepon & email adalah milik pemilik portfolio dan ditaruh di `content/site.ts`. Render email sebagai tautan `mailto:` biasa; untuk telepon gunakan tautan WhatsApp/`tel:` hanya jika pemilik menyetujui (default: tampilkan di section Contact, bukan di footer/meta).
- Jangan menyalin gambar/aset dari Dribbble atau situs lain. Placeholder harus karya sendiri (SVG/gradient). Foto stok hanya bila sumbernya dicatat di `ASSETS.md`.
- Jangan memakai nama/branding "Ethan Miles" atau foto referensi di hasil akhir — referensi hanya untuk gaya.

## 13. Workflow (ikuti urutan; berhenti & lapor di tiap checkpoint ★)

1. Baca PRD.md + DESIGN.md + reference. Tulis **rencana singkat** (daftar file, risiko, pertanyaan aset). ★ tampilkan ke user.
2. Setup project (§3) + `globals.css` token (DESIGN.md §3–4) + font.
3. Bangun primitif motion (`Reveal`, `Magnetic`, `Marquee`, `CountUp`, `TiltCard`, `SplitText`, `CustomCursor`) + `lib/gsap.ts`, `lenis.ts`.
4. Layout: `PageShell`, `Navbar`, `MobileMenu`, `Preloader`. ★ screenshot 390/768/1440.
5. Hero (tanpa liquid dulu, gambar statis) → tambahkan `LiquidPortrait` + fallback. ★
6. About → Services (+ Tech Orbit) → Experience → Portfolio (+ modal) → Credentials → CtaCard.
7. Footer cinematic (adaptasi §5.1).
8. SEO, i18n, tema/OG image, `robots.txt`, `sitemap`.
9. QA: lint, typecheck, unit test, Playwright 3 viewport, Lighthouse, uji reduced-motion, uji tanpa WebGL (flag `--disable-webgl`/`--disable-gpu`). Perbaiki sampai target tercapai.
10. `README.md` (jalankan, ganti konten, ganti aset, matikan efek 3D) + `ASSETS.md` (daftar aset & sumber) + laporan akhir (§15).

## 14. Definition of Done

- [ ] Semua requirement `Must` di PRD terpenuhi.
- [ ] Tidak ada horizontal scroll di 320 px; tidak ada layout shift saat load.
- [ ] Hero liquid berfungsi di desktop (hover), tablet & mobile (sentuh/drag), dan **fallback statis** teruji.
- [ ] Orbit 3D lazy, ter-dispose, dan ada fallback.
- [ ] Footer curtain di desktop, statis di mobile/tablet/layar pendek.
- [ ] `prefers-reduced-motion` teruji.
- [ ] Lighthouse: Perf (m/d) ≥ 85/95, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- [ ] `tsc --noEmit`, `eslint`, `vitest`, `playwright` hijau. Console bersih.
- [ ] Tidak ada placeholder teks sampel dari komponen sumber (SOBERS, Volvox, Forma®, "Download iOS").

## 15. Format Laporan Akhir

1. Ringkasan 3–5 kalimat.
2. Daftar file dibuat/diubah (grup per folder).
3. Cara menjalankan: `npm run dev`, `npm run build`, `npm run test`, `npm run e2e`.
4. Hasil Lighthouse + FPS (atau perkiraan jujur jika tidak bisa diukur).
5. Keputusan/kompromi (mis. partikel dikurangi di mobile).
6. **Daftar `TODO(asset)` dan `TODO(confirm)`** yang butuh input user.

## 16. Larangan Keras

- Jangan commit API key/secret. Form kontak (jika ada) hanya ke endpoint dari `.env` (`VITE_CONTACT_ENDPOINT`).
- Jangan memuat skrip pihak ketiga/analytics tanpa persetujuan.
- Jangan pakai `100vh` untuk hero/footer; jangan animasi layout properties.
- Jangan menonaktifkan aturan lint/TS untuk "membereskan" error.
- Jangan menimpa file di `reference/`.
