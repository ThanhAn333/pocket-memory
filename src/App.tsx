import { useEffect, useRef, useState } from 'react'
import { Flower2, Leaf, Volume2, VolumeX } from 'lucide-react'
import { Envelope } from './components/Envelope'
import { AmbientEffects } from './components/AmbientEffects'
import { Album, Ceremony, Closing, Graduate } from './components/Chapters'
import { invitation } from './config/invitation'
import { useStoryMotion } from './hooks/useMotion'
import './App.css'

function SoundControl() {
  const audio = useRef<HTMLAudioElement>(null)
  const pending = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const element = audio.current
    if (!element) return

    let active = true
    function removeGestureFallback() {
      document.removeEventListener('click', startOnGesture, true)
    }
    function startOnGesture(event: MouseEvent) {
      if (event.target instanceof Element && event.target.closest('.sound')) return
      removeGestureFallback()
      if (element?.paused) {
        void element.play().catch(() => {
          if (active) setMessage('Hãy chạm nút âm thanh để bật nhạc.')
        })
      }
    }

    document.addEventListener('click', startOnGesture, true)
    element.addEventListener('playing', removeGestureFallback, { once: true })
    void element.play().catch((error: unknown) => {
      if (!active || !element.paused) return
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setMessage('Chạm vào trang để bắt đầu nhạc.')
      } else if (!(error instanceof DOMException && error.name === 'AbortError')) {
        removeGestureFallback()
        setMessage('Không thể phát nhạc nền.')
      }
    })

    return () => {
      active = false
      removeGestureFallback()
      element.removeEventListener('playing', removeGestureFallback)
      element.pause()
    }
  }, [])

  async function toggle() {
    const element = audio.current
    if (!element) {
      setMessage((current) => current ? '' : 'Nhạc nền chưa được thêm.')
      return
    }
    if (pending.current) return
    if (!element.paused) {
      element.pause()
      setMessage('')
      return
    }
    pending.current = true
    setMessage('')
    try {
      await element.play()
    } catch {
      setMessage('Không thể phát nhạc nền.')
    } finally {
      pending.current = false
    }
  }

  return <div className="sound">
    {invitation.musicUrl && <audio ref={audio} src={invitation.musicUrl} preload="auto" loop
      onPlaying={() => { setPlaying(true); setMessage('') }} onPause={() => setPlaying(false)} onError={() => {
        setPlaying(false)
        setMessage('Không thể phát nhạc nền.')
      }} />}
    <button className="sound-button" onClick={toggle} aria-pressed={playing} aria-label="Nhạc nền">
      {playing ? <Volume2 size={16} /> : <VolumeX size={16} />}<span>{playing ? 'Tắt nhạc' : 'Bật nhạc'}</span>
    </button>
    <div className="sound-status" role="status">{message}</div>
  </div>
}

function moveTo(id: string, focusSelector: string) {
  const section = document.getElementById(id)
  section?.querySelector<HTMLElement>(focusSelector)?.focus({ preventScroll: true })
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  section?.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth' })
}

function App() {
  const story = useRef<HTMLDivElement>(null)
  const [replay, setReplay] = useState(0)
  const [ambientEffects, setAmbientEffects] = useState(true)
  const [guest] = useState(() => Array.from(new URLSearchParams(window.location.search).get('to')?.trim() || '').slice(0, 100).join(''))
  useStoryMotion(story, replay)

  function restart() {
    setReplay((value) => value + 1)
    if (window.location.hash) window.history.replaceState(null, '', window.location.pathname + window.location.search)
    moveTo('top', 'h1')
  }

  return (
    <div ref={story} id="top">
      <AmbientEffects enabled={ambientEffects} />
      <a className="skip-link" href="#ceremony">Đến thông tin buổi lễ</a>
      <header className="site-header">
        <a className="wordmark" href="#top" lang="en"><Flower2 size={25} strokeWidth={1.15} /> Pocket Memories</a>
        <div className="header-controls">
          <button type="button" className="sound-button ambient-toggle" aria-label="Hiệu ứng nền"
            title="Bật hoặc tắt hoa lá và bong bóng" aria-pressed={ambientEffects} onClick={() => setAmbientEffects((enabled) => !enabled)}>
            <Leaf size={17} />
          </button>
          <SoundControl />
        </div>
      </header>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="chapter-label" data-intro lang="en"><span aria-hidden="true" />01 / A Letter for You<span aria-hidden="true" /></p>
            <h1 id="hero-title" tabIndex={-1} data-intro lang="en">A little letter <em>for you.</em></h1>
            <p data-intro>Có một lời mời đặc biệt dành cho bạn.</p>
          </div>
          <Envelope key={replay} guest={guest} onOpen={() => moveTo('graduate', 'h2')} />
        </section>
        <Graduate />
        <Album />
        <Ceremony />
        <Closing onReplay={restart} />
      </main>
      <footer className="site-footer"><a className="wordmark" href="#top" lang="en"><Flower2 size={21} strokeWidth={1.15} /> Pocket Memories</a></footer>
    </div>
  )
}

export default App
