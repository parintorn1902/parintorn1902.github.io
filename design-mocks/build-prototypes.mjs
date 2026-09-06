// Local, disposable prototype builder. Does not alter the portfolio build.
import { build } from 'esbuild';
await build({
  entryPoints: ['design-mocks/prototype.js'],
  outfile: 'design-mocks/prototype.bundle.js',
  bundle: true,
  format: 'iife',
  minify: true,
  legalComments: 'eof',
  target: ['es2020'],
});
console.log('Built design-mocks/prototype.bundle.js');
