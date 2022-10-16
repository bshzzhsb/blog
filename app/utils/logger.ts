export enum LogModule {
  REPL = 'REPL',
}

export type LogSubmodule = {
  [LogModule.REPL]: 'COMPILER' | 'IFRAME' | 'PRETTIER' | 'IMPORT_RESOLVER';
};

function getStyle(color: string, backgroundColor: string) {
  return `padding-left: 4px; padding-right: 4px; color: ${color}; background-color: ${backgroundColor}`;
}

function getLogStyle<T extends LogModule>(logModule: T, submodule?: LogSubmodule[T]): string[] {
  switch (logModule) {
    case LogModule.REPL: {
      const style = [`%c${logModule}`, getStyle('white', '#2563eb')];

      if (submodule === 'COMPILER') {
        style[0] += `%c${submodule}`;
        style.push(getStyle('white', '#65a30d'));
      } else if (submodule === 'IFRAME') {
        style[0] += `%c${submodule}`;
        style.push(getStyle('white', '#0891b2'));
      } else if (submodule === 'PRETTIER') {
        style[0] += `%c${submodule}`;
        style.push(getStyle('white', '#0d9488'));
      } else if (submodule === 'IMPORT_RESOLVER') {
        style[0] += `%c${submodule}`;
        style.push(getStyle('white', '#059669'));
      }

      return style;
    }
    default: {
      return [`%c${LogModule}`, getStyle('white', '#0ea5e9')];
    }
  }
}

export function getLogger<T extends LogModule>(logModule: T, submodule?: LogSubmodule[T]) {
  const prefix = getLogStyle(logModule, submodule);

  const info = (...args: unknown[]) => {
    console.log(...prefix, ...args);
  };

  const error = (...args: unknown[]) => {
    console.error(...prefix, ...args);
  };

  return {
    info,
    error,
  };
}
