import type { Field } from 'payload'

export const titleField: Field = { name: 'title', type: 'text', required: true, maxLength: 200 }

export const imageField: Field = { name: 'image', type: 'upload', relationTo: 'media' }

// Plain text, one paragraph per block. The site splits it on empty lines (front/src/assets/cms.js).
export const bodyField = (label = 'Text'): Field => ({
  name: 'body',
  label,
  type: 'textarea',
  required: true,
  admin: { rows: 14, description: 'Separate paragraphs with an empty line.' },
})
