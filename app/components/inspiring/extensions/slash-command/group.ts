import { Editor } from '@tiptap/core';
import { IconNames } from '~/components/icon/type';
import { TEXT } from '~/constants';

export type Command = {
  id: string;
  label: string;
  aliases?: string[];
  icon: IconNames;
  action: (editor: Editor) => void;
  shouldBeHidden?: (editor: Editor) => boolean;
};

export type Group = {
  id: string;
  title: string;
  commands: Command[];
};

export const GROUPS: Group[] = [
  {
    id: 'format',
    title: TEXT.format,
    commands: [
      ...([1, 2, 3] as const).map(level => ({
        id: `heading${level}`,
        label: `Heading ${level}`,
        aliases: [`h${level}`],
        icon: `h${level}` as 'h1' | 'h2' | 'h3',
        action: (editor: Editor) => {
          editor.chain().focus().setHeading({ level }).run();
        },
      })),
      {
        id: 'bullet_list',
        label: `Bullet List`,
        aliases: [`ul`],
        icon: 'list-ul-solid',
        action: (editor: Editor) => {
          editor.chain().focus().toggleBulletList().run();
        },
      },
      {
        id: 'numbered_list',
        label: `Numbered List`,
        aliases: [`ol`],
        icon: 'list-ol-solid',
        action: (editor: Editor) => {
          editor.chain().focus().toggleOrderedList().run();
        },
      },
      {
        id: 'blockquote',
        label: `Blockquote`,
        icon: 'quote-left-solid',
        action: (editor: Editor) => {
          editor.chain().focus().setBlockquote().run();
        },
      },
      {
        id: 'codeblock',
        label: `Code Block`,
        icon: 'code-solid',
        action: (editor: Editor) => {
          editor.chain().focus().setCodeBlock().run();
        },
      },
    ],
  },
];
