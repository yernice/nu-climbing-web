import type { CollectionConfig } from 'payload'
import { anyone } from '../access'
import { bodyField, imageField, titleField } from '../fields'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Blog post', plural: 'Blog posts' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'publishedAt', 'updatedAt'] },
  defaultSort: '-publishedAt',
  access: { read: anyone },
  fields: [
    titleField,
    imageField,
    {
      name: 'publishedAt',
      label: 'Publish date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    bodyField(),
  ],
}
