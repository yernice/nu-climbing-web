import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Courses } from './collections/Courses'
import { Events } from './collections/Events'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { Registrations } from './collections/Registrations'
import { Users } from './collections/Users'
import { addRegistrationGuards } from './database/registrationGuards'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// On Vercel, fall back to the project's production address if SERVER_URL is not set.
const serverURL =
  process.env.SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')
const frontURL = process.env.FRONT_URL || 'http://localhost:5173'

export default buildConfig({
  // Makes image URLs absolute (http://localhost:3000/api/media/file/...), so the React site can show them.
  serverURL,
  // The React site runs on another address, so the browser must be allowed to call this API.
  cors: [frontURL],
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' | NU Climbing admin' },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Posts, Projects, Events, Registrations, Courses, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Payload's tables live in their own schema, apart from anything else in the database.
    schemaName: 'payload',
    // Production creates and changes tables only through src/migrations (`payload migrate`).
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  upload: {
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per image
  },
  sharp,
  // In development Payload creates tables automatically ("push"), so the registration guards are
  // added here. In production they come from the migration in src/migrations.
  onInit: async (payload) => {
    if (process.env.NODE_ENV !== 'production') await addRegistrationGuards(payload)
  },
  plugins: [
    // On Vercel the disk is temporary, so images go to Vercel Blob. Without BLOB_READ_WRITE_TOKEN
    // (your computer) images stay in back/media as before.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      token: process.env.BLOB_READ_WRITE_TOKEN,
      collections: { media: true },
      // Vercel refuses requests over 4.5 MB, so the admin's browser uploads images straight to Blob.
      clientUploads: true,
      // Same database columns with and without Blob, so one migration fits every environment.
      alwaysInsertFields: true,
    }),
  ],
})
