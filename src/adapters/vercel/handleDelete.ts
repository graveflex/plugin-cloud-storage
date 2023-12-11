import { del } from '@vercel/blob'
import path from 'path'

import type { HandleDelete } from '../../types'

interface Args {
  token: string
  baseUrl: string
  prefix?: string
}

export const getHandleDelete = ({ token, baseUrl }: Args): HandleDelete => {
  return async ({ filename, doc: { prefix = '' } }) => {
    const fileUrl = `${baseUrl}/${path.posix.join(prefix, filename)}`
    const deletedBlob = await del(fileUrl, { token })

    return deletedBlob
  }
}
