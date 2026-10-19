import type { CollectionConfig } from 'payload'

// The club has exactly one admin. The "create first user" screen on /admin works once;
// after that nobody can add or delete accounts (the admin can still change their own password).
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Admin', plural: 'Admins' },
  admin: { useAsTitle: 'email' },
  auth: {
    // 5 wrong passwords lock the account for 15 minutes.
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
  },
  access: {
    create: async ({ req }) =>
      (await req.payload.count({ collection: 'users', overrideAccess: true })).totalDocs === 0,
    delete: () => false,
  },
  fields: [],
}
