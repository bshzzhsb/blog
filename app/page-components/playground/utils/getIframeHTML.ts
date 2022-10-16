export function getIframeHTML(id: string) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="module">
      window.addEventListener('message', ({ data }) => {
        const { event, message } = data;
        if (event !== 'CODE_UPDATE') return;
        
        window.disposer?.();
        window.disposer = undefined;
      
        document.getElementById('app-script')?.remove();
        const script = document.createElement('script');
        script.src = message;
        script.id = 'app-script';
        script.type = 'module';
        document.body.appendChild(script);
      });
    </script>
    <script>
      var _privateLog = console.log;
      console.log = function(...rest) {
        _privateLog.apply(console, rest.map(log => log.toString()));
        if(typeof window !== 'undefined') {
          window.parent.postMessage({
            source: "frame-${id}",
            message: {
              type: "log",
              data: rest.map(log => log.toString()),
            },
          }, "*");
        }
      }
      window.onerror = function(message, source, lineno, colno, error) {
        if(typeof window !== 'undefined') {
          window.parent.postMessage({
            source: \`frame-${id}\`,
            message: {
              type: "error",
              data: error ? { name: error.name, message: error.message } : { message }
            },
          }, "*");
        }
      }
    </script>
  </head>
  <body>
    <div id="app"></div>
    <script id="app-script" type="module"></script>
  </body>
</html>
`;
}
