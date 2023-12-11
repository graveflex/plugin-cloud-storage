import type { Adapter, GeneratedAdapter, VercelBlobConfig } from '../../types'

import { getGenerateURL } from './generateURL'
import { getHandleDelete } from './handleDelete'
import { getHandleUpload } from './handleUpload'
import { getStaticHandler } from './staticHandler'
import { extendWebpackConfig } from './webpack'

// TODO: move VercelBlobConfig to this file as `Args`
export interface Args {}

// TODO: use this as a reference
/* {
 *  token,
 *  baseUrl, // RENAME
 *  storeId,
 *  config {
 *    access,
 *    optionalUrlPrefix,
 *    addRandomSuffix,
 *    cacheControlMaxAge
 *  }
 * } */

console.log('@--> here')
export const vercelBlobAdapter = (config: VercelBlobConfig): Adapter => {
  console.log('@--> here info here')
  // read config options and pass to `handleUpload`
  // TODO: generate baseURL here and pass to functions
  // ex. const baseUrl = `https://${storeId}.${access}.${baseUrl}`
  // TODO: conditionally tack on `optionalUrlPrefix`
  // TODO: utilize `prefix` in the same way other adapters are
  return ({ collection, prefix }): GeneratedAdapter => {
    return {
      handleUpload: getHandleUpload(config),
      handleDelete: getHandleDelete(config),
      generateURL: getGenerateURL(config),
      staticHandler: getStaticHandler(config, collection),
      webpack: extendWebpackConfig,
    }
  }
}
