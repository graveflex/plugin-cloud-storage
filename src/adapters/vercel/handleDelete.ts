import { del } from '@vercel/blob'
import path from 'path'

import type { HandleDelete, VercelBlobConfig } from '../../types'

export const getHandleDelete = ({
  token,
  storeId,
  baseUrl,
  access,
  optionalUrlPrefix,
}: VercelBlobConfig): HandleDelete => {
  return async ({ filename, doc: { prefix = '' } }) => {
    let url = `https://${storeId}.${access}.${baseUrl}`

    if (optionalUrlPrefix) {
      url = `${url}/${optionalUrlPrefix}`
    }
    const fileUrl = `${url}/${path.posix.join(prefix, filename)}`

    const deletedBlob = await del(fileUrl, { token })
    return deletedBlob
  }
}
