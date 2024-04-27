import { classnames } from '~/utils/classname';
import { IconProps } from '.';

const Loading: React.FC<IconProps> = props => {
  const { className } = props;

  return (
    <svg
      className={classnames('animate-spin ease-in-out', className)}
      viewBox="0 0 48 48"
      stroke="currentColor"
      strokeWidth="6"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fill: 'none' }}
    >
      <path d="M 10.144 32 A 16 16 0 0 1 24 8" />
    </svg>
  );
};

export default Loading;
