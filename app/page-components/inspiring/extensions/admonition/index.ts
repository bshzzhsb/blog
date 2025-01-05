import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { AdmonitionComponent, AdmonitionContentComponent, AdmonitionTitleComponent } from './component';
import type { AdmonitionAttrs, AdmonitionType } from './types';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    admonition: {
      setAdmonition: () => ReturnType;
      setAdmonitionType: (type: AdmonitionType) => ReturnType;
    };
  }
}

export const Admonition = Node.create({
  name: 'admonition',
  group: 'block',
  defining: true,
  isolating: true,

  content: 'admonitionTitle admonitionContent',

  addAttributes(): AdmonitionAttrs {
    return {
      type: 'info',
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ['admonition', mergeAttributes(HTMLAttributes)];
  },

  parseHTML() {
    return [{ tag: 'admonition' }];
  },

  addCommands() {
    return {
      setAdmonition:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: 'admonition',
            attrs: { type: 'info' },
            content: [
              { type: 'admonitionTitle', attrs: { type: 'info' } },
              { type: 'admonitionContent', content: [{ type: 'paragraph' }] },
            ],
          });
        },
      setAdmonitionType:
        type =>
        ({ chain }) => {
          return chain().updateAttributes('admonitionTitle', { type }).updateAttributes('admonition', { type }).run();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(AdmonitionComponent);
  },
});

export const AdmonitionTitle = Node.create({
  name: 'admonitionTitle',
  group: 'block',
  content: 'inline*',
  defining: true,
  isolating: true,

  addAttributes(): AdmonitionAttrs {
    return {
      type: 'info',
    };
  },

  parseHTML() {
    return [{ tag: 'admonition-title' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['admonition-title', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AdmonitionTitleComponent);
  },
});

export const AdmonitionContent = Node.create({
  name: 'admonitionContent',
  group: 'block',
  content: 'block+',
  defining: true,
  isolating: true,

  parseHTML() {
    return [{ tag: 'admonition-content' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['admonition-content', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AdmonitionContentComponent);
  },
});
