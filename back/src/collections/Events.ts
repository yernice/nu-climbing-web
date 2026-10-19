import type { CollectionBeforeDeleteHook, CollectionConfig, FieldHook } from 'payload'
import { anyone } from '../access'
import { bodyField, imageField, titleField } from '../fields'
import { registerEndpoint } from '../registration/registerEndpoint'

// `registered` is never stored: it is counted from the registrations every time an event is read.
const countRegistrations: FieldHook = async ({ data, req }) => {
  if (!data?.id) return 0
  const { totalDocs } = await req.payload.count({
    collection: 'registrations',
    where: { event: { equals: data.id } },
    overrideAccess: true,
    req,
  })
  return totalDocs
}

// Deleting an event also deletes its registrations. On its own the database would keep them
// with an empty event, i.e. people's names and phones attached to nothing.
const deleteRegistrations: CollectionBeforeDeleteHook = async ({ id, req }) => {
  await req.payload.delete({
    collection: 'registrations',
    where: { event: { equals: id } },
    overrideAccess: true,
    req,
  })
}

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'startAt', 'place', 'registered', 'capacity'] },
  defaultSort: '-startAt',
  access: { read: anyone },
  endpoints: [registerEndpoint],
  hooks: { beforeDelete: [deleteRegistrations] },
  fields: [
    titleField,
    imageField,
    {
      type: 'row',
      fields: [
        {
          name: 'startAt',
          label: 'Starts at',
          type: 'date',
          required: true,
          admin: { width: '50%', date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd.MM.yyyy HH:mm' } },
        },
        { name: 'capacity', type: 'number', required: true, min: 1, max: 10000, defaultValue: 20, admin: { width: '25%' } },
        {
          name: 'registered',
          type: 'number',
          virtual: true,
          admin: { width: '25%', readOnly: true, description: 'Counted from registrations' },
          hooks: { afterRead: [countRegistrations] },
        },
      ],
    },
    { name: 'place', type: 'text', required: true, maxLength: 200 },
    bodyField('Description'),
    {
      // Shows the event's registrations on its edit page. Admin only: names and phones are private.
      name: 'registrations',
      type: 'join',
      collection: 'registrations',
      on: 'event',
      access: { read: ({ req }) => Boolean(req.user) },
      admin: { defaultColumns: ['name', 'email', 'phone', 'createdAt'] },
    },
  ],
}
