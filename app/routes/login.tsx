import { Form } from '@remix-run/react';
import { ActionFunctionArgs } from '@vercel/remix';
import { registerTiptapToken } from '~/.server/inspiring/auth';

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
    <div className="flex justify-center items-center w-screen h-screen">
      <Form method="post" className="basis-80 -mt-24 mx-4 p-8 rounded-lg shadow-2xl">
        <div className="flex justify-center mb-4 text-xl font-semibold">{TEXT.login}</div>
        <div>
          <input
            className="w-full px-3 py-2 rounded-lg ring-1 ring-neutral-300 focus:ring-2 focus:ring-blue-500"
            name="tiptapPassword"
            type="password"
            placeholder="Please input password"
          />
        </div>
        <div>
          <button className="w-full mt-4 p-2 text-white rounded-lg bg-blue-500 active:bg-blue-600">
            {TEXT.submitLogin}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
