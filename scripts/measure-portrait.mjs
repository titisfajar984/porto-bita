/**
 * Objective fidelity check for the liquid portrait: screenshots the hero canvas
 * and compares it against the source portrait image.
 *
 *   node scripts/measure-portrait.mjs
 */
import { chromium } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'

const BASE = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:4173'
mkdirSync('screenshots', { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const logs = []
page.on('console', (m) => {
  if (m.type() === 'error') logs.push(m.text())
})
page.on('pageerror', (e) => logs.push(e.message))

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(5000)

const report = await page.evaluate(async () => {
  const host = document.querySelector('[data-gl]')
  const canvas = host.querySelector('canvas')
  const img = host.querySelector('img')

  // Render the canvas into an offscreen 2D canvas so we can compare pixels.
  const off = document.createElement('canvas')
  off.width = 400
  off.height = Math.round((canvas.height / canvas.width) * 400)
  const ctx = off.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, off.width, off.height)
  ctx.drawImage(canvas, 0, 0, off.width, off.height)

  // Reference: the same source image, contain-fitted to the same box.
  const ref = document.createElement('canvas')
  ref.width = off.width
  ref.height = off.height
  const rctx = ref.getContext('2d')
  rctx.fillStyle = '#ffffff'
  rctx.fillRect(0, 0, ref.width, ref.height)
  const ratio = img.naturalWidth / img.naturalHeight
  let w = ref.width
  let h = ref.height
  if (ratio > ref.width / ref.height) h = ref.width / ratio
  else w = ref.height * ratio
  rctx.drawImage(img, (ref.width - w) / 2, ref.height - h, w, h)

  const a = ctx.getImageData(0, 0, off.width, off.height).data
  const b = rctx.getImageData(0, 0, ref.width, ref.height).data

  let diff = 0
  let covered = 0
  let subjectPixels = 0
  let subjectCovered = 0
  for (let i = 0; i < a.length; i += 4) {
    const dr = a[i] - b[i]
    const dg = a[i + 1] - b[i + 1]
    const db = a[i + 2] - b[i + 2]
    diff += Math.sqrt(dr * dr + dg * dg + db * db)
    const refIsBackground = b[i] > 246 && b[i + 1] > 246 && b[i + 2] > 246
    if (!refIsBackground) {
      subjectPixels += 1
      const drawn = Math.abs(a[i] - 255) + Math.abs(a[i + 1] - 255) + Math.abs(a[i + 2] - 255)
      if (drawn > 24) {
        subjectCovered += 1
        covered += 1
      }
    }
  }
  const pixels = a.length / 4
  return {
    dataGl: host.getAttribute('data-gl'),
    glError: host.getAttribute('data-gl-error'),
    particles: window.__liquidParticles ?? null,
    meanAbsoluteError: +(diff / pixels).toFixed(2),
    fidelityPercent: +(100 - (diff / pixels) / 4.41).toFixed(1),
    subjectCoveragePercent: +((subjectCovered / Math.max(1, subjectPixels)) * 100).toFixed(1),
    subjectPixels,
  }
})

console.log(JSON.stringify(report, null, 2))
if (logs.length) console.log('console errors:', logs.join('\n'))
writeFileSync('screenshots/portrait-report.json', JSON.stringify(report, null, 2))
await browser.close()
