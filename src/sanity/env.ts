export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-1'

export const dataset = assertValue(
  'production',
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const token = assertValue(
  'skbAeNWI4yQzcdm09vjPPBKtbJjPvJR0yNp19kTUoU1KTo1g2eiJJy90NYYkqvKmDGoIJn88vNdBoBoQzcCNeVUdN1lFHWHAvMFazrkkXWjnzT7FDLWA5eMD6xxFr1orneqa6gp8xWn88NOkjaBvIxaku9vXmx66jsUfkYYgPFXOPDJTImTk',
  'Missing environment variable: NEXT_PUBLIC_SANITY_API_TOKEN,'
)

export const projectId = assertValue(
  "en8led0l",
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}