import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { useFetcher } from '@remix-run/react';
import { Editor, EditorContent } from '@tiptap/react';
import { TiptapCollabProvider } from '@hocuspocus/provider';

import { classnames } from '~/utils/classname';
import { Icon } from '~/components/icon';
import { EditorState } from '~/types/inspiring';

import { useContentEditor, useTitleEditor } from '../hooks/use-editor';
import { EditorHeader } from './header';

interface EditorComponentProps {
  id: string;
  provider: TiptapCollabProvider;
  ydoc: Y.Doc;
  className?: string;
}

export const EditorComponent: React.FC<EditorComponentProps> = React.memo(props => {
  const { id, provider, ydoc, className } = props;
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const contentEditorRef = useRef<Editor | null>(null);
  const saveFetcher = useFetcher();

  const { titleEditor } = useTitleEditor(ydoc, contentEditorRef);
  const { contentEditor, characterCount, editorState } = useContentEditor(ydoc, provider, container ?? undefined);
  contentEditorRef.current = contentEditor;

  useEffect(() => {
    if (!titleEditor) return;

    const handleSave = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveFetcher.submit(
          { title: titleEditor.getJSON() },
          { method: 'POST', action: `/editor/api/save/${id}`, encType: 'application/json' },
        );
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
        editorState={editorState}
        getEditorContent={getEditorContent}
      />
      <div
        ref={ref => setContainer(ref)}
        className="inspiring editor relative flex-1 flex items-center flex-col w-full overflow-auto"
      >
        {editorState !== EditorState.SYNCED && (
          <div className="absolute flex justify-center items-center w-full h-full bg-white z-10">
            <Icon name="loading" className="w-12 h-12 animate-spin ease-in-out" />
          </div>
        )}
        <EditorContent className="inspiring-title w-full max-w-3xl mx-8 mt-12 mb-8" editor={titleEditor} />
        <EditorContent className="w-full max-w-3xl mx-8 mb-48 flex-1" editor={contentEditor} />
      </div>
    </div>
  );
});
