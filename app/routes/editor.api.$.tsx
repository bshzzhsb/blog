import type { ActionFunction } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';

import {
  createDocument,
  saveAllDocumentsTitlesToVercelKV,
  saveDocumentTitleToVercelKV,
  saveDocumentToVercel,
} from '~/.server/inspiring/api';
import { getSession } from '~/session';

export const action: ActionFunction = async ({ request, params }) => {
  console.log('editor.api', params);
  const session = await getSession(request.headers.get('Cookie'));

  if (!session.has(process.env.TIPTAP_TOKEN_KEY)) {
    return redirect('/login');
  }

  const [api, ...rest] = params['*']?.split('/') ?? [];

  switch (api) {
    case 'save': {
      const [id] = rest;
      const data = await request.json();

      if (!id || !data) {
        return json({}, { status: 400 });
      }

      console.log('api.$.save', id, data.title);
      await saveDocumentTitleToVercelKV(id, data);
      return json({ ok: true });
    }
    case 'create': {
      const id = `blog.${crypto.randomUUID()}`;
      await createDocument(id);
      return redirect(`/editor/${id}`);
    }
    case 'resync': {
      await saveAllDocumentsTitlesToVercelKV();
      return json({ ok: true });
    }
    case 'publish': {
      const [id] = rest;
      const data = await request.json();
      await saveDocumentToVercel(id, data);
      return json({ ok: true });
    }
  }

  return json({ ok: true });
};
