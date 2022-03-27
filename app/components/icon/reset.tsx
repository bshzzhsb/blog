import type { IconProps } from '.';

const Reset: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      version="1.1"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fill: 'none' }}
    >
      <path d="M 6.68 34 A 20 20 0 1 0 6.68 14 V 4 M 6.68 14 H 16.68" />
    </svg>
  );
};

export default Reset;
