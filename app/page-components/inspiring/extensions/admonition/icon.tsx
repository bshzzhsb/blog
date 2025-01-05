import React from 'react';

import { Icon, IconNames } from '~/components/icon';
import { classnames } from '~/utils/classname';

import type { AdmonitionType } from './types';

interface RoundedIconProps {
  className: string;
  icon: IconNames;
  iconClassName: string;
}

const RoundedIcon: React.FC<RoundedIconProps> = props => {
  const { className, icon, iconClassName } = props;

  return (
    <span className={classnames('flex justify-center items-center p-0.5 rounded-full', className)}>
      <Icon name={icon} className={classnames('p-px', iconClassName)} />
    </span>
  );
};

const Info: React.FC = () => {
  return <RoundedIcon icon="info" className="bg-blue-500" iconClassName="text-white" />;
};

const Question: React.FC = () => {
  return <RoundedIcon icon="question" className="bg-orange-500" iconClassName="text-white" />;
};

const Warning: React.FC = () => {
  return <RoundedIcon icon="exclamation" className="bg-yellow-500" iconClassName="text-white" />;
};

const Bolt: React.FC = () => {
  return <RoundedIcon icon="bolt" className="bg-red-500" iconClassName="text-white" />;
};

export const IconMap: Record<AdmonitionType, React.ReactNode> = {
  info: <Info />,
  question: <Question />,
  warning: <Warning />,
  bolt: <Bolt />,
};
