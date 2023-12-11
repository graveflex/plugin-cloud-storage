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

export const vercelBlobAdapter = ({ token, endpointUrl, storeId, options }: Args): Adapter => {
  // read config options and pass to `handleUpload`
  // TODO: generate baseURL here and pass to functions
  const { access, optionalUrlPrefix, addRandomSuffix, cacheControlMaxAge } = options
  const baseUrl = `https://${storeId}.${access}.${endpointUrl}${
    optionalUrlPrefix ? `/${optionalUrlPrefix}` : ''
  }`

  // TODO: conditionally tack on `optionalUrlPrefix`
  // TODO: utilize `prefix` in the same way other adapters are
  return ({ collection, prefix }): GeneratedAdapter => {
    return {
      handleUpload: getHandleUpload({
        token,
        prefix,
        access,
        addRandomSuffix,
        cacheControlMaxAge,
      }),
      handleDelete: getHandleDelete({ token, baseUrl, prefix }),
      generateURL: getGenerateURL({ options, baseUrl, prefix }),
      staticHandler: getStaticHandler({ token, options, prefix }, collection),
      webpack: extendWebpackConfig,
    }
  }
}
