import { Form } from '@remix-run/react';

import { Icon } from '~/components/icon';
import { TEXT } from '~/constants';

const Login: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Form method="post" action="/auth/signin/github" className="basis-80">
        <button className="flex items-center justify-center relative w-full mt-4 p-2 text-white rounded-lg bg-blue-500 active:bg-blue-600">
          <Icon name="github" className="absolute left-4" />
          {TEXT.LOGIN_WITH_GITHUB}
        </button>
      </Form>
    </div>
  );
};

export default Login;
