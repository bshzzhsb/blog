import type * as MonacoEditor from 'monaco-editor';
import debounce from '~/utils/debounce';

import { getLogger, LogModule } from '~/utils/logger';

import { getTypeDeclarationPath } from './file';

type ImportResource = {
  type: 'relative' | 'external';
  packageName: string;
  path: string;
};

const REGEXP_IMPORT = /import[^'"]*(?:from)?\s(?:'|")([^'"]+)('|")/g;
const SUFFIXES = ['.d.ts', '/index.d.ts'];
const LOCAL_STORAGE_PREFIX = '__IMPORT__';
const PACKAGE_MAP: Record<string, string> = {
  react: 'react/ts5.0',
};

const logger = getLogger(LogModule.REPL, 'IMPORT_RESOLVER');

export class ImportResolver {
  private disposers: MonacoEditor.IDisposable[] = [];
  private pendingImports: string[] = [];
  private cache = new LocalCache();

  constructor(
    private readonly editor: MonacoEditor.editor.IStandaloneCodeEditor,
    private monaco: typeof MonacoEditor,
    externals?: string[],
  ) {
    this.handleModelContentChange();
    if (externals) {
      this.resolveImports(externals);
    }

    this.disposers.push(
      editor.onDidChangeModel(() => {
        this.handleModelContentChange();
      }),
      editor.onDidChangeModelContent(() => {
        this.debouncedHandleModelContentChange();
      }),
    );
  }

  dispose() {
    this.disposers.forEach(disposer => disposer.dispose());
  }

  private handleModelContentChange() {
    const content = this.editor.getValue();
    const imports = this.parseImports(content);

    this.resolveImports(imports);
  }

  private debouncedHandleModelContentChange = debounce(() => {
    this.handleModelContentChange();
  }, 2000);

  private parseImports(content: string) {
    return [...content.matchAll(REGEXP_IMPORT)].map(res => res[1]).filter(Boolean);
  }

  private resolvePath(importee: string): ImportResource {
    if (importee.startsWith('.')) {
      return {
        type: 'relative',
        packageName: '',
        path: importee,
      };
    } else if (importee.startsWith('@')) {
      const segments = importee.split('/');
      return {
        type: 'external',
        packageName: segments.slice(0, 2).join('/'),
        path: segments.slice(2).join('/'),
      };
    } else {
      const segments = importee.split('/');
      return {
        type: 'external',
        packageName: segments[0],
        path: segments.slice(1).join('/'),
      };
    }
  }

  private async resolveImports(imports: string[]) {
    await Promise.all(imports.map(importee => this.resolveImport(importee)));
  }

  private async resolveImport(importee: string) {
    const { packageName, path, type } = this.resolvePath(importee);
    // Relative path, don't need to import type declarations
    if (type === 'relative') return;

    const resourcePath = `${packageName}/${path}`.replace(/\/+$/, '');
    if (this.pendingImports.includes(resourcePath)) return;

    this.pendingImports.push(resourcePath);
    try {
      const { content, filePath } = await this.loadFileContent(packageName, path);
      const typeDeclarationPath = getTypeDeclarationPath(filePath);

      // Set type declarations to monaco
      this.monaco.languages.typescript.typescriptDefaults.addExtraLib(content, typeDeclarationPath);
      this.monaco.languages.typescript.javascriptDefaults.addExtraLib(content, typeDeclarationPath);
    } catch (e) {
      logger.error(e);
    }
  }

  private async loadFileContent(packageName: string, subPath: string) {
    const typeDeclarationPathPrefix = [`@types/${PACKAGE_MAP[packageName] ?? packageName}`, subPath]
      .filter(Boolean)
      .join('/');
    // Although monaco's typescript version is 5.0.2, we should load react types from @types/react/ts5.0.
    // But we can't set monaco's type path to that, it should be `@types/react/index.d.ts` eg.
    const virtualTypeDeclarationPathPrefix = [`@types/${packageName}`, subPath].filter(Boolean).join('/');

    // Load from cache
    for (const suffix of SUFFIXES) {
      const filePath = `${typeDeclarationPathPrefix}${suffix}`;
      const content = this.cache.getFromCache(filePath);
      if (content) {
        logger.info(`load ${filePath} from cache success`);
        return { content, filePath: `${virtualTypeDeclarationPathPrefix}${suffix}` };
      }
    }

    // Load from unpkg
    for (const suffix of SUFFIXES) {
      const filePath = `${typeDeclarationPathPrefix}${suffix}`;
      const url = `https://unpkg.com/${filePath}`;
      try {
        const content = await this.loadFileFromUnpkg(url);
        if (content) {
          logger.info(`load ${typeDeclarationPathPrefix} from unpkg success`);
          this.cache.setToCache(filePath, content);
          return { content, filePath: `${virtualTypeDeclarationPathPrefix}${suffix}` };
        }
      } catch (e) {
        logger.error(`load type declarations from ${url} error`, e);
      }
    }

    throw new Error(`failed to load type declarations of ${packageName}/${subPath}`);
  }

  private async loadFileFromUnpkg(url: string) {
    const res = await fetch(url, { method: 'GET' });

    if (res.ok) {
      return await res.text();
    } else if (res.status === 404) {
      return '';
    } else {
      throw Error(`fetch ${url} error, status: ${res.status}`);
    }
  }
}

class LocalCache {
  private caches = new Map<string, string>();

  getFromCache(path: string) {
    let content: string | undefined | null = this.caches.get(path);
    if (content) return content;

    content = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${path}`);
    if (content) {
      this.caches.set(path, content);
      return content;
    }

    return undefined;
  }

  setToCache(path: string, content: string) {
    this.caches.set(path, content);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${path}`, content);
  }
}
