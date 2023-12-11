import path from 'path'

import type { GenerateURL } from '../../types'

interface Args {
  baseUrl: string
  prefix?: string
}

export const getGenerateURL = ({ baseUrl }: Args): GenerateURL => {
  return ({ filename, prefix = '' }) => {
    return `${baseUrl}/${path.posix.join(prefix, filename)}`
  }
}
