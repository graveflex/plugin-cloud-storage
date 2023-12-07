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

const getHandleUpload = ({
  token,
  bucketName,
  access = 'public',
  prefix = '',
  addRandomSuffix = false,
  cacheControlMaxAge = 31556926,
}: Args): HandleUpload => {
  return async ({ data, file }) => {
    const fileKey = path.posix.join(data.prefix || prefix, file.filename)
    const filePath = `${bucketName}/${fileKey}`
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

export default getHandleUpload
