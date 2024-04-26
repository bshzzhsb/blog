import { useEffect, useState } from 'react';
import { throttle } from 'lodash-es';
import * as Y from 'yjs';
import { JSONContent, useEditor } from '@tiptap/react';
import type { Editor } from '@tiptap/core';
import { StarterKit } from '@tiptap/starter-kit';
import { Document } from '@tiptap/extension-document';
import { Text } from '@tiptap/extension-text';
import { Heading } from '@tiptap/extension-heading';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { FileHandler } from '@tiptap-pro/extension-file-handler';
import { Collaboration } from '@tiptap/extension-collaboration';
import { CollaborationCursor } from '@tiptap/extension-collaboration-cursor';
import { CharacterCount, CharacterCountStorage } from '@tiptap/extension-character-count';
import { HocuspocusProvider, WebSocketStatus } from '@hocuspocus/provider';
import { TableOfContentData, TableOfContents, getHierarchicalIndexes } from '@tiptap-pro/extension-table-of-contents';

import ImageBlock from '~/components/inspiring/extensions/image-block';
import { EditorState, EditorUser } from '~/types/inspiring';

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

export function useContentEditor(doc: Y.Doc, provider: HocuspocusProvider) {
  const [editorState, setEditorState] = useState(EditorState.CONNECTING);

  const contentEditor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      ImageBlock,
      Link.configure({ HTMLAttributes: { rel: undefined } }),
      Placeholder.configure({ placeholder: 'Write something...' }),
      Collaboration.configure({ document: doc, field: 'content' }),
      FileHandler.configure({
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
      }),
      CollaborationCursor.configure({
        provider,
        user: {
          name: 'bshzzhsb',
          color: '#001122',
        } as EditorUser,
      }),
      CharacterCount,
    ],
  });

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

  return { contentEditor, users, characterCount, editorState };
}

export function useBlogTitle(content: JSONContent) {
  const blogTitle = useEditor({
    content,
    editable: false,
    extensions: [Document, Text, Heading.configure({ levels: [1] })],
  });

  return { blogTitle };
}

export function useBlogContent(content: JSONContent) {
  const [toc, setToc] = useState<TableOfContentData>([]);

  const blogContent = useEditor({
    content,
    editable: false,
    extensions: [
      StarterKit.configure({ history: false }),
      Link.configure({ HTMLAttributes: { rel: undefined } }),
      TableOfContents.configure({
        getIndex: getHierarchicalIndexes,
        onUpdate(data) {
          setToc(data);
        },
      }),
      CharacterCount,
    ],
  });

  const characterCount: CharacterCountStorage = blogContent?.storage.characterCount || {
    characters: () => 0,
    words: () => 0,
  };

  return { blogContent, toc, characterCount };
}
