import type { Editor } from '@tiptap/core';
import { Blockquote } from '@tiptap/extension-blockquote';
import { Bold } from '@tiptap/extension-bold';
import { BulletList } from '@tiptap/extension-bullet-list';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Code } from '@tiptap/extension-code';
import { Document } from '@tiptap/extension-document';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import type { FileHandlerOptions } from '@tiptap-pro/extension-file-handler';
import { FileHandler } from '@tiptap-pro/extension-file-handler';
import { HardBreak } from '@tiptap/extension-hard-break';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { Italic } from '@tiptap/extension-italic';
import { Link } from '@tiptap/extension-link';
import { ListItem } from '@tiptap/extension-list-item';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Strike } from '@tiptap/extension-strike';
import { TableOfContentsOptions } from '@tiptap-pro/extension-table-of-contents';
import { TableOfContents } from '@tiptap-pro/extension-table-of-contents';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { Text } from '@tiptap/extension-text';
import { Underline } from '@tiptap/extension-underline';

import { Admonition, AdmonitionContent, AdmonitionTitle } from './admonition';
import { Codeblock } from './codeblock';
import type { BubbleMenuOptions } from './bubble-menu';
import { BubbleMenu } from './bubble-menu';
import { Heading } from './heading';
import { ImageBlock } from './image-block';
import { SlashCommand } from './slash-command';

type BaseExtensionOptions = {
  tableOfContents?: Partial<TableOfContentsOptions>;
};

export function getTitleExtensions(contentEditor: React.RefObject<Editor>) {
  return [
    Document.extend({
      content: 'heading',
    }),
    Text,
    Paragraph,
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
  ];
}

export function getBaseExtensions(options?: BaseExtensionOptions) {
  return [
    Admonition,
    AdmonitionContent,
    AdmonitionTitle,
    Blockquote,
    Bold,
    BulletList,
    CharacterCount,
    Code,
    Codeblock,
    Document,
    HardBreak,
    Heading,
    HorizontalRule,
    ImageBlock,
    Italic,
    Link.configure({ HTMLAttributes: { rel: null } }),
    ListItem,
    OrderedList,
    Paragraph,
    Strike,
    TableOfContents.configure(options?.tableOfContents),
    TaskItem,
    TaskList,
    Text,
    Underline,
  ];
}

type EditorExtensionOptions = {
  bubbleMenu?: BubbleMenuOptions;
  fileHandler?: Partial<FileHandlerOptions>;
};

export function getEditorExtensions(options: EditorExtensionOptions) {
  return [
    BubbleMenu.configure(options.bubbleMenu),
    Dropcursor,
    FileHandler.configure(options.fileHandler),
    Placeholder.configure({ placeholder: 'Write something...' }),
    SlashCommand,
  ];
}
