import type * as MonacoEditor from 'monaco-editor';
import { FormatInput } from '~/workers/prettier';

import type { Monaco } from '../editor';

export function setupMonacoTSCompileOptions(monaco: Monaco) {
  const compilerOptions: MonacoEditor.languages.typescript.CompilerOptions = {
    strict: true,
    allowNonTsExtensions: true,
    allowSyntheticDefaultImports: true,
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    isolatedModules: true,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
    typeRoots: ['node_modules/@types'],
  };

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions);
}

export function setupMonacoFormatter(monaco: Monaco, formatter: Worker) {
  monaco.languages.registerDocumentFormattingEditProvider('typescript', {
    async provideDocumentFormattingEdits(model: MonacoEditor.editor.ITextModel) {
      const source = model.getValue();
      formatter.postMessage({ event: 'FORMAT', file: { filename: '', source } } as FormatInput);

      return new Promise(resolve => {
        formatter.addEventListener(
          'message',
          ({ data }: { data: FormatInput }) => {
            resolve([
              {
                range: model.getFullModelRange(),
                text: data.file.source,
              },
            ]);
          },
          { once: true },
        );
      });
    },
  });
}

export function setupMonacoEnv() {
  window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
      if (label === 'json') {
        return '../../workers/monaco/language/json/json.worker.js';
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return '../../workers/monaco/language/css/css.worker.js';
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return '../../workers/monaco/language/html/html.worker.js';
      }
      if (label === 'typescript' || label === 'javascript') {
        return '../../workers/monaco/language/typescript/ts.worker.js';
      }
      return '../../workers/monaco/editor/editor.worker.js';
    },
  };
}

export function clearMonacoEnv() {
  window.MonacoEnvironment = undefined;
}
