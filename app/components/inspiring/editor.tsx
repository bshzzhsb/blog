import React, { useCallback, useEffect, useState } from 'react';
import * as Y from 'yjs';
import { useFetcher } from '@remix-run/react';
import { EditorContent } from '@tiptap/react';
import type { TiptapCollabProvider, WebSocketStatus } from '@hocuspocus/provider';

import { classnames } from '~/utils/classname';

import { useContentEditor, useTitleEditor } from './use-editor';
import { EditorHeader } from './header';
import { Loading } from '~/components/icon';

interface InspiringProps {
  id: string;
  provider: TiptapCollabProvider;
  ydoc: Y.Doc;
  className?: string;
}

const InspiringEditor: React.FC<InspiringProps> = React.memo(props => {
  const { id, provider, ydoc, className } = props;
  const [state, setState] = useState<'connecting' | 'connected' | 'syncing' | 'synced' | 'disconnected'>('connecting');
  const saveFetcher = useFetcher();

  const { titleEditor } = useTitleEditor(ydoc);
  const { contentEditor, characterCount, collabState } = useContentEditor(ydoc, provider);

  useEffect(() => {
    const handleSynced = () => {
      setState('synced');
    };
    const handleStateChange = (state: WebSocketStatus) => {
      setState(state);
    };

    provider.on('synced', handleSynced);
    provider.on('status', handleStateChange);

    return () => {
      provider.off('synced', handleSynced);
      provider.off('status', handleStateChange);
    };
  }, [provider]);

  useEffect(() => {
    if (!titleEditor) return;

    const handleSave = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === 's') {
        event.preventDefault();
        saveFetcher.submit(
          { title: titleEditor.getText() },
          { method: 'POST', action: `/editor/api/save/${id}`, encType: 'application/json' },
        );
        console.log('[DEBUG] save', id, titleEditor.getText());
      }
    };

    window.addEventListener('keydown', handleSave);

    return () => {
      window.removeEventListener('keydown', handleSave);
    };
  }, [id, saveFetcher, titleEditor, ydoc]);

  const getEditorContent = useCallback(() => {
    if (!titleEditor || !contentEditor) return;
    return { id, title: titleEditor.getJSON(), content: contentEditor.getJSON() };
  }, [contentEditor, id, titleEditor]);

  return (
    <div className={classnames('flex flex-col items-center overflow-hidden', className)}>
      <EditorHeader
        characters={characterCount.characters()}
        words={characterCount.words()}
        collabState={collabState}
        getEditorContent={getEditorContent}
      />
      <div className="flex-1 flex items-center flex-col w-full overflow-hidden">
        {state !== 'synced' ? (
          <div className="flex justify-center items-center w-full h-full">
            <Loading className="w-12 h-12" />
          </div>
        ) : (
          <>
            <EditorContent className="w-full max-w-3xl m-8" editor={titleEditor} />
            <EditorContent className="w-full max-w-3xl m-8 flex-1" editor={contentEditor} />
          </>
        )}
      </div>
    </div>
  );
});

export default InspiringEditor;
