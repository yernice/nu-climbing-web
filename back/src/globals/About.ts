import type { GlobalConfig } from 'payload'

// Links show up on the public site: only real web addresses (no javascript: etc.).
const webLink = (value: string | null | undefined) =>
  !value || /^https?:\/\//i.test(value) || 'Must start with http:// or https://'

// The "About us" page: one document (a Payload "global"), edited under About page in the admin.
export const About: GlobalConfig = {
  slug: 'about',
  label: 'About page',
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true, defaultValue: 'About Us', maxLength: 200 },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'intro',
      label: 'Text',
      type: 'textarea',
      admin: { rows: 10, description: 'Who we are. Separate paragraphs with an empty line.' },
    },
    {
      name: 'facts',
      label: 'Key numbers',
      type: 'array',
      maxRows: 4,
      labels: { singular: 'Number', plural: 'Numbers' },
      admin: { description: 'Shown as a row of boxes under the text, e.g. "40+" / "members".' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'text', required: true, maxLength: 20, admin: { width: '35%', placeholder: '40+' } },
            { name: 'label', type: 'text', required: true, maxLength: 60, admin: { width: '65%', placeholder: 'members' } },
          ],
        },
      ],
    },
    {
      name: 'motto',
      type: 'text',
      maxLength: 200,
      admin: { description: 'One short sentence, shown as a big banner.', placeholder: 'We believe climbing is for everyone!' },
    },
    {
      name: 'activities',
      label: 'What we do',
      type: 'array',
      labels: { singular: 'Activity', plural: 'Activities' },
      fields: [
        { name: 'title', type: 'text', required: true, maxLength: 100 },
        { name: 'text', type: 'textarea', required: true, maxLength: 1000, admin: { rows: 4 } },
      ],
    },
    {
      name: 'schedule',
      label: 'Training schedule',
      type: 'array',
      labels: { singular: 'Training', plural: 'Trainings' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'day', type: 'text', required: true, admin: { width: '30%', placeholder: 'Tuesday' } },
            { name: 'time', type: 'text', required: true, admin: { width: '25%', placeholder: '19:00 - 21:00' } },
            { name: 'place', type: 'text', admin: { width: '45%', placeholder: 'NU Sports Center' } },
          ],
        },
      ],
    },
    {
      name: 'team',
      label: 'Board and contacts',
      type: 'array',
      labels: { singular: 'Person', plural: 'People' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'role', type: 'text', admin: { width: '50%', placeholder: 'President' } },
          ],
        },
        { name: 'photo', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'links',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text', validate: webLink, admin: { placeholder: 'https://instagram.com/...' } },
        { name: 'telegram', type: 'text', validate: webLink, admin: { placeholder: 'https://t.me/...' } },
        { name: 'email', type: 'email' },
      ],
    },
  ],
}
