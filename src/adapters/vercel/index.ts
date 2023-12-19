import type { Adapter, GeneratedAdapter } from '../../types'

import { getGenerateURL } from './generateURL'
import { getHandleDelete } from './handleDelete'
import { getHandleUpload } from './handleUpload'
import { getStaticHandler } from './staticHandler'
import { extendWebpackConfig } from './webpack'

// TODO: move VercelBlobConfig to this file as `Args`

export interface VercelConfigArgs {
  access: 'public'
  optionalUrlPrefix: string
  addRandomSuffix: boolean
  cacheControlMaxAge: number
}
export interface Args {
  token: string
  endpointUrl: string // RENAME
  storeId: string
  options: VercelConfigArgs
}

export const vercelBlobAdapter = ({ token, endpointUrl, storeId, options }: Args): Adapter => {
  // read config options and pass to `handleUpload`
  // TODO: generate baseURL here and pass to functions
  const { access, optionalUrlPrefix, addRandomSuffix, cacheControlMaxAge } = options
  const baseUrl = `https://${storeId}.${access}.${endpointUrl}${
    optionalUrlPrefix ? `/${optionalUrlPrefix}` : ''
  }`

  return ({ collection, prefix }): GeneratedAdapter => {
    return {
      handleUpload: getHandleUpload({
        token,
        prefix,
        access,
        addRandomSuffix,
        cacheControlMaxAge,
        optionalUrlPrefix,
      }),
      handleDelete: getHandleDelete({ token, baseUrl, prefix }),
      generateURL: getGenerateURL({ baseUrl, prefix }),
      staticHandler: getStaticHandler({ baseUrl }, collection),
      webpack: extendWebpackConfig,
    }
  }
}
