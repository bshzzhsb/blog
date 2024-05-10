import { forwardRef } from 'react';
import { FloatingPortal, useMergeRefs } from '@floating-ui/react';

import type { TooltipOptions } from './hooks';
import { TooltipContext, useTooltip, useTooltipContext } from './hooks';

interface TooltipProps extends TooltipOptions {
  children: React.ReactNode;
}

export function Tooltip(props: TooltipProps) {
  const { children, ...options } = props;
  const tooltip = useTooltip(options);

  return <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>;
}

export const TooltipTrigger = forwardRef<HTMLElement, React.HTMLProps<HTMLElement>>(
  function TooltipTrigger(props, propRef) {
    const { children } = props;
    const context = useTooltipContext();
    const childrenRef = (children as unknown as { ref: React.RefObject<HTMLElement> }).ref;
    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

    return (
      <button ref={ref} data-state={context.open ? 'open' : 'closed'} {...context.getReferenceProps(props)}>
        {children}
      </button>
    );
  },
);

export const TooltipContent = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  function TooltipContent(props, propRef) {
    const { style } = props;
    const context = useTooltipContext();
    const ref = useMergeRefs([context.refs.setFloating, propRef]);

    if (!context.open) return null;

    return (
      <FloatingPortal>
        <div ref={ref} style={{ ...context.floatingStyles, ...style }} {...context.getFloatingProps(props)} />
      </FloatingPortal>
    );
  },
);
