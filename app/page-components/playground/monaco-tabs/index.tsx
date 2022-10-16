import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [filenames, setFilenames] = useState<string[]>([]);
  const [modifiedFiles, setModifiedFiles] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const monacoTabs = useMonacoTabs({ monaco });
  const activeFilename = useMemo(() => filenames[activeIndex], [activeIndex, filenames]);
  const activeModel = monacoTabs.getModel(activeFilename);

  useEffect(() => {
    if (!activeModel) return;
    onActiveFileChange({ filename: activeFilename, source: activeModel.getValue() });
  }, [activeFilename, activeModel, onActiveFileChange]);

  useEffect(() => {
    const files = getFilesFromLocalStorage(id);

    setFilenames(files.map(file => file.filename));
    monacoTabs.reset(files);
    pack(files);

    return () => {
      monacoTabs.reset([]);
    };
  }, [id, monacoTabs, pack]);

  useEffect(() => {
    return monacoTabs.eventEmitter.subscribe(Event.MODEL_CONTENT_CHANGE, filename => {
      onActiveFileChange({ filename, source: monacoTabs.getModel(filename)?.getValue() ?? '' });
      setModifiedFiles(pre => {
        return pre.includes(filename) ? pre : [...pre, filename];
      });
    });
  }, [monacoTabs, onActiveFileChange]);

  useEffect(() => {
    const handleKeyboardSave = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
        e.preventDefault();
        setModifiedFiles([]);
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
      const activeIndex = filenames.findIndex(it => it === filename);
      setActiveIndex(Math.max(activeIndex, 0));
    },
    [filenames],
  );

  const onAddTab = useCallback(() => {
    let fileIndex = monacoTabs.value.size + 1;
    while (monacoTabs.value.has(`index${fileIndex}.tsx`)) {
      fileIndex += 1;
    }
    const filename = `index${fileIndex}.tsx`;

    monacoTabs.createTab({ filename, source: '' });
    // Set new file active and modified
    setFilenames(pre => {
      const index = pre.findIndex(it => it === filename);
      if (index >= 0) return pre;

      setActiveIndex(pre.length);
      return [...pre, filename];
    });
    setModifiedFiles(pre => {
      return pre.includes(filename) ? pre : [...pre, filename];
    });
  }, [monacoTabs]);

  const onDeleteTab = useCallback(
    (filename: string) => {
      monacoTabs.deleteTab(filename);
      setFilenames(pre => {
        const index = pre.findIndex(it => it === filename);
        if (index < 0) return pre;

        pre.splice(index, 1);
        setActiveIndex(preActiveIndex => {
          return pre.length - 1 < preActiveIndex ? preActiveIndex - 1 : preActiveIndex;
        });
        return [...pre];
      });
      setModifiedFiles(pre => {
        const index = pre.findIndex(it => it === filename);
        if (index < 0) return pre;

        pre.splice(index, 1);
        return [...pre];
      });
    },
    [monacoTabs],
  );

  const onRenameTab = useCallback(
    (oldFilename: string, newFilename: string) => {
      const tab = monacoTabs.renameTab(oldFilename, newFilename);
      // New filename already exist, rename failed.
      if (!tab) return;

      setFilenames(pre => {
        const index = pre.findIndex(it => it === oldFilename);
        if (index < 0) return pre;

        pre[index] = newFilename;
        return [...pre];
      });
      setModifiedFiles(pre => {
        const index = pre.findIndex(it => it === oldFilename);
        if (index < 0) return pre;

        pre[index] = newFilename;
        return [...pre];
      });
    },
    [monacoTabs],
  );

  const onReset = useCallback(() => {
    monacoTabs.reset(CODE_FILES);

    setFilenames(CODE_FILES.map(file => file.filename));
    setActiveIndex(0);
    setModifiedFiles([]);
    saveFilesToLocalStorage(id, CODE_FILES);
    pack(CODE_FILES);
  }, [id, monacoTabs, pack]);

  return (
    <div className="flex flex-col">
      <MonacoTabsHeader
        activeIndex={activeIndex}
        filenames={filenames}
        modifiedFiles={modifiedFiles}
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
