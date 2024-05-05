import { Editor, isNodeSelection, isTextSelection, posToDOMRect } from '@tiptap/core';
import { EditorState, Plugin, PluginKey, PluginView } from '@tiptap/pm/state';
import { EditorView } from '@tiptap/pm/view';

import { Popup } from '../slash-command/popup';

export interface BubbleMenuPluginProps {
  pluginKey: PluginKey | string;
  editor: Editor;
  element: HTMLElement;
  shouldShow?: (props: {
    editor: Editor;
    view: EditorView;
    state: EditorState;
    oldState?: EditorState;
    from: number;
    to: number;
  }) => boolean;
}

export type BubbleMenuViewProps = BubbleMenuPluginProps & {
  view: EditorView;
};

export class BubbleMenuView implements PluginView {
  editor: Editor;
  element: HTMLElement;
  popup: Popup;
  view: EditorView;
  preventHide = false;
  private updateDebounceTimer: number | undefined;

  constructor({ editor, element, view, shouldShow }: BubbleMenuViewProps) {
    console.log('new BubbleMenuView');
    this.editor = editor;
    this.element = element;
    this.view = view;

    if (shouldShow) {
      this.shouldShow = shouldShow;
    }

    this.element.addEventListener('mousedown', this.mousedownHandler, { capture: true });
    this.editor.on('focus', this.focusHandler);
    // this.editor.on('blur', this.blurHandler);
    this.popup = new Popup(element, { getBoundingClientRect: this.getSelectionRect });
  }

  destroy() {
    console.log('destroy');
    this.popup?.destroy();
    this.element.removeEventListener('mousedown', this.mousedownHandler, { capture: true });
    this.editor.off('focus', this.focusHandler);
    this.editor.off('blur', this.blurHandler);
  }

  show() {
    console.log('bubble show', this.popup);
    this.popup.updatePosition();
    this.popup.show();
  }

  hide() {
    console.log('hide');
    this.popup.hide();
  }

  public shouldShow: Exclude<BubbleMenuPluginProps['shouldShow'], null> = ({ view, state, from, to }) => {
    const { doc, selection } = state;
    const { empty } = selection;

    // Sometime check for `empty` is not enough.
    // Double click an empty paragraph returns a node size of 2.
    // So we check also for an empty text size.
    const isEmptyTextBlock = !doc.textBetween(from, to).length && isTextSelection(state.selection);

    // When clicking on a element inside the bubble menu the editor "blur" event
    // is called and the bubble menu item is focussed. In this case we should
    // consider the menu as part of the editor and keep showing the menu
    const isChildOfMenu = this.element.contains(document.activeElement);

    const hasEditorFocus = view.hasFocus() || isChildOfMenu;

    console.log('shouldShow', { hasEditorFocus, empty, isEmptyTextBlock });

    if (!hasEditorFocus || empty || isEmptyTextBlock || !this.editor.isEditable) {
      return false;
    }

    return true;
  };

  mousedownHandler = () => {
    this.preventHide = true;
  };

  focusHandler = () => {
    // we use `setTimeout` to make sure `selection` is already updated
    setTimeout(() => this.update(this.editor.view));
  };

  blurHandler = ({ event }: { event: FocusEvent }) => {
    if (this.preventHide) {
      this.preventHide = false;

      return;
    }

    if (event?.relatedTarget && this.element.parentNode?.contains(event.relatedTarget as Node)) {
      return;
    }

    console.log('in blurHandler');
    this.hide();
  };

  update(view: EditorView, oldState?: EditorState) {
    const { state } = view;
    const hasValidSelection = state.selection.$from.pos !== state.selection.$to.pos;

    const selectionChanged = !oldState?.selection.eq(view.state.selection);
    const docChanged = !oldState?.doc.eq(view.state.doc);

    if (!selectionChanged && !docChanged) return;

    if (hasValidSelection) {
      this.handleDebouncedUpdate(view, oldState);
      return;
    }

    this.updateHandler(view, oldState);
  }

  handleDebouncedUpdate = (view: EditorView, oldState?: EditorState) => {
    const selectionChanged = !oldState?.selection.eq(view.state.selection);
    const docChanged = !oldState?.doc.eq(view.state.doc);

    if (!selectionChanged && !docChanged) {
      return;
    }

    if (this.updateDebounceTimer) {
      clearTimeout(this.updateDebounceTimer);
    }

    this.updateDebounceTimer = window.setTimeout(() => {
      this.updateHandler(view, oldState);
    }, 100);
  };

  updateHandler = (view: EditorView, oldState?: EditorState) => {
    const { state, composing } = view;
    const { selection } = state;

    if (composing) {
      return;
    }

    // support for CellSelections
    const { ranges } = selection;
    const from = Math.min(...ranges.map(range => range.$from.pos));
    const to = Math.max(...ranges.map(range => range.$to.pos));

    const shouldShow =
      this.shouldShow?.({
        editor: this.editor,
        view,
        state,
        oldState,
        from,
        to,
      }) ?? true;

    console.log('shouldShow', shouldShow);

    if (!shouldShow) {
      this.hide();

      return;
    }

    this.show();
  };

