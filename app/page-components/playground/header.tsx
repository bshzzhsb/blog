import React from 'react';

import { TEXT } from '~/constants';
import { Arrow, Split } from '~/components/icon';
import { IconButton } from '~/components/button';
import { ModeSwitcher } from '~/components/mode-switcher';

interface PlaygroundHeaderProps {
  showResult: boolean;
  onChangeShowResult: () => void;
}

export const PlaygroundHeader: React.FC<PlaygroundHeaderProps> = ({ showResult, onChangeShowResult }) => {
  return (
    <header className="grid grid-cols-3 h-12 items-center border-b border-secondary">
      <div className="ml-2">
        <IconButton onClick={() => history.back()}>
          <Arrow className="w-5 h-5 rotate-180" />
        </IconButton>
      </div>
      <div className="text-center text-xl font-semibold tracking-wide">{TEXT.playground}</div>
      <div className="flex justify-end items-center gap-4 mr-4">
        <ModeSwitcher />
        <IconButton onClick={onChangeShowResult}>
          <Split className="w-5 h-5" split={!showResult} />
        </IconButton>
      </div>
    </header>
  );
};
