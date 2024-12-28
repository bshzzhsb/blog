import React from 'react';
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react/suspense';

import { EditorComponent } from './editor';
import { Loading } from '~/components/loading';

interface InspiringEditorProps {
  id: string;
  liveblocksPublicApiKey: string;
  className?: string;
}

export const InspiringEditor: React.FC<InspiringEditorProps> = React.memo(props => {
  const { id, className, liveblocksPublicApiKey } = props;

  return (
    <LiveblocksProvider publicApiKey={liveblocksPublicApiKey}>
      <RoomProvider id={id}>
        <ClientSideSuspense fallback={<Loading />}>
          <EditorComponent id={id} className={className} />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
});
