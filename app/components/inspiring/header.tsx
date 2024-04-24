import { memo, useEffect } from 'react';
import { useFetcher } from '@remix-run/react';
import { WebSocketStatus } from '@hocuspocus/provider';
import { JSONContent } from '@tiptap/react';

import { TEXT } from '~/constants';

import { Loading, Publish } from '../icon';
import EditorInfo from './editor-info';

export interface EditorHeaderProps {
  characters: number;
  words: number;
  collabState: WebSocketStatus;
  getEditorContent: () => { id: string; title: JSONContent; content: JSONContent } | undefined;
}

export const EditorHeader: React.FC<EditorHeaderProps> = memo(props => {
  const { characters, words, collabState, getEditorContent } = props;
  const publishFetcher = useFetcher();

  const handleClickPublish = () => {
    if (publishFetcher.state !== 'idle') return;

    const editorContent = getEditorContent();
    if (!editorContent) return;

    const { id, title, content } = editorContent;
    publishFetcher.submit(
      { title, content },
      { method: 'POST', action: `/editor/api/publish/${id}`, encType: 'application/json' },
    );
  };

  useEffect(() => {
    console.log(publishFetcher.state);
  }, [publishFetcher.state]);

  return (
    <div className="flex justify-end w-full px-4 py-2 border-b-2 border-b-gray-300">
      <div className="flex items-center gap-4 text-xs">
        <button
          onClick={handleClickPublish}
          className="flex items-center gap-1 px-1 py-1 border-[1px] border-gray-200 shadow rounded hover:bg-gray-100 active:bg-gray-200"
        >
          {publishFetcher.state === 'submitting' ? <Loading /> : <Publish />}
          <span>{TEXT.publish}</span>
        </button>
        <EditorInfo characters={characters} words={words} collabState={collabState} />
      </div>
    </div>
  );
});
