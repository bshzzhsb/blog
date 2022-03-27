import { Codes } from '~/constants';

export function constructCode(codes: Codes, id: string) {
  const html = codes.find((code) => code.lang === 'html')?.code;
  const css = codes.find((code) => code.lang === 'css')?.code;
  const js = codes.find((code) => code.lang === 'js')?.code;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CodeSnippet</title>
  <style>
    ${css}
    body {
      margin: 0;
      padding: 8px;
      background-color: #fbfbfb;
      box-sizing: border-box;
    }
    *::-webkit-scrollbar {
      width: 0;
      background-color: #282c34;
    }
    *::-webkit-scrollbar-track {
      border-radius: 4px;
      background-color: transparent;
    }
    *::-webkit-scrollbar-thumb {
      border: 2px solid #282c34;
      border-radius: 6px;
      background-color: var(--color-n6);
    }
  </style>
</head>
<body>
  ${html}
  <span></span>
  <script>
    var _privateLog = console.log;
    console.log = function(...rest) {
      if(typeof window !== 'undefined') {
        window.parent.postMessage({
          source: "frame-${id}",
          message: {
            type: "log",
            data: rest
          },
        }, "*");
      }
      _privateLog.apply(console, arguments);
    }
    window.onerror = function(message, source, lineno, colno, error) {
      if(typeof window !== 'undefined') {
        window.parent.postMessage({
          source: "frame-${id}",
          message: {
            type: "error",
            data: { name: error.name, message: error.message }
          },
        }, "*");
      }
    }
  </script>
  <script>
    ${js}
  </script>
</body>
</html>
`;
}
