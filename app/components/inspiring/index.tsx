import React, { useEffect, useMemo, useState } from 'react';
import * as Y from 'yjs';

import { TiptapCollabProvider } from '@hocuspocus/provider';

import { TIPTAP_APP_ID } from '~/constants';

import InspiringEditor from './editor';

interface InspiringProps {
  id: string;
  token: string;
  className?: string;
}

const Inspiring: React.FC<InspiringProps> = React.memo(props => {
  const { id, token, className } = props;
  const [provider, setProvider] = useState<TiptapCollabProvider | undefined>();
  const ydoc = useMemo(() => new Y.Doc(), []);

  useEffect(() => {
    const provider = new TiptapCollabProvider({
      name: id,
      appId: TIPTAP_APP_ID,
      token,
      document: ydoc,
    });
    setProvider(provider);

    return () => {
      provider.destroy();
    };
  }, [id, token, ydoc]);

  if (!provider) return null;

  return <InspiringEditor id={id} provider={provider} ydoc={ydoc} className={className} />;
});

export default Inspiring;
