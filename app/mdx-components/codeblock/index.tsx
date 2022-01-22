import React from 'react';

interface CodeblockProps {
  className: string;
}

const Codeblock: React.FC<CodeblockProps> = ({ className, children }) => {
  const language = className?.replace(/language-/, '');

  return (
    <pre
      data-lang={language}
      className={
        className +
        ' relative pt-10 pb-8 px-8 lg:-mx-8 text-sm' +
        ' before:absolute before:top-0 before:content-[attr(data-lang)] before:px-2 before:py-1 before:rounded-b'
      }
    >
      {children}
    </pre>
  );
};

export default Codeblock;
