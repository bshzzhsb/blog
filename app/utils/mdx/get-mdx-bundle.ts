import grayMatter from 'gray-matter';
import esbuild from 'esbuild';
import type { BuildOptions } from 'esbuild';

import resolveExternalPlugin, { EXTERNAL_CONFIG } from './resolve-external-plugin';

export async function getMDXBundle(file: string) {
  const { default: xdmEsbuild } = await import('xdm/esbuild.js');
  // @ts-ignore
  // TODO: typescript has a bug with unist@4.1.0
  const { default: rehypePrism } = await import('@mapbox/rehype-prism');
  const { default: remarkFrontmatter } = await import('remark-frontmatter');

  const { data: frontMatter } = grayMatter.read(file);

  const buildOptions: BuildOptions = {
    entryPoints: [file],
    bundle: true,
    minify: process.env.NODE_ENV === 'production',
    format: 'iife',
    globalName: 'Component',
    write: false,
    plugins: [
      resolveExternalPlugin(EXTERNAL_CONFIG),
      xdmEsbuild({ remarkPlugins: [remarkFrontmatter], rehypePlugins: [rehypePrism] }),
    ],
  };

  const bundle = await esbuild.build(buildOptions);
  if (bundle.outputFiles) {
    return {
      frontMatter: frontMatter,
      code: `${bundle.outputFiles[0].text};return Component;`,
    };
  } else {
    throw new Error('build error');
  }
}
