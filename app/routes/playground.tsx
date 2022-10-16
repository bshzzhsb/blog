import type { MetaFunction } from '@vercel/remix';

import { TEXT } from '~/constants';
import { Playground } from '~/page-components/playground';
import monacoStyles from '~/styles/editor.main.css';

export const meta: MetaFunction = () => ({ title: TEXT.playground });

export const links = () => [
  {
    rel: 'stylesheet',
    href: monacoStyles,
  },
];

const PlaygroundPage = () => <Playground id="playground-page" />;

export default PlaygroundPage;
