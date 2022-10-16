import fs from 'fs/promises';
import grayMatter from 'gray-matter';

import { getMDXBundle, BLOG_DIR } from '~/utils/mdx/get-mdx-bundle';
import type { FrontMatter } from '~/utils/mdx/get-mdx-bundle';
import { objToCamelCase } from '~/utils/to-camel-case';

export type BlogListProps = {
  slug: string;
  frontMatter: FrontMatter;
}[];

export type BlogProps = {
  frontMatter: FrontMatter;
  code: string;
};

export async function getBlogList(): Promise<BlogListProps> {
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

export async function getBlog(slug: string): Promise<BlogProps> {
  const blogPath = `${BLOG_DIR}/${slug}/index.mdx`;
  const blog = getMDXBundle(blogPath);
  return blog;
}
