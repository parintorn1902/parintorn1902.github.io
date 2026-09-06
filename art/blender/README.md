# Portfolio Blender assets

Authored for this portfolio in Blender 5.2.1. Open `hacker-workshop.blend` for editable bevelled geometry, separate asset collections, and a render-ready studio camera. The core is visible initially; toggle collection visibility to work on the terminal, server, stack, or timeline.

The web models are in `public/models/hacker-workshop/`. Static parts are merged by material, while `SCREEN_*`, `LABEL_*`, and `ROTOR_*` objects keep stable names. React supplies the display textures from `src/data/portfolio.ts`; screenshots are fitted without cropping. The two rotor objects retain their pivot origins for live animation.

## Rebuild the generated source and exports

```sh
blender --background --python art/blender/build_workshop.py
python3 art/blender/validate_exports.py
```

Add `-- --render` to also render the three geometry previews. These renders intentionally show blank display glass; the running website applies the actual portfolio content. The build command regenerates the `.blend` file from the Python design, so save manual Blender edits under another filename before rebuilding.

The builder uses [Blender's glTF exporter](https://docs.blender.org/api/current/bpy.ops.export_scene.html), with applied bevels, Y-up coordinates, and Draco compression. Source modifiers remain editable. `manifest.json` records file sizes and geometry counts. Export only the intended asset collection when editing manually, preserving the named display surfaces and rotor pivots.

The Draco decoders are served locally from `public/models/draco/`, copied from the installed Three.js distribution. They are covered by the included Apache 2.0 license. No model, decoder, font, or texture is fetched from an external CDN.

## Boop

`boop.blend` is the articulated mascot source. Rebuild it and `public/models/boop.glb` with:

```sh
blender --background --python art/blender/build_boop.py
node --experimental-strip-types --test tests/boop.test.mjs
```

The rigid hierarchy contains `body`, `hip_left/right`, `knee_left/right`, `ankle_left/right`, and `shoulder_left/right`. Both leg segments are 0.42 units long; resting hip height is 0.97 and ankle height is 0.13. Keep these dimensions synchronized with `tiny-planet/boop.ts`. Geometry stays editable in Blender; the browser computes the walk and jump poses. No baked animation clip is required.

## Runtime

The selected Tiny Planet implementation uses `tiny-planet/scenery.ts` for the workshop assets, pastel material variants, and data-driven displays. `tiny-planet/world.ts` controls cameras and gameplay; `tiny-planet/boop.ts` articulates the robot. Floor-contact and stride tests load the actual exported GLB.

The earlier Engine Room implementation remains in source:


- `Models.tsx` loads and instances the five GLB files, assigns content textures, and animates the core.
- `surface-textures.ts` paints the real project screenshots and data-driven display text. glTF textures use `flipY = false`.
- `journey.ts` supplies the scene destinations. `World.tsx` fits the models into the dedicated mobile viewport.
- Reduced motion freezes ambient movement. Asset-loading and renderer failures retain the HTML portfolio fallback.

Check the browser after an export: all six destinations, correct screenshots and labels, interrupted transitions, phone framing, pause/resume, and the missing-model fallback.
