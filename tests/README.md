# Portfolio checks

Run build/type checking, lint, and the exported-model gait checks:

```sh
npm run build
npm run lint
node --experimental-strip-types --test tests/boop.test.mjs
```

The gait test requires Node 22.6+ and reads the actual Blender GLB. It checks floor contact over a complete stride, opposing leg movement, stopping, jumping, and planted-foot sliding.

`portfolio.browser.mjs` contains the browser regression scenario for partial-scroll recovery, URL/scene synchronization, opening details before the lazy world loads, walking/jumping, six station dialogs, and mobile overflow. It uses the installed `playwright-cli`, with a Vite development server on port 4323:

```sh
npm run dev -- --host 127.0.0.1 --port 4323 --strictPort
```

In a second terminal:

```sh
playwright-cli -s=portfolio-check open http://127.0.0.1:4323/
python3 - <<'PY'
from pathlib import Path
import subprocess
code = Path('tests/portfolio.browser.mjs').read_text().split('export default ', 1)[1]
result = subprocess.run(['playwright-cli', '-s=portfolio-check', 'run-code', code], capture_output=True, text=True)
print(result.stdout)
print(result.stderr)
raise SystemExit(result.returncode or (1 if '### Error' in result.stdout else 0))
PY
playwright-cli -s=portfolio-check close
```

Stop the development server with Ctrl+C after the checks. These browser checks use development-only gait telemetry and must run against Vite dev, not the production preview. CI currently runs the build; the gait and browser checks are local checks.
