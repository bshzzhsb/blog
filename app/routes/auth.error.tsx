import { useSearchParams } from '@remix-run/react';
import React from 'react';

const AuthError: React.FC = () => {
  const [searchParams] = useSearchParams();

  return <div className="h-screen w-screen flex justify-center items-center text-4xl">{searchParams.get('error')}</div>;
};

export default AuthError;
