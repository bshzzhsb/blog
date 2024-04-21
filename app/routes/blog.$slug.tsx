import { useEffect, useMemo, useRef, useState } from 'react';
import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix';
import { useLoaderData } from '@remix-run/react';

import { getBlog } from '~/.server/blog';
import type { BlogProps } from '~/.server/blog';
import { formatDate } from '~/utils/date';
import getMDXComponent from '~/utils/mdx/get-mdx-component';
import TOC from '~/page-components/toc';
import type { TOCProps } from '~/page-components/toc';
import Anchor from '~/mdx-components/anchor';
import Code from '~/mdx-components/code';
import Codeblock from '~/mdx-components/codeblock';
import { getHeading } from '~/mdx-components/heading';
import HighlightBlock from '~/mdx-components/highlight-block';
import { TEXT } from '~/constants';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [];

  const title = data.frontMatter?.title;
  return [{ title: title ? `${title} - ${TEXT.siteName}` : TEXT.siteName }];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (params.slug) {
    const blog = await getBlog(params.slug.replace(/^\/?blog\//g, ''));
    return blog;
  }
  return null;
};

const MDXComponents = {
  a: Anchor,
  h1: getHeading(1),
  h2: getHeading(2),
  h3: getHeading(3),
  h4: getHeading(4),
  h5: getHeading(5),
  h6: getHeading(6),
  code: Code,
  pre: Codeblock,
  HighlightBlock: HighlightBlock,
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

const Blog = () => {
  const [headings, setHeadings] = useState<TOCProps['headings']>([]);
  const ref = useRef<HTMLElement>(null);
  const { frontMatter, code } = useLoaderData<BlogProps>();
  const Component = useMemo(() => (code ? getMDXComponent(code) : null), [code]);
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
            <h1 className="mb-3 text-4xl">{frontMatter?.title}</h1>
            <div className="text-secondary">{formatDate(new Date(frontMatter?.date))}</div>
          </div>
        </header>
        <main className="flex justify-center px-8 mb-16">
          <article className="blog flex-1 max-w-full md:max-w-2xl" ref={ref}>
            {Component && <Component components={MDXComponents} />}
          </article>
          <TOC
            className="sticky top-24 ml-auto basis-52 max-h-[calc(100vh-12rem)] hidden xl:block"
            headings={headings}
          />
        </main>
      </main>
    </div>
  );
};

export default Blog;
