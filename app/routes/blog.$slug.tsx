import { memo } from 'react';
import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix';
import { useLoaderData } from '@remix-run/react';

import { getBlog } from '~/.server/blog';
import { TEXT } from '~/constants';
import { getDocContent } from '~/utils/get-doc-content';
import { InspiringBlog } from '~/page-components/inspiring/blog';

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

const Blog = memo(function Blog() {
  const blog = useLoaderData<typeof loader>();

  if (!blog) return null;

  return (
    <div className="min-h-[calc(100vh-10.5rem)]">
      <InspiringBlog blog={blog} />
    </div>
  );
});

export default Blog;
