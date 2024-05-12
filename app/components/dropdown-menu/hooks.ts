import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListItem,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react';

export const ParentDropdownMenuContext = createContext<ReturnType<typeof useParentDropdownMenu> | null>(null);

export function useParentDropdownMenuContext() {
  return useContext(ParentDropdownMenuContext);
}

export function useParentDropdownMenu(context: ReturnType<typeof useDropdownMenu>) {
  const { activeIndex, setHasFocusInside, interactions } = context;
  const { getItemProps } = interactions;
  return useMemo(
    () => ({ activeIndex, setHasFocusInside, getItemProps }),
    [activeIndex, getItemProps, setHasFocusInside],
  );
}

export const DropdownMenuContext = createContext<ReturnType<typeof useDropdownMenu> | null>(null);

export function useDropdownMenuContext() {
  const context = useContext(DropdownMenuContext);

  if (context === null) {
    throw new Error('DropdownMenu components must be wrapped in <DropdownMenu />');
  }

  return context;
}

export function useDropdownMenu(
  elementsRef: React.MutableRefObject<(HTMLElement | null)[]>,
  labelsRef: React.MutableRefObject<(string | null)[]>,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasFocusInside, setHasFocusInside] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const item = useListItem();

  const isNested = parentId != null;

  const floating = useFloating<HTMLButtonElement>({
    nodeId,
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: isNested ? 'right-start' : 'bottom-start',
    middleware: [offset({ mainAxis: isNested ? 0 : 4, alignmentAxis: isNested ? -4 : 0 }), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });
  const { context } = floating;

  const hover = useHover(context, {
    enabled: true,
    delay: { open: 75 },
    handleClose: safePolygon({ blockPointerEvents: true }),
  });
  const click = useClick(context, {
    event: 'mousedown',
    toggle: !isNested,
    ignoreMouse: isNested,
  });
  const role = useRole(context, { role: 'menu' });
  const dismiss = useDismiss(context, { bubbles: true });
  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    nested: isNested,
    onNavigate: setActiveIndex,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    onMatch: isOpen ? setActiveIndex : undefined,
    activeIndex,
  });

  const interactions = useInteractions([hover, click, role, dismiss, listNavigation, typeahead]);

  // Event emitter allows you to communicate across tree components.
  // This effect closes all menus when an item gets clicked anywhere
  // in the tree.
  useEffect(() => {
    if (!tree) return;

    function handleTreeClick() {
      setIsOpen(false);
    }

    function onSubMenuOpen(event: { nodeId: string; parentId: string }) {
      if (event.nodeId !== nodeId && event.parentId === parentId) {
        setIsOpen(false);
      }
    }

    tree.events.on('click', handleTreeClick);
    tree.events.on('menuopen', onSubMenuOpen);

    return () => {
      tree.events.off('click', handleTreeClick);
      tree.events.off('menuopen', onSubMenuOpen);
    };
  }, [tree, nodeId, parentId]);

  useEffect(() => {
    if (isOpen && tree) {
      tree.events.emit('menuopen', { parentId, nodeId });
    }
  }, [tree, isOpen, nodeId, parentId]);

  return useMemo(
    () => ({
      isOpen,
      setIsOpen,
      activeIndex,
      setActiveIndex,
      hasFocusInside,
      setHasFocusInside,
      isNested,
      nodeId,

      elementsRef,
      labelsRef,

      floating,
      interactions,
      item,
    }),
    [activeIndex, elementsRef, floating, hasFocusInside, interactions, isNested, isOpen, item, labelsRef, nodeId],
  );
}
