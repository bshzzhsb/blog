/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  ignoredRouteFiles: ['.*'],
  publicPath: '/build/',
  serverBuildTarget: 'vercel',
  server: process.env.NODE_ENV === 'production' ? './server/index.ts' : undefined,
  serverDependenciesToBundle: [/^unist.*/],
};
