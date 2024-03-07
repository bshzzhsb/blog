import path from 'path';

async function preprocess() {
  const buildOptions = {
    entryPoints: [path.resolve('./app', 'utils', 'mdx', 'compile-blogs.ts')],
    bundle: true,
    minify: true,
    format: 'esm',
    platform: 'node',
    external: ['gray-matter', 'fs', 'esbuild', '@mdx-js/esbuild', 'remark-frontmatter', 'dotenv'],
    outfile: './scripts/bundle.mjs',
  };

  const { default: esbuild } = await import('esbuild');
  await esbuild.build(buildOptions);
  console.log('Successfully build blog cache');
}

preprocess();
