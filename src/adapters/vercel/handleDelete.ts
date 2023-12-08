import { del } from '@vercel/blob'
import path from 'path'
import type { HandleDelete } from '../../types'

interface Args {
  token: string
  storeId: string
  bucketName: string
}

export const getHandleDelete = ({ token, bucketName, storeId }: Args): HandleDelete => {
  return async ({ filename, doc: { prefix = '' } }) => {
    const fileUrl = `https://${storeId}.public.blob.vercel-storage.com/${bucketName}/${path.posix.join(
      prefix,
      filename,
    )}`

    // TODO: do we need to return this?
    const deletedBlob = await del(fileUrl, { token })
    return deletedBlob
  }
}
