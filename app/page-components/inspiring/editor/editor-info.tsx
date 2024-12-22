import { memo } from 'react';

import { TEXT } from '~/constants';
import { classnames } from '~/utils/classname';

export interface EditorInfoProps {
  characters: number;
  words: number;
  isEditorReady: boolean;
}

const EditorInfo: React.FC<EditorInfoProps> = memo(props => {
  const { characters, words, isEditorReady } = props;

  return (
    <div className="flex gap-4">
      <div className="flex flex-col text-right">
        <span>
          {words} {words <= 1 ? 'word' : 'words'}
        </span>
        <span>
          {characters} {characters <= 1 ? 'character' : 'characters'}
        </span>
      </div>
      <div className="w-[1px] bg-gray-300" />
      <div className="flex items-center gap-2">
        <div
          className={classnames(
            'w-2 h-2 rounded-full',
            isEditorReady ? 'bg-green-500 dark:bg-green-400' : 'bg-yellow-500 dark:bg-yellow-400',
          )}
        />
        <span>{isEditorReady ? TEXT.CONNECTED : TEXT.CONNECTING}</span>
      </div>
    </div>
  );
});

export default EditorInfo;
