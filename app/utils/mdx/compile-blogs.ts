import fs from 'fs/promises';
import path from 'path';

import { kv } from '@vercel/kv';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.development.local') });

import { BLOG_KEY } from '~/constants';

import { getMDXBundleFromEsbuild } from './get-mdx-bundle';

async function compileBlogs() {
  const BLOG_DIR = path.resolve('./app/blog');
  const dir = await fs.readdir(BLOG_DIR);

  await Promise.all(
    dir.map(async fileDir => {
      const filePath = `${BLOG_DIR}/${fileDir}/index.mdx`;
      const blog = await getMDXBundleFromEsbuild(filePath);
      console.log(`[KV] set ${fileDir} to vercel kv`);
      kv.hset(BLOG_KEY, { [fileDir]: blog });
    }),
  );
}

compileBlogs();
