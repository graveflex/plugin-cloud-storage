import type { Adapter, GeneratedAdapter } from '../../types'

import getGenerateURL from './generateURL'
import getHandleDelete from './handleDelete'
import getHandleUpload from './handleUpload'
import getStaticHandler from './staticHandler'

export interface Args {
  token: string
  storeId: string
  bucketName: string
}

export const vercelBlobAdapter = ({ token, storeId, bucketName }: Args): Adapter => {
  return ({ collection }): GeneratedAdapter => {
    console.log('@--> collection', collection)
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
    }
  }
}
