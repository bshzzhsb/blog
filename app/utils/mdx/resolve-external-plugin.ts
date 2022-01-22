import type { Plugin } from 'esbuild';

type ExternalConfig = { [key: string]: { defaultExport: string; namedExports?: string[] } };

export const EXTERNAL_CONFIG: ExternalConfig = {
  react: {
    defaultExport: 'React',
  },
  'react-dom': {
    defaultExport: 'ReactDOM',
  },
  'react/jsx-runtime': {
    defaultExport: '_jsx_runtime',
    namedExports: ['Fragment', 'jsx', 'jsxs'],
  },
};

function createESMContents(defaultExport: string, namedExports?: string[]) {
  const exports = [`export default ${defaultExport};`];
  if (namedExports && namedExports.length) {
    const exportNames = namedExports.join(',');
    exports.push(`const { ${exportNames} } = ${defaultExport};`);
    exports.push(`export { ${exportNames} };`);
  }
  return exports.join('\n');
}

export default function resolveExternalPlugin(config: ExternalConfig): Plugin {
  return {
    name: 'resolve-external',
    setup(build) {
      build.onResolve({ filter: new RegExp(`^(?:${Object.keys(EXTERNAL_CONFIG).join('|')})$`) }, ({ path }) => {
        return {
          path,
          namespace: 'resolve-external',
        };
      });
      build.onLoad({ filter: /.*/, namespace: 'resolve-external' }, ({ path }) => {
        const { defaultExport, namedExports } = config[path];
        return {
          contents: createESMContents(defaultExport, namedExports),
        };
      });
    },
  };
}
