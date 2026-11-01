/**
 * Captures the hero canvas on its own so the fidelity check can compare it to
 * the source portrait outside the browser (see compare-portrait.py).
 *
 *   node scripts/capture-canvas.mjs
 */
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const BASE = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:4173'
mkdirSync('screenshots', { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})
page.on('pageerror', (e) => errors.push(e.message))

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(5000)

const state = await page.evaluate(() => {
  const host = document.querySelector('[data-gl]')
  return { dataGl: host?.getAttribute('data-gl'), glError: host?.getAttribute('data-gl-error') }
})

await page.locator('[data-gl] canvas').screenshot({ path: 'screenshots/canvas-only.png' })
await page.locator('[data-gl]').screenshot({ path: 'screenshots/portrait-host.png' })

console.log(JSON.stringify({ ...state, consoleErrors: errors }, null, 2))
await browser.close()
