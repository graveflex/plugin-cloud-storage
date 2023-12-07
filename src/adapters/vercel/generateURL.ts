import path from 'path'

import type { GenerateURL } from '../../types'

interface Args {
  storeId: string
  bucketName: string
}

const getGenerateURL = ({ storeId, bucketName }: Args): GenerateURL => {
  return ({ filename, prefix = '' }) => {
    return `https://${storeId}.public.blob.vercel-storage.com/${bucketName}/${path.posix.join(
      prefix,
      filename,
    )}`
  }
}

export default getGenerateURL
