import { build } from 'esbuild';
await build({entryPoints:['design-mocks/game-world/game.js'],outfile:'design-mocks/game-world/game.bundle.js',bundle:true,format:'iife',minify:true,legalComments:'eof',target:['es2020']});
