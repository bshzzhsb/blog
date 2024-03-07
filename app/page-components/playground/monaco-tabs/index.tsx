import React, { useCallback, useEffect, useMemo } from 'react';
import type * as Monaco from 'monaco-editor';

import type { CodeFile } from '~/constants';
import { CODE_FILES } from '~/constants';

import { getFilesFromLocalStorage, saveFilesToLocalStorage } from '../utils/file';
import { Event, useMonacoTabs } from '../hooks/monaco-tabs';
import { MonacoTabsHeader } from './header';
import { Editor } from '../editor';

interface MonacoTabsProps {
  id: string;
  monaco: typeof Monaco;
  onActiveFileChange: (file: CodeFile) => void;
  pack: (files: CodeFile[]) => void;
}

export const MonacoTabs: React.FC<MonacoTabsProps> = React.memo(props => {
  const { id, monaco, onActiveFileChange, pack } = props;

  const { tabsActions, ...monacoTabs } = useMonacoTabs({ monaco });
  const activeFilename = useMemo(
    () => monacoTabs.tabNames[monacoTabs.activeIndex],
    [monacoTabs.activeIndex, monacoTabs.tabNames],
  );
  const activeModel = monacoTabs.getModel(activeFilename);

  useEffect(() => {
    if (!activeModel) return;
    onActiveFileChange({ filename: activeFilename, source: activeModel.getValue() });
  }, [activeFilename, activeModel, onActiveFileChange]);

  useEffect(() => {
    const files = getFilesFromLocalStorage(id);
    tabsActions.reset(files);
    pack(files);

    return () => {
      tabsActions.reset([]);
    };
  }, [id, pack, tabsActions]);

  useEffect(() => {
    return monacoTabs.eventEmitter.subscribe(Event.MODEL_CONTENT_CHANGE, filename => {
      onActiveFileChange({ filename, source: monacoTabs.getModel(filename)?.getValue() ?? '' });
      monacoTabs.setModifiedTabs(pre => {
        return pre.includes(filename) ? pre : [...pre, filename];
      });
    });
  }, [monacoTabs, onActiveFileChange]);

  useEffect(() => {
    const handleKeyboardSave = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
        e.preventDefault();
        monacoTabs.setModifiedTabs([]);
        const tabs = monacoTabs.getTabs();
        saveFilesToLocalStorage(id, tabs);
        pack(tabs);
      }
    };
    window.addEventListener('keydown', handleKeyboardSave);

    return () => {
      window.removeEventListener('keydown', handleKeyboardSave);
    };
  }, [id, monacoTabs, pack]);

  const onClickTab = useCallback(
    (filename: string) => {
      const activeIndex = monacoTabs.tabNames.findIndex(it => it === filename);
      monacoTabs.setActiveIndex(Math.max(activeIndex, 0));
    },
    [monacoTabs],
  );

  const onAddTab = useCallback(() => {
    let fileIndex = monacoTabs.value.size + 1;
    while (monacoTabs.value.has(`index${fileIndex}.tsx`)) {
      fileIndex += 1;
    }
    const filename = `index${fileIndex}.tsx`;

    tabsActions.addTab({ filename, source: '' });
  }, [monacoTabs.value, tabsActions]);

  const onDeleteTab = useCallback(
    (filename: string) => {
      tabsActions.deleteTab(filename);
    },
    [tabsActions],
  );

  const onRenameTab = useCallback(
    (oldFilename: string, newFilename: string) => {
      tabsActions.renameTab(oldFilename, newFilename);
    },
    [tabsActions],
  );

  const onReset = useCallback(() => {
    tabsActions.reset(CODE_FILES);
    saveFilesToLocalStorage(id, CODE_FILES);
    pack(CODE_FILES);
  }, [id, pack, tabsActions]);

  return (
    <div className="flex flex-col">
      <MonacoTabsHeader
        activeIndex={monacoTabs.activeIndex}
        filenames={monacoTabs.tabNames}
        modifiedFiles={monacoTabs.modifiedTabs}
        onRenameTab={onRenameTab}
        onClickTab={onClickTab}
        onAddTab={onAddTab}
        onDeleteTab={onDeleteTab}
        onReset={onReset}
      />
      {activeModel && <Editor resolveImports monaco={monaco} model={activeModel} />}
    </div>
  );
});
