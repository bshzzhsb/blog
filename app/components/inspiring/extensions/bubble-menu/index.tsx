import React, { useEffect } from 'react';
import { Editor, Extension, ReactRenderer } from '@tiptap/react';

import { BubbleMenuPlugin, BubbleMenuPluginProps } from './plugin';

export type BubbleMenuProps = Pick<BubbleMenuPluginProps, 'shouldShow'> & {
  pluginKey: string;
  editor: Editor | null;
};

export const useBubbleMenu = (props: BubbleMenuProps) => {
  const { pluginKey, editor, shouldShow } = props;

  useEffect(() => {
    if (!editor) return;
    if (editor.isDestroyed) return;

    const bubbleMenu = new ReactRenderer(BubbleMenu, {
      editor,
      props: {
        editor,
      },
    });
    console.log('useBubbleMenu', editor, bubbleMenu.reactElement);
    const plugin = BubbleMenuPlugin({
      editor,
      element: bubbleMenu.element as HTMLElement,
      pluginKey,
      shouldShow,
    });

    editor.registerPlugin(plugin);

    return () => {
      editor.unregisterPlugin(pluginKey);
    };
  }, [editor, pluginKey, shouldShow]);
};

const BubbleMenu: React.FC = props => {
  console.log('BubbleMenu props', props);
  return <div className="bg-white rounded border-[1px] border-neutral-200">TEST</div>;
};

export const BubbleMenuPlugin1 = Extension.create({
  name: 'BubbleMenuPlugin',
  priority: 500,

  addProseMirrorPlugins() {
    return [
      BubbleMenuPlugin({
        editor: this.editor,
      }),
    ];
  },
});
