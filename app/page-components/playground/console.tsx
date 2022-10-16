import React, { useEffect } from 'react';

import { getLogger, LogModule } from '~/utils/logger';

interface ConsoleProps {
  id: string;
  logs: string[];
  setLogs: React.Dispatch<React.SetStateAction<string[]>>;
}

const logger = getLogger(LogModule.REPL, 'IFRAME');

const Console: React.FC<ConsoleProps> = React.memo(({ id, logs, setLogs }) => {
  useEffect(() => {
    const handleMessage = ({ data }: MessageEvent) => {
      if (data?.source === `frame-${id}` && data.message.type === 'log') {
        logger.info(data.source, data.message.data[0]);
        const message = data.message.data;
        const stringify = (m: unknown) => (typeof m === 'object' ? JSON.stringify(m) : (m as string));
        const log = message.map((m: unknown) => stringify(m)).join('\t');
        setLogs(preLogs => [...preLogs, log]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [id, setLogs]);

  return (
    <div className="h-full border-t border-secondary overflow-y-auto text-secondary font-mono editor-scrollbar">
      {logs.map((log, i) => (
        <p key={i} className="border-b border-secondary px-4 mt-1 last:mb-4">
          {log}
        </p>
      ))}
    </div>
  );
});

export default Console;
