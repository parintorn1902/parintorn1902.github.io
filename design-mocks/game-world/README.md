# Playable game-world theme prototypes

Question: which playful visual direction should replace the Blender workshop theme?

- A: Tiny Planet. Cheerful islands, soft colors, and a robot guide.
- B: After-hours Arcade. Cabinet-style projects and a frontal arcade stage.
- C: Pocket Space. Orbital platforms, mission navigation, and a robot astronaut.

Run from the repository root:

```sh
node design-mocks/game-world/build.mjs
python3 -m http.server 4322 --bind 127.0.0.1
```

Open `http://127.0.0.1:4322/design-mocks/game-world/comparison.html` or `prototype.html?variant=A` on the same path. The server must run at the repository root because these previews reuse the local Blender assets and project screenshots.

`comparison.html` is a self-contained static comparison. The playable previews share `game.js` and `game.css`, load the actual portfolio data through the bundle, and have no persistence. They are outside the production Vite entry and build output.

Scroll or use the range input for continuous camera travel. Select Play as Boop for WASD/arrow movement, Space to jump, E to inspect a nearby station, and pointer-drag camera turning. Mobile has directional and jump buttons. Click stations for the corresponding details. Left/right arrows cycle themes in story mode when an input or button does not have focus.

The new mascot is authored in `boop.blend`; regenerate it with `blender --background --python design-mocks/game-world/build-bot.py`. The workshop models keep their existing editable Blender source.

These are throwaway interaction and theme studies, not production architecture. Navigation, collision, and accessibility should be integrated into the application deliberately after a visual direction is selected. The existing portfolio has not been replaced.

Verified locally: all three themes, desktop and mobile layout, project source links, continuous scrolling, keyboard movement, jump, touch controls, inspection dialogs, fall recovery, and motion pause.
