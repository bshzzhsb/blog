import React, { useEffect, useRef, useState } from 'react';
import type * as Monaco from 'monaco-editor';

import { getLanguage } from './utils/get-language';
import { Editor } from './editor';

interface OutputProps {
  monaco: typeof Monaco;
  code: string;
  filename: string;
}

export const Output: React.FC<OutputProps> = React.memo(({ monaco, code, filename }) => {
  const [model, setModel] = useState<Monaco.editor.ITextModel>();
  const initialCode = useRef(code);

  useEffect(() => {
    const language = getLanguage(filename);
    const model = monaco.editor.createModel(initialCode.current, language);
    setModel(model);

    return () => {
      model.dispose();
      setModel(undefined);
    };
  }, [filename, monaco.editor]);

  useEffect(() => {
    if (!model || model.isDisposed()) return;

    const language = getLanguage(filename);
    model.setValue(code);
    monaco.editor.setModelLanguage(model, language);
  }, [code, filename, model, monaco.editor]);

  if (!model) return null;

  return <Editor readonly monaco={monaco} model={model} />;
});
