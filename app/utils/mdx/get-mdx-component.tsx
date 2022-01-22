import React from 'react';
import _jsx_runtime from 'react/jsx-runtime';
import ReactDOM from 'react-dom';

interface MDXComponentWrapperProps {
  components?: Record<string, React.FC<any>>;
}

function getMDXComponent(code: string) {
  const scope = { React, _jsx_runtime, ReactDOM };
  const fn = new Function(...Object.keys(scope), code);
  const Component = fn(...Object.values(scope)).default;

  const getMDXComponentWrapper: React.FC<MDXComponentWrapperProps> = ({ components }) => {
    return <Component components={components} />;
  };
  return getMDXComponentWrapper;
}

export default getMDXComponent;
