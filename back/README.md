# NU Climbing backend (Payload CMS)

[Payload](https://payloadcms.com) 3 on Next.js, with PostgreSQL. It gives the club:

- an **admin panel** at http://localhost:3000/admin for blog posts, projects, events, courses and images,
  and the list of people who registered for events;
- the **API** the React site in `front/` reads (posts, events, ...);
- the **event registration endpoint**, with an optional copy of every registration in a Google Sheet.

## Setup (once)

1. **Node.js 20.18+** (`node --version`).
2. **Database.** PostgreSQL with a `nu_climbing` database and a `climbing_app` login that owns it
   (created earlier with `psql -U postgres`: `CREATE ROLE climbing_app LOGIN PASSWORD '...';`
   `CREATE DATABASE nu_climbing OWNER climbing_app;`). Payload creates its own tables in a
   `payload` schema inside that database on the first start.
3. **Secrets.** Copy `.env.example` to `.env` (gitignored) and fill in `DATABASE_URL` and
   `PAYLOAD_SECRET`.
4. `npm install`

## Run

```
npm run dev
```

Open http://localhost:3000/admin. The first time, Payload asks you to **create the admin account**.
The club has one admin: after that account exists nobody can add or delete accounts (you can still
change your own password). Five wrong passwords lock the account for 15 minutes.

The React site (`npm run dev` in `front/`, http://localhost:5173) loads its content from here.

## Example content

```
npm run seed     # adds example posts, projects, events and courses with placeholder images
npm run unseed   # removes exactly those examples; your own content is never touched
```

## What is where

| Path | What |
|---|---|
| `src/payload.config.ts` | Main config: collections, database, CORS for the site, image size limit |
| `src/collections/` | One file per collection (fields, who can read/edit, admin columns) |
| `src/registration/` | Registration endpoint, validation rules, rate limit, Google Sheets copy |
| `src/database/registrationGuards.ts` | PostgreSQL trigger that refuses registrations for a full event |
| `src/seed/` | Example content and its placeholder images |
| `src/migrations/` | Database changes for production (see "Changing collections later") |
| `vercel.json`, `scripts/vercel-build.mjs` | Vercel build: migrations (production only), then `next build` |
| `google-sheets/registrations.gs` | Apps Script for the Google Sheet |
| `media/` | Uploaded images on your computer (gitignored). On Vercel they go to Vercel Blob |

Text fields (`body`) are plain text with paragraphs separated by an empty line. An event's
"registered" number is counted from the registrations, never stored. Deleting an event also
deletes its registrations.

## Public API

Everything the site shows is readable without login, e.g. `GET /api/posts`, `/api/events`,
`/api/projects`, `/api/courses` (Payload's [REST API](https://payloadcms.com/docs/rest-api/overview)).
Registrations are admin-only.

### Registering for an event

```
POST /api/events/{id}/register
Content-Type: application/json

{"name": "Aruzhan", "email": "aruzhan@nu.edu.kz", "phone": "+7 701 000 0000"}
```

| Answer | When |
|---|---|
| `201 {"status": "registered", "id": 12}` | Saved |
| `422 {"errors": {"email": "Use your @nu.edu.kz email."}}` | A field is empty or invalid (same messages as the site's form) |
| `409 {"error": "...", "code": "full"}` | No places left (`code` is `past` if the event has started, `duplicate` if the email is already registered) |
| `404` / `415` / `429` | No such event / body is not JSON / more than 20 requests from one IP in 10 minutes |

The database itself enforces the important rules, even if two people press Register at the same
moment: a trigger refuses the registration once the event is full, and a unique index allows one
registration per email per event.

The rate limit reads the visitor's address from `X-Forwarded-For`. In production, run the server
behind a reverse proxy (nginx, Caddy or the hosting platform) that sets that header; Next.js alone
trusts whatever a visitor sends.

## Google Sheets copy of registrations (optional)

Every new registration can also appear in a Google Sheet, one tab per event. The database stays
the real record: deleting someone in the admin panel does not delete them from the sheet, and if
Google is unreachable the registration is still saved (the server log says "not copied").

1. Create a Google Sheet, e.g. "NU Climbing registrations".
2. In the sheet: **Extensions > Apps Script**. Delete the sample code and paste
   [`google-sheets/registrations.gs`](google-sheets/registrations.gs).
3. Replace the `SECRET` value with `SHEETS_SECRET` from `.env`, then save (Ctrl+S).
4. **Deploy > New deployment**, gear icon > **Web app**. Execute as: **Me**. Who has access:
   **Anyone** (the secret is what keeps others out). Click **Deploy** and allow access. Google warns
   that the app is unverified because it is your own script: **Advanced > Go to ... (unsafe)**.
5. Put the **Web app URL** (ends with `/exec`) in `.env` as `SHEETS_WEBHOOK_URL` and restart
   `npm run dev`.

After changing the script, deploy again with **Manage deployments > Edit > New version**, or the
old code keeps running.

## Changing collections later (database migrations)

On your computer Payload changes the tables by itself (`npm run dev`). Production only changes them
through files in `src/migrations`. So after you add or change a field:

```
npm run payload -- migrate:create describe-the-change
```

Commit the new file in `src/migrations` together with your change. Vercel runs it on the next
production deploy. Do not run `payload migrate` on your computer: your local tables were made by
`npm run dev` and Payload would ask confusing questions.

## Deploying to Vercel

The site and the backend are two Vercel projects from the same GitHub repository.

**Before the first deploy:** the React site builds from git alone: `front/src/api/*.js` load
everything from the backend, and `front/src/assets/` (no longer gitignored) holds `default_image.jpg`.
The fonts (`front/src/assets/fonts/Tanker-Regular.otf`, `BespokeSerif-Regular.otf`, free from
fontshare.com) are still missing: the site builds and works without them, but shows default fonts.

**1. Backend project**
1. On vercel.com: **Add New > Project**, import the repository, set **Root Directory** to `back`.
   Framework is detected as Next.js. The build command comes from `back/vercel.json`.
2. Before deploying, open the project's **Storage** tab:
   - **Create Database > Neon (Postgres)**, region **Frankfurt**, connect it to this project.
     This sets `DATABASE_URL`.
   - **Create > Blob**, connect it to this project. This sets `BLOB_READ_WRITE_TOKEN`.
3. **Settings > Environment Variables** (Production):
   - `PAYLOAD_SECRET`: a new long random string (see `.env.example`), not the one on your computer.
   - `SHEETS_WEBHOOK_URL`, `SHEETS_SECRET`: the same as in your local `.env`, if you use Google Sheets.
   - `SERVER_URL` is optional: by default the project's own `https://...vercel.app` address is used.
4. **Settings > Functions > Region**: Frankfurt (`fra1`), next to the database.
5. **Deploy.** The build creates the tables (`payload migrate`) and builds the admin.
6. Open `https://<backend>.vercel.app/admin` and create the admin account.

**2. Site project**
1. **Add New > Project**, the same repository, **Root Directory** `front`. Framework: Vite.
2. Environment variable `VITE_API_URL` = `https://<backend>.vercel.app` (no slash at the end).
3. **Deploy.** `front/vercel.json` makes links like `/blog/5` work when opened directly.
   The backend lets any website read its public data, so nothing else needs to point at the site.

**3. Check**
- The site shows content you add in the admin; images load.
- A registration succeeds, appears under **Registrations** and in the Google Sheet; the same email
  twice is refused.

**Good to know on Vercel**
- Every push to `main` redeploys. Other branches get preview deployments; they do **not** run
  migrations, so an unfinished branch can never change the real database.
- After a quiet period the first request is slower (the function starts up).
- The "20 registrations per IP" limit is only approximate there (see `src/registration/rateLimit.ts`);
  full events and duplicate emails are still refused by the database.
- Images live in the Blob store; the database lives in Neon. Back up with Neon's built-in history
  (point-in-time restore) and, before big changes, a `pg_dump` of `DATABASE_URL`.
- Vercel's free Hobby plan is for non-commercial use, and Vercel and Neon have no servers in
  Kazakhstan: check with the university that registrations (names, phones) may be stored abroad.
