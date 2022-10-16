import { transform } from '@babel/standalone';
import { rollup, Plugin } from '@rollup/browser';

import type { CodeFile } from '~/constants/code';
import { getLogger, LogModule } from '~/utils/logger';

export namespace CompilerWorker {
  export type Event = 'COMPILE' | 'PACK';
  export type Input = { event: 'COMPILE'; file: CodeFile } | { event: 'PACK'; files: CodeFile[] };
  export type Output = { event: 'COMPILE'; file: CodeFile } | { event: 'PACK'; output: string };
}

const logger = getLogger(LogModule.REPL, 'COMPILER');

const lookup = new Map<string, string>();
const importedCSS = new Set<string>();

function getEsmURL(source: string) {
  return `https://esm.sh/${source}?dev`;
}

function esmImportPlugin(): Plugin {
  return {
    name: 'esm-import-plugin',

    resolveId(importee) {
      // Import another file
      if (importee.startsWith('.')) return importee;

      return {
        id: getEsmURL(importee),
        external: true,
      };
    },

    load(filename) {
      const content = lookup.get(filename);
      if (content === undefined) {
        throw new Error(`cannot find ${filename}`);
      }
      return content;
    },

    transform(source, filename) {
      if (/\.css$/.test(filename)) {
        importedCSS.add(filename.replace(/^(\.\/)+/, ''));
        return '';
      }

      if (filename.startsWith('.')) {
        const { code } = transform(source, {
          filename: filename + '.tsx',
          presets: ['react', 'typescript'],
        });

        return code;
      }
    },
  };
}

function getCSS(files: CodeFile[]) {
  const css = files
    .filter(file => importedCSS.has(file.filename))
    .map(file => file.source)
    .join('\n');

  return `(() => {
    let stylesheet = document.getElementById('stylesheet');
    if (!stylesheet) {
      stylesheet = document.createElement('style');
      stylesheet.setAttribute('id', 'stylesheet');
      document.head.appendChild(stylesheet);
    };
    const css = document.createTextNode(\`${css}\`);
    stylesheet.innerHTML = '';
    stylesheet.appendChild(css);
  })()`;
}

async function pack(files: CodeFile[]) {
  if (files.length === 0) return '';

  lookup.clear();
  for (const { filename, source } of files) {
    lookup.set(`./${filename.replace(/\.(j|t)sx?$/, '')}`, source);
  }

  const entry = `./${files[0].filename.replace(/\.(j|t)sx?$/, '')}`;
  const packer = await rollup({
    input: entry,
    plugins: [esmImportPlugin()],
  });

  const {
    output: [{ code }],
  } = await packer.generate({ format: 'esm' });

  const css = getCSS(files);
  importedCSS.clear();

  return `${code} window.disposer = () => __root__.unmount(); ${css}`;
}

function transformReact(jsx: CodeFile): CodeFile {
  const { filename, source } = jsx;
  const { code } = transform(source, {
    filename,
    presets: ['react', 'typescript'],
  });

  return { source: code ?? '', filename };
}

self.addEventListener('message', async ({ data }: { data: CompilerWorker.Input }) => {
  const { event } = data;
  let message: CompilerWorker.Output | undefined = undefined;

  logger.info('receive message', event);

  if (event === 'COMPILE') {
    const result = transformReact(data.file);
    message = { event, file: result };
  } else if (event === 'PACK') {
    const result = await pack(data.files);
    message = { event, output: result };
  }

  logger.info('send message', event);

  if (message) {
    self.postMessage(message);
  }
});

export {};
