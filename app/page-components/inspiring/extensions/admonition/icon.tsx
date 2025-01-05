import React from 'react';

import { Icon } from '~/components/icon';

import type { AdmonitionType } from './types';

const Info: React.FC = () => {
  return <Icon name="circle-info" className="w-5 h-5 text-blue-500" />;
};

const Check: React.FC = () => {
  return <Icon name="circle-check" className="w-5 h-5 text-green-500" />;
};

const Question: React.FC = () => {
  return <Icon name="circle-question" className="w-5 h-5 text-orange-500" />;
};

const Warning: React.FC = () => {
  return <Icon name="circle-exclamation" className="w-5 h-5 text-yellow-500" />;
};

const Bolt: React.FC = () => {
  return <Icon name="circle-bolt" className="w-5 h-5 text-red-500" />;
};

export const IconMap: Record<AdmonitionType, React.ReactNode> = {
  info: <Info />,
  check: <Check />,
  question: <Question />,
  warning: <Warning />,
  bolt: <Bolt />,
};
