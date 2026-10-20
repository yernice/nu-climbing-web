// Build command on Vercel (see vercel.json). Database migrations run only for production
// deployments, so a preview of an unfinished branch can never change the real database.
import { execSync } from 'node:child_process'

const run = (command) => execSync(command, { stdio: 'inherit' })

if (process.env.VERCEL_ENV === 'production') {
  run('npm run payload -- migrate')
} else {
  console.log(`Skipping database migrations (VERCEL_ENV=${process.env.VERCEL_ENV ?? 'not set'}).`)
}
run('npm run build')
