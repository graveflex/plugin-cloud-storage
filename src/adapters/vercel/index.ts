import type { Adapter, GeneratedAdapter } from '../../types'

import { getGenerateURL } from './generateURL'
import { getHandleDelete } from './handleDelete'
import { getHandleUpload } from './handleUpload'
import { getStaticHandler } from './staticHandler'
import { extendWebpackConfig } from './webpack'

export interface Args {
  token: string
  storeId: string
  bucketName: string
}

// TODO: handle config object here
// TODO: swap `storeId` for url
export const vercelBlobAdapter = ({ token, storeId, bucketName }: Args): Adapter => {
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
