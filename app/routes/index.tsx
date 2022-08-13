import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getBlogList } from '~/api/blog.server';
import type { BlogListProps } from '~/api/blog.server';
import { Arrow } from '~/components/icon';
import { formatDate } from '~/utils/date';
import { TEXT } from '~/constants';

export const meta: MetaFunction = () => ({ title: TEXT.siteName });

export const loader: LoaderFunction = async () => {
  return getBlogList();
};

const Index: React.FC = () => {
  const data = useLoaderData<BlogListProps>();

  return (
    <div className="min-h-[calc(100vh-10.5rem)]">
      <main className="flex flex-col gap-12 max-w-2xl py-32 px-8 mx-auto">
        {data.map(({ frontMatter, slug }) => (
          <article key={slug}>
            <Link to={`${slug}`} className="group w-full h-full">
              <h2 className="mb-2 text-2xl font-semibold">{frontMatter.title}</h2>
              <p className="mb-2 text-secondary">{formatDate(new Date(frontMatter.date))}</p>
              <p className="mb-3 text-base">{frontMatter.excerpt}</p>
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

export default Index;
