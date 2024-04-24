import { memo, useEffect, useRef, useState } from 'react';
import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix';
import { useLoaderData } from '@remix-run/react';
import { EditorContent } from '@tiptap/react';

import { getBlog } from '~/.server/blog';
import { formatDate } from '~/utils/date';
import TOC from '~/page-components/toc';
import type { TOCProps } from '~/page-components/toc';
import { TEXT } from '~/constants';
import { getDocContent } from '~/utils/get-doc-content';
import { useBlogContent, useBlogTitle } from '~/components/inspiring/use-editor';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [];

  const title = getDocContent(data.title);
  return [{ title: title ? `${title} - ${TEXT.siteName}` : TEXT.siteName }];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (params.slug) {
    const blog = await getBlog(params.slug.replace(/^\/?blog\//g, ''));
    return blog;
  }
  return null;
};

const getHeadings = (children: HTMLCollection) => {
  const headingTags = ['H1', 'H2', 'H3'];

  return Array.from(children)
    .filter((child): child is HTMLHeadingElement => headingTags.includes(child.tagName))
    .map(child => ({
      text: child.innerText.slice(1).trim(),
      level: +child.tagName.replace('H', '') as 1 | 2 | 3,
    }));
};

const Blog = memo(() => {
  const [headings, setHeadings] = useState<TOCProps['headings']>([]);
  const ref = useRef<HTMLElement>(null);
  const { title, content, size, createdAt, updatedAt } = useLoaderData<typeof loader>() ?? {};

  const { blogTitle } = useBlogTitle(title ?? {});
  const { blogContent, characterCount } = useBlogContent(content ?? {});

  useEffect(() => {
    if (ref.current?.children) {
      const headings = getHeadings(ref.current.children);
      setHeadings(headings);
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-10.5rem)]">
      <main className="max-w-5xl pt-32 mx-auto">
        <header className="flex justify-center px-8 mb-16">
          <div className="w-full md:max-w-2xl xl:max-w-5xl">
            <EditorContent editor={blogTitle} />
            <div className="text-secondary">
              {characterCount.words()}&nbsp;
              {characterCount.characters()}&nbsp;
              {size}&nbsp;
              {createdAt && formatDate(new Date(createdAt))}&nbsp;
              {updatedAt && formatDate(new Date(updatedAt))}
            </div>
          </div>
        </header>
        <main className="flex justify-center px-8 mb-16">
          <article className="blog flex-1 max-w-full md:max-w-2xl" ref={ref}>
            <EditorContent editor={blogContent} />
          </article>
          <TOC
            className="sticky top-24 ml-auto basis-52 max-h-[calc(100vh-12rem)] hidden xl:block"
            headings={headings}
          />
        </main>
      </main>
    </div>
  );
});

export default Blog;
