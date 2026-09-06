# Portfolio implementation notes

React and Vite portfolio for Parintorn Sanguanpong. The selected design is Tiny Planet A: black background, white text, lime accents, connected toy islands, and a playable Blender robot.

## Content and scene mapping

- `src/data/portfolio.ts` is authoritative for projects, previews, links, experience, technologies, skills, and contact details.
- `src/components/tiny-planet/stops.ts` maps that content to the six island stations. Keep it free of runtime Three.js imports so HTML loads before the lazy world chunk.
- `TinyPlanet.tsx` owns accessible HTML, dialogs, navigation, motion preferences, and the no-WebGL fallback. Continuous camera progress updates refs, not React state. Content is inert between stations.
- `world.ts` owns camera travel, input, movement, collision, and the render clock. Walk animation must follow actual displacement, including when a collider stops movement. Pause gameplay while dialogs are open and clear held keys on blur or visibility changes. Dispose event listeners, observers, renderer resources, and pending asset resources on teardown.
- `scenery.ts` builds the islands and loads workshop GLBs with local Draco. Project screenshots and labels come from the portfolio data. Preserve `SCREEN_*`, `LABEL_*`, and `ROTOR_*` node names on export.
- `boop.ts` animates rigid hip, knee, ankle, and shoulder joints. The planted shoe must meet the floor and move backward by the same distance the character travels forward. Keep joint names and dimensions synchronized with `art/blender/build_boop.py`. `tests/boop.test.mjs` checks the exported model and gait.
- `tiny-planet.css` owns the selected presentation. `src/index.css` contains shared resets and Tailwind's import.
- The previous `engine-room/` presentation remains available in source. Its data mapping and full detail component are reused by Tiny Planet.

## Existing entry points

Preserve `#about`, `#projects`, `#technologies`, `#experience`, and `#contact`. Individual project IDs also select their exhibit. Browser history and direct links must select the corresponding scene.

## Validation and delivery

Check both projects, rapid navigation, reduced motion, keyboard and phone movement, standing/blocked gait, jumping, narrow viewports, and renderer failure. Use the npm lockfile for reproducible installs. Build and lint commands are in `package.json`; gait checks run with `node --experimental-strip-types --test tests/boop.test.mjs`.

The entry is `src/App.tsx`. `design-mocks/` contains separate studies and is not bundled into the application. GitHub Actions deploys on pushes to the configured deployment branch; publishing requires explicit user instruction.
