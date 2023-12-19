import { put } from '@vercel/blob'
import path from 'path'

import type { HandleUpload } from '../../types'

interface Args {
  token: string
  access: 'public'
  prefix?: string
  addRandomSuffix: boolean
  cacheControlMaxAge: number
  optionalUrlPrefix: string
}

export const getHandleUpload = ({
  token,
  access,
  addRandomSuffix,
  cacheControlMaxAge,
  prefix = '',
  optionalUrlPrefix,
}: Args): HandleUpload => {
  return async ({ data, file }) => {
    const filename = optionalUrlPrefix ? `${optionalUrlPrefix}/${file.filename}` : file.filename
    const fileKey = path.posix.join(data.prefix || prefix, filename)

    await put(fileKey, file.buffer, {
      token,
      contentType: file.mimeType,
      access,
      addRandomSuffix,
      cacheControlMaxAge,
    })

    if (addRandomSuffix) {
      // handle updating data
    }

    return data
  }
}
