import path from 'path';
import esbuild from 'esbuild';

const options = {};
const args = process.argv.slice(2);

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (/^--/.test(arg)) {
    options[arg.replace(/^--/, '')] = args[++i] ?? '';
  }
}

const workerEntryPoints = [
  'vs/language/json/json.worker.js',
  'vs/language/css/css.worker.js',
  'vs/language/html/html.worker.js',
  'vs/language/typescript/ts.worker.js',
  'vs/editor/editor.worker.js',
];

async function preprocess() {
  const buildOptions = {
    entryPoints: [path.resolve('./app/workers/compiler.ts'), path.resolve('./app/workers/prettier.ts')],
    bundle: true,
    minify: true,
    format: 'iife',
    platform: 'browser',
    outdir: './public/workers/',
    watch:
      options.env !== 'production'
        ? {
            onRebuild(error) {
              if (error) console.error('Rebuild workers failed:', error);
              else console.log('Rebuild workers succeeded');
            },
          }
        : undefined,
  };

  await esbuild.build(buildOptions);
  console.log(options.env !== 'production' ? 'Watching workers...' : 'Build workers succeeded');
}

async function buildMonacoWorkers() {
  const buildOptions = {
    entryPoints: workerEntryPoints.map((entry) => path.resolve('./node_modules/monaco-editor/esm/', entry)),
    bundle: true,
    minify: true,
    format: 'iife',
    platform: 'browser',
    outdir: './public/workers/monaco',
  };

  await esbuild.build(buildOptions);
  console.log('Build monaco workers succeeded');
}

buildMonacoWorkers();
preprocess();
