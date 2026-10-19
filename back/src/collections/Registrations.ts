import type { CollectionConfig } from 'payload'
import { copyToGoogleSheets } from '../registration/sheets'
import { emailError, nameError, normalizeEmail, phoneError } from '../registration/rules'

// Only the logged-in admin can read or change registrations (Payload's default access).
// Visitors register through POST /api/events/:id/register (registration/registerEndpoint.ts).
export const Registrations: CollectionConfig = {
  slug: 'registrations',
  labels: { singular: 'Registration', plural: 'Registrations' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'event', 'createdAt'],
    listSearchableFields: ['name', 'email', 'phone'],
    description:
      'People who registered on the site. When Google Sheets is connected, new ones are copied there too (deleting here does not delete there).',
  },
  defaultSort: '-createdAt',
  // One registration per email per event. Emails are stored in lower case (see the email field).
  indexes: [{ fields: ['event', 'email'], unique: true }],
  fields: [
    { name: 'event', type: 'relationship', relationTo: 'events', required: true, index: true },
    {
      name: 'name',
      type: 'text',
      required: true,
      validate: (value: string | null | undefined) => nameError((value ?? '').trim()) ?? true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      hooks: { beforeValidate: [({ value }) => (typeof value === 'string' ? normalizeEmail(value) : value)] },
      validate: (value: string | null | undefined) => emailError(value ?? '') ?? true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      validate: (value: string | null | undefined) => phoneError((value ?? '').trim()) ?? true,
    },
  ],
  hooks: { afterChange: [copyToGoogleSheets] },
}
