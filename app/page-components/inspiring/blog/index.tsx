import { memo, useRef } from 'react';
import { EditorContent } from '@tiptap/react';

import { BlogDocument } from '~/types/inspiring';
import { formatDate } from '~/utils/date';
import TOC from '~/page-components/toc';

import { useContent, useTitle } from '../hooks/use-blog';

interface InspiringBlogProps {
  blog: BlogDocument;
}

export const InspiringBlog: React.FC<InspiringBlogProps> = memo(function Blog(props) {
  const { blog } = props;
  const { title, content, createdAt } = blog;
  const ref = useRef<HTMLElement>(null);

  const { blogTitle } = useTitle(title ?? {});
  const { blogContent, toc } = useContent(content ?? {});

  if (!blogTitle || !blogContent) return null;

  return (
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
  );
});
