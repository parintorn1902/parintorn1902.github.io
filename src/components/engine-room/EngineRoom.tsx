import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { destinations, destinationForHash, sections, profile } from './journey'
import type { Destination } from './journey'
import { DestinationContent, FullDetails } from './Content'
import './engine-room.css'

const World = lazy(() => import('./World'))
class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onFailure() }
  render() { return this.state.failed ? null : this.props.children }
}

export default function EngineRoom() {
  const [target, setTarget] = useState(() => destinationForHash(window.location.hash))
  const [active, setActive] = useState(target)
  const [traveling, setTraveling] = useState(true)
  const [animated, setAnimated] = useState(() => !matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [tour, setTour] = useState(false)
  const [sceneAvailable, setSceneAvailable] = useState(true)
  const [visible, setVisible] = useState(() => !document.hidden)
  const [details, setDetails] = useState<Destination | null>(null)
  const detailsDialog = useRef<HTMLDialogElement>(null)
  const helpDialog = useRef<HTMLDialogElement>(null)
  const requested = useRef(target.id)
  const wheel = useRef({ amount: 0, last: 0, lockedUntil: 0 })

  const arrive = useCallback((id: string) => {
    // Ignore an interrupted flight's completion; only the latest requested destination may commit.
    if (id !== requested.current) return
    const destination = destinations.find(item => item.id === id)
    if (destination) { setActive(destination); setTraveling(false) }
  }, [])
  const go = useCallback((destination: Destination, updateHistory = true) => {
    if (destination.id === requested.current) return
    requested.current = destination.id; setTarget(destination)
    if (sceneAvailable) setTraveling(true)
    else { setActive(destination); setTraveling(false) }
    if (updateHistory && window.location.hash !== `#${destination.section}`) history.pushState(null, '', `#${destination.section}`)
  }, [sceneAvailable])
  const step = useCallback((direction: number) => {
    const index = destinations.findIndex(d => d.id === requested.current)
    go(destinations[Math.max(0, Math.min(destinations.length - 1, index + direction))])
  }, [go])
  const failScene = useCallback(() => { setSceneAvailable(false); setTraveling(false); setActive(destinations.find(d => d.id === requested.current) ?? destinations[0]); setTour(false) }, [])

  useEffect(() => {
    const change = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', change)
    return () => document.removeEventListener('visibilitychange', change)
  }, [])
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setAnimated(!media.matches)
    media.addEventListener('change', change)
    return () => media.removeEventListener('change', change)
  }, [])
  useEffect(() => {
    const change = () => go(destinationForHash(window.location.hash), false)
    window.addEventListener('popstate', change); window.addEventListener('hashchange', change)
    return () => { window.removeEventListener('popstate', change); window.removeEventListener('hashchange', change) }
  }, [go])
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (detailsDialog.current?.open || helpDialog.current?.open || (event.target instanceof Element && event.target.closest('input,textarea,[contenteditable]'))) return
      if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) { event.preventDefault(); setTour(false); step(['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [step])
  useEffect(() => {
    if (!tour || traveling || details || !visible) return
    const timer = setTimeout(() => {
      const index = destinations.findIndex(d => d.id === requested.current)
      go(destinations[(index + 1) % destinations.length])
    }, 6500)
    return () => clearTimeout(timer)
  }, [tour, traveling, active, details, visible, go])
  useEffect(() => { if (details) detailsDialog.current?.showModal() }, [details])

  const index = destinations.findIndex(d => d.id === target.id)
  const select = (destination: Destination) => { setTour(false); go(destination) }
  return <div className="engine-room" data-active-stop={active.id} data-target-stop={target.id} data-traveling={traveling}>
    <a className="skip-link" href="#content" onClick={event => { event.preventDefault(); document.getElementById('content')?.focus() }}>Skip to portfolio information</a>
    <div className="world-stage" aria-label={`3D exhibit: ${target.label}`} onWheel={event => {
      if (event.ctrlKey || details || helpDialog.current?.open) return
      const now = performance.now(), state = wheel.current
      if (now < state.lockedUntil) return
      if (now - state.last > 250) state.amount = 0
      state.last = now; state.amount += event.deltaY
      if (Math.abs(state.amount) > 100) { setTour(false); step(Math.sign(state.amount)); state.amount = 0; state.lockedUntil = now + 2000 }
    }}>
      {sceneAvailable && <SceneBoundary onFailure={failScene}><Suspense fallback={null}><World target={target} activeId={active.id} animated={animated} traveling={traveling} onArrive={arrive} onUnavailable={failScene} /></Suspense></SceneBoundary>}
    </div>
    <div className="world-shade" />
    <header className="site-header">
      <a className="wordmark" href="#about" onClick={event => { event.preventDefault(); select(destinations[0]) }}>parintorn<span>.</span></a>
      <nav className="section-nav" aria-label="Portfolio sections">{sections.map(section => <a key={section.id} href={`#${section.id}`} aria-current={target.section === section.id ? 'page' : undefined} onClick={event => {
        event.preventDefault(); const destination = section.id === target.section ? target : destinations.find(d => d.section === section.id)!; select(destination)
      }}>{section.label}</a>)}</nav>
      <div className="view-controls"><button onClick={() => setAnimated(value => !value)} aria-pressed={!animated}>{animated ? 'Pause motion' : 'Enable motion'}</button><button className="help-control" aria-label="Navigation help" onClick={() => { setTour(false); helpDialog.current?.showModal() }}>?</button></div>
    </header>
    <div className="travel-status" role="status" aria-live="polite">{traveling ? `Traveling to ${target.label}` : !sceneAvailable ? '3D unavailable. Your portfolio information is still accessible.' : ''}</div>
    <main id="content" tabIndex={-1} className={`portfolio-copy ${traveling ? 'in-transit' : ''}`} aria-busy={traveling}>
      <article key={active.id} id={active.section} className={`destination-copy kind-${active.model}`} inert={traveling}>
        <DestinationContent destination={active} fallback={!sceneAvailable} onDetails={() => { setTour(false); setDetails(active) }} />
      </article>
    </main>
    {target.section === 'projects' && <nav className="project-picker" aria-label="Choose a project">{destinations.filter(d => d.project).map(destination => <button key={destination.id} aria-pressed={target.id === destination.id} onClick={() => select(destination)}>{String(destination.project!.projectId).padStart(2, '0')} / {destination.label}</button>)}</nav>}
    <footer className="journey-footer">
      <div className="journey-context"><span className="journey-counter">{String(index + 1).padStart(2, '0')} <span>/ {String(destinations.length).padStart(2, '0')}</span></span><span>{target.label}</span><span className="interaction-hint">Drag to orbit / wheel or arrow keys to travel</span></div>
      <div className="journey-navigation"><nav aria-label="Exhibit destinations" className="destination-nav">{destinations.map((destination, i) => <button key={destination.id} aria-label={`Visit ${destination.label}`} aria-current={target.id === destination.id ? 'step' : undefined} onClick={() => select(destination)}><span>{String(i + 1).padStart(2, '0')}</span><span className="destination-name">{destination.label}</span></button>)}</nav><div className="journey-actions"><button onClick={() => setTour(value => !value)} aria-pressed={tour}>{tour ? 'Stop tour' : 'Play tour'}</button><button className="direction-control" aria-label="Previous exhibit" disabled={index === 0} onClick={() => { setTour(false); step(-1) }}>←</button><button className="direction-control" aria-label="Next exhibit" disabled={index === destinations.length - 1} onClick={() => { setTour(false); step(1) }}>→</button></div></div>
    </footer>
    <dialog ref={detailsDialog} className="details-dialog" aria-labelledby="details-title" onClose={() => setDetails(null)}><button className="dialog-close" onClick={() => detailsDialog.current?.close()}>Close ×</button>{details && <FullDetails destination={details} />}</dialog>
    <dialog ref={helpDialog} className="help-dialog" aria-labelledby="help-title"><button className="dialog-close" onClick={() => helpDialog.current?.close()}>Close ×</button><h2 id="help-title">Explore the work.</h2><p>Drag the 3D scene to orbit. Use your mouse wheel, arrow keys, or the navigation to travel between exhibits.</p><p>Choose a project to see its actual screenshot and matching system. Play tour visits every exhibit. Pause motion stops ambient animation and makes travel instant.</p><p>Contact <a href={`mailto:${profile.email}`}>{profile.email}</a>.</p></dialog>
  </div>
}
