import React from 'react';

import { IconButton } from '~/components/button';
import { Add, Reset } from '~/components/icon';

import { Filename } from './filename';

interface MonacoTabsHeaderProps {
  filenames: string[];
  modifiedFiles: string[];
  activeIndex: number;
  onClickTab: (filename: string) => void;
  onAddTab: () => void;
  onDeleteTab: (filename: string) => void;
  onRenameTab: (oldFilename: string, newFilename: string) => void;
  onReset: () => void;
}

export const MonacoTabsHeader: React.FC<MonacoTabsHeaderProps> = React.memo(props => {
  const { filenames, modifiedFiles, activeIndex, onRenameTab: onChangeFilename } = props;
  const { onClickTab, onAddTab, onDeleteTab, onReset } = props;

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <ul className="flex gap-1">
          {filenames.map((filename, i) => (
            <Filename
              key={filename}
              name={filename}
              editable={i >= 1}
              active={activeIndex === i}
              modified={modifiedFiles.includes(filename)}
              onChangeFilename={onChangeFilename}
              onClick={onClickTab}
              onClickDelete={onDeleteTab}
            />
          ))}
        </ul>
        <IconButton className="ml-2" onClick={onAddTab}>
          <Add />
        </IconButton>
      </div>
      <IconButton className="mx-2" onClick={onReset}>
        <Reset />
      </IconButton>
    </div>
  );
});
