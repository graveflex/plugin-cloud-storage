/* eslint-disable no-console */
// had to convert to a react file to return react components

import * as React from 'react'
import { handleUpload, upload, type HandleUploadBody } from '@vercel/blob/client'

import type {
  CollectionConfig,
  CustomSaveButtonProps,
  Field,
  SanitizedCollectionConfig,
} from 'payload/types'

const urlField: Field = {
  name: 'url',
  type: 'text',
  hooks: {
    afterRead: [
      ({ value }) => {
        // console.log('hello from hook', value)
        return value
      },
    ],
  },
}
// custom react component, client-side.  Need to figure out how to get the request data in here?
export const CustomSaveButton: CustomSaveButtonProps = ({ event, DefaultButton, label, save }) => {
  console.log('CUSTOM BUTTON FIRING HERE!!!!!')
  console.log('label', label)
  console.log('window.event', window.event)
  console.log('event', event)
  console.log('document', document)
  return (
    <div>
      <form onSubmit={console.log('BUTTON IS FIRING')}>
        <DefaultButton label={label} save={save} />
      </form>
    </div>
  )
}

export const Media: SanitizedCollectionConfig = {
  slug: 'media',
  admin: {
    components: {
      edit: {
        SaveButton: CustomSaveButton,
      },
    },
  },
  upload: {
    imageSizes: [
      {
        height: 400,
        width: 400,
        crop: 'center',
        name: 'square',
      },
      {
        width: 900,
        height: 450,
        crop: 'center',
        name: 'sixteenByNineMedium',
      },
    ],
    staticDir: '',
    staticURL: '',
    disableLocalStorage: false,
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
    },

    // The following fields should be able to be merged in to default upload fields
    urlField,
    {
      name: 'sizes',
      type: 'group',
      fields: [
        {
          name: 'square',
          type: 'group',
          fields: [urlField],
        },
      ],
    },
  ],
  // custom endpoint below here, this runs on the server-side.
  endpoints: [
    {
      path: '/',
      method: 'post',
      handler: async (req, res, next) => {
        console.log('req.params.filename', req.files.file.name)
        console.log('req.files.file', req.files.file.data)
        const blobResult = await upload(req.files.file.name, req.files.file.data, {
          access: 'public',
          handleUploadUrl: '/',
          contentType: req.headers['content-type'],
        })

        console.log('blobResult', blobResult)
        if (blobResult) {
          res.status(200).send({ blobResult })
        } else {
          res.status(404).send({ error: 'blob did not create' })
        }
      },
    },
  ],
}
