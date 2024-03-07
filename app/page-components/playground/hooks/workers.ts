import { useCallback, useEffect, useState } from 'react';
import { CodeFile } from '~/constants';

import type { CompilerWorker } from './workers/compiler';

interface WorkerProps {
  onReceiveCompilerMessage: (message: CompilerWorker.Output) => void;
}

export const useWorkers = (props: WorkerProps) => {
  const { onReceiveCompilerMessage } = props;
  const [compiler, setCompiler] = useState<Worker>();
  const [formatter, setFormatter] = useState<Worker>();

  useEffect(() => {
    const worker = new Worker(new URL('/workers/compiler.js', import.meta.url));
    setCompiler(worker);

    return () => {
      worker.terminate();
      setCompiler(undefined);
    };
  }, []);

  useEffect(() => {
    const worker = new Worker(new URL('/workers/prettier.js', import.meta.url));
    setFormatter(worker);

    return () => {
      worker.terminate();
      setCompiler(undefined);
    };
  }, []);

  useEffect(() => {
    if (!compiler) return;

    const handleCompilerMessage = ({ data }: { data: CompilerWorker.Output }) => {
      onReceiveCompilerMessage(data);
    };
    compiler.addEventListener('message', handleCompilerMessage);

    return () => {
      compiler.removeEventListener('message', handleCompilerMessage);
    };
  }, [compiler, onReceiveCompilerMessage]);

  const sendCompileRequest = useCallback(
    (file: CodeFile) => {
      const message: CompilerWorker.Input = { event: 'COMPILE', file };
      compiler?.postMessage(message);
    },
    [compiler],
  );

  const sendPackRequest = useCallback(
    (files: CodeFile[]) => {
      const message: CompilerWorker.Input = { event: 'PACK', files };
      compiler?.postMessage(message);
    },
    [compiler],
  );

  return { formatter, sendCompileRequest, sendPackRequest };
};
