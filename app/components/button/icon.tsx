import { classnames } from '~/utils/classname';

interface IconButtonProps {
  className?: string;
  onClick?: React.MouseEventHandler;
  children: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, className, children }) => (
  <button className={classnames('plain-btn', className)} onClick={onClick}>
    {children}
  </button>
);

export default IconButton;
