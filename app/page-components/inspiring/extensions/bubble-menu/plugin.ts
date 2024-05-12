import { Editor, isTextSelection } from '@tiptap/core';
import { EditorState, Plugin, PluginKey, Selection } from '@tiptap/pm/state';

export interface BubbleMenuPluginOptions<T> {
  pluginKey?: PluginKey;
  editor: Editor;
  char?: string;
  items?: (state: EditorState) => T;
  render?: () => {
    onStart?: (props: BubbleMenuPluginProps<T>) => void;
    onUpdate?: (props: BubbleMenuPluginProps<T>) => void;
    onExit?: (props: BubbleMenuPluginProps<T>) => void;
  };
}

interface BubbleMenuPluginProps<T> {
  items?: T;
}

interface BubbleMenuPluginState<T> {
  active: boolean;
  selection?: Selection;
  items?: T;
}

export function BubbleMenuPlugin<T>(options: BubbleMenuPluginOptions<T>) {
  const { editor, render, items } = options;
  const renderer = render?.();

  return new Plugin<BubbleMenuPluginState<T>>({
    key: new PluginKey('BubbleMenu'),

    view() {
      return {
        update: async (view, prevState) => {
          const prev = (this.key as PluginKey<BubbleMenuPluginState<T>>).getState(prevState);
          const next = (this.key as PluginKey<BubbleMenuPluginState<T>>).getState(view.state);

          // See how the state changed
          const started = !prev?.active && next?.active;
          const stopped = prev?.active && !next?.active;
          const updated = !started && !stopped;
          const handleStart = started;
          const handleUpdate = updated;
          const handleExit = stopped;

          if (!handleStart && !handleExit && !handleUpdate) return;

          const props: BubbleMenuPluginProps<T> = {
            items: next?.items,
          };

          if (handleExit) {
            renderer?.onExit?.(props);
          }

          if (handleUpdate) {
            renderer?.onUpdate?.(props);
          }

          if (handleStart) {
            renderer?.onStart?.(props);
          }
        },

        destroy: () => {
          renderer?.onExit?.({});
        },
      };
    },

    state: {
      init() {
        return {
          active: false,
        };
      },

      apply(transaction, prev, oldState, state) {
        const { view, isEditable } = editor;
        const { composing } = view;
        const { doc, selection } = state;
        const { ranges } = selection;

        const next: BubbleMenuPluginState<T> = { active: false, selection, items: items?.(state) };

        if (!isEditable || composing) {
          return next;
        }

        // support for CellSelections
        const from = Math.min(...ranges.map(range => range.$from.pos));
        const to = Math.max(...ranges.map(range => range.$to.pos));

        // Sometime check for `empty` is not enough.
        // Double click an empty paragraph returns a node size of 2.
        // So we check also for an empty text size.
        const isEmptyTextBlock = !doc.textBetween(from, to).length && isTextSelection(selection);

        if (!isEmptyTextBlock) {
          next.active = true;
        }

        return next;
      },
    },
  });
}
