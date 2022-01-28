interface AnchorProps {
  href: string;
  children: string;
}

const Anchor: React.FC<AnchorProps> = ({ href, children }) => (
  <a href={href} target="_blank" className='hover:shadow-[0_2px_0] transition-shadow'>
    {children}
  </a>
);

export default Anchor;
