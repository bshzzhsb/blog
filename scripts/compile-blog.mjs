import path from 'path';

async function preprocess() {
  const buildOptions = {
    entryPoints: [path.resolve('./app', 'utils', 'mdx', 'compile-blogs.ts')],
    bundle: true,
    minify: true,
    format: 'iife',
    platform: 'node',
    external: ['gray-matter', 'fs', 'esbuild', '@mdx-js/esbuild', 'remark-frontmatter'],
    outfile: './scripts/bundle.js',
  };

  const { default: esbuild } = await import('esbuild');
  await esbuild.build(buildOptions);
  console.log('Successfully build blog cache');
}

preprocess();
