import React, { useEffect } from 'react';

interface ConsoleProps {
  id: string;
  logs: string[];
  setLogs: React.Dispatch<React.SetStateAction<string[]>>;
}

const Console: React.FC<ConsoleProps> = React.memo(({ id, logs, setLogs }) => {
  useEffect(() => {
    const handleMessage = ({ data }: MessageEvent) => {
      if (data?.source === `frame-${id}` && data.message.type === 'log') {
        const message = data.message.data;
        const stringify = (m: unknown) => (typeof m === 'object' ? JSON.stringify(m) : (m as string));
        const log = message.map((m: unknown) => stringify(m)).join('\t');
        setLogs((preLogs) => [...preLogs, log]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [id, setLogs]);

  return (
    <div className="h-full overflow-y-auto font-mono scrollbar">
      {logs.map((log, i) => (
        <p key={i} className="border-b px-4 mt-1 last:mb-8">
          {log}
        </p>
      ))}
    </div>
  );
});

export default Console;
