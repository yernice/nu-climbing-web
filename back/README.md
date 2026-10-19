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
| `google-sheets/registrations.gs` | Apps Script for the Google Sheet |
| `media/` | Uploaded images (gitignored). Back it up together with the database |

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
