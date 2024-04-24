import { useEffect, useState } from 'react';
// import { throttle } from 'lodash-es';
import * as Y from 'yjs';
import { JSONContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Document } from '@tiptap/extension-document';
import { Text } from '@tiptap/extension-text';
import { Heading } from '@tiptap/extension-heading';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Collaboration } from '@tiptap/extension-collaboration';
import { CollaborationCursor } from '@tiptap/extension-collaboration-cursor';
import { CharacterCount, CharacterCountStorage } from '@tiptap/extension-character-count';
import { HocuspocusProvider, WebSocketStatus } from '@hocuspocus/provider';

import { EditorUser } from '~/types/tiptap';

export function useTitleEditor(doc: Y.Doc) {
  const titleEditor = useEditor({
    extensions: [
      Document,
      Text,
      Heading.configure({ levels: [1] }),
      Placeholder.configure({ placeholder: 'Title' }),
      Collaboration.configure({ document: doc, field: 'title' }),
    ],
    // onUpdate: throttle(
    //   ({ editor }) => {
    // fetch(`/editor/save/${id}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   body: JSON.stringify({ title: editor.getText(), _action: 'SAVE' }),
    // });
    // },
    //   500,
    //   { leading: true },
    // ),
  });

  return { titleEditor };
}

export function useContentEditor(doc: Y.Doc, provider: HocuspocusProvider) {
  const [collabState, setCollabState] = useState(WebSocketStatus.Connecting);

  const contentEditor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Link.configure({ HTMLAttributes: { rel: undefined } }),
      Placeholder.configure({ placeholder: 'Write something...' }),
      Collaboration.configure({ document: doc, field: 'content' }),
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
    const handelStatusChange = (event: { status: WebSocketStatus }) => {
      setCollabState(event.status);
    };
    provider.on('status', handelStatusChange);

    return () => {
      provider.off('status', handelStatusChange);
    };
  }, [provider]);

  return { contentEditor, users, characterCount, collabState };
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
  const blogContent = useEditor({
    content,
    editable: false,
    extensions: [
      StarterKit.configure({ history: false }),
      Link.configure({ HTMLAttributes: { rel: undefined } }),
      CharacterCount,
    ],
  });

  const characterCount: CharacterCountStorage = blogContent?.storage.characterCount || {
    characters: () => 0,
    words: () => 0,
  };

  return { blogContent, characterCount };
}
