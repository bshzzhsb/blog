import fs from 'fs/promises';
import path from 'path';

import { getMDXBundleFromEsbuild } from './get-mdx-bundle';

async function compileBlogs() {
  const BLOG_DIR = path.resolve('./app/blog');
  const dir = await fs.readdir(BLOG_DIR);

  await Promise.all(
    dir.map(async fileDir => {
      const filePath = `${BLOG_DIR}/${fileDir}/index.mdx`;
      const blog = await getMDXBundleFromEsbuild(filePath);
      await fs.writeFile(`${BLOG_DIR}/${fileDir}/index.json`, JSON.stringify(blog), 'utf-8');
    }),
  );
}

compileBlogs();
