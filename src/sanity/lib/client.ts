import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, token } from '../env'

export const client = createClient({
  projectId: 'en8led0l',
  dataset: 'production',
  apiVersion: "2023-10-10",
  token: 'skbAeNWI4yQzcdm09vjPPBKtbJjPvJR0yNp19kTUoU1KTo1g2eiJJy90NYYkqvKmDGoIJn88vNdBoBoQzcCNeVUdN1lFHWHAvMFazrkkXWjnzT7FDLWA5eMD6xxFr1orneqa6gp8xWn88NOkjaBvIxaku9vXmx66jsUfkYYgPFXOPDJTImTk',
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
})