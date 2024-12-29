import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFetcher } from '@remix-run/react';
import { Editor, EditorContent } from '@tiptap/react';
import { useIsEditorReady } from '@liveblocks/react-tiptap';

import '@liveblocks/react-ui/styles.css';
import '@liveblocks/react-tiptap/styles.css';

import { classnames } from '~/utils/classname';
import { Loading } from '~/components/loading';

import { useContentEditor, useTitleEditor } from '../hooks/use-editor';
import { EditorHeader } from './header';

interface EditorComponentProps {
  id: string;
  className?: string;
}

export const EditorComponent: React.FC<EditorComponentProps> = React.memo(props => {
  const { id, className } = props;
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const contentEditorRef = useRef<Editor | null>(null);
  const saveFetcher = useFetcher();
  const isEditorReady = useIsEditorReady();

  const { titleEditor } = useTitleEditor(contentEditorRef);
  const { contentEditor, characterCount } = useContentEditor(container ?? undefined);
  contentEditorRef.current = contentEditor;

  useEffect(() => {
    if (!titleEditor) return;

    const handleSave = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveFetcher.submit(
          { title: titleEditor.getJSON() },
          { method: 'POST', action: `/editor/api/save/${encodeURIComponent(id)}`, encType: 'application/json' },
        );
      }
    };

    window.addEventListener('keydown', handleSave);

    return () => {
      window.removeEventListener('keydown', handleSave);
    };
  }, [id, saveFetcher, titleEditor]);

  const getEditorContent = useCallback(() => {
    if (!titleEditor || !contentEditor) return;
    return { id, title: titleEditor.getJSON(), content: contentEditor.getJSON() };
  }, [contentEditor, id, titleEditor]);

  return (
    <div className={classnames('flex flex-col items-center overflow-hidden', className)}>
      <EditorHeader
        characters={characterCount.characters()}
        words={characterCount.words()}
        isEditorReady={isEditorReady}
        getEditorContent={getEditorContent}
      />
      <div
        ref={ref => setContainer(ref)}
        className="inspiring editor relative flex-1 flex items-center flex-col w-full overflow-auto"
      >
        {!isEditorReady && <Loading />}
        <EditorContent className="inspiring-title w-full max-w-3xl mx-8 mt-12 mb-8" editor={titleEditor} />
        <EditorContent className="w-full max-w-3xl mx-8 mb-48 flex-1" editor={contentEditor} />
      </div>
    </div>
  );
});
