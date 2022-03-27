import type { IconProps } from '.';

type SplitProps = {
  split: boolean;
} & IconProps;

const Split: React.FC<SplitProps> = ({ split, className }) => (
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
    <path d={split ? 'M 2 16 V 4 H 46 V 16 H 2' : 'M 4 16 V 4 H 44 V 16 H 4'} fill="currentColor" />
    <path d={split ? 'M 24 16 H 2 V 44 H 24 V 16 H 46 V 44 H 24' : 'M 4 16 H 44 V 44 H 4 V 16'} />
  </svg>
);

export default Split;
