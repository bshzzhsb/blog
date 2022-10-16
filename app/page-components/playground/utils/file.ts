import type { CodeFile } from '~/constants';
import { CODE_FILES, LOCAL_STORAGE_KEY } from '~/constants';

export function getFilePath(path: string) {
  return `file:///repl/${path}`;
}

export function getTypeDeclarationsPath(path: string) {
  return `file:///node_modules/@types/${path}/index.d.ts`;
}

export function getFilesFromLocalStorage(id: string): CodeFile[] {
  const files = localStorage.getItem(`${LOCAL_STORAGE_KEY}-${id}`);
  if (files) {
    return JSON.parse(files) as CodeFile[];
  }
  return CODE_FILES;
}

export function saveFilesToLocalStorage(id: string, files: CodeFile[]) {
  localStorage.setItem(`${LOCAL_STORAGE_KEY}-${id}`, JSON.stringify(files));
}
