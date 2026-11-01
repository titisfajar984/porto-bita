import type { ReactNode } from 'react'

import { useI18n } from '@/app/i18n-context'

/**
 * Root page shell.
 *
 * `<main>` must stay a direct sibling of the cinematic footer and carry
 * `rounded-b-[32px]` + `z-10` so the footer "curtain" reads as sliding out from
 * behind it (AGENT.md §5.1 #8, DESIGN.md §7.8).
 */
export function PageShell({ children }: { children: ReactNode }) {
  const { t } = useI18n()

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        {t.common.skipToContent}
      </a>
      <main
        id="main"
        className="relative z-10 rounded-b-[32px] bg-page shadow-[0_40px_80px_-40px_rgba(25,45,120,.35)]"
      >
        {children}
      </main>
    </>
  )
}
