import fs from 'fs/promises';
import url from 'url';

import grayMatter from 'gray-matter';
import { kv } from '@vercel/kv';

import { getMDXBundleFromEsbuild } from '~/utils/mdx/get-mdx-bundle';
import type { FrontMatter } from '~/utils/mdx/get-mdx-bundle';
import { objToCamelCase } from '~/utils/to-camel-case';
import { BLOG_KEY } from '~/constants';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
export const BLOG_DIR = `${__dirname}../../app/blog`;

export type BlogListProps = {
  slug: string;
  frontMatter: FrontMatter;
}[];

export type BlogProps = {
  frontMatter: FrontMatter;
  code: string;
};

export async function getBlogList(): Promise<BlogListProps> {
  if (process.env.NODE_ENV === 'development') {
    return getBlogListFromLocal();
  } else {
    return getBlogListFromVercelKV();
  }
}

async function getBlogListFromVercelKV(): Promise<BlogListProps> {
  const blogRecords = await kv.hgetall<Record<string, BlogProps>>(BLOG_KEY);
  if (!blogRecords) return [];

  return Object.entries(blogRecords)
    .map(([fileDir, blog]) => {
      return { slug: fileDir, frontMatter: blog.frontMatter };
    })
    .sort((a, b) => new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime());
}

async function getBlogListFromLocal(): Promise<BlogListProps> {
  const dir = await fs.readdir(BLOG_DIR);
  const blogList = await Promise.all(
    dir.map(async fileDir => {
      const filePath = `${BLOG_DIR}/${fileDir}/index.mdx`;
      const file = await fs.readFile(filePath);
      const { data } = await grayMatter(file.toString());
      return { slug: fileDir, frontMatter: objToCamelCase(data) as unknown as FrontMatter };
    }),
  );
  blogList.sort((a, b) => b.frontMatter.date.getTime() - a.frontMatter.date.getTime());

  return blogList;
}

export async function getBlog(slug: string): Promise<BlogProps | null> {
  if (process.env.NODE_ENV === 'development') {
    const blogPath = `${BLOG_DIR}/${slug}/index.mdx`;
    return getMDXBundleFromEsbuild(blogPath);
  } else {
    return getBlogFromVercelKV(slug);
  }
}

async function getBlogFromVercelKV(slug: string): Promise<BlogProps | null> {
  return kv.hget<BlogProps>(BLOG_KEY, slug);
}
