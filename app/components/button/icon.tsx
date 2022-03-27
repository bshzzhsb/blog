interface IconButtonProps {
  onClick: React.MouseEventHandler;
  children: React.ReactElement;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, children }) => (
  <button className="plain-btn" onClick={onClick}>
    {children}
  </button>
);

export default IconButton;
