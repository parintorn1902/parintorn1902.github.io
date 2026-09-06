import { useEffect, useRef, useState } from 'react'
import { FullDetails } from '../engine-room/Content'
import { destinations, profile, projectImage } from '../engine-room/journey'
import { banter, hello, stopForHash, stops } from './stops'
import type { WorldController } from './world'
import './tiny-planet.css'

export default function TinyPlanet() {
  const [active, setActive] = useState(stopForHash)
  const [exploring, setExploring] = useState(false)
  const [motion, setMotion] = useState(
    () => !matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [ready, setReady] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const [nearby, setNearby] = useState(true)
  const [message, setMessage] = useState(hello)
  const [details, setDetails] = useState<number | null>(null)
  const canvas = useRef<HTMLCanvasElement>(null),
    story = useRef<HTMLElement>(null),
    range = useRef<HTMLInputElement>(null),
    dialog = useRef<HTMLDialogElement>(null)
  const world = useRef<WorldController | null>(null)
  const start = useRef({ index: active, motion, paused: false })
  const stop = stops[active]

  useEffect(() => {
    let disposed = false
    import('./world')
      .then(({ createWorld }) => {
        if (disposed || !canvas.current) return
        try {
          world.current = createWorld(
            canvas.current,
            {
              active: setActive,
              mode: setExploring,
              ready: setReady,
              nearby: setNearby,
              say: setMessage,
              inspect: setDetails,
              progress: (value) => {
                if (range.current) range.current.value = String(value)
                const traveling = Math.abs(value - Math.round(value)) > 0.18
                if (story.current) {
                  story.current.classList.toggle('traveling', traveling)
                  story.current.inert = traveling
                }
              },
              unavailable: () => {
                setUnavailable(true)
                setReady(false)
                if (story.current) {
                  story.current.inert = false
                  story.current.classList.remove('traveling')
                }
              },
            },
            start.current.index,
            start.current.motion,
          )
          world.current.pause(start.current.paused)
        } catch {
          setUnavailable(true)
        }
      })
      .catch(() => {
        if (!disposed) setUnavailable(true)
      })
    return () => {
      disposed = true
      world.current?.dispose()
      world.current = null
    }
  }, [])
  useEffect(() => {
    start.current.motion = motion
    world.current?.motion(motion)
  }, [motion])
  useEffect(() => {
    start.current.paused = details !== null
    if (details !== null) {
      world.current?.pause(true)
      dialog.current?.showModal()
    } else {
      dialog.current?.close()
      world.current?.pause(false)
    }
  }, [details])
  useEffect(() => {
    const hash = () => {
      const index = stopForHash()
      start.current.index = index
      if (!world.current || unavailable) setActive(index)
      else world.current.go(index)
    }
    window.addEventListener('hashchange', hash)
    return () => window.removeEventListener('hashchange', hash)
  }, [unavailable])
  function go(index: number) {
    start.current.index = index
    if (unavailable || !world.current) {
      setActive(index)
      if (range.current) range.current.value = String(index)
    } else world.current.go(index)
    history.pushState(null, '', `#${stops[index].id}`)
  }
  const inspect = () => setDetails(active)
  return (
    <div
      id="planet"
      className={exploring ? 'exploring' : ''}
      data-unavailable={unavailable}
      data-ready={ready}
      data-active-stop={stop.id}
      data-mode={exploring ? 'explore' : 'story'}
    >
      <a
        className="skip-link"
        href="#story"
        onClick={(e) => {
          e.preventDefault()
          story.current?.focus()
        }}
      >
        Skip to portfolio
      </a>
      <canvas
        id="world"
        ref={canvas}
        tabIndex={0}
        aria-label="Interactive portfolio world. Scroll to travel. In play mode, use WASD or arrows to walk, Space to jump, E to inspect, and drag to turn."
      />
      <div className="shade" />
      <header>
        <a
          className="brand"
          href="#about"
          onClick={(e) => {
            e.preventDefault()
            go(0)
          }}
        >
          parintorn<span> / play</span>
        </a>
        <nav aria-label="Portfolio">
          {[1, 3, 4, 5].map((i) => (
            <button key={i} onClick={() => go(i)}>
              {i === 1 ? 'Projects' : stops[i].label}
            </button>
          ))}
        </nav>
        <button
          id="motion"
          aria-pressed={!motion}
          onClick={() => setMotion(!motion)}
        >
          {motion ? 'Pause motion' : 'Enable motion'}
        </button>
      </header>
      <div className="edition">A LITTLE WORLD BY PARINTORN</div>
      <main id="story" ref={story} tabIndex={-1}>
        <p id="kicker">{stop.kicker}</p>
        <h1>
          {stop.title}
          {active === 0 && (
            <>
              <br />
              <em>Silly little world.</em>
            </>
          )}
        </h1>
        <p id="description">{stop.description}</p>
        {unavailable && stop.project && (
          <img
            className="fallback-image"
            src={projectImage(stop.project)}
            alt={`${stop.title} screenshot`}
          />
        )}
        <div className="actions">
          {!unavailable && (
            <button
              id="play"
              className="primary"
              disabled={!ready}
              onClick={() => world.current?.explore(true)}
            >
              {ready ? 'Play as Boop ↗' : 'Unpacking the world…'}
            </button>
          )}
          <button id="inspect" className="secondary" onClick={inspect}>
            {active === 0
              ? 'Meet the engineer →'
              : active === 5
                ? 'Get in touch →'
                : 'Inspect this station →'}
          </button>
        </div>
        {unavailable && (
          <p className="fallback-note">
            3D is unavailable. Every project and portfolio detail is still
            accessible using the station buttons.
          </p>
        )}
      </main>
      <div className="guide">
        <span className="guide-face" aria-hidden="true">
          :)
        </span>
        <p role="status">{message}</p>
      </div>
      <div id="explore-hud" hidden={!exploring}>
        <strong>YOU ARE BOOP</strong>
        <p>WASD / arrows · Space to jump · E to inspect · Drag to turn</p>
        <button
          id="return"
          onClick={() => {
            world.current?.explore(false)
            setMessage(banter[active])
          }}
        >
          Back to story ↗
        </button>
        <button id="nearby" disabled={!nearby} onClick={inspect}>
          Inspect this station
        </button>
      </div>
      <div
        className="touch-pad"
        aria-label="Movement controls"
        hidden={!exploring}
      >
        {[
          [['KeyW', '↑', 'forward']],
          [
            ['KeyA', '←', 'left'],
            ['KeyS', '↓', 'backward'],
            ['KeyD', '→', 'right'],
          ],
        ].map((row, i) => (
          <div key={i}>
            {row.map(([key, label, direction]) => (
              <button
                key={key}
                aria-label={`Move ${direction}`}
                onPointerDown={(e) => {
                  e.preventDefault()
                  e.currentTarget.setPointerCapture(e.pointerId)
                  world.current?.key(key, true)
                }}
                onPointerUp={() => world.current?.key(key, false)}
                onPointerCancel={() => world.current?.key(key, false)}
                onLostPointerCapture={() => world.current?.key(key, false)}
              >
                {label}
              </button>
            ))}
          </div>
        ))}
        <button id="jump" onClick={() => world.current?.jump()}>
          Jump!
        </button>
      </div>
      <div className="journey">
        <label htmlFor="journey">
          SCROLL TO EXPLORE{' '}
          <span>
            {String(active + 1).padStart(2, '0')} / {stop.label}
          </span>
        </label>
        <input
          id="journey"
          ref={range}
          aria-label="Story position"
          type="range"
          min="0"
          max={stops.length - 1}
          step="0.001"
          defaultValue={active}
          onChange={(e) => {
            if (unavailable) setActive(Math.round(Number(e.target.value)))
            else world.current?.go(Number(e.target.value))
          }}
        />
        <nav id="stops" aria-label="World stations">
          {stops.map((s, i) => (
            <button
              key={s.id}
              aria-current={i === active}
              onClick={() => go(i)}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </div>
      <dialog
        ref={dialog}
        aria-labelledby="details-title"
        onClose={() => setDetails(null)}
      >
        <button id="close-details" onClick={() => setDetails(null)}>
          Close ×
        </button>
        {details !== null &&
          (stops[details].project ? (
            <ProjectDetails index={details} />
          ) : (
            <FullDetails destination={destinations[details]} />
          ))}
      </dialog>
    </div>
  )
}

function ProjectDetails({ index }: { index: number }) {
  const project = stops[index].project!
  return (
    <>
      <h2 id="details-title">{project.projectName}</h2>
      <p>{project.projectDesc}</p>
      <p>{project.tags?.join(' / ')}</p>
      <img
        src={projectImage(project)}
        alt={`${project.projectName} screenshot`}
      />
      {project.projectSourceLink && (
        <a
          href={project.projectSourceLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          View source ↗
        </a>
      )}
      {project.projectDemoLink && (
        <a
          href={project.projectDemoLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Live demo ↗
        </a>
      )}
      <p>Built by {profile.name}.</p>
    </>
  )
}
