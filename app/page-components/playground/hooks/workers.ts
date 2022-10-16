import { useCallback, useEffect } from 'react';
import { CodeFile } from '~/constants';
import { useSetup } from '~/utils/hooks';

import type { CompilerWorker } from '~/workers/compiler';

interface WorkerProps {
  onReceiveCompilerMessage: (message: CompilerWorker.Output) => void;
}

export const useWorkers = (props: WorkerProps) => {
  const { onReceiveCompilerMessage } = props;

  const compiler = useSetup(
    () => {
      return new Worker(new URL('../../workers/compiler.js', import.meta.url));
    },
    worker => {
      worker?.terminate();
    },
  );

  const formatter = useSetup(
    () => {
      return new Worker(new URL('../../workers/prettier.js', import.meta.url));
    },
    worker => {
      worker?.terminate();
    },
  );

  useEffect(() => {
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
      compiler.postMessage(message);
    },
    [compiler],
  );

  const sendPackRequest = useCallback(
    (files: CodeFile[]) => {
      const message: CompilerWorker.Input = { event: 'PACK', files };
      compiler.postMessage(message);
    },
    [compiler],
  );

  return { formatter, sendCompileRequest, sendPackRequest };
};
