import { Extension, ReactRenderer, isActive, isNodeSelection, posToDOMRect } from '@tiptap/react';
import { inline, offset, type ReferenceElement } from '@floating-ui/dom';

import { Popup } from '~/components/popup';

import { BubbleMenuPlugin } from './plugin';
import { BubbleMenuComponent } from './components';

export interface BubbleMenuState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikeThrough: boolean;
}

export interface BubbleMenuOptions {
  container?: HTMLDivElement;
}

export const BubbleMenu = Extension.create<BubbleMenuOptions>({
  name: 'BubbleMenuPlugin',

  addOptions() {
    return {
      container: undefined,
    };
  },

  addProseMirrorPlugins() {
    const { options } = this;

    return [
      BubbleMenuPlugin<BubbleMenuState>({
        editor: this.editor,

        items(state) {
          const isBold = isActive(state, 'bold');
          const isItalic = isActive(state, 'italic');
          const isUnderline = isActive(state, 'underline');
          const isStrikeThrough = isActive(state, 'strike');

          return { isBold, isItalic, isUnderline, isStrikeThrough };
        },

        render: () => {
          let component: ReactRenderer<undefined, undefined> | null = null;
          let popup: Popup | null = null;

          return {
            onStart: props => {
              component = new ReactRenderer(BubbleMenuComponent, {
                editor: this.editor,
                props: {
                  ...props,
                  editor: this.editor,
                },
              });

              const getSelectionRect = () => {
                const { view } = this.editor;
                const { state } = view;
                const { selection } = state;

                // support for CellSelections
                const { ranges } = selection;
                const from = Math.min(...ranges.map(range => range.$from.pos));
                const to = Math.max(...ranges.map(range => range.$to.pos));

                if (isNodeSelection(state.selection)) {
                  let node = view.nodeDOM(from) as HTMLElement;

                  const nodeViewWrapper = node.dataset.nodeViewWrapper
                    ? node
                    : node.querySelector('[data-node-view-wrapper]');

                  if (nodeViewWrapper) {
                    node = nodeViewWrapper.firstChild as HTMLElement;
                  }

                  if (node) {
                    return node.getBoundingClientRect();
                  }
                }

                const a = new Range();
                const fromNode = view.domAtPos(from);
                a.setStart(fromNode.node, fromNode.offset);
                const toNode = view.domAtPos(to);
                a.setEnd(toNode.node, toNode.offset);

                console.log('posToDOMRect', from, to, posToDOMRect(view, from, to), a, a.getClientRects());

                return posToDOMRect(view, from, to);
              };

              const getSelectionRects = () => {
                const { view } = this.editor;
                const { state } = view;
                const { selection } = state;

                // support for CellSelections
                const { ranges } = selection;
                const from = Math.min(...ranges.map(range => range.$from.pos));
                const to = Math.max(...ranges.map(range => range.$to.pos));

                const a = new Range();
                const fromNode = view.domAtPos(from);
                a.setStart(fromNode.node, fromNode.offset);
                const toNode = view.domAtPos(to);
                a.setEnd(toNode.node, toNode.offset);

                return a.getClientRects();
              };

              const anchor: ReferenceElement = {
                getBoundingClientRect: getSelectionRect,
                getClientRects: getSelectionRects,
              };

              popup = new Popup(
                component.element,
                anchor,
                { placement: 'top-start', middleware: [inline(), offset({ mainAxis: 4 })] },
                options.container,
              );
              popup.show();
              popup.updatePosition();
            },
            onUpdate(props) {
              component?.updateProps(props);
              popup?.updatePosition();
            },
            onExit() {
              popup?.destroy();
              component?.destroy();
            },
          };
        },
      }),
    ];
  },
});
