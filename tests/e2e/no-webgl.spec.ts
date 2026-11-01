import { expect, test } from '@playwright/test'

/**
 * PRD §12 acceptance #4: with WebGL unavailable the hero and the orbit must fall
 * back to static imagery and the console must stay clean.
 */
test.describe('no-WebGL fallback', () => {
  test('hero falls back to the static portrait with no console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    page.on('pageerror', (error) => errors.push(error.message))

    await page.goto('/')
    await page.waitForTimeout(3000)

    const host = page.locator('[data-gl]')
    await expect(host).toHaveAttribute('data-gl', 'off')

    // The accessible <img> is the visible layer in this mode.
    await expect(host.getByAltText(/Potret Adinda/i)).toBeVisible()

    const canvasOpacity = await host
      .locator('canvas')
      .evaluate((element) => getComputedStyle(element).opacity)
    expect(canvasOpacity).toBe('0')

    expect(errors, errors.join('\n')).toEqual([])
  })

  test('tech orbit falls back to the static illustration', async ({ page }) => {
    await page.goto('/')
    await page.locator('#service').scrollIntoViewIfNeeded()
    await page.waitForTimeout(1500)

    await expect(page.getByRole('img', { name: /ilustrasi statis orbit teknologi/i })).toBeVisible()
  })

  test('the page still has no horizontal overflow', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })
})
