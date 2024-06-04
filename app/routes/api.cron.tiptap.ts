import { json } from '@vercel/remix';

import { getDocumentList } from '~/.server/inspiring/api';

export async function loader() {
  const documentList = await getDocumentList();
  return json({ list: documentList });
}
