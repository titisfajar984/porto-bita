# Adinda Wira Zahra Tsabitah — Portfolio

Website portofolio satu halaman untuk **Adinda Wira Zahra Tsabitah** (IT Enthusiast, lulusan S1 Sistem Informasi).
Interaktif dan animatif: potret partikel cair (WebGL2 GPGPU), Tech Orbit 3D (React Three Fiber), animasi scroll GSAP, dan footer sinematik "tirai". Mobile-first, aksesibel, dengan fallback berlapis.

Spesifikasi lengkap ada di [`AGENT.md`](./AGENT.md), [`PRD.md`](./PRD.md), dan [`DESIGN.md`](./DESIGN.md). Daftar aset & sumbernya ada di [`ASSETS.md`](./ASSETS.md).

---

## Menjalankan

```bash
npm install
npm run dev        # dev server (Vite)
npm run build      # typecheck + production build ke dist/
npm run preview    # jalankan hasil build
```

Perintah kualitas:

```bash
npm run typecheck  # tsc untuk kode aplikasi + test
npm run lint       # ESLint
npm run format     # Prettier
npm run test       # Vitest (unit)
npm run e2e        # Playwright — 3 viewport (390 / 820 / 1440)
```

> `npm run e2e` menjalankan `npm run preview` sendiri. Jalankan `npm run build` lebih dulu.

---

## Struktur

```
public/
  fonts/            Poppins 300–700 (latin subset, self-host)
  images/           adinda-hero.webp (+ -mobile), adinda-about-*.webp (srcset 640/1024/1600)
  projects/         6 cover proyek (1200×900 WebP)
  og-image.png      1200×630
  favicon.svg  robots.txt  sitemap.xml  site.webmanifest  404.html
reference/          dokumen sumber (tidak ikut di-bundle)
src/
  app/              App providers: i18n, Lenis, MotionConfig
  components/
    ui/             button, dialog (shadcn/ui) + motion-footer + brand-icons
    motion/         Reveal, SplitText, Magnetic, Marquee, CountUp, TiltCard, Parallax, CustomCursor
    liquid/         liquid-engine.ts (WebGL2 GPGPU), LiquidPortrait.tsx
    three/          TechOrbit.tsx, TechOrbitScene.tsx, orbit-fallback.tsx
    sections/       Hero, About, Services, Experience, Portfolio, Credentials, CtaCard
    layout/         Navbar, MobileMenu, Preloader, PageShell
  hooks/            useMediaQuery, useReducedMotion, useInViewOnce, useWebGL2, useLowPower,
                    useIsTouch, useGsapContext, useFocusTrap, useBodyScrollLock, useActiveSection,
                    useScrollProgress
  lib/              utils, gsap, lenis, motion-tokens, seo
  content/          site, projects, experience, services, testimonials, i18n/{id,en}
  styles/           globals.css (design token, font, utility)
tests/              unit (Vitest) + e2e (Playwright)
```

---

## Mengubah konten

Semua teks ada di `src/content/` — tidak ada copy yang ditulis langsung di JSX.

| Ingin mengubah | File |
|---|---|
| Nama, email, telepon, tautan sosial, statistik | `src/content/site.ts` |
| Daftar proyek (judul, kategori, konteks, ringkasan, tautan) | `src/content/projects.ts` |
| Timeline pendidikan & pengalaman | `src/content/experience.ts` |
| Lima layanan + label orbit + chip teknologi | `src/content/services.ts` |
| Teks apa pun per bahasa | `src/content/i18n/id.ts` dan `src/content/i18n/en.ts` |

**Aturan penting:** kedua file bahasa harus punya struktur kunci yang sama. `tests/i18n.test.ts` akan gagal kalau tidak.

Bahasa default **Indonesia**; tombol ID/EN di navbar menyimpan pilihan ke `localStorage` dan memperbarui `<html lang>`.

### Menghidupkan tombol "Unduh CV"

Taruh file di `public/cv/Adinda-CV.pdf`, lalu di `src/components/sections/About.tsx` ubah:

```ts
const hasCv = false   // →  true
```

dan bungkus tombol dengan `<a href="/cv/Adinda-CV.pdf" download>`.

---

## Mengganti aset

| Aset | Path | Ukuran disarankan |
|---|---|---|
| Foto hero (cut-out transparan) | `public/images/adinda-hero.webp` | ±1120×1400, alpha, ≤ 350 KB |
| Foto hero (mobile) | `public/images/adinda-hero-mobile.webp` | ±720×900 |
| Foto About | `public/images/adinda-about-{640,1024,1600}.webp` | rasio 4:3.2 |
| Cover proyek | `public/projects/<slug>.webp` | 1200×900, ≤ 140 KB |
| OG image | `public/og-image.png` | 1200×630 |

