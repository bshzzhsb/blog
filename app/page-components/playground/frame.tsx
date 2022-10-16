import React, { useEffect, useMemo, useRef, useState } from 'react';

import { getIframeHTML } from './utils/getIframeHTML';

interface FrameProps {
  id: string;
  code: string;
}

const Frame: React.FC<FrameProps> = React.memo(({ id, code }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const iframe = useRef<HTMLIFrameElement>(null!);
  const [loaded, setLoaded] = useState(false);
  const html = useMemo(() => getIframeHTML(id), [id]);

  useEffect(() => {
    const iframeWindow = iframe.current.contentWindow;
    if (!iframeWindow) return;

    if (loaded) {
      const blob = new Blob([code], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      iframeWindow?.postMessage({ id, event: 'CODE_UPDATE', message: url });
      return () => {
        URL.revokeObjectURL(url);
      };
    }

    iframeWindow.addEventListener('load', () => {
      setLoaded(true);
    });
  }, [id, code, loaded]);

  return <iframe ref={iframe} width="100%" height="100%" srcDoc={html} className="border-none" />;
});

export default Frame;
