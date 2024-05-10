import React, { forwardRef, useRef } from 'react';
import {
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  useFloatingParentNodeId,
  useFloatingTree,
  useListItem,
  useMergeRefs,
} from '@floating-ui/react';

import { Icon } from '~/components/icon';

import {
  DropdownMenuContext,
  ParentDropdownMenuContext,
  useDropdownMenu,
  useDropdownMenuContext,
  useParentDropdownMenu,
  useParentDropdownMenuContext,
} from './hooks';
import { classnames } from '~/utils/classname';

export function DropdownMenu(props: React.PropsWithChildren) {
  const { children } = props;
  const parentId = useFloatingParentNodeId();

  if (parentId === null) {
    return (
      <FloatingTree>
        <DropdownMenuComponent>{children}</DropdownMenuComponent>
      </FloatingTree>
    );
  }

  return <DropdownMenuComponent>{children}</DropdownMenuComponent>;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  label: string;
  disabled?: boolean;
}

export const DropdownMenuItem = forwardRef<
  HTMLButtonElement,
  DropdownMenuItemProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, forwardedRef) => {
  const { label, disabled, children, ...rest } = props;
  const { activeIndex, setHasFocusInside, interactions } = useDropdownMenuContext();
  const item = useListItem({ label: disabled ? null : label });
  const tree = useFloatingTree();
  const { getItemProps } = interactions;

  const isActive = item.index === activeIndex;

  return (
    <button
      {...rest}
      ref={useMergeRefs([item.ref, forwardedRef])}
      type="button"
      role="menuitem"
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      {...getItemProps({
        onClick(event: React.MouseEvent<HTMLButtonElement>) {
          props.onClick?.(event);
          tree?.events.emit('click');
        },
        onFocus(event: React.FocusEvent<HTMLButtonElement>) {
          props.onFocus?.(event);
          setHasFocusInside(true);
        },
      })}
    >
      {children}
    </button>
  );
});

export const DropdownMenuTrigger = forwardRef<HTMLButtonElement, React.HTMLProps<HTMLButtonElement>>(
  ({ children, className }, propsRef) => {
    const parent = useParentDropdownMenuContext();

    const { isOpen, isNested, hasFocusInside, setHasFocusInside, floating, interactions, item } =
      useDropdownMenuContext();
    const { getReferenceProps } = interactions;

    return (
      <button
        ref={useMergeRefs([floating.refs.setReference, item.ref, propsRef])}
        className={className}
        tabIndex={!isNested ? undefined : parent?.activeIndex === item.index ? 0 : -1}
        role={isNested ? 'menuitem' : undefined}
        data-state={isOpen ? 'open' : 'closed'}
        data-nested={isNested ? '' : undefined}
        data-focus-inside={hasFocusInside ? '' : undefined}
        {...getReferenceProps(
          parent?.getItemProps({
            onFocus() {
              setHasFocusInside(false);
              parent?.setHasFocusInside(true);
            },
          }),
        )}
      >
        {children}
        <Icon
          name="chevron-up-regular"
          className={classnames('transition', { 'rotate-90': isNested, 'rotate-180': !isNested && isOpen })}
        />
      </button>
    );
  },
);

export const DropdownMenuContent = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  function DropdownMenuContent({ children, ...props }, propsRef) {
    const dropdownMenuContext = useDropdownMenuContext();
    const parentDropDownMenuContext = useParentDropdownMenu(dropdownMenuContext);
    const { isOpen, isNested, elementsRef, labelsRef, floating, interactions } = dropdownMenuContext;
    const { context, floatingStyles, refs } = floating;
    const { getFloatingProps } = interactions;
    const ref = useMergeRefs([refs.setFloating, propsRef]);

    return (
      <ParentDropdownMenuContext.Provider value={parentDropDownMenuContext}>
        <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
          {isOpen && (
            <FloatingPortal>
              <FloatingFocusManager
                context={context}
                modal={false}
                initialFocus={isNested ? -1 : 0}
                returnFocus={!isNested}
              >
                <div ref={ref} style={floatingStyles} {...getFloatingProps()} {...props}>
                  {children}
                </div>
              </FloatingFocusManager>
            </FloatingPortal>
          )}
        </FloatingList>
      </ParentDropdownMenuContext.Provider>
    );
  },
);

function DropdownMenuComponent(props: React.PropsWithChildren) {
  const { children } = props;
  const elementsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const labelsRef = useRef<Array<string | null>>([]);

  const dropdownMenuContext = useDropdownMenu(elementsRef, labelsRef);

  return (
    <FloatingNode id={dropdownMenuContext.nodeId}>
      <DropdownMenuContext.Provider value={dropdownMenuContext}>{children}</DropdownMenuContext.Provider>
    </FloatingNode>
  );
}
