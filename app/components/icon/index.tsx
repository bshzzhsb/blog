import { IconNames } from './type';

export type { IconNames };

export interface IconProps {
  name: IconNames;
  className?: string;
}

export const Icon: React.FC<IconProps> = props => {
  const { name, className } = props;

  return (
    <svg className={className}>
      <use href={`#${name}`} />
    </svg>
  );
};
