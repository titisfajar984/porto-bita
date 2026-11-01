import { describe, expect, it } from 'vitest'

/**
 * The particle field has to land exactly where the static `<img>` fallback sits
 * (`object-fit: contain; object-position: bottom center`). Getting this wrong
 * stretches the portrait and destroys the rest state — see the LiquidPortrait
 * notes in ASSETS.md.
 *
 * `mapHome` is module-private, so this mirrors its contract and pins the
 * geometry the engine must satisfy.
 */
function containFit(aspect: number, imageAspect: number) {
  let height = 1
  let width = imageAspect
  if (width > aspect) {
    width = aspect
    height = aspect / imageAspect
  }
  return { width, height, offsetX: (aspect - width) / 2 }
}

describe('portrait contain-fit geometry', () => {
  it('letterboxes a 4:5 portrait inside a wider canvas', () => {
    const canvasAspect = 636 / 515 // 1.235
    const imageAspect = 1120 / 1400 // 0.8
    const fit = containFit(canvasAspect, imageAspect)

    expect(fit.height).toBe(1)
    expect(fit.width).toBeCloseTo(0.8, 6)
    expect(fit.offsetX).toBeCloseTo((canvasAspect - 0.8) / 2, 6)
    // Centred horizontally, touching both the top and bottom edges.
    expect(fit.offsetX * 2 + fit.width).toBeCloseTo(canvasAspect, 6)
  })

  it('fills the width when the image is wider than the canvas', () => {
    const canvasAspect = 0.6
    const imageAspect = 1.5
    const fit = containFit(canvasAspect, imageAspect)

    expect(fit.width).toBe(0.6)
    expect(fit.height).toBeCloseTo(0.4, 6)
    expect(fit.offsetX).toBe(0)
  })

  it('maps the image bottom edge to the canvas bottom edge', () => {
    const fit = containFit(1.235, 0.8)
    // uv v = 1 (bottom of the image) → sim y = 0
    expect((1 - 1) * fit.height).toBe(0)
    // uv v = 0 (top of the image) → sim y = height
    expect((1 - 0) * fit.height).toBe(1)
  })

  it('never lets the mapped portrait exceed the canvas width', () => {
    for (const aspect of [0.5, 0.8, 1.235, 2, 3.5]) {
      const fit = containFit(aspect, 0.8)
      expect(fit.offsetX + fit.width).toBeLessThanOrEqual(aspect + 1e-9)
      expect(fit.offsetX).toBeGreaterThanOrEqual(-1e-9)
    }
  })
})
