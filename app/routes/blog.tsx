import { Outlet } from '@remix-run/react';

import { TEXT } from '~/constants';
import Navbar from '~/page-components/navbar';
import Footer from '~/page-components/footer';

const Blog: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-10.5rem)]">
        <Outlet />
      </main>
      <Footer text={TEXT.footer} />
    </>
  );
};

export default Blog;
