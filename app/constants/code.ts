import type { Language } from '~/page-components/playground/utils';

export type Codes = { lang: Language; code: string }[];

export const CODES: Codes = [
  {
    lang: 'html',
    code: `<div class="parent">
  <div class="child">
    child element
  </div>
</div>
`,
  },
  {
    lang: 'css',
    code: `.parent {
  width: 200px;
  height: 200px;
  background-color: lightpink;
}
.child {
  width: 100px;
  height: 100px;
  background-color: lightblue;
}
`,
  },
  {
    lang: 'js',
    code: `console.log('playground');
`,
  },
];
