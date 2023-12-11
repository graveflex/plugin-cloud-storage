import path from 'path'

import type { GenerateURL, VercelBlobConfig } from '../../types'

export const getGenerateURL = ({
  storeId,
  baseUrl,
  access,
  optionalUrlPrefix,
}: VercelBlobConfig): GenerateURL => {
  return ({ filename, prefix = '' }) => {
    let url = `https://${storeId}.${access}.${baseUrl}`

    if (optionalUrlPrefix) {
      url = `${url}/${optionalUrlPrefix}`
    }
    return `${url}/${path.posix.join(prefix, filename)}`
  }
}
