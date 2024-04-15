import { memo, useState } from 'react'
import {
  Group,
  Text,
  Button,
  Stack,
  BackgroundImage,
  Center,
  Space,
} from '@mantine/core'
import { Dropzone, FileWithPath } from '@mantine/dropzone'
import { IconPencil, IconPlus } from '@tabler/icons-react'
import cx from 'clsx'

import { handleError } from 'utils'

import classes from './index.module.css'
import { productApi } from 'resources/product'
import queryClient from 'query-client'

const ONE_MB_IN_BYTES = 1048576

const ProductPhotoUpload = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { mutate: uploadProductPhoto } = productApi.useUploadProductPhoto<
    FormData
  >()

  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const isFileSizeCorrect = (file: any) => {
    if (file.size / ONE_MB_IN_BYTES > 2) {
      setErrorMessage('Sorry, you cannot upload a file larger than 2 MB.')
      return false
    }
    return true
  }

  const isFileFormatCorrect = (file: FileWithPath) => {
    if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.type))
      return true
    setErrorMessage('Sorry, you can only upload JPG, JPEG or PNG photos.')
    return false
  }

  const handleProductPhotoUpload = async ([imageFile]: FileWithPath[]) => {
    setErrorMessage(null)

    if (
      isFileFormatCorrect(imageFile) &&
      isFileSizeCorrect(imageFile) &&
      imageFile
    ) {
      const body = new FormData()
      body.append('file', imageFile, imageFile.name)

      uploadProductPhoto(body, {
        onSuccess: async (data) => {
          const product = (await queryClient.getQueryData([
            'productUrl',
          ])) as any

          // console.log("data", data);

          if (product) {
            await setImageUrl(product.url)
            // console.log("imageUrl", product.url);
          }
        },
        onError: (err) => handleError(err),
      })
    }
  }

  return (
    <>
      <Stack>
        <Group align="flex-start" gap={32}>
          <Stack align="center" gap={10}>
            <Dropzone
              name="avatarUrl"
              accept={['image/png', 'image/jpg', 'image/jpeg']}
              onDrop={handleProductPhotoUpload}
              classNames={{
                root: classes.dropzoneRoot,
              }}
            >
              <label
                className={cx(classes.browseButton, {
                  [classes.error]: errorMessage,
                })}
              >
                {imageUrl ? (
                  <BackgroundImage
                    className={classes.avatar}
                    w={135}
                    h={135}
                    src={imageUrl}
                  >
                    <Center
                      className={classes.innerAvatar}
                      w="100%"
                      h="100%"
                      bg="#10101099"
                      c="gray.2"
                    >
                      <IconPencil />
                    </Center>
                  </BackgroundImage>
                ) : (
                  <BackgroundImage
                    className={classes.addIcon}
                    w={135}
                    h={135}
                    src={
                      'https://res.cloudinary.com/bhatiya-bhargav/image/upload/v1713178243/Shopy/public/Cover-img.png.png'
                    }
                  ></BackgroundImage>
                )}
              </label>
            </Dropzone>

            {imageUrl && (
              <Button
                type="submit"
                variant="subtle"
                onClick={() => setImageUrl(null)}
                size="sm"
              >
                Remove
              </Button>
            )}
          </Stack>

          <Stack
            gap={4}
            pt={6}
            style={{
              justifyContent: 'center',
              alignItems: 'flex-start',
              height: '80px',
            }}
          >
            <Text size="sm" c="gray">
              Upload product photo
            </Text>
            <Text size="xs" c="gray">
              Recommended size: 400x400 pixels
            </Text>
          </Stack>
        </Group>
      </Stack>
      {!!errorMessage && <p className={classes.errorMessage}>{errorMessage}</p>}
      <Space h="md" />
    </>
  )
}

export default memo(ProductPhotoUpload)
