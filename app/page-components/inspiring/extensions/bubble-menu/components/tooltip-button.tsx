import React from 'react';

import { Icon } from '~/components/icon';
import { IconNames } from '~/components/icon/type';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/tooltip';

import { classnames } from '~/utils/classname';

interface TooltipButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  tooltip: string;
  tooltipIcons?: TooltipIcon[];
}

type TooltipIcon = 'Mod' | 'Shift' | 'B' | 'I' | 'S' | 'U';

const TooltipIconMap: Record<TooltipIcon, IconNames> = {
  Mod: 'command-regular',
  Shift: 'up-regular',
  B: 'b-solid',
  I: 'i-solid',
  S: 's-solid',
  U: 'u-solid',
};

export function TooltipButton(props: TooltipButtonProps) {
  const { children, active, tooltip, tooltipIcons, className, ...rest } = props;

  return (
    <Tooltip placement="top">
      <TooltipTrigger
        className={classnames('p-1 rounded hover:bg-neutral-200 active:bg-neutral-300', className, {
          'text-blue-500': active,
        })}
        {...rest}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent className="flex items-center px-2 py-1 text-xs text-neutral-600 bg-white rounded border-[1px] border-neutral-100 shadow">
        {tooltip}
        <span className="ml-1">{'('}</span>
        <span className="flex items-center gap-1">
          {tooltipIcons?.map((icon, index) => (
            <Icon
              key={index}
              name={TooltipIconMap[icon]}
              className={classnames('w-3 h-3', { 'w-2.5 h-2.5': icon === 'Mod' })}
            />
          ))}
        </span>
        <span>{')'}</span>
      </TooltipContent>
    </Tooltip>
  );
}
