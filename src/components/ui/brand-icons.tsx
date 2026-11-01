import type { SVGProps } from 'react'

/**
 * Brand marks are inline SVG on purpose (DESIGN.md §12): lucide dropped its
 * brand glyphs, and the design asks for simple monochrome outlines rather than
 * full-colour logos. All three inherit `currentColor`.
 */
export type BrandIconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 16, ...props }: BrandIconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    focusable: 'false' as const,
    ...props,
  }
}

export function InstagramIcon(props: BrandIconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function GithubIcon(props: BrandIconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 19c-4.3 1.3-4.3-2.2-6-2.6m12 5.6v-3.6a3.1 3.1 0 0 0-.9-2.4c3-.3 5-2 5-5.6a4.3 4.3 0 0 0-1.2-3 4 4 0 0 0-.1-3s-1.2-.4-3.9 1.5a9.4 9.4 0 0 0-5 0C6.2 3.9 5 4.3 5 4.3a4 4 0 0 0-.1 3 4.3 4.3 0 0 0-1.2 3c0 3.6 2 5.3 5 5.6a3.1 3.1 0 0 0-.9 2.4V22" />
    </svg>
  )
}

export function LinktreeIcon(props: BrandIconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v6M12 9 8.5 5.5M12 9l3.5-3.5" />
      <path d="M4.5 14.5h15" />
      <path d="M12 14.5V21" />
    </svg>
  )
}
