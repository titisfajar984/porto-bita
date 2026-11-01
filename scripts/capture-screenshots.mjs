/**
 * Capture checkpoint screenshots at the three acceptance viewports
 * (AGENT.md §13 item 4). Run against a live preview server:
 *
 *   npm run build
 *   npm run preview -- --port 4173
 *   node scripts/capture-screenshots.mjs
 *
 * Output: screenshots/<viewport>-<mode>.png
 */
import { mkdirSync } from 'node:fs'
import { chromium } from '@playwright/test'

const BASE = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:4173'
const OUT = 'screenshots'

const VIEWPORTS = [
  { name: 'mobile-390', width: 390, height: 844, mobile: true },
  { name: 'tablet-768', width: 768, height: 1024, mobile: false },
  { name: 'desktop-1440', width: 1440, height: 900, mobile: false },
]

mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: viewport.mobile,
    isMobile: viewport.mobile,
  })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2600) // let the preloader and hero intro settle

  await page.screenshot({ path: `${OUT}/${viewport.name}-hero.png` })

  for (const section of ['about', 'service', 'experience', 'portfolio', 'contact']) {
    await page.locator(`#${section}`).scrollIntoViewIfNeeded()
    await page.waitForTimeout(1400)
    await page.screenshot({ path: `${OUT}/${viewport.name}-${section}.png` })
  }

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(1600)
  await page.screenshot({ path: `${OUT}/${viewport.name}-footer.png` })

  await context.close()
  console.log(`captured ${viewport.name}`)
}

// Reduced-motion pass at desktop width.
const reduced = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
})
const reducedPage = await reduced.newPage()
await reducedPage.goto(BASE, { waitUntil: 'networkidle' })
await reducedPage.waitForTimeout(1600)
await reducedPage.screenshot({ path: `${OUT}/desktop-1440-reduced-motion.png` })
await reduced.close()
console.log('captured reduced-motion')

await browser.close()
console.log('done')
