import type { MetaFunction } from '@vercel/remix';
import { Link, useLoaderData } from '@remix-run/react';

import { getBlogList } from '~/.server/blog';
import { Arrow } from '~/components/icon';
import { formatDate } from '~/utils/date';
import { TEXT } from '~/constants';

export const meta: MetaFunction = () => [{ title: TEXT.siteName }];

export const loader = async () => {
  return getBlogList();
};

const Blog: React.FC = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="min-h-[calc(100vh-10.5rem)]">
      <main className="flex flex-col gap-12 max-w-2xl py-32 px-8 mx-auto">
        {data.map(({ slug, title, createdAt }) => (
          <article key={slug}>
            <Link to={`${slug}`} className="group w-full h-full">
              <h2 className="mb-2 text-2xl font-semibold">{title}</h2>
              {!!createdAt && <p className="mb-2 text-secondary">{formatDate(new Date(createdAt))}</p>}
              <p className="flex items-center gap-4 text-sm tracking-wider font-semibold">
                {TEXT.readMore}
                <Arrow className="opacity-0 group-hover:opacity-100 transition" />
              </p>
            </Link>
          </article>
        ))}
      </main>
    </div>
  );
};

export default Blog;
