// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import prettier from 'prettier/esm/standalone.mjs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import parserBabel from 'prettier/esm/parser-babel.mjs';

import type { CodeFile } from '~/constants/code';
import { getLogger, LogModule } from '~/utils/logger';

const logger = getLogger(LogModule.REPL, 'PRETTIER');

function format(code: string) {
  return prettier.format(code, {
    parser: 'babel-ts',
    plugins: [parserBabel],
    arrowParens: 'avoid',
    singleQuote: true,
  });
}

export type FormatInput = {
  event: 'FORMAT';
  file: CodeFile;
};

self.addEventListener('message', ({ data }: { data: FormatInput }) => {
  const { event, file } = data;
  const { filename, source } = file;

  logger.info('receive message');

  if (event === 'FORMAT') {
    logger.info('send message');

    self.postMessage({ event, file: { filename, source: format(source) } });
  }
});

export {};
