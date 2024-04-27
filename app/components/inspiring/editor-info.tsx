import { memo } from 'react';

import { classnames } from '~/utils/classname';
import { EditorState } from '~/types/inspiring';

export interface EditorInfoProps {
  characters: number;
  words: number;
  editorState: EditorState;
}

const EditorStateMap: Record<EditorState, string> = {
  [EditorState.CONNECTING]: 'Connecting',
  [EditorState.CONNECTED]: 'Connected',
  [EditorState.DISCONNECTED]: 'Disconnected',
  [EditorState.SYNCED]: 'Connected',
};

const EditorInfo: React.FC<EditorInfoProps> = memo(props => {
  const { characters, words, editorState } = props;

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
          className={classnames('w-2 h-2 rounded-full', {
            'bg-yellow-500 dark:bg-yellow-400': editorState === EditorState.CONNECTING,
            'bg-green-500 dark:bg-green-400':
              editorState === EditorState.CONNECTED || editorState === EditorState.SYNCED,
            'bg-red-500 dark:bg-red-400': editorState === EditorState.DISCONNECTED,
          })}
        />
        <span>{EditorStateMap[editorState]}</span>
      </div>
    </div>
  );
});

export default EditorInfo;
