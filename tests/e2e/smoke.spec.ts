import { expect, test } from '@playwright/test'

test.describe('portfolio smoke', () => {
  test('renders the hero and every section anchor', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toContainText('ADINDA')

    for (const id of ['home', 'about', 'service', 'experience', 'portfolio', 'contact']) {
      await expect(page.locator(`#${id}`)).toBeAttached()
    }
  })

  test('never scrolls horizontally', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(1)
  })

  test('lists all six projects and opens a detail dialog', async ({ page }) => {
    await page.goto('/')
    await page.locator('#portfolio').scrollIntoViewIfNeeded()

    const cards = page.getByRole('button', { name: /Pratinjau proyek/i })
    await expect(cards).toHaveCount(6)

    await cards.first().click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('switches language and updates <html lang>', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'id')

    await page.getByRole('button', { name: /Ganti bahasa/i }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })

  test('keeps the portrait image in the DOM for assistive tech', async ({ page }) => {
    await page.goto('/')
    const portrait = page.getByAltText(/Potret Adinda/i)
    await expect(portrait).toBeAttached()
    await expect(portrait).toHaveAttribute('src', /adinda-hero/)
  })

  test('skips continuous motion under prefers-reduced-motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/')

    const marquee = page.locator('[data-marquee]').first()
    await expect(marquee).toHaveAttribute('data-marquee', 'static')

    await context.close()
  })
})
