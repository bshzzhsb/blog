import React, { useEffect } from 'react';

import Frame from './frame';
import Error from './error';
import type { ErrorType } from './error';
import Console from './console';

interface ResultProps {
  id: string;
  code: string;
  logs: string[];
  setLogs: React.Dispatch<React.SetStateAction<string[]>>;
  error: ErrorType | null;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
}

export const Result: React.FC<ResultProps> = React.memo(props => {
  const { id, code, logs, setLogs, error, setError } = props;

  useEffect(() => {
    const handleMessage = ({ data }: MessageEvent) => {
      if (data?.source === `frame-${id}` && data.message?.type === 'error') {
        console.log(data.message);
        setError(data.message.data);
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [id, setError]);

  return (
    <div className="relative grid grid-rows-2 md:grid-row-1 h-full">
      {error && <Error error={error} />}
      <Frame id={id} code={code} />
      <Console id={id} logs={logs} setLogs={setLogs} />
    </div>
  );
});
