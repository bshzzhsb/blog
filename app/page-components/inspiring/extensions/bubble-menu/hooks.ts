import { useCallback, useMemo } from 'react';
import { Editor } from '@tiptap/react';

import { ContentTypeOption } from './components/content-type';

export function useBubbleMenuCommands(editor: Editor) {
  const toggleBold = useCallback(() => editor.chain().focus().toggleBold().run(), [editor]);
  const toggleItalic = useCallback(() => editor.chain().focus().toggleItalic().run(), [editor]);
  const toggleUnderline = useCallback(() => editor.chain().focus().toggleUnderline().run(), [editor]);
  const toggleStrikethrough = useCallback(() => editor.chain().focus().toggleStrike().run(), [editor]);

  return {
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleStrikethrough,
  };
}

export function useContentTypeOptions(editor: Editor): ContentTypeOption[] {
  return useMemo<ContentTypeOption[]>(
    () => [
      {
        id: 'paragraph',
        label: 'Paragraph',
        icon: 'paragraph-regular',
        onClick: () => editor.chain().focus().lift('taskItem').liftListItem('listItem').setParagraph().run(),
        isActive: () => editor.isActive('paragraph'),
      },
      ...([1, 2, 3] as const).map(level => ({
        id: `heading${level}`,
        label: `Heading ${level}`,
        icon: `h${level}-solid` as 'h1-solid' | 'h2-solid' | 'h3-solid',
        onClick: () => editor.chain().focus().lift('taskItem').liftListItem('listItem').toggleHeading({ level }).run(),
        isActive: () => editor.isActive('heading', { level }),
      })),
    ],
    [editor, editor.state],
  );
}
