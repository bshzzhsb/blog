import React from 'react';

interface CodeProps {
  children: React.ReactNode;
  className: string;
}

const Code: React.FC<CodeProps> = ({ className, children }) => {
  const childrenArray = React.Children.toArray(children);
  // filter empty line at head and tail
  const filteredChildren = childrenArray.filter((child, i) =>
    i === 0 || i === childrenArray.length - 1 ? !!child.toString().trim() : true,
  );

  return <code className={className}>{filteredChildren}</code>;
};

export default Code;
