import { useCallback, useRef } from 'react';
import type * as Monaco from 'monaco-editor';

import { CodeFile } from '~/constants';
import { useSetup } from '~/utils/hooks';
import { EventEmitter } from '~/utils/event-emitter';

import { getLanguage } from '../utils/get-language';
import { getFilePath } from '../utils/file';

interface MonacoTabsProps {
  monaco: typeof Monaco;
}

export enum Event {
  MODEL_CONTENT_CHANGE,
}
type Subscriber = {
  [Event.MODEL_CONTENT_CHANGE]: (filename: string) => void;
};

type Tab = { watcher: Monaco.IDisposable; model: Monaco.editor.ITextModel };

export const useMonacoTabs = ({ monaco }: MonacoTabsProps) => {
  const tabs = useRef(new Map<string, Tab>());
  const eventEmitter = useRef(new EventEmitter<Event, Subscriber>());

  const getModel = useCallback((filename: string) => {
    return tabs.current.get(filename)?.model;
  }, []);

  const getTabs = useCallback(() => {
    const res: CodeFile[] = [];
    for (const [filename, tab] of tabs.current) {
      res.push({ filename, source: tab.model.getValue() });
    }
    return res;
  }, []);

  const createTab = useCallback(
    (file: CodeFile) => {
      const { filename, source } = file;
      if (tabs.current.get(filename)) return;

      const path = getFilePath(filename);
      const language = getLanguage(filename);
      const model = monaco.editor.createModel(source, language, monaco.Uri.parse(path));
      const watcher = model.onDidChangeContent(() => {
        eventEmitter.current.emit(Event.MODEL_CONTENT_CHANGE, [filename]);
      });

      const tab = { model, watcher };
      tabs.current.set(filename, tab);
      return tab;
    },
    [monaco.Uri, monaco.editor],
  );

  const deleteTab = useCallback((filename: string) => {
    const tab = tabs.current.get(filename);
    if (!tab) return;

    tab.model.dispose();
    tab.watcher.dispose();
    tabs.current.delete(filename);
  }, []);

  const renameTab = useCallback(
    (oldFilename: string, newFilename: string) => {
      const newFilenameExist = !!getModel(newFilename);
      if (newFilenameExist) return;

      // Monaco don't support change uri of model
      // On tab rename, we need to delete old tab and create new tab
      const value = getModel(oldFilename)?.getValue();
      deleteTab(oldFilename);
      return createTab({ filename: newFilename, source: value ?? '' });
    },
    [createTab, deleteTab, getModel],
  );

  const reset = useCallback(
    (files: CodeFile[]) => {
      for (const [, { model, watcher }] of tabs.current) {
        watcher.dispose();
        model.dispose();
      }

      tabs.current.clear();
      for (const file of files) {
        createTab(file);
      }
    },
    [createTab],
  );

  const monacoTabs = useSetup(() => {
    return {
      value: tabs.current,
      createTab,
      deleteTab,
      renameTab,
      reset,
      getModel,
      getTabs,
      eventEmitter: eventEmitter.current,
    };
  });

  return monacoTabs;
};
