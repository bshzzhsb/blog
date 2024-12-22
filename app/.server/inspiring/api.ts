import { kv } from '@vercel/kv';

import type { BlogDocument, Document } from '~/types/inspiring';

import { liveblocksApi, LiveblocksDeleteCommands, LiveblocksGetCommands } from '../liveblocks';

export async function saveDocumentToVercel(id: string, data: Document) {
  const document = await liveblocksApi.get(LiveblocksGetCommands.ROOMS_ROOM_ID, undefined, { roomId: id });

  if (!document) {
    throw new Error(`cannot find document by id: ${id}`);
  }

  await kv.hset<BlogDocument>(process.env.KV_BLOG_KEY, {
    [id]: {
      title: data.title,
      content: data.content,
      createdAt: document.createdAt ? new Date(document.createdAt).getTime() : undefined,
      updatedAt: new Date().getTime(),
    },
  });
}

export async function deleteDocument(id: string) {
  // NOTE: This will not delete the saved document.
  await liveblocksApi.delete(LiveblocksDeleteCommands.ROOMS_ROOM_ID, undefined, { roomId: id });
}
