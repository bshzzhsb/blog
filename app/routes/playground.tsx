import type { MetaFunction } from '@vercel/remix';

import { TEXT } from '~/constants';
import { Playground } from '~/page-components/playground';
import monacoStyles from 'monaco-editor/min/vs/editor/editor.main.css?url';

export const meta: MetaFunction = () => [{ title: TEXT.playground }];

export const links = () => [
  {
    rel: 'stylesheet',
    href: monacoStyles,
  },
];

const PlaygroundPage = () => <Playground id="playground-page" />;

export default PlaygroundPage;