Nama file cover harus sama dengan nilai `cover` di `src/content/projects.ts` — `tests/content.test.ts` memverifikasi setiap file benar-benar ada.

**Catatan soal foto hero:** efek liquid membaca channel alpha. Kalau Anda menggantinya dengan foto berlatar (tanpa transparansi), `LiquidPortrait` otomatis jatuh ke mode *flat-key* memakai prop `background` (warna kartu di titik itu). Hasilnya lebih kasar di bagian rambut — cut-out transparan tetap yang terbaik.

---

## Mematikan efek 3D / berat

Tidak perlu menghapus kode — setiap efek punya saklar. Cari di komponennya:

| Efek | Cara mematikan |
|---|---|
| Partikel liquid di hero | Di `src/components/sections/Hero.tsx`, ganti `interactive`/`streaks`/`intro` jadi `false`, atau set `particleDensity={0}` (akan otomatis jatuh ke gambar statis) |
| Tech Orbit 3D | Di `src/components/three/TechOrbit.tsx`, ubah `const usable = ...` menjadi `const usable = false` — akan selalu memakai ilustrasi SVG statis |
| Lenis (smooth scroll) | Di `src/app/providers.tsx`, hapus blok `LenisProvider` |
| Kursor kustom | Di `src/app/providers.tsx`, hapus `<CustomCursor />` |
| Preloader | Di `src/App.tsx`, hapus `<Preloader />` |
| Marquee | Di `src/components/motion/Marquee.tsx`, set `duration` → komponen otomatis statis bila `prefers-reduced-motion` aktif |

Paksa fallback di browser untuk menguji: `chrome --disable-webgl` atau DevTools → Rendering → *Emulate CSS media feature `prefers-reduced-motion`*.

---

## Aksesibilitas

- Skip link paling awal di DOM.
- Focus ring selalu terlihat (`focus-visible`), termasuk di atas gradient biru.
- Menu mobile: `role="dialog"`, `aria-modal`, focus trap, `Esc`, body scroll terkunci.
- Dialog proyek: fokus dikembalikan ke kartu pemicu.
- Semua canvas `aria-hidden`; `<img alt>` potret tetap ada di DOM dalam keadaan apa pun.
- `prefers-reduced-motion` mematikan Lenis, marquee, parallax, tilt, magnetic, partikel intro/ambient, dan kursor kustom.

## Performa

- three/R3F hanya dimuat saat section Services mendekati viewport, dan di-`dispose` saat jauh.
- Chunk `three` dipisah lewat `manualChunks` di `vite.config.ts`.
- Partikel liquid dijeda saat offscreen atau tab tidak aktif (`IntersectionObserver` + `visibilitychange`).
- Font dan gambar hero di-`preload`; semua gambar lain `loading="lazy"`.

## Skrip bantu

```bash
node scripts/capture-screenshots.mjs   # screenshot 390 / 768 / 1440 + reduced-motion → screenshots/
node scripts/capture-canvas.mjs        # tangkap kanvas potret saja
python scripts/compare-portrait.py     # bandingkan render partikel vs foto sumber (korelasi, luminans)
node scripts/measure-portrait.mjs      # ringkasan cepat di dalam browser
```

`compare-portrait.py` butuh Pillow. Hasil terakhir: korelasi luminans **0.965**, rata-rata luminans 157,0 vs 159,8 pada sumber, simpangan baku 78,4 vs 78,3 — artinya kondisi diam sudah terbaca sebagai foto, bukan awan titik.

## Catatan implementasi

- **`LiquidPortrait` memakai pemetaan `object-fit: contain; object-position: bottom center`** yang sama persis dengan `<img>` statis. Kalau pemetaan ini diubah, partikel akan meleset dari gambar fallback saat crossfade dan potret terlihat gepeng. `tests/liquid-geometry.test.ts` mengunci geometrinya.
- **Pass simulasi mematikan blending.** State partikel adalah *replace*, bukan komposit; membiarkan blending menyala membuat tiap frame menambahkan hasilnya ke state sebelumnya dan seluruh medan partikel meledak.
- **Turbulensi ambient dimatikan saat diam** (×0.05) dan hanya hidup saat kursor berada di atas potret. Tanpa ini partikel terus bergetar dan potret tidak pernah tajam.
- **Ukuran titik diskalakan** ke `sqrt(area kanvas / jumlah partikel)`, jadi potret tetap solid di layar high-DPI.
- **Chunk `three` 245,6 KB gzip**, di atas target AGENT.md §10 (≤ 220 KB). Sudah diuji: menghapus `@react-three/drei` sama sekali tidak mengubah ukuran chunk — biayanya murni `three` + `@react-three/fiber`. Chunk ini lazy dan di-`dispose` saat jauh dari viewport.

## Lisensi

Kode proyek ini: MIT. Font **Poppins** © Indian Type Foundry, dirilis di bawah SIL Open Font License 1.1.
