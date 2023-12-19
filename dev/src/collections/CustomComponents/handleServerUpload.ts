import type { PutBlobResult } from '@vercel/blob'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import type { PayloadHandler } from 'payload/config'

export const handleVercelUpload: PayloadHandler = async (req, res) => {
  console.log('this endpoint is firing!!!!')
  const token = process.env.BLOB_READ_WRITE_TOKEN

  if (!token) {
    console.log('missing token')
  }

  try {
    const request = req
    const body = (await req.body) as HandleUploadBody

    const handleUploadResult = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname: string) => {
        // not sure what to make use of pathname here. Type requires it, docs example doesn't use it
        console.log('pathname', pathname)

        return {
          tokenPayload: JSON.stringify({ token }),
          addRandomSuffix: false,
          cacheControlMaxAge: 31556926,
          // allowedContentTypes: contentTypes,
          // maximumSizeInBytes: maxBytes,
        }
      },
      onUploadCompleted: async ({
        url,
        pathname,
        contentDisposition,
        contentType,
      }: PutBlobResult) => {
        console.log('Upload completed for url:', url)
        console.log('Upload completed for pathname:', pathname)
        console.log('Upload completed for contentDisposition:', contentDisposition)
        console.log('Upload completed for contentType:', contentType)
      },
    })

    res.status(200).json(handleUploadResult)
  } catch (error) {
    console.error('Error in handleUpload:', error)
  }
}
