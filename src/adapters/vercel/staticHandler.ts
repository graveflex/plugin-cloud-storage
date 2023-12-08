import path from 'path'
import { head } from '@vercel/blob'
import type { CollectionConfig } from 'payload/types'

import type { StaticHandler } from '../../types'
import { getFilePrefix } from '../../utilities/getFilePrefix'

interface Args {
  token: string
  storeId: string
  bucketName: string
  collection: CollectionConfig
}

export const getStaticHandler = ({ bucketName, storeId, collection }: Args): StaticHandler => {
  return async (req, res, next) => {
    try {
      const prefix = await getFilePrefix({ req, collection })
      const fileUrl = `https://${storeId}.public.blob.vercel-storage.com/${bucketName}/${path.posix.join(
        prefix,
        req.params.filename,
      )}`
      const blobMetadata = await head(fileUrl)

      if (blobMetadata) {
        const { contentType, size } = blobMetadata
        const response = await fetch(fileUrl)
        const blob = await response.blob()

        if (blob) {
          res.set({
            'Content-Type': contentType,
            'Content-Length': size,
            'Content-Disposition': 'inline',
          })

          blob.arrayBuffer().then(b => {
            res.send(Buffer.from(b))
            res.end()
          })
        }
      }

      next()
    } catch (err: unknown) {
      next(err)
    }
  }
}
