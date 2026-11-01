/**
 * PRD §6.5: there is no testimonial data in the source. The section is NOT
 * rendered while this array is empty — no fake quotes, ever.
 */
export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  avatar: string
}

export const TESTIMONIALS: Testimonial[] = []
