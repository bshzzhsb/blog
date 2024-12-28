export enum LogModule {
  AUTH = 'AUTH',
}

function getStyle(color: string, backgroundColor: string) {
  return `padding-left: 4px; padding-right: 4px; color: ${color}; background-color: ${backgroundColor}`;
}

function getLogStyle<T extends LogModule>(logModule: T): string[] {
  switch (logModule) {
    case LogModule.AUTH: {
      const style = [`%c${logModule}`, getStyle('white', '#2563eb')];
      return style;
    }
    default: {
      return [`%c${LogModule}`, getStyle('white', '#0ea5e9')];
    }
  }
}

export function getLogger<T extends LogModule>(logModule: T) {
  const prefix = getLogStyle(logModule);

  const info = (...args: unknown[]) => {
    console.log(...prefix, ...args);
  };

  const error = (...args: unknown[]) => {
    console.error(...prefix, ...args);
  };

  return { info, error };
}
