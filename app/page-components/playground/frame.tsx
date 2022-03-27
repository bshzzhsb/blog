interface FrameProps {
  srcDoc: string;
}

const Frame: React.FC<FrameProps> = ({ srcDoc }) => (
  <iframe width="100%" height="100%" srcDoc={srcDoc} className="border-none" />
);

export default Frame;
