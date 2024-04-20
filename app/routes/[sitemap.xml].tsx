import { getBlogList } from '~/api/blog.server';

const time = new Date().toISOString();

export const loader = async () => {
  const blogList = await getBlogList();

  const blogs = blogList
    .map(
      blog => `
<url>
  <loc>https://blog.bshz.xyz/${blog.slug}</loc>
  <lastmod>${time}</lastmod>
  <priority>1.0</priority>
</url>`,
    )
    .join();

  const content = `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://blog.bshz.xyz/</loc>
    <lastmod>${time}</lastmod>
    <priority>1.0</priority>
  </url>
  ${blogs}
</urlset>
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  });
};