  private getSelectionRect = () => {
    const { view } = this.editor;
    const { state } = view;
    const { selection } = state;

    // support for CellSelections
    const { ranges } = selection;
    const from = Math.min(...ranges.map(range => range.$from.pos));
    const to = Math.max(...ranges.map(range => range.$to.pos));

    if (isNodeSelection(state.selection)) {
      let node = view.nodeDOM(from) as HTMLElement;

      const nodeViewWrapper = node.dataset.nodeViewWrapper ? node : node.querySelector('[data-node-view-wrapper]');

      if (nodeViewWrapper) {
        node = nodeViewWrapper.firstChild as HTMLElement;
      }

      if (node) {
        return node.getBoundingClientRect();
      }
    }

    return posToDOMRect(view, from, to);
  };
}

export const BubbleMenuPlugin = (options: BubbleMenuPluginProps) => {
  return new Plugin({
    key: typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey,
    view: view => new BubbleMenuView({ view, ...options }),
  });
};

type BMPState = {
  
}

export const BMP = () => {
  return new Plugin({
    key: new PluginKey('BMP'),

    view() {
      return {
        update: async (view, prevState) => {
          const prev = this.key?.getState(prevState);
          const next = this.key?.getState(view.state);

          // See how the state changed
          const moved = prev.active && next.active && prev.range.from !== next.range.from;
          const started = !prev.active && next.active;
          const stopped = prev.active && !next.active;
          const changed = !started && !stopped && prev.query !== next.query;
          const handleStart = started || moved;
          const handleChange = changed && !moved;
          const handleExit = stopped || moved;

          // Cancel when suggestion isn't active
          if (!handleStart && !handleChange && !handleExit) {
            return;
          }

          const state = handleExit && !handleStart ? prev : next;
          const decorationNode = view.dom.querySelector(`[data-decoration-id="${state.decorationId}"]`);

          props = {
            editor,
            range: state.range,
            query: state.query,
            text: state.text,
            items: [],
            command: commandProps => {
              return command({
                editor,
                range: state.range,
                props: commandProps,
              });
            },
            decorationNode,
            // virtual node for popper.js or tippy.js
            // this can be used for building popups without a DOM node
            clientRect: decorationNode
              ? () => {
                  // because of `items` can be asynchrounous we’ll search for the current decoration node
                  const { decorationId } = this.key?.getState(editor.state); // eslint-disable-line
                  const currentDecorationNode = view.dom.querySelector(`[data-decoration-id="${decorationId}"]`);

                  return currentDecorationNode?.getBoundingClientRect() || null;
                }
              : null,
          };

          if (handleStart) {
            renderer?.onBeforeStart?.(props);
          }

          if (handleChange) {
            renderer?.onBeforeUpdate?.(props);
          }

          if (handleChange || handleStart) {
            props.items = await items({
              editor,
              query: state.query,
            });
          }

          if (handleExit) {
            renderer?.onExit?.(props);
          }

          if (handleChange) {
            renderer?.onUpdate?.(props);
          }

          if (handleStart) {
            renderer?.onStart?.(props);
          }
        },

        destroy: () => {
          if (!props) {
            return;
          }

          renderer?.onExit?.(props);
        },
      };
    },

    state: {
      // Initialize the plugin's internal state.
      init() {
        const state: {
          active: boolean;
          range: Range;
          query: null | string;
          text: null | string;
          composing: boolean;
          decorationId?: string | null;
        } = {
          active: false,
          range: {
            from: 0,
            to: 0,
          },
          query: null,
          text: null,
          composing: false,
        };

        return state;
      },

      // Apply changes to the plugin state from a view transaction.
      apply(transaction, prev, oldState, state) {
        const { isEditable } = editor;
        const { composing } = editor.view;
        const { selection } = transaction;
        const { empty, from } = selection;
        const next = { ...prev };

        next.composing = composing;

        // We can only be suggesting if the view is editable, and:
        //   * there is no selection, or
        //   * a composition is active (see: https://github.com/ueberdosis/tiptap/issues/1449)
        if (isEditable && (empty || editor.view.composing)) {
          // Reset active state if we just left the previous suggestion range
          if ((from < prev.range.from || from > prev.range.to) && !composing && !prev.composing) {
            next.active = false;
          }

          // Try to match against where our cursor currently is
          const match = findSuggestionMatch({
            char,
            allowSpaces,
            allowedPrefixes,
            startOfLine,
            $position: selection.$from,
          });
          const decorationId = `id_${Math.floor(Math.random() * 0xffffffff)}`;

          // If we found a match, update the current state to show it
          if (match && allow({ editor, state, range: match.range })) {
            next.active = true;
            next.decorationId = prev.decorationId ? prev.decorationId : decorationId;
            next.range = match.range;
            next.query = match.query;
            next.text = match.text;
          } else {
            next.active = false;
          }
        } else {
          next.active = false;
        }

        // Make sure to empty the range if suggestion is inactive
        if (!next.active) {
          next.decorationId = null;
          next.range = { from: 0, to: 0 };
          next.query = null;
          next.text = null;
        }

        return next;
      },
    },

    props: {
      // Call the keydown hook if suggestion is active.
      handleKeyDown(view, event) {
        const { active, range } = plugin.getState(view.state);

        if (!active) {
          return false;
        }

        return renderer?.onKeyDown?.({ view, event, range }) || false;
      },

      // Setup decorator on the currently active suggestion.
      decorations(state) {
        const { active, range, decorationId } = plugin.getState(state);

        if (!active) {
          return null;
        }

        return DecorationSet.create(state.doc, [
          Decoration.inline(range.from, range.to, {
            nodeName: decorationTag,
            class: decorationClass,
            'data-decoration-id': decorationId,
          }),
        ]);
      },
    },
  });
};
