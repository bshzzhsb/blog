import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';

export type Language = 'html' | 'css' | 'js' | 'jsx';

export function getLanguage(lang: Language) {
  switch (lang) {
    case 'html':
      return html();
    case 'css':
      return css();
    case 'js':
      return javascript({ jsx: false });
    case 'jsx':
    default:
      return javascript({ jsx: true });
  }
}

export function getEditorTheme() {
  return EditorView.theme({
    '&.cm-editor.cm-focused': {
      outline: 'none',
    },
  });
}
