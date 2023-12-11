import { put } from '@vercel/blob'
import { upload } from '@vercel/blob/client'
import path from 'path'

import type { HandleUpload, VercelBlobConfig } from '../../types'

export const getHandleUpload = ({
  token,
  access = 'public',
  addRandomSuffix,
  cacheControlMaxAge,
  optionalUrlPrefix,
}: VercelBlobConfig): HandleUpload => {
  return async ({ data, file }) => {
    const prefix = optionalUrlPrefix || ''
    const fileKey = path.posix.join(data.prefix || prefix, file.filename)

    await put(fileKey, file.buffer, {
      token,
      contentType: file.mimeType,
      access,
      addRandomSuffix,
      cacheControlMaxAge,
    })

    // TODO: handle uploads over 4.5mb -- notes on attempt:
    // error when running: upload: 'Error: Vercel Blob: client/`upload` must be called from a client environment' -- need to figure out how to access payload's client environment

    // const fileSizeInMb = typeof file?.filesize === 'number' ? file.filesize / 1000000 : 0 // need better default here
    // if (fileSizeInMb < 4.5) {
    //   blobResult = await put(fileKey, file.buffer, {
    //     token,
    //     contentType: file.mimeType,
    //     access,
    //     addRandomSuffix,
    //     cacheControlMaxAge,
    //   })
    // } else if (fileSizeInMb > 4.5 && fileSizeInMb < 500) {
    //   blobResult = await upload(fileKey, file.buffer, {
    //     access: 'public',
    //     handleUploadUrl: '/api/avatar/upload',
    //   })
    // }

    // const blobResult = await upload(file.filename, file.buffer, {
    //   access: 'public',
    //   handleUploadUrl: fileKey,
    //   contentType: file.mimeType,
    // })

    if (addRandomSuffix) {
      // handle updating data
    }

    return data
  }
}
