import type { Field } from 'payload'

export const titleField: Field = { name: 'title', type: 'text', required: true, maxLength: 200 }

export const imageField: Field = { name: 'image', type: 'upload', relationTo: 'media' }

// The long text of posts, projects and events is rich text: see richText.ts.
export { bodyFields } from './richText'
