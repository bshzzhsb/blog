import React from 'react';
import { Editor, NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { NodeViewConstructor } from '@tiptap/pm/view';

import { classnames } from '~/utils/classname';

import { IconMap } from './icon';
import type { AdmonitionAttrs, AdmonitionType } from './types';

interface AdmonitionProps {
  editor: Editor;
  node: Parameters<NodeViewConstructor>[0];
}

export const AdmonitionTitleComponent: React.FC<AdmonitionProps> = props => {
  const { editor, node } = props;
  const { type } = node.attrs as AdmonitionAttrs;

  const switchType = (current: AdmonitionType) => {
    const order = ['info', 'question', 'warning', 'bolt'] as const;
    const currentIndex = order.indexOf(current);
    const next = order[(currentIndex + 1) % 4];
    editor.chain().focus().setAdmonitionType(next).run();
  };

  return (
    <NodeViewWrapper
      className={classnames('flex items-center gap-3 px-3 py-2 font-bold', {
        'bg-blue-100': type === 'info',
        'bg-orange-100': type === 'question',
        'bg-yellow-100': type === 'warning',
        'bg-red-100': type === 'bolt',
      })}
    >
      <span className="cursor-pointer" onClick={editor.isEditable ? () => switchType(type) : undefined}>
        {IconMap[type]}
      </span>
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

export const AdmonitionComponent: React.FC<AdmonitionProps> = props => {
  const { node } = props;
  const { type } = node.attrs as AdmonitionAttrs;

  return (
    <NodeViewWrapper
      className={classnames('admonition my-4 border-l-4 rounded overflow-hidden shadow', {
        'border-l-blue-500': type === 'info',
        'border-l-orange-500': type === 'question',
        'border-l-yellow-500': type === 'warning',
        'border-l-red-500': type === 'bolt',
      })}
    >
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

export const AdmonitionContentComponent: React.FC = () => {
  return (
    <NodeViewWrapper className="p-3 text-base">
      <NodeViewContent />
    </NodeViewWrapper>
  );
};
