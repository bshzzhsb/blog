import { memo, useMemo } from 'react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/dropdown-menu';
import type { IconNames } from '~/components/icon';
import { Icon } from '~/components/icon';
import { classnames } from '~/utils/classname';

export type ContentTypeOption = {
  id: string;
  label: string;
  icon: IconNames;
  onClick: () => void;
  isDisabled: () => boolean;
  isActive: () => boolean;
};

interface ContentTypeProps {
  options: ContentTypeOption[];
}

export const ContentType: React.FC<ContentTypeProps> = memo(function ContentType(props) {
  const { options } = props;
  const activeItem = useMemo(() => options.find(option => option.isActive()), [options]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-1 p-1 bg-white rounded hover:bg-neutral-200 active:bg-neutral-300">
        <Icon name={activeItem?.icon ?? 'paragraph-regular'} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-1 w-48 px-2 py-1.5 bg-white rounded-lg border-[1px] border-neutral-100 shadow-sm">
        {options.map(option => (
          <DropdownMenuItem
            key={option.id}
            label={option.label}
            disabled={option.isDisabled()}
            onClick={option.onClick}
            className={classnames(
              'flex gap-4 items-center px-2 py-1.5 text-sm text-left rounded hover:bg-neutral-200 active:bg-neutral-300',
              {
                'text-blue-600': option.isActive(),
              },
            )}
          >
            <Icon name={option.icon} />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
