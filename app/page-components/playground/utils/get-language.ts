export function getLanguage(filename: string) {
  const suffix = filename.split('.').slice(-1)[0];

  switch (suffix) {
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    default:
      return 'typescript';
  }
}
