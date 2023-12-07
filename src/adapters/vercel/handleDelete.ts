import { del } from '@vercel/blob'
import path from 'path'

import type { HandleDelete } from '../../types'

interface Args {
  token: string
  storeId: string
  bucketName: string
}

const getHandleDelete = ({ token, bucketName, storeId }: Args): HandleDelete => {
  return async ({ filename, doc: { prefix = '' } }) => {
    const fileUrl = `https://${storeId}.public.blob.vercel-storage.com/${bucketName}/${path.posix.join(
      prefix,
      filename,
    )}`

    const deletedBlob = await del(fileUrl, { token })
    return deletedBlob
  }
}

export default getHandleDelete
