import type { Adapter, GeneratedAdapter } from '../../types'

import { getGenerateURL } from './generateURL'
import { getHandleDelete } from './handleDelete'
import { getHandleUpload } from './handleUpload'
import { getStaticHandler } from './staticHandler'
import { extendWebpackConfig } from './webpack'

export interface Args {
  // URL for blob uploads
  baseUrl: string
  token: string
  storeId: string // DEPRECATED
  bucketName: string
  // https://vercel.com/docs/storage/vercel-blob/using-blob-sdk#put
  config?: {
    bucketName?: string
    addRandomSuffix?: boolean
    cacheControlMaxAge?: number
  }
}

// TODO: swap `storeId` for url as `baseUrl`
// TODO: handle config object here
export const vercelBlobAdapter = ({ token, storeId, bucketName, config = {} }: Args): Adapter => {
  // read config options and pass to `handleUpload`
  return ({ collection }): GeneratedAdapter => {
    return {
      handleUpload: getHandleUpload({ token, bucketName }),
      handleDelete: getHandleDelete({ token, bucketName, storeId }),
      generateURL: getGenerateURL({ storeId, bucketName }),
      staticHandler: getStaticHandler({
        token,
        bucketName,
        storeId,
        collection,
      }),
      webpack: extendWebpackConfig,
    }
  }
}
