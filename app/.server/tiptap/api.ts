import { TIPTAP_APP_ID } from '~/constants';
import type { TiptapDocument } from '~/types/tiptap';

export async function createDocument(name: string, data: BodyInit) {
  return api(name, 'POST', data);
}

export async function getDocumentList(): Promise<TiptapDocument[]> {
  const response = await api('', 'GET');
  return await response.json();
}

export async function getDocument(name: string) {
  const response = await api(`${name}?format=yjs`, 'GET');
  Buffer.from(await response.arrayBuffer());
}

export async function saveDocument() {}

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
