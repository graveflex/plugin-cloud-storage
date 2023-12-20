/* eslint-disable no-console */
import * as React from 'react'
import { upload } from '@vercel/blob/client'
import { useAllFormFields, reduceFieldsToValues } from 'payload/components/forms'
import { useConfig } from 'payload/components/utilities'

import type { CustomSaveButtonProps } from 'payload/types'

// custom react component, client-side.
export const VercelUploadComponent: CustomSaveButtonProps = ({
  props,
  label,
  save,
  DefaultButton,
}) => {
  const [fields] = useAllFormFields()
  const formData = reduceFieldsToValues(fields, true)

  const payloadConfig = useConfig()
  const optionalUrlPrefix = payloadConfig.custom.vercelConfig.optionalUrlPrefix
  const payloadServerUrl = payloadConfig.serverURL

  const handleFormSubmit = async () => {
    console.log('formData', formData.file)
    const originalFileName = await formData.file.name
    const fileName = `${
      optionalUrlPrefix ? `${optionalUrlPrefix}/${originalFileName}` : originalFileName
    }`

    const reader = new FileReader()
    reader.readAsArrayBuffer(formData.file)
    reader.onload = async event => {
      const fileData = event.target.result

      try {
        const blobResult = await upload(fileName, fileData, {
          access: 'public',
          handleUploadUrl: `${payloadServerUrl}/api/media/vercel-upload`,
          contentType: formData.file.type,
          clientPayload: 'hello-from-upload',
        })

        if (!blobResult) {
          throw new Error()
        }

        console.log('blobResult', blobResult)
        // save to local DB after blob result has generated
        save()
      } catch (error) {
        console.log('error uploading blob to vercel', error)
      }
    }
  }

  return <DefaultButton props={props} label={label} save={handleFormSubmit} />
}
