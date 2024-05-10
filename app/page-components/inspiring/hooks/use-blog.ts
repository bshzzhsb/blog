import { useState } from 'react';
import type { JSONContent } from '@tiptap/react';

import { CharacterCountStorage } from '@tiptap/extension-character-count';
import { Document } from '@tiptap/extension-document';
import { Heading } from '@tiptap/extension-heading';
import { TableOfContentData, getHierarchicalIndexes } from '@tiptap-pro/extension-table-of-contents';
import { Text } from '@tiptap/extension-text';

import { getBaseExtensions } from '../extensions';
import { useEditor } from './use-tiptap-editor';

export function useTitle(content: JSONContent) {
  const blogTitle = useEditor({
    content,
    editable: false,
    extensions: [Document, Text, Heading.configure({ levels: [1] })],
  });

  return { blogTitle };
}

export function useContent(content: JSONContent) {
  const [toc, setToc] = useState<TableOfContentData>([]);

  const blogContent = useEditor({
    content,
    editable: false,
    extensions: [
      ...getBaseExtensions({
        tableOfContents: {
          getIndex: getHierarchicalIndexes,
          onUpdate(data) {
            setToc(data);
          },
        },
      }),
    ],
  });

  const characterCount: CharacterCountStorage = blogContent?.storage.characterCount || {
    characters: () => 0,
    words: () => 0,
  };

  return { blogContent, toc, characterCount };
}
