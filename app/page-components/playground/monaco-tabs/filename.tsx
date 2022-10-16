import React, { useEffect, useRef, useState } from 'react';

import { Delete } from '~/components/icon';
import { IconButton } from '~/components/button';
import { classnames } from '~/utils/classname';

interface FilenameProps {
  name: string;
  active: boolean;
  editable: boolean;
  modified: boolean;
  onChangeFilename: (oldFilename: string, newFilename: string) => void;
  onClick: (filename: string) => void;
  onClickDelete: (filename: string) => void;
}

export const Filename: React.FC<FilenameProps> = React.memo(props => {
  const { name, active, editable, modified, onChangeFilename, onClick, onClickDelete } = props;
  const [edit, setEdit] = useState(false);
  const [tempName, setTempName] = useState(name);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (edit) {
      ref.current?.focus();
    }
  }, [edit]);

  useEffect(() => {
    setTempName(name);
  }, [name]);

  const handleDoubleClick = () => {
    if (!editable) return;
    setEdit(true);
  };

  const handleChangeFilename = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value);
  };

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Space') {
      e.preventDefault();
    } else if (e.code === 'Enter') {
      ref.current?.blur();
      onChangeFilename(name, tempName);
      setTempName(name);
      setEdit(false);
    }
  };

  const handleBlur = () => {
    setEdit(false);
    onChangeFilename(name, tempName);
    setTempName(name);
  };

  return (
    <li
      className={classnames(
        'flex gap-1 h-12 pl-2 pr-2 items-center text-base cursor-pointer border-b-2 hover:bg-gray-100 dark:hover:bg-gray-800',
        {
          'text-blue-500 border-b-blue-500': active,
          'border-b-black/0 hover:border-b-gray-200 dark:hover:border-b-gray-700': !active,
        },
      )}
      onClick={() => onClick(name)}
    >
      <span className="relative px-2 py-1" onDoubleClick={handleDoubleClick}>
        {name}
        <input
          ref={ref}
          className={classnames(
            'absolute top-0 left-0 w-full h-full px-[7px] py-1 outline-none border rounded border-blue-600',
            { hidden: !edit },
          )}
          value={tempName}
          onChange={handleChangeFilename}
          onKeyDown={handleKeydown}
          onBlur={handleBlur}
        />
      </span>

      <div className="group relative w-5 h-5">
        {editable && (
          <IconButton
            className={classnames({
              'hidden group-hover:block': modified,
            })}
            onClick={e => {
              e.stopPropagation();
              onClickDelete(name);
            }}
          >
            <Delete className="w-3 h-3" />
          </IconButton>
        )}
        {modified && (
          <span
            className={classnames('absolute left-0 top-0 flex justify-center items-center w-full h-full', {
              'group-hover:hidden': editable,
            })}
          >
            <span className="block bg-dark-bg dark:bg-white w-2 h-2 rounded-full" />
          </span>
        )}
      </div>
    </li>
  );
});
