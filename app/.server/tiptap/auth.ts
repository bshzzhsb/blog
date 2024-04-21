import jsonwebtoken from 'jsonwebtoken';
import { redirect } from '@vercel/remix';

import { commitSession, getSession } from '~/session';

export async function registerTiptapToken(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  const body = await request.formData();
  const password = (body.get('tiptapPassword') ?? '') as string;

  const jwt = jsonwebtoken.sign(password, process.env.USER_PASSWORD_SECRET_ID);

  if (jwt === process.env.USER_PASSWORD) {
    const tiptapToken = jsonwebtoken.sign({}, process.env.TIPTAP_APP_SECRET_ID);
    session.set(process.env.TIPTAP_TOKEN_KEY, tiptapToken);

    return redirect('/editor', { headers: { 'Set-Cookie': await commitSession(session) } });
  }

  session.flash('error', 'Invalid password');
  return redirect('/login', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

function response(status: number, data: unknown) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
