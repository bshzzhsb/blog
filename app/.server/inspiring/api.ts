import { kv } from '@vercel/kv';
import { JSONContent } from '@tiptap/react';

import type { BlogDocument, Document, DocumentListItem, TiptapDocumentList } from '~/types/inspiring';
import { TIPTAP_APP_ID, VERCEL_KV_BLOG_KEY, VERCEL_KV_DOC_LIST_KEY } from '~/constants';

type SaveDocumentTitlePayload = {
  title: JSONContent;
  savedAt: number;
};

export async function createDocument(id: string, data?: BodyInit) {
  return api(id, 'POST', data);
}

export async function getDocumentList(): Promise<TiptapDocumentList> {
  const listDocumentResponse = await api('', 'GET');

  return await listDocumentResponse.json();
}

export async function getDocumentListFromVercelKV() {
  const list = await kv.hgetall<Record<string, SaveDocumentTitlePayload>>(VERCEL_KV_DOC_LIST_KEY);
  if (!list) return [];

  return Object.entries(list).map(([id, data]) => ({ ...data, id }));
}

export async function getDocument(id: string) {
  const response = await api(`${id}?format=yjs`, 'GET');
  Buffer.from(await response.arrayBuffer());
}

export async function saveDocumentTitleToVercelKV(id: string, data: Omit<DocumentListItem, 'savedAt' | 'id'>) {
  await kv.hset<Omit<DocumentListItem, 'id'>>(VERCEL_KV_DOC_LIST_KEY, { [id]: { ...data, savedAt: Date.now() } });
}

export async function saveAllDocumentsTitlesToVercelKV() {
  const [documents] = await Promise.all([getDocumentList(), kv.del(VERCEL_KV_DOC_LIST_KEY)]);
  for (const document of documents) {
    const getDocumentResponse = await api(`${document.name}?format=json&fragment=title`, 'GET');
    const title = await getDocumentResponse.json();
    await saveDocumentTitleToVercelKV(document.name, { title });
  }
}

export async function saveDocumentToVercel(id: string, data: Document) {
  const documents = await getDocumentList();
  const document = documents.find(doc => doc.name === id);

  if (!document) {
    console.log('cannot find document of id', id);
  }

  await kv.hset<BlogDocument>(VERCEL_KV_BLOG_KEY, {
    [id]: {
      title: data.title,
      content: data.content,
      size: document?.size,
      createdAt: document?.created_at ? new Date(document.created_at).getTime() : undefined,
      updatedAt: document?.updated_at ? new Date(document.updated_at).getTime() : undefined,
    },
  });
}

const BASE_URL = `https://${TIPTAP_APP_ID}.collab.tiptap.cloud/api/documents`;

async function api(path: string, method: string, data?: BodyInit) {
  const url = new URL(`${BASE_URL}/${path}`);

  console.log('api', url.toString(), { method, Authorization: process.env.TIPTAP_API_SECRET_ID });

  return fetch(url.toString(), {
    method,
    headers: { Authorization: process.env.TIPTAP_API_SECRET_ID },
    body: data,
  });
}
