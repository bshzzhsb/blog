import grayMatter from 'gray-matter';
import type Esbuild from 'esbuild';

import resolveExternalPlugin, { EXTERNAL_CONFIG } from './resolve-external-plugin';
import rehypePrismPlugin from './rehype-prism-plugin';

export interface FrontMatter {
  title: string;
  date: Date;
  lastModified?: Date;
  excerpt: string;
}

let esbuild: typeof Esbuild | null = null;

async function getEsbuild() {
  if (esbuild === null) {
    const _ = await import('esbuild');
    esbuild = _;
  }
  return esbuild;
}

export async function getMDXBundleFromEsbuild(file: string) {
  const { default: mdx } = await import('@mdx-js/esbuild');
  const { default: remarkFrontmatter } = await import('remark-frontmatter');

  const { data: frontMatter } = grayMatter.read(file);

  const buildOptions: Esbuild.BuildOptions = {
    entryPoints: [file],
    bundle: true,
    minify: process.env.NODE_ENV === 'production',
    format: 'iife',
    globalName: 'Component',
    write: false,
    plugins: [
      resolveExternalPlugin(EXTERNAL_CONFIG),
      mdx({ remarkPlugins: [remarkFrontmatter], rehypePlugins: [rehypePrismPlugin] }),
    ],
  };

  const esbuild = await getEsbuild();
  const bundle = await esbuild.build(buildOptions);
  if (bundle.outputFiles) {
    return {
      frontMatter: frontMatter as FrontMatter,
      code: `${bundle.outputFiles[0].text};return Component;`,
    };
  } else {
    throw new Error('build blog error');
  }
}
