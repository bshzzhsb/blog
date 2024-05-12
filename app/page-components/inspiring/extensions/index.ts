import { Blockquote } from '@tiptap/extension-blockquote';
import { Bold } from '@tiptap/extension-bold';
import { BulletList } from '@tiptap/extension-bullet-list';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Code } from '@tiptap/extension-code';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import type { CollaborationOptions } from '@tiptap/extension-collaboration';
import { Collaboration } from '@tiptap/extension-collaboration';
import type { CollaborationCursorOptions } from '@tiptap/extension-collaboration-cursor';
import { CollaborationCursor } from '@tiptap/extension-collaboration-cursor';
import { Document } from '@tiptap/extension-document';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import type { FileHandlerOptions } from '@tiptap-pro/extension-file-handler';
import { FileHandler } from '@tiptap-pro/extension-file-handler';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Heading } from '@tiptap/extension-heading';
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

import { lowlight } from 'lowlight';

import type { BubbleMenuOptions } from './bubble-menu';
import { BubbleMenu } from './bubble-menu';
import { ImageBlock } from './image-block';
import { SlashCommand } from './slash-command';

type BaseExtensionOptions = {
  tableOfContents?: Partial<TableOfContentsOptions>;
};

export function getBaseExtensions(options: BaseExtensionOptions) {
  return [
    Blockquote,
    Bold,
    BulletList,
    CharacterCount,
    Code,
    CodeBlockLowlight.configure({ lowlight }),
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
    TableOfContents.configure(options.tableOfContents),
    TaskItem,
    TaskList,
    Text,
    Underline,
  ];
}

type EditorExtensionOptions = {
  bubbleMenu?: BubbleMenuOptions;
  collaboration?: Partial<CollaborationOptions>;
  collaborationCursor?: Partial<CollaborationCursorOptions>;
  fileHandler?: Partial<FileHandlerOptions>;
};

export function getEditorExtensions(options: EditorExtensionOptions) {
  return [
    BubbleMenu.configure(options.bubbleMenu),
    Collaboration.configure(options.collaboration),
    CollaborationCursor.configure(options.collaborationCursor),
    Dropcursor,
    FileHandler,
    Placeholder.configure({ placeholder: 'Write something...' }),
    SlashCommand,
  ];
}
