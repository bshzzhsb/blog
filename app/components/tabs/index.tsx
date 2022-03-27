import React, { useEffect, useRef, useState } from 'react';

interface TabPaneProps {
  tabKey: string;
  name: string;
  children: React.ReactElement;
}

interface TabsProps {
  defaultIndex?: number;
  className?: string;
  rightBtn?: React.ReactElement;
  children: React.ReactElement<TabPaneProps> | React.ReactElement<TabPaneProps>[];
}

export const TabPane: React.FC<TabPaneProps> = ({ children }) => children;

function Tabs({ defaultIndex, className = '', rightBtn, children }: TabsProps) {
  const tabs = React.Children.map(children, (child) => ({
    key: child.props.tabKey,
    node: child,
  })).filter(Boolean);
  const [activeIndex, setActiveIndex] = useState<number>(defaultIndex ?? 0);
  const [tabBarPos, setTabBarPos] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const tabRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (activeIndex >= tabRefs.current.length) return;
    const tab = tabRefs.current[activeIndex];
    setTabBarPos({ left: tab?.offsetLeft, width: tab?.offsetWidth });
  }, [activeIndex]);

  return (
    <div className={className + ' flex flex-col overflow-hidden'}>
      <div className="flex justify-between items-center border-b">
        <div className="relative flex gap-4 items-center px-4">
          {tabs.map((tab, i) => (
            <div
              key={tab.key}
              ref={(ref) => {
                if (ref) tabRefs.current[i] = ref;
              }}
              className={'px-1 py-2.5 cursor-pointer' + (activeIndex === i ? ' text-blue-500' : '')}
              onClick={() => setActiveIndex(i)}
            >
              {tab.node.props.name}
            </div>
          ))}
          <div
            className="absolute bottom-[-1px] h-[2px] bg-blue-500 transition-all z-10"
            style={{
              left: `${tabBarPos.left}px`,
              width: `${tabBarPos.width}px`,
            }}
          />
        </div>
        <div className="flex gap-4 items-center mr-4">{rightBtn}</div>
      </div>
      <div className="flex-1 overflow-hidden">
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
