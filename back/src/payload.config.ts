import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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

const serverURL = process.env.SERVER_URL || 'http://localhost:3000'
const frontURL = process.env.FRONT_URL || 'http://localhost:5173'

export default buildConfig({
  // Makes image URLs absolute (http://localhost:3000/api/media/file/...), so the React site can show them.
  serverURL,
  // The React site runs on another port, so the browser must be allowed to call this API.
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
    // Payload's tables live in their own schema, apart from anything else in the nu_climbing database.
    schemaName: 'payload',
  }),
  upload: {
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per image
  },
  sharp,
  onInit: async (payload) => {
    await addRegistrationGuards(payload)
  },
  plugins: [],
})
