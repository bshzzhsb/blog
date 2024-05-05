import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import type { SuggestionProps } from '@tiptap/suggestion';

import { Icon } from '~/components/icon';
import { classnames } from '~/utils/classname';

import type { Command, Group } from './group';

export type MenuListRef = {
  onKeyDown: (event: KeyboardEvent) => boolean;
};

export const MenuList = forwardRef<MenuListRef, SuggestionProps<Group>>((props, ref) => {
  const { items: groups, command: execute } = props;
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

  // Reset index to the first menu item when groups change.
  useEffect(() => {
    setSelectedGroupIndex(0);
    setSelectedCommandIndex(0);
  }, [groups]);

  const onSelectItem = useCallback(
    (command: Command) => {
      execute(command as unknown as Group);
    },
    [execute],
  );

  useImperativeHandle(
    ref,
    () => ({
      onKeyDown: event => {
        console.log('useImperativeHandle', event.key);
        switch (event.key) {
          case 'ArrowDown': {
            const commands = groups[selectedGroupIndex]?.commands;
            if (!commands || commands.length === 0) {
              return false;
            }

            let newGroupIndex = selectedGroupIndex;
            let newCommandIndex = selectedCommandIndex + 1;

            if (newCommandIndex > commands.length - 1) {
              newCommandIndex = 0;
              newGroupIndex += 1;
            }

            if (newGroupIndex > groups.length - 1) {
              newGroupIndex = 0;
            }

            setSelectedGroupIndex(newGroupIndex);
            setSelectedCommandIndex(newCommandIndex);

            return true;
          }
          case 'ArrowUp': {
            const commands = groups[selectedGroupIndex]?.commands;
            if (!commands || commands.length === 0) {
              return false;
            }

            let newGroupIndex = selectedGroupIndex;
            let newCommandIndex = selectedCommandIndex - 1;

            if (newCommandIndex < 0) {
              newGroupIndex -= 1;

              if (newGroupIndex < 0) {
                newGroupIndex = groups.length - 1;
              }

              newCommandIndex = groups[newGroupIndex].commands.length - 1;
            }

            setSelectedGroupIndex(newGroupIndex);
            setSelectedCommandIndex(newCommandIndex);

            return true;
          }
          case 'Enter': {
            const activeItem = groups[selectedGroupIndex]?.commands[selectedCommandIndex];

            if (!activeItem) {
              return false;
            }

            onSelectItem(activeItem);

            return true;
          }
        }

        return false;
      },
    }),
    [onSelectItem, groups, selectedCommandIndex, selectedGroupIndex],
  );

  // TODO: @sibo select item maybe out of the viewport.

  if (groups.length === 0) return null;

  return (
    <div className='flex flex-col gap-2 max-w-xs p-2 background rounded-lg border-[1px] border-gray-200 shadow-md"'>
      {groups.map((group, groupIndex) => (
        <div key={group.id} className="flex flex-col justify-center gap-2">
          <div className="text-sm font-semibold text-secondary">{group.title}</div>
          <div className="flex flex-col gap-2">
            {group.commands.map((command, commandIndex) => (
              <button
                key={command.id}
                onClick={() => onSelectItem(command)}
                className={classnames('flex items-center gap-2 px-2 py-1 rounded hover:bg-neutral-100', {
                  'bg-neutral-100': groupIndex === selectedGroupIndex && commandIndex === selectedCommandIndex,
                })}
              >
                <Icon name={command.icon} />
                {command.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

MenuList.displayName = 'MenuList';
