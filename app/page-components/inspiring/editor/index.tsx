import React from 'react';
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react/suspense';

import { EditorComponent } from './editor';
import { Loading } from '~/components/loading';

interface InspiringEditorProps {
  id: string;
  token: string;
  liveblocksPublicApiKey: string;
  className?: string;
}

export const InspiringEditor: React.FC<InspiringEditorProps> = React.memo(props => {
  const { id, className, liveblocksPublicApiKey: liveblockPublicApiKey } = props;

  return (
    <LiveblocksProvider publicApiKey={liveblockPublicApiKey}>
      <RoomProvider id={id}>
        <ClientSideSuspense fallback={<Loading />}>
          <EditorComponent id={id} className={className} />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
});
