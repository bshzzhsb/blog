import type { IconProps } from '.';

const Arrow: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    version="1.1"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    style={{ fill: 'none' }}
  >
    <line x1="4" y1="12" x2="20" y2="12" />
    <polyline points="12 4 20 12 12 20" />
  </svg>
);

export default Arrow;
