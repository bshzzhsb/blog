import { kv } from '@vercel/kv';

import type { BlogDocument, Document } from '~/types/inspiring';

const KV_BLOG_KEY = process.env.KV_BLOG_KEY;

async function saveDocument(id: string, data: Document, createAt: Date) {
  await kv.hset<BlogDocument>(KV_BLOG_KEY, {
    [id]: {
      title: data.title,
      content: data.content,
      createdAt: new Date(createAt).getTime(),
      updatedAt: new Date().getTime(),
    },
  });
}

async function deleteDocument(id: string) {
  await kv.hdel(KV_BLOG_KEY, id);
}

export const vercelKv = { saveDocument, deleteDocument };
