import React, { useEffect, useLayoutEffect, useRef } from 'react';
import type * as MonacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

import { clearMonacoEnv, setupMonacoEnv, setupMonacoTSCompileOptions } from './utils/monaco';
import { ImportResolver } from './utils/import-resolver';

type Monaco = typeof MonacoEditor;
export type { Monaco };

interface EditorProps {
  monaco: Monaco;
  model: MonacoEditor.editor.ITextModel;
  readonly?: boolean;
  resolveImports?: boolean;
}

export const Editor: React.FC<EditorProps> = props => {
  const { monaco, model, readonly, resolveImports } = props;
  const editor = useRef<MonacoEditor.editor.IStandaloneCodeEditor>();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const editorDiv = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    setupMonacoEnv();
    setupMonacoTSCompileOptions(monaco);

    return () => {
      clearMonacoEnv();
    };
  }, [monaco]);

  useEffect(() => {
    if (!editorDiv.current) return;

    const monacoEditor = monaco.editor.create(editorDiv.current, {
      model: null,
      automaticLayout: true,
      lineNumbers: 'on',
      lineNumbersMinChars: 3,
      readOnly: true,
      domReadOnly: false,
      minimap: {
        enabled: false,
      },
    });
    editor.current = monacoEditor;

    return () => {
      monacoEditor.dispose();
    };
  }, [monaco]);

  useEffect(() => {
    if (!editor.current) return;
    if (!resolveImports) return;

    const importResolver = new ImportResolver(editor.current, monaco, ['react/jsx-runtime']);

    return () => {
      importResolver.dispose();
    };
  }, [monaco, resolveImports]);

  useEffect(() => {
    if (!editor.current) return;
    editor.current.setModel(model);
  }, [editor, model]);

  useEffect(() => {
    if (!editor.current) return;
    editor.current.updateOptions({
      readOnly: readonly,
    });
  }, [editor, readonly]);

  return <div ref={editorDiv} className="editor h-full min-h-0"></div>;
};
