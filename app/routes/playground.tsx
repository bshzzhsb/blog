import type { MetaFunction } from "@remix-run/node";

import { TEXT } from '~/constants';
import Playground from '~/page-components/playground';
import editorStyles from '~/styles/editor.css';

export const meta: MetaFunction = () => ({ title: TEXT.playground });

export const links = () => [
  {
    rel: 'stylesheet',
    href: editorStyles,
  },
];

const PlaygroundPage = () => <Playground id="playground-page" />;

export default PlaygroundPage;
