import type { CollectionConfig } from 'payload'
import { anyone } from '../access'
import { bodyField, imageField, titleField } from '../fields'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Project', plural: 'Projects' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'updatedAt'] },
  defaultSort: '-createdAt',
  access: { read: anyone },
  fields: [titleField, imageField, bodyField()],
}
