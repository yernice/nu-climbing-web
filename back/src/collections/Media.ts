import path from 'path'
import type { CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'
import { anyone } from '../access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Image', plural: 'Images' },
  admin: { description: 'Photos for posts, projects, events and courses.' },
  access: { read: anyone },
  upload: {
    // back/media (gitignored): back it up together with the database.
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  fields: [{ name: 'alt', label: 'Short description (for screen readers)', type: 'text' }],
}
