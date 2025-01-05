import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';

import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import markdown from 'highlight.js/lib/languages/markdown';
import rust from 'highlight.js/lib/languages/rust';
import scss from 'highlight.js/lib/languages/scss';
import shell from 'highlight.js/lib/languages/shell';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import { mergeAttributes } from '@tiptap/core';

/**
 * Map of grammars.
 *
 * @type {Record<string, LanguageFn>}
 */
const grammars = {
  bash,
  c,
  cpp,
  css,
  javascript,
  markdown,
  rust,
  scss,
  shell,
  typescript,
  xml,
  yaml,
};

const lowlight = createLowlight(grammars);

export const Codeblock = CodeBlockLowlight.extend({
  renderHTML({ node, HTMLAttributes }) {
    return [
      'pre',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-lang': node.attrs.language }),
      ['code', { class: node.attrs.language ? this.options.languageClassPrefix + node.attrs.language : null }, 0],
    ];
  },
}).configure({ lowlight });
