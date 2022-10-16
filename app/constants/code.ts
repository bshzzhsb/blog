export type CodeFile = { filename: string; source: string };

export const LOCAL_STORAGE_KEY = '__FILES__';

export const CODE_FILES: CodeFile[] = [
  {
    filename: 'index.tsx',
    source: `import ReactDOM from 'react-dom/client';
import React, { useEffect, useState } from 'react';

import './index.css';

const App = React.memo(() => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(\`count: $\{count}\`);
  }, [count]);
  
  const handleClick = () => {
    setCount(pre => pre + 1);
  };
  
  return (
    <div className="app">
      <button onClick={handleClick}>{count}</button>
    </div>
  );
});

// DO NOT DELETE CODE BELOW!!!
const __root__ = ReactDOM.createRoot(document.getElementById('app')!);
__root__.render(<App />);
`,
  },
  {
    filename: 'index.css',
    source: `.app, button {
  font-size: 2rem;
  font-weight: 600;
}
`,
  },
];
