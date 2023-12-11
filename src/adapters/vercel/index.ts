import type { Adapter, GeneratedAdapter, VercelBlobConfig } from '../../types'

import { getGenerateURL } from './generateURL'
import { getHandleDelete } from './handleDelete'
import { getHandleUpload } from './handleUpload'
import { getStaticHandler } from './staticHandler'
import { extendWebpackConfig } from './webpack'

export const vercelBlobAdapter = (config: VercelBlobConfig): Adapter => {
  // read config options and pass to `handleUpload`
  return ({ collection }): GeneratedAdapter => {
    return {
      handleUpload: getHandleUpload(config),
      handleDelete: getHandleDelete(config),
      generateURL: getGenerateURL(config),
      staticHandler: getStaticHandler(config, collection),
      webpack: extendWebpackConfig,
    }
  }
}
