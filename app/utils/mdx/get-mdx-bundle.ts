import grayMatter from 'gray-matter';
import fs from 'fs/promises';
import type Esbuild from 'esbuild';

import resolveExternalPlugin, { EXTERNAL_CONFIG } from './resolve-external-plugin';

export interface FrontMatter {
  title: string;
  date: Date;
  lastModified?: Date;
  excerpt: string;
}

export const BLOG_DIR = `${__dirname}/../../app/blog`;

let esbuild: typeof Esbuild | null = null;

async function getEsbuild() {
  if (esbuild === null) {
    const _ = await import('esbuild');
    esbuild = _;
  }
  return esbuild;
}

export async function getMDXBundle(file: string) {
  if (process.env.NODE_ENV === 'development') {
    return await getMDXBundleFromEsbuild(file);
  } else {
    return await getMDXBundleFromCache(file);
  }
}

export async function getMDXBundleFromEsbuild(file: string) {
  const { default: mdx } = await import('@mdx-js/esbuild');
  // eslint-disable-next-line
  // @ts-ignore
  // TODO: typescript has a bug with unist@4.1.0
  const { default: rehypePrism } = await import('@mapbox/rehype-prism');
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
      mdx({ remarkPlugins: [remarkFrontmatter], rehypePlugins: [rehypePrism] }),
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

async function getMDXBundleFromCache(file: string) {
  try {
    const res = await fs.readFile(file.replace('.mdx', '.json'), 'utf-8');
    return JSON.parse(res) as { frontMatter: FrontMatter; code: string };
  } catch (e) {
    throw new Error('get blog from cache error');
  }
}
