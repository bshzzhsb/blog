interface FooterProps {
  text: string;
}

const Footer: React.FC<FooterProps> = ({ text }) => (
  <>
    {text && (
      <div className="flex flex-col items-center px-8 py-8 text-xs text-secondary text-center">
        <p className="mb-2">{text}</p>
        <p>&copy; 2022 build with remix</p>
      </div>
    )}
  </>
);

export default Footer;
