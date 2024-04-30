import { memo, useRef } from 'react';
import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix';
import { useLoaderData } from '@remix-run/react';
import { EditorContent } from '@tiptap/react';

import { getBlog } from '~/.server/blog';
import { formatDate } from '~/utils/date';
import TOC from '~/page-components/toc';
import { TEXT } from '~/constants';
import { getDocContent } from '~/utils/get-doc-content';
import { useBlogContent, useBlogTitle } from '~/utils/hooks/use-editor';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [];

  const title = getDocContent(data.title);
  return [{ title: title ? `${title} - ${TEXT.siteName}` : TEXT.siteName }];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (params.slug) {
    const blog = await getBlog(`blog.${params.slug}`);
    return blog;
  }
  return null;
};

const Blog = memo(() => {
  const ref = useRef<HTMLElement>(null);
  const { title, content, createdAt } = useLoaderData<typeof loader>() ?? {};

  const { blogTitle } = useBlogTitle(title ?? {});
  const { blogContent, toc } = useBlogContent(content ?? {});

  if (!blogTitle || !blogContent) return null;

  return (
    <div className="min-h-[calc(100vh-10.5rem)]">
      <main className="max-w-5xl pt-24 mx-auto">
        <header className="flex justify-center px-8 mb-16">
          <div className="inspiring blog w-full md:max-w-2xl xl:max-w-5xl">
            <EditorContent editor={blogTitle} className="inspiring-title mb-4 text-4xl" />
            <div className="text-secondary">{createdAt && formatDate(new Date(createdAt))}</div>
          </div>
        </header>
        <main className="flex justify-center px-8 mb-16">
          <article className="inspiring blog flex-1 max-w-full md:max-w-2xl" ref={ref}>
            <EditorContent editor={blogContent} />
          </article>
          <TOC className="sticky top-24 ml-auto basis-52 max-h-[calc(100vh-12rem)] hidden xl:block" toc={toc} />
        </main>
      </main>
    </div>
  );
});

export default Blog;
