import type { Editor } from '@tiptap/core';
import { CharacterCountStorage } from '@tiptap/extension-character-count';
import { Document } from '@tiptap/extension-document';
import { Heading } from '@tiptap/extension-heading';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Text } from '@tiptap/extension-text';
import { useLiveblocksExtension } from '@liveblocks/react-tiptap';

import { getBaseExtensions, getEditorExtensions } from '../extensions';
import { useEditor } from '@tiptap/react';

export function useTitleEditor(contentEditor: React.RefObject<Editor>) {
  const liveblocks = useLiveblocksExtension({ field: 'title' });

  const titleEditor = useEditor({
    extensions: [
      liveblocks,
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
    ],
  });

  return { titleEditor };
}

export function useContentEditor(container?: HTMLDivElement) {
  const liveblocks = useLiveblocksExtension({ field: 'content' });

  const contentEditor = useEditor(
    {
      extensions: [
        liveblocks,
        ...getBaseExtensions(),
        ...getEditorExtensions({
          bubbleMenu: { container },
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

  const characterCount: CharacterCountStorage = contentEditor?.storage.characterCount || {
    characters: () => 0,
    words: () => 0,
  };

  return { contentEditor, characterCount };
}
