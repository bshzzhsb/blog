interface TextButtonProps {
  text: string;
  onClick: React.MouseEventHandler;
}

const TextButton: React.FC<TextButtonProps> = ({ text, onClick }) => {
  return (
    <button className="plain-btn" onClick={onClick}>
      {text}
    </button>
  );
};

export default TextButton;
