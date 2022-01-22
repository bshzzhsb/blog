import fs from 'fs/promises';
import grayMatter from 'gray-matter';

import { getMDXBundle } from '~/utils/mdx/get-mdx-bundle';

export type BlogListProps = {
  slug: string;
  frontMatter: {
    [key: string]: string;
  };
}[];

export type BlogProps = {
  frontMatter: {
    [key: string]: any;
  };
  code: string;
};

const BLOG_DIR = `${__dirname}/../../app/blog`;

export async function getBlogList(): Promise<BlogListProps> {
  const dir = await fs.readdir(BLOG_DIR);
  const blogList = await Promise.all(
    dir.map(async (fileDir) => {
      const filePath = `${BLOG_DIR}/${fileDir}/index.mdx`;
      const file = await fs.readFile(filePath);
      const { data } = await grayMatter(file.toString());
      return { slug: fileDir, frontMatter: data };
    }),
  );
  blogList.sort((a, b) => b.frontMatter.date - a.frontMatter.date);

  return blogList;
}

export async function getBlog(slug: string) {
  const blogPath = `${BLOG_DIR}/${slug}/index.mdx`;
  const blog = getMDXBundle(blogPath);
  return blog;
}
