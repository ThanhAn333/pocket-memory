import { useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Flower2, MailOpen } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

type Phase = 'closed' | 'opening' | 'opened'

export function Envelope({ guest, onOpen }: { guest: string; onOpen: () => void }) {
  const scope = useRef<HTMLDivElement>(null)
  const phase = useRef<Phase>('closed')
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const [state, setState] = useState<Phase>('closed')
  const { contextSafe } = useGSAP(() => () => timeline.current?.kill(), { scope })

  function finish() {
    phase.current = 'opened'
    setState('opened')
    onOpen()
  }

  function open() {
    if (phase.current === 'opened') {
      onOpen()
      return
    }
    if (phase.current !== 'closed') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return
    }

    phase.current = 'opening'
    setState('opening')
    try {
      contextSafe(() => {
        timeline.current = gsap.timeline({ onComplete: finish })
          .to('.wax', { scale: 0.8, opacity: 0, duration: 0.22, ease: 'power2.in' })
          .to('.flap', { rotationX: -177, duration: 0.68, ease: 'power2.inOut' }, 0.14)
          .set('.flap', { zIndex: 1 }, 0.48)
          .to('.letter', { yPercent: -48, duration: 0.75, ease: 'power3.out' }, 0.53)
          .to('.envelope-shadow', { opacity: 0.55, scaleX: 0.92, duration: 0.55 }, 0.35)
      })()
    } catch {
      timeline.current?.kill()
      finish()
    }
  }

  function skip() {
    if (phase.current === 'opening') {
      timeline.current?.kill()
      contextSafe(() => gsap.set('.wax, .flap, .letter, .envelope-shadow', { clearProps: 'all' }))()
    }
    phase.current = 'opened'
    setState('opened')
  }

  return (
    <div ref={scope} className="envelope-scene" data-state={state}>
      <div className="stationery" data-intro>
        <div className="stationery-rule" aria-hidden="true" />
        <button className="envelope-button" type="button" onClick={open} aria-disabled={state === 'opening'}
          aria-controls="graduate" aria-label={state === 'opened' ? 'Xem phần giới thiệu' : 'Mở phong thư'}>
          <span className="envelope" aria-hidden="true">
            <span className="envelope-shadow" />
            <span className="envelope-back" />
            <span className="letter"><Flower2 size={20} /><span>A Letter to Remember</span></span>
            <span className="envelope-pocket" />
            <span className="flap" />
            <span className="wax"><Flower2 size={25} strokeWidth={1.1} /></span>
          </span>
        </button>
        <span className="stationery-note" lang={guest ? 'vi' : 'en'}>{guest ? `Thân gửi ${guest}` : 'A letter to remember'}</span>
      </div>
      <div className="hero-actions" data-intro>
        <button className="button primary" type="button" onClick={open} aria-disabled={state === 'opening'} aria-controls="graduate">
          <MailOpen size={17} /> {state === 'closed' ? 'Chạm để mở thư' : state === 'opening' ? 'Đang mở thư…' : 'Đọc thư mời'}
        </button>
        <a className="text-link" href="#ceremony" onClick={skip}>Xem thông tin ngay <ArrowUpRight size={15} /></a>
      </div>
      <a className="scroll-cue" href="#graduate" aria-label="Cuộn đến phần giới thiệu"><ArrowDown size={17} /></a>
    </div>
  )
}
