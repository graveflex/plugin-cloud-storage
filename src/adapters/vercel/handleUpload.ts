import { put } from '@vercel/blob'
import { handleUpload, upload, type HandleUploadBody } from '@vercel/blob/client'
import path from 'path'

import type { HandleUpload } from '../../types'

interface Args {
  token: string
  access: 'public'
  prefix?: string
  addRandomSuffix: boolean
  cacheControlMaxAge: number
}

export const getHandleUpload = ({
  token,
  access,
  addRandomSuffix,
  cacheControlMaxAge,
  prefix = '',
}: Args): HandleUpload => {
  return async ({ data, file }) => {
    const fileKey = path.posix.join(data.prefix || prefix, file.filename)

    await put(fileKey, file.buffer, {
      token,
      contentType: file.mimeType,
      access,
      addRandomSuffix,
      cacheControlMaxAge,
    })

    // TODO: handle uploads over 4.5mb
    /// //// Client-Side Upload Work /// ////

    // Conditional to handle filesize:
    // const fileSizeInMb = typeof file?.filesize === 'number' ? file.filesize / 1000000 : 0 // need better default here
    // if (fileSizeInMb < 4.5) {
    //   await put(fileKey, file.buffer, {
    //     token,
    //     contentType: file.mimeType,
    //     access,
    //     addRandomSuffix,
    //     cacheControlMaxAge,
    //   })
    // } else if (fileSizeInMb > 4.5 && fileSizeInMb < 500) {
    //   await upload(fileKey, file.buffer, {
    //    access: 'public',
    //    handleUploadUrl: '/server-route/to/call/for/token', // --> need to figure this out
    //    contentType: file.mimeType,
    //  })
    // }

    // /// /// /// /// NOTES /// /// /// /// ////

    // Reached out to Payload Folks via discord --  Cliff Notes on discussion:
    // // - Client hooks aren't accessible from the adapter/plugin
    // // - We'll have to write our own Component and Endpoint
    // // - The contributor speculated that the 4.5 limit is due to the server less function limitations
    // Refs:
    // // - https://payloadcms.com/docs/admin/components
    // // - https://payloadcms.com/docs/rest-api/overview#custom-endpoints

    // When attempting to run 'upload' via server here:
    // // - "Error: Vercel Blob: client/`upload` must be called from a client environment"

    /// //// EXAMPLE Server-Side `handleUpload` function from Vercel-Blob storage //// ///
    // const body = (await req.payload.express?.request.body.json()) as HandleUploadBody
    // const request = req.payload.express?.request.body
    // const blobResponse = await handleUpload({
    //   token,
    //   request,
    //   body,
    //   onBeforeGenerateToken: async (pathname: string, clientPayload?: string) => {
    //     return {
    //       allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
    //       tokenPayload: JSON.stringify({
    //         // optional, sent to your server on upload completion
    //         // you could pass a user id from auth, or a value from clientPayload
    //       }),
    //     }
    //   },
    //   onUploadCompleted: async ({ blob, tokenPayload }) => {
    //     // Get notified of client upload completion
    //     // ⚠️ This will not work on `localhost` websites,
    //     // Use ngrok or similar to get the full upload flow

    //     console.log('blob upload completed', blob, tokenPayload)

    //     try {
    //       // Run any logic after the file upload completed
    //       // const { userId } = JSON.parse(tokenPayload);
    //       // await db.update({ avatar: blob.url, userId });
    //     } catch (error) {
    //       throw new Error('Could not update user')
    //     }
    //   },
    // })

    /// //// END Client-Side Upload Work /// ////

    if (addRandomSuffix) {
      // handle updating data
    }

    return data
  }
}
