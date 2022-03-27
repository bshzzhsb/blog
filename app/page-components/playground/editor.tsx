import { useEffect, useRef, useState } from 'react';
import { EditorView, highlightActiveLine, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { history, historyKeymap } from '@codemirror/history';
import { defaultKeymap } from '@codemirror/commands';
import { classHighlightStyle } from '@codemirror/highlight';
import { lineNumbers } from '@codemirror/gutter';
import { bracketMatching } from '@codemirror/matchbrackets';

import { getLanguage, getEditorTheme } from './utils';
import type { Language } from './utils';

interface LanguageProps {
  defaultCode: string;
  language: Language;
  onChange: (code: string) => void;
}

const Editor: React.FC<LanguageProps> = ({ defaultCode, language, onChange }) => {
  const [code, setCode] = useState(defaultCode);
  const editorRef = useRef<HTMLDivElement>(null);
  const cmView = useRef<EditorView>();

  useEffect(() => {
    const lang = getLanguage(language);
    if (editorRef.current) {
      const view = new EditorView({
        state: EditorState.create({
          doc: code,
          extensions: [
            history(),
            lang,
            getEditorTheme(),
            highlightActiveLine(),
            bracketMatching(),
            classHighlightStyle,
            lineNumbers(),
            keymap.of([...defaultKeymap, ...historyKeymap]),
          ],
        }),
        parent: editorRef.current,
        dispatch: (tr) => {
          view.update([tr]);
          if (tr.docChanged) {
            const newCode = tr.newDoc.sliceString(0, tr.newDoc.length);
            setCode(newCode);
            onChange(newCode);
          }
        },
      });
      cmView.current = view;
    }
    return () => {
      cmView.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cmView.current && defaultCode !== code) {
      const view = cmView.current;
      cmView.current.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: defaultCode },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCode]);

  return <div ref={editorRef} className="editor h-full"></div>;
};

export default Editor;
