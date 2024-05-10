import { Editor } from '@tiptap/react';

import { Icon } from '~/components/icon';

import { useBubbleMenuCommands, useContentTypeOptions } from '../hooks';
import { TooltipButton } from './tooltip-button';
import type { BubbleMenuState } from '..';
import { ContentType } from './content-type';

interface BubbleMenuProps {
  editor: Editor;
  items: BubbleMenuState;
}

export function BubbleMenuComponent(props: BubbleMenuProps) {
  const { editor, items } = props;
  const commands = useBubbleMenuCommands(editor);
  const contentTypeOptions = useContentTypeOptions(editor);

  return (
    <div className="flex items-center p-2 bg-white rounded-lg border-[1px] border-neutral-200 shadow-sm">
      <ContentType options={contentTypeOptions} />
      <div className="w-px h-5 mx-2 bg-neutral-500" />
      <div className="flex gap-2">
        <TooltipButton active={items.isBold} tooltip="Bold" tooltipIcons={['Mod', 'B']} onClick={commands.toggleBold}>
          <Icon name="bold-solid" />
        </TooltipButton>
        <TooltipButton
          active={items.isItalic}
          tooltip="Italic"
          tooltipIcons={['Mod', 'I']}
          onClick={commands.toggleItalic}
        >
          <Icon name="italic-solid" />
        </TooltipButton>
        <TooltipButton
          active={items.isUnderline}
          tooltip="Underline"
          tooltipIcons={['Mod', 'U']}
          onClick={commands.toggleUnderline}
        >
          <Icon name="underline-solid" />
        </TooltipButton>
        <TooltipButton
          active={items.isStrikeThrough}
          tooltip="Strikethrough"
          tooltipIcons={['Mod', 'Shift', 'S']}
          onClick={commands.toggleStrikethrough}
        >
          <Icon name="strikethrough-solid" />
        </TooltipButton>
      </div>
    </div>
  );
}
