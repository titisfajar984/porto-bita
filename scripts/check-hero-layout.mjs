import { chromium } from '@playwright/test'

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
await p.waitForTimeout(3500)

const out = await p.evaluate(() => {
  const box = (el) => {
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
  }
  const head = document.querySelector('#hero-heading').getBoundingClientRect()
  const chips = [...document.querySelectorAll('[data-chip-depth]')].map((c) => {
    const r = c.getBoundingClientRect()
    const overlaps = !(r.right < head.left || r.left > head.right || r.bottom < head.top || r.top > head.bottom)
    return { text: c.textContent.trim(), x: Math.round(r.x), y: Math.round(r.y), overlapsHeadline: overlaps }
  })
  return { headline: box(document.querySelector('#hero-heading')), chips }
})

console.log(JSON.stringify(out))
await p.screenshot({ path: 'screenshots/desktop-1440-hero.png' })
await p.locator('#home').screenshot({ path: 'screenshots/hero-card.png' })
await b.close()
