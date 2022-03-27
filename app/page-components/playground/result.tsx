import React, { useEffect } from 'react';

import Frame from './frame';
import Error from './error';
import type { ErrorType } from './error';

interface ResultProps {
  id: string;
  loading: boolean;
  code: string;
  error: ErrorType | null;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
}

const Result: React.FC<ResultProps> = React.memo(({ id, loading, code, error, setError }) => {
  useEffect(() => {
    const handleMessage = ({ data }: MessageEvent) => {
      if (data?.source === `frame-${id}` && data?.message?.type === 'error') {
        console.log(data.message);
        setError(data.message.data);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [id, setError]);

  if (loading) return null;

  return (
    <div className="relative h-full">
      {error && <Error error={error} />}
      <Frame srcDoc={code} />
    </div>
  );
});

export default Result;
