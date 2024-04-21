import { Form } from '@remix-run/react';
import { ActionFunctionArgs } from '@vercel/remix';
import { registerTiptapToken } from '~/.server/tiptap/auth';

import { TEXT } from '~/constants';

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await registerTiptapToken(request);
  } catch (e) {
    return e;
  }
}

const Login: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Form method="post" className="p-4 shadow-md">
        <input className="" name="tiptapPassword" />
        <button>{TEXT.submitLogin}</button>
      </Form>
    </div>
  );
};

export default Login;
