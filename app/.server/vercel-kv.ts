import { Redis } from '@upstash/redis';

import type { BlogDocument, Document } from '~/types/inspiring';

const redis = Redis.fromEnv();

const KV_BLOG_KEY = process.env.KV_BLOG_KEY;

async function saveDocument(id: string, data: Document, createAt: Date) {
  await redis.hset<BlogDocument>(KV_BLOG_KEY, {
    [id]: {
      title: data.title,
      content: data.content,
      createdAt: new Date(createAt).getTime(),
      updatedAt: new Date().getTime(),
    },
  });
}

async function deleteDocument(id: string) {
  await redis.hdel(KV_BLOG_KEY, id);
}

export const vercelKv = { saveDocument, deleteDocument };
