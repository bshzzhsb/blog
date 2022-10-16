import React, { useCallback, useEffect, useState } from 'react';
import type * as Monaco from 'monaco-editor';

import type { CompilerWorker } from '~/workers/compiler';
import Tabs, { TabPane } from '~/components/tabs';
import type { CodeFile } from '~/constants';
import { useTheme } from '~/utils/theme';

import { setupMonacoFormatter } from './utils/monaco';
import { useWorkers } from './hooks/workers';
import { MonacoTabs } from './monaco-tabs';
import { PlaygroundHeader } from './header';
import type { ErrorType } from './error';
import { Result } from './result';
import { Output } from './output';

interface PlaygroundProps {
  id: string;
}

export const Playground: React.FC<PlaygroundProps> = ({ id }) => {
  const [monaco, setMonaco] = useState<typeof Monaco>();

  useEffect(() => {
    async function setupMonaco() {
      const monaco = await import('monaco-editor');
      if (unmounted) return;

      setMonaco(monaco);
    }

    let unmounted = false;
    setupMonaco();

    return () => {
      unmounted = true;
    };
  }, []);

  if (!monaco) return null;

  return <MonacoPlayground id={id} monaco={monaco} />;
};

interface MonacoPlaygroundProps {
  monaco: typeof Monaco;
  id: string;
}

const MonacoPlayground: React.FC<MonacoPlaygroundProps> = React.memo(({ id, monaco }) => {
  const [packedCode, setPackedCode] = useState('');
  const [compiledFile, setCompiledFile] = useState<CodeFile>({ filename: '', source: '' });
  const [error, setError] = useState<ErrorType | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(true);
  const [resultIndex, setResultIndex] = useState<number>(0);

  const [theme] = useTheme();

  useEffect(() => {
    monaco.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs');
  }, [monaco, theme]);

  const onReceiveCompilerMessage = useCallback((data: CompilerWorker.Output) => {
    const { event } = data;

    if (event === 'PACK') {
      setPackedCode(data.output);
    } else if (event === 'COMPILE') {
      setCompiledFile(data.file);
    }
  }, []);

  const { formatter, sendCompileRequest, sendPackRequest } = useWorkers({ onReceiveCompilerMessage });

  useEffect(() => {
    setupMonacoFormatter(monaco, formatter);
  }, [formatter, monaco]);

  const onActiveFileChange = useCallback(
    (file: CodeFile) => {
      if (resultIndex === 1) {
        if (!/\.css$/.test(file.filename)) {
          sendCompileRequest(file);
        } else {
          setCompiledFile(file);
        }
      }
    },
    [resultIndex, sendCompileRequest],
  );

  const pack = useCallback(
    (files: CodeFile[]) => {
      setLogs([]);
      setError(null);
      sendPackRequest(files);
    },
    [sendPackRequest],
  );

  const onChangeShowResult = useCallback(() => {
    setShowResult(pre => !pre);
    setError(null);
    setLogs([]);
  }, []);

  return (
    <>
      <PlaygroundHeader showResult={showResult} onChangeShowResult={onChangeShowResult} />
      <div
        className={
          'grid md:grid-rows-1 w-screen h-[calc(100vh-3rem)] ' +
          (showResult ? 'grid-rows-2 md:grid-cols-2' : 'grid-rows-1 md:grid-cols-1')
        }
      >
        <MonacoTabs id={id} monaco={monaco} onActiveFileChange={onActiveFileChange} pack={pack} />
        {showResult && (
          <Tabs
            activeIndex={resultIndex}
            setActiveIndex={setResultIndex}
            className="border-t-2 md:border-t-0 md:border-l-2 border-secondary"
          >
            <TabPane tabKey="result" name="Result">
              <Result id={id} code={packedCode} logs={logs} setLogs={setLogs} error={error} setError={setError} />
            </TabPane>
            <TabPane tabKey="console" name="Output">
              <Output monaco={monaco} code={compiledFile.source} filename={compiledFile.filename} />
            </TabPane>
          </Tabs>
        )}
      </div>
    </>
  );
});
