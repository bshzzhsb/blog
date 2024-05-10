import { useEffect, useState } from 'react';
import { throttle } from 'lodash-es';
import * as Y from 'yjs';
import type { Editor } from '@tiptap/core';

import { CharacterCountStorage } from '@tiptap/extension-character-count';
import { Collaboration } from '@tiptap/extension-collaboration';
import { Document } from '@tiptap/extension-document';
import { Heading } from '@tiptap/extension-heading';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Text } from '@tiptap/extension-text';

import { HocuspocusProvider, WebSocketStatus } from '@hocuspocus/provider';

import { getBaseExtensions, getEditorExtensions } from '../extensions';
import { EditorState, EditorUser } from '~/types/inspiring';
import { useEditor } from './use-tiptap-editor';

export function useTitleEditor(doc: Y.Doc, contentEditor: React.RefObject<Editor>) {
  const titleEditor = useEditor({
    extensions: [
      Document.extend({
        content: 'heading',
      }),
      Text,
      Heading.extend({
        addKeyboardShortcuts() {
          const handleEnter = () => {
            return contentEditor.current?.commands.focus('start') ?? true;
          };

          return {
            ArrowDown: handleEnter,
            Enter: handleEnter,
            'Mod-Enter': handleEnter,
          };
        },
      }).configure({ levels: [1] }),
      Placeholder.configure({ placeholder: 'Title' }),
      Collaboration.configure({ document: doc, field: 'title' }),
    ],
    onUpdate: throttle<({ editor }: { editor: Editor }) => void>(({ editor }) => {
      console.log('title update', editor.getJSON());
    }, 1000),
  });

  return { titleEditor };
}

export function useContentEditor(doc: Y.Doc, provider: HocuspocusProvider, container?: HTMLDivElement) {
  const [editorState, setEditorState] = useState(EditorState.CONNECTING);

  const contentEditor = useEditor(
    {
      extensions: [
        ...getBaseExtensions({}),
        ...getEditorExtensions({
          bubbleMenu: { container },
          collaboration: { document: doc, field: 'content' },
          collaborationCursor: {
            provider,
            user: {
              name: 'bshzzhsb',
              color: '#001122',
            } as EditorUser,
          },
          fileHandler: {
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
            onPaste(editor, files) {
              files.forEach(async file => {
                const data = new FormData();
                data.append('file', file);
                const response = await fetch('/editor/api/upload_image', {
                  method: 'POST',
                  body: data,
                });
                const url = await response.json();
                return editor.chain().setImageBlockAt({ pos: editor.state.selection.anchor, src: url }).focus().run();
              });
            },
          },
        }),
      ],
    },
    [container],
  );

  const users = contentEditor?.storage.collaborationCursor?.users ?? [];

  const characterCount: CharacterCountStorage = contentEditor?.storage.characterCount || {
    characters: () => 0,
    words: () => 0,
  };

  useEffect(() => {
    const handleSynced = () => {
      setEditorState(EditorState.SYNCED);
    };

    const handleStateChange = (status: WebSocketStatus) => {
      const stateMap: Record<WebSocketStatus, EditorState> = {
        [WebSocketStatus.Connecting]: EditorState.CONNECTING,
        [WebSocketStatus.Connected]: EditorState.CONNECTED,
        [WebSocketStatus.Disconnected]: EditorState.DISCONNECTED,
      };
      setEditorState(stateMap[status]);
    };

    provider.on('synced', handleSynced);
    provider.on('status', handleStateChange);

    return () => {
      provider.off('synced', handleSynced);
      provider.off('status', handleStateChange);
    };
  }, [provider]);

  console.log('editor state', editorState);

  return { contentEditor, users, characterCount, editorState };
}
