import { put } from '@vercel/blob'
import path from 'path'

import type { HandleUpload } from '../../types'

interface Args {
  token: string
  bucketName: string
  access?: 'public'
  prefix?: string
  addRandomSuffix?: boolean
  cacheControlMaxAge?: number
}

export const getHandleUpload = ({
  token,
  bucketName,
  access = 'public',
  prefix = '',
  addRandomSuffix = false,
  cacheControlMaxAge = 31556926,
}: Args): HandleUpload => {
  return async ({ data, file }) => {
    // TODO: handle uploads > 4.5MB
    // https://vercel.com/docs/storage/vercel-blob/quickstart#server-and-client-uploads
    const fileKey = path.posix.join(data.prefix || prefix, file.filename)
    const filePath = `${bucketName}/${fileKey}`

    // 1. How big is the file?
    // 2. If < 4.5MB, use `put`
    // 3. If < 500MB use `handleUpload`
    // 4. Throw error if > 500MB

    const resp = await put(filePath, file.buffer, {
      token,
      contentType: file.mimeType,
      access,
      addRandomSuffix,
      cacheControlMaxAge,
    })

    console.log('@--> data', data)

    if (addRandomSuffix) {
      // handle updating data
    }

    return data
  }
}
