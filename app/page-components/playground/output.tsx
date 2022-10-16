import React from 'react';
import type * as Monaco from 'monaco-editor';

import { useSetup } from '~/utils/hooks';

import { getLanguage } from './utils/get-language';
import { Editor } from './editor';

interface OutputProps {
  monaco: typeof Monaco;
  code: string;
  filename: string;
}

export const Output: React.FC<OutputProps> = React.memo(({ monaco, code, filename }) => {
  const model = useSetup(
    () => {
      const language = getLanguage(filename);
      return monaco.editor.createModel(code, language);
    },
    m => {
      m?.dispose();
    },
  );

  const language = getLanguage(filename);
  model.setValue(code);
  monaco.editor.setModelLanguage(model, language);

  return <Editor readonly monaco={monaco} model={model} />;
});
