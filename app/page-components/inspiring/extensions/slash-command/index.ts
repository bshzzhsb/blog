import { Editor, Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { ReactRenderer } from '@tiptap/react';
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';
import { Suggestion } from '@tiptap/suggestion';

import { Popup } from '~/components/popup';

import type { Command, Group } from './group';
import { GROUPS } from './group';
import { MenuList } from './menu-list';
import type { MenuListRef } from './menu-list';

const KEY = 'SlashCommand';

export const SlashCommand = Extension.create({
  name: KEY,
  priority: 500,

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        allowSpaces: true,
        startOfLine: true,
        pluginKey: new PluginKey(KEY),

        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          const isRootDepth = $from.depth === 1;
          const isParagraph = $from.parent.type.name === 'paragraph';
          const isStartOfNode = $from.parent.textContent?.charAt(0) === '/';
          const isInColumn = this.editor.isActive('column');

          const afterContent = $from.parent.textContent?.substring($from.parent.textContent?.indexOf('/'));
          const isValidAfterContent = !afterContent?.endsWith('  ');

          return (isRootDepth || isInColumn) && isParagraph && isStartOfNode && isValidAfterContent;
        },

        command: ({ editor, props }: { editor: Editor; props: Group }) => {
          const { view, state } = editor;
          const { $head, $from } = view.state.selection;

          const end = $from.pos;
          const from = $head?.nodeBefore
            ? end - ($head.nodeBefore.text?.substring($head.nodeBefore.text?.indexOf('/')).length ?? 0)
            : $from.start();

          const tr = state.tr.deleteRange(from, end);
          view.dispatch(tr);

          // NOTE: props real type is Command, but @tiptap/suggestion assert its type same as item's type below (Group).
          (props as unknown as Command).action(editor);
          view.focus();
        },

        items: ({ query }: { query: string }) => {
          const withFilteredCommands = GROUPS.map(group => ({
            ...group,
            commands: group.commands
              .filter(item => {
                const labelNormalized = item.label.toLowerCase().trim();
                const queryNormalized = query.toLowerCase().trim();

                const matchLabel = labelNormalized.includes(queryNormalized);
                const matchAliases = item.aliases?.map(alias => alias.toLowerCase().trim()).includes(queryNormalized);

                return matchLabel || matchAliases;
              })
              .filter(command => !command.shouldBeHidden?.(this.editor)),
          }));

          const withoutEmptyGroups = withFilteredCommands.filter(group => group.commands.length > 0);

          return withoutEmptyGroups;
        },

        render: () => {
          let component: ReactRenderer<MenuListRef, SuggestionProps<Group>> | null = null;
          let popup: Popup | null = null;

          return {
            onStart(props) {
              component = new ReactRenderer(MenuList, {
                props,
                editor: props.editor,
              });

              const { view } = props.editor;
              const anchor = view.domAtPos(props.range.from).node as Element;

              popup = new Popup(component.element, anchor, { placement: 'bottom-start' });
              popup.show();
            },

            onUpdate(props) {
              component?.updateProps(props);
            },

            onKeyDown(props: SuggestionKeyDownProps) {
              if (props.event.key === 'Escape') {
                popup?.hide();
                return true;
              }

              popup?.show();
              return component?.ref?.onKeyDown(props.event) ?? false;
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
