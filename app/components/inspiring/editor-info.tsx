import { memo } from 'react';
import { WebSocketStatus } from '@hocuspocus/provider';
import { classnames } from '~/utils/classname';

export interface EditorInfoProps {
  characters: number;
  words: number;
  collabState: WebSocketStatus;
}

const CollabStateMap: Record<WebSocketStatus, string> = {
  [WebSocketStatus.Connected]: 'Connected',
  [WebSocketStatus.Connecting]: 'Connecting',
  [WebSocketStatus.Disconnected]: 'Disconnected',
};

const EditorInfo: React.FC<EditorInfoProps> = memo(props => {
  const { characters, words, collabState } = props;

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
            'bg-yellow-500 dark:bg-yellow-400': collabState === WebSocketStatus.Connecting,
            'bg-green-500 dark:bg-green-400': collabState === WebSocketStatus.Connected,
            'bg-red-500 dark:bg-red-400': collabState === WebSocketStatus.Disconnected,
          })}
        />
        <span>{CollabStateMap[collabState]}</span>
      </div>
    </div>
  );
});

export default EditorInfo;
