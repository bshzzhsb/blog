import { createContext, useContext, useMemo, useState } from 'react';
import type { Placement } from '@floating-ui/react';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';

export interface TooltipOptions {
  initialOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
}

export function useTooltip(options: TooltipOptions) {
  const { initialOpen, open: controlledOpen, onOpenChange: setControlledOpen, placement } = options;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { move: false, enabled: controlledOpen === undefined });
  const focus = useFocus(context, { enabled: controlledOpen === undefined });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getFloatingProps, getReferenceProps } = useInteractions([hover, focus, dismiss, role]);

  return useMemo(
    () => ({
      open,
      setOpen,
      refs,
      floatingStyles,
      context,
      getFloatingProps,
      getReferenceProps,
    }),
    [context, floatingStyles, getFloatingProps, getReferenceProps, open, refs, setOpen],
  );
}

type TooltipContextType = ReturnType<typeof useTooltip> | null;

export const TooltipContext = createContext<TooltipContextType>(null);

export const useTooltipContext = () => {
  const context = useContext(TooltipContext);

  if (context === null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />');
  }

  return context;
};
