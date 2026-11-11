const particles = [
  'leaf', 'petal', 'leaf', 'petal', 'petal',
  'leaf', 'petal', 'leaf', 'petal', 'leaf',
] as const

export function AmbientEffects({ enabled }: { enabled: boolean }) {
  if (!enabled) return null

  return (
    <>
      <div className="floating-bubbles" aria-hidden="true">
        <span /><span /><span /><span /><span /><span />
      </div>
      <div className="falling-botanicals" aria-hidden="true">
        {particles.map((shape, index) => <span className={`falling-${shape}`} key={index} />)}
      </div>
    </>
  )
}
