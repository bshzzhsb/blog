import { useCallback, useMemo, useRef, useState } from 'react';
import type * as Monaco from 'monaco-editor';

import { CodeFile } from '~/constants';
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
  const tabsRef = useRef<(Tab & { filename: string })[]>([]);
  const [tabs, setTabs] = useState(new Map<string, Tab>());
  const [tabNames, setTabNames] = useState<string[]>([]);
  const [modifiedTabs, setModifiedTabs] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const eventEmitter = useRef(new EventEmitter<Event, Subscriber>());

  const getModel = useCallback(
    (filename: string) => {
      return tabs.get(filename)?.model;
    },
    [tabs],
  );

  const getTabs = useCallback(() => {
    const res: CodeFile[] = [];
    for (const [filename, tab] of tabs) {
      res.push({ filename, source: tab.model.getValue() });
    }
    return res;
  }, [tabs]);

  const createTab = useCallback(
    (file: CodeFile): Tab | undefined => {
      const { filename, source } = file;
      const path = getFilePath(filename);
      const uri = monaco.Uri.parse(path);
      const tab = tabsRef.current.find(t => t.filename === filename);
      if (tab) {
        return { model: tab.model, watcher: tab.watcher };
      }

      if (monaco.editor.getModel(uri)) return;

      const language = getLanguage(filename);

      const model = monaco.editor.createModel(source, language, monaco.Uri.parse(path));
      const watcher = model.onDidChangeContent(() => {
        eventEmitter.current.emit(Event.MODEL_CONTENT_CHANGE, [filename]);
      });

      tabsRef.current.push({ model, watcher, filename });
      return { model, watcher };
    },
    [monaco.Uri, monaco.editor],
  );

  const disposeTab = useCallback((tab: Tab) => {
    tab.model.dispose();
    tab.watcher.dispose();

    tabsRef.current = tabsRef.current.filter(t => t.model !== tab.model);
  }, []);

  const addTab = useCallback(
    (file: CodeFile) => {
      const tab = createTab(file);
      if (!tab) return;

      const { filename } = file;
      setTabs(currentTabs => {
        const newTab = new Map(currentTabs);
        newTab.set(filename, tab);
        return newTab;
      });

      // Set new file active and modified
      setTabNames(pre => {
        const index = pre.findIndex(it => it === filename);
        if (index >= 0) return pre;

        setActiveIndex(pre.length);
        return [...pre, filename];
      });
      setModifiedTabs(pre => {
        return pre.includes(filename) ? pre : [...pre, filename];
      });
      return tab;
    },
    [createTab],
  );

  const deleteTab = useCallback(
    (filename: string) => {
      setTabs(currentTabs => {
        const tab = currentTabs.get(filename);
        if (!tab) return currentTabs;

        disposeTab(tab);

        const newTabs = new Map(currentTabs);
        newTabs.delete(filename);

        return new Map(newTabs);
      });

      setTabNames(pre => {
        const index = pre.findIndex(it => it === filename);
        if (index < 0) return pre;

        pre.splice(index, 1);
        setActiveIndex(preActiveIndex => {
          return pre.length - 1 < preActiveIndex ? preActiveIndex - 1 : preActiveIndex;
        });
        return [...pre];
      });

      setModifiedTabs(pre => {
        const index = pre.findIndex(it => it === filename);
        if (index < 0) return pre;

        pre.splice(index, 1);
        return [...pre];
      });
    },
    [disposeTab],
  );

  const renameTab = useCallback(
    (oldFilename: string, newFilename: string) => {
      setTabs(currentTabs => {
        const newFilenameExist = currentTabs.has(newFilename);
        // New filename already exist, rename failed.
        if (newFilenameExist) return currentTabs;

        const oldTab = currentTabs.get(oldFilename);
        if (!oldTab) return currentTabs;

        const modelValue = oldTab.model.getValue();
        const newTab = createTab({ filename: newFilename, source: modelValue });
        if (!newTab) return currentTabs;

        // Monaco don't support change uri of model
        // On tab rename, we need to delete old tab and create new tab
        disposeTab(oldTab);

        const newTabs = new Map(currentTabs);
        newTabs.delete(oldFilename);
        newTabs.set(newFilename, newTab);

        setTabNames(pre => {
          const index = pre.findIndex(it => it === oldFilename);
          if (index < 0) return pre;

          pre[index] = newFilename;
          return [...pre];
        });

        setModifiedTabs(pre => {
          const index = pre.findIndex(it => it === oldFilename);
          if (index < 0) return pre;

          pre[index] = newFilename;
          return [...pre];
        });

        return newTabs;
      });
    },
    [createTab, disposeTab],
  );

  const reset = useCallback(
    (files: CodeFile[]) => {
      setTabs(currentTabs => {
        for (const [, currentTab] of currentTabs) {
          disposeTab(currentTab);
        }

        const newTabs = new Map<string, Tab>();
        for (const file of files) {
          const tab = createTab(file);
          if (!tab) continue;
          newTabs.set(file.filename, tab);
        }

        return newTabs;
      });
      setTabNames(files.map(file => file.filename));
      setModifiedTabs([]);
      setActiveIndex(0);
    },
    [createTab, disposeTab],
  );

  const tabsActions = useMemo(() => {
    return {
      addTab,
      deleteTab,
      renameTab,
      reset,
    };
  }, [addTab, deleteTab, renameTab, reset]);

  return {
    tabsActions,
    value: tabs,
    getModel,
    getTabs,
    eventEmitter: eventEmitter.current,
    tabNames,
    modifiedTabs,
    setModifiedTabs,
    activeIndex,
    setActiveIndex,
  };
};
