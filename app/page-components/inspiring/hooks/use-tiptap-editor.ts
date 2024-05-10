import { useEffect, useRef, useState } from 'react';
import { Editor as ReactEditor } from '@tiptap/react';
import type { EditorOptions } from '@tiptap/core';

// NOTE: This is copied from @tiptap/react repo but change the hook of ReactEditor from `useRef` to `useState`.
// `useRef` cannot update immediately when deps change and <EditorContent />'s editor maybe destroyed.
// If we use `useRef` to store Editor, imagine case below:
// 1. MountRef. We use `SetState` to set ref (trigger recreate editor).
// 2. `SetState` cause rerender. All passive effects will be flushed.
//    In <EditorContent /> mount effect, editor is still null.
//    In `useEffect` of `useEditor`, new editor (Editor1) was created.
// 3. During render, Editor1 was passed to <EditorContent />.
// 4. After render, `useEditor` do cleanup because deps changed. Editor1 was destroyed.
// 5. In <EditorContent /> mount effect, editor is **the old editor** (Editor1).
//    This will lead to <ErrorBoundary />!!!
export const useEditor = (options: Partial<EditorOptions> = {}, deps: React.DependencyList = []) => {
  const [editor, setEditor] = useState<ReactEditor | null>(null);
  const [, forceUpdate] = useState({});

  const { onBeforeCreate, onBlur, onCreate, onDestroy, onFocus, onSelectionUpdate, onTransaction, onUpdate } = options;

  const onBeforeCreateRef = useRef(onBeforeCreate);
  const onBlurRef = useRef(onBlur);
  const onCreateRef = useRef(onCreate);
  const onDestroyRef = useRef(onDestroy);
  const onFocusRef = useRef(onFocus);
  const onSelectionUpdateRef = useRef(onSelectionUpdate);
  const onTransactionRef = useRef(onTransaction);
  const onUpdateRef = useRef(onUpdate);

  // This effect will handle updating the editor instance
  // when the event handlers change.
  useEffect(() => {
    if (!editor) {
      return;
    }

    if (onBeforeCreate) {
      editor.off('beforeCreate', onBeforeCreateRef.current);
      editor.on('beforeCreate', onBeforeCreate);

      onBeforeCreateRef.current = onBeforeCreate;
    }

    if (onBlur) {
      editor.off('blur', onBlurRef.current);
      editor.on('blur', onBlur);

      onBlurRef.current = onBlur;
    }

    if (onCreate) {
      editor.off('create', onCreateRef.current);
      editor.on('create', onCreate);

      onCreateRef.current = onCreate;
    }

    if (onDestroy) {
      editor.off('destroy', onDestroyRef.current);
      editor.on('destroy', onDestroy);

      onDestroyRef.current = onDestroy;
    }

    if (onFocus) {
      editor.off('focus', onFocusRef.current);
      editor.on('focus', onFocus);

      onFocusRef.current = onFocus;
    }

    if (onSelectionUpdate) {
      editor.off('selectionUpdate', onSelectionUpdateRef.current);
      editor.on('selectionUpdate', onSelectionUpdate);

      onSelectionUpdateRef.current = onSelectionUpdate;
    }

    if (onTransaction) {
      editor.off('transaction', onTransactionRef.current);
      editor.on('transaction', onTransaction);

      onTransactionRef.current = onTransaction;
    }

    if (onUpdate) {
      editor.off('update', onUpdateRef.current);
      editor.on('update', onUpdate);

      onUpdateRef.current = onUpdate;
    }
  }, [onBeforeCreate, onBlur, onCreate, onDestroy, onFocus, onSelectionUpdate, onTransaction, onUpdate, editor]);

  useEffect(() => {
    let isMounted = true;

    const reactEditor = new ReactEditor(options);
    reactEditor.on('transaction', () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (isMounted) {
            forceUpdate({});
          }
        });
      });
    });

    setEditor(reactEditor);

    return () => {
      isMounted = false;
      reactEditor.destroy();
    };
  }, deps);

  return editor;
};
