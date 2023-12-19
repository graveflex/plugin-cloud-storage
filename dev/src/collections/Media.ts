/* eslint-disable no-console */
import type { Field, SanitizedCollectionConfig } from 'payload/types'

import { VercelUploadComponent } from './CustomComponents/VercelUploadComponent'
import { handleVercelUpload } from './CustomComponents/handleServerUpload'

const urlField: Field = {
  name: 'url',
  type: 'text',
  hooks: {
    afterRead: [
      ({ value }) => {
        return value
      },
    ],
  },
}

export const Media: SanitizedCollectionConfig = {
  slug: 'media',
  admin: {
    components: {
      // @ts-expect-error
      // 'edit' errors because its expecting other cusomtized components, eventhough they're set as optional
      edit: {
        SaveButton: VercelUploadComponent,
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
    staticDir: '/media',
    staticURL: '/media',
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
  endpoints: [
    {
      path: '/vercel-upload',
      method: 'post',
      handler: handleVercelUpload,
    },
  ],
}
