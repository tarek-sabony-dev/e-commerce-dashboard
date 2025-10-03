import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

const es = initEdgeStore.create();

/**
 * This is the main router for the EdgeStore buckets.
 */
const edgeStoreRouter = es.router({
  publicImages: es.imageBucket().beforeDelete(({ ctx, fileInfo }) => {
    console.log('Before delete hook called for file:', fileInfo.url);
    // Add your logic here to allow or deny the deletion.
    // For example, check user permissions in the context.
    // Return true to allow the deletion.
    return true;
  }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export { handler as GET, handler as POST };

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;