import { kv } from '@vercel/kv';

import { VERCEL_KV_BLOG_KEY } from '~/constants';
import type { BlogDocument, BlogList } from '~/types/inspiring';
import { getDocContent } from '~/utils/get-doc-content';

export async function getBlogList(): Promise<BlogList> {
  const blogRecords = await kv.hgetall<Record<string, BlogDocument>>(VERCEL_KV_BLOG_KEY);
  if (!blogRecords) return [];

  console.log('blog list', Array.from(Object.keys(blogRecords)));

  return Object.entries(blogRecords)
    .map(([id, blog]) => {
      return {
        slug: getBlogSlug(id),
        title: getDocContent(blog.title),
        createAt: blog.createdAt,
        updateAt: blog.updatedAt,
      };
    })
    .sort((a, b) => (b.createAt ?? 0) - (a.createAt ?? 0));
}

export async function getBlog(slug: string): Promise<BlogDocument | null> {
  return kv.hget<BlogDocument>(VERCEL_KV_BLOG_KEY, slug);
}

function getBlogSlug(id: string) {
  return id.replace(/^blog\./g, '');
}
