import React, { useEffect } from 'react';

import { classnames } from '~/utils/classname';
import { IconButton } from '~/components/button';
import { Add } from '~/components/icon';

interface TabPaneProps {
  tabKey: string;
  name: React.ReactNode;
  children: React.ReactElement;
}

interface TabsProps {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  className?: string;
  addable?: boolean;
  onAdd?: () => void;
  children: React.ReactElement<TabPaneProps> | undefined | (React.ReactElement<TabPaneProps> | undefined)[];
}

export const TabPane: React.FC<TabPaneProps> = ({ children }) => children;

function Tabs(props: TabsProps) {
  const { activeIndex, setActiveIndex, className, addable, onAdd, children } = props;
  const tabs =
    React.Children.map(children, child => {
      if (!child) return undefined;
      return {
        key: child.props.tabKey,
        node: child,
      };
    })?.filter(Boolean) ?? [];

  useEffect(() => {
    if (activeIndex < 0) {
      setActiveIndex(0);
    } else if (activeIndex >= tabs.length) {
      setActiveIndex(tabs.length - 1);
    }
  }, [activeIndex, setActiveIndex, tabs.length]);

  return (
    <div className={classnames('flex flex-col', className)}>
      <div className="flex justify-between items-center">
        <ul className="relative flex flex-1 gap-1 items-center">
          {tabs.map((tab, i) => (
            <li
              key={tab.key}
              className={classnames(
                'flex flex-1 justify-center items-center h-12 cursor-pointer border-b-2 hover:bg-gray-100 dark:hover:bg-gray-800',
                {
                  'text-blue-500 border-b-blue-500': activeIndex === i,
                  'border-b-black/0 hover:border-b-gray-200 dark:hover:border-b-gray-700': activeIndex !== i,
                },
              )}
              onClick={() => setActiveIndex(i)}
            >
              {tab.node.props.name}
            </li>
          ))}
          {addable && (
            <IconButton className="ml-1" onClick={onAdd}>
              <Add />
            </IconButton>
          )}
        </ul>
      </div>
      <div className={'flex-1 h-full min-h-0'}>
        {tabs.map((tab, i) => (
          <div key={tab.key} className={'h-full' + (activeIndex === i ? '' : ' hidden')}>
            {tab.node.props.children}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tabs;
