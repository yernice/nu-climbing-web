import type { CollectionConfig } from 'payload'
import { anyone } from '../access'
import { imageField, titleField } from '../fields'

export const Courses: CollectionConfig = {
  slug: 'courses',
  labels: { singular: 'Course', plural: 'Courses' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'updatedAt'] },
  defaultSort: '-createdAt',
  access: { read: anyone },
  fields: [
    titleField,
    { name: 'description', type: 'textarea', required: true, maxLength: 2000, admin: { rows: 4 } },
    imageField,
    {
      name: 'materials',
      type: 'array',
      labels: { singular: 'Material', plural: 'Materials' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'type',
              type: 'select',
              required: true,
              defaultValue: 'reading',
              options: [
                { label: 'Reading', value: 'reading' },
                { label: 'Video', value: 'video' },
              ],
              admin: { width: '25%' },
            },
            { name: 'title', type: 'text', required: true, maxLength: 200, admin: { width: '75%' } },
          ],
        },
        {
          name: 'url',
          label: 'Link',
          type: 'text',
          required: true,
          // Links show up on the public site: only real web addresses (no javascript: etc.).
          validate: (value: string | null | undefined) =>
            /^https?:\/\//i.test(value ?? '') || 'Must start with http:// or https://',
        },
      ],
    },
  ],
}
