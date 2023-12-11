import type { Adapter, GeneratedAdapter, VercelBlobConfig } from '../../types'

import { getGenerateURL } from './generateURL'
import { getHandleDelete } from './handleDelete'
import { getHandleUpload } from './handleUpload'
import { getStaticHandler } from './staticHandler'
import { extendWebpackConfig } from './webpack'

// TODO: move VercelBlobConfig to this file as `Args`
export interface Args {
  token: string
  endpointUrl: string // RENAME
  storeId: string
  options: {
    access: 'public'
    optionalUrlPrefix: string
    addRandomSuffix: boolean
    cacheControlMaxAge: number
  }
}

console.log('@--> here')
export const vercelBlobAdapter = ({ token, endpointUrl, storeId, options }: Args): Adapter => {
  console.log('@--> here info here')
  // read config options and pass to `handleUpload`
  // TODO: generate baseURL here and pass to functions
  // ex. const baseUrl = `https://${storeId}.${access}.${baseUrl}`
  // TODO: conditionally tack on `optionalUrlPrefix`
  // TODO: utilize `prefix` in the same way other adapters are
  return ({ collection, prefix }): GeneratedAdapter => {
    return {
      handleUpload: getHandleUpload(options),
      handleDelete: getHandleDelete(options),
      generateURL: getGenerateURL(options),
      staticHandler: getStaticHandler(options, collection),
      webpack: extendWebpackConfig,
    }
  }
}
