import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { RefObject } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function animateChapter(chapter: HTMLElement) {
  const light = chapter.querySelector('.chapter-transition span')
  const heading = chapter.querySelectorAll('.chapter-label, h2')
  if (!light || !heading.length) return

  const transition = gsap.timeline({ paused: true })
    .fromTo(light, { yPercent: -90, opacity: 0 }, {
      yPercent: 15, opacity: 0.85, duration: 0.43, ease: 'power2.out', immediateRender: false,
    })
    .to(light, { yPercent: 115, opacity: 0, duration: 0.64, ease: 'power2.in' })
    .fromTo(heading, { y: 18, opacity: 0.58 }, {
      y: 0, opacity: 1, duration: 0.64, stagger: 0.08, ease: 'power3.out', immediateRender: false,
    }, 0.15)

  ScrollTrigger.create({
    trigger: chapter,
    start: 'top 76%',
    end: 'bottom 24%',
    onEnter: () => { transition.restart() },
    onEnterBack: () => { transition.restart() },
  })
}

export function useStoryMotion(scope: RefObject<HTMLElement | null>, replay: number) {
  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add({
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 768px)',
    }, ({ conditions }) => {
      if (!conditions?.motion) return
      gsap.from('[data-intro]', { y: 12, opacity: 0.45, duration: 0.7, stagger: 0.08, ease: 'power2.out' })
      gsap.utils.toArray<HTMLElement>('main > .chapter', scope.current).forEach(animateChapter)
      gsap.utils.toArray<HTMLElement>('[data-reveal]', scope.current).forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight * 0.88) return
        gsap.from(element, {
          y: 22, opacity: 0.5, duration: 0.75, ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 90%', once: true },
        })
      })
      gsap.utils.toArray<HTMLElement>('[data-photo]', scope.current).forEach((element) => {
        if (element.getBoundingClientRect().top >= window.innerHeight * 0.9) {
          gsap.from(element, {
            clipPath: 'inset(7% 0 7% 0)', duration: 0.75, ease: 'power2.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          })
        }
        if (conditions.desktop) {
          gsap.fromTo(element, { objectPosition: '50% 44%' }, {
            objectPosition: '50% 56%', ease: 'none',
            scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        }
      })
    })
    return () => media.revert()
  }, { scope, dependencies: [replay], revertOnUpdate: true })
}
