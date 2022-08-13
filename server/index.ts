import { createRequestHandler } from '@remix-run/vercel';
import { createMetronomeGetLoadContext, registerMetronome } from '@metronome-sh/vercel';
import * as build from '@remix-run/dev/server-build'

const buildWithMetronome = registerMetronome(build);

const metronomeGetLoadContext = createMetronomeGetLoadContext(buildWithMetronome);

export default createRequestHandler({
  build: buildWithMetronome,
  getLoadContext: metronomeGetLoadContext,
  mode: process.env.NODE_ENV,
});
