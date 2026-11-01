import { useCallback, useEffect, useState } from 'react'

import { NavbarPill } from '@/components/layout/Navbar'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { PageShell } from '@/components/layout/PageShell'
import { Preloader } from '@/components/layout/Preloader'
import { About } from '@/components/sections/About'
import { Credentials } from '@/components/sections/Credentials'
import { CtaCard } from '@/components/sections/CtaCard'
import { Experience } from '@/components/sections/Experience'
import { Hero } from '@/components/sections/Hero'
import { Portfolio } from '@/components/sections/Portfolio'
import { Services } from '@/components/sections/Services'
import { CinematicFooter } from '@/components/ui/motion-footer'
import { useActiveSection } from '@/hooks/useActiveSection'
import { refreshScrollTrigger } from '@/lib/gsap'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [preloaderDone, setPreloaderDone] = useState(false)
  const activeSection = useActiveSection()

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const openMenu = useCallback(() => setMenuOpen(true), [])

  // Re-measure scroll positions once the preloader has handed the page over.
  useEffect(() => {
    const id = window.setTimeout(() => refreshScrollTrigger(), 140)
    return () => window.clearTimeout(id)
  }, [preloaderDone])

  return (
    <>
      <Preloader onComplete={() => setPreloaderDone(true)} />
      <NavbarPill activeSection={activeSection} />
      <MobileMenu open={menuOpen} onClose={closeMenu} activeSection={activeSection} />

      <PageShell>
        <div className="mx-auto w-full max-w-[1360px] space-y-4 px-3 py-3 md:space-y-5 md:px-5 md:py-5 lg:space-y-6 lg:px-7 lg:py-6">
          <Hero activeSection={activeSection} onOpenMenu={openMenu} />
          <About />
          <Services />
          <Experience />
          <Portfolio />
          <Credentials />
          <CtaCard />
        </div>
      </PageShell>

      {/* The footer must be a direct sibling of <main> for the curtain to work (AGENT.md §5.1 #8). */}
      <CinematicFooter />
    </>
  )
}
