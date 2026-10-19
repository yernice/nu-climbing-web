import { headersWithCors, type Endpoint, type PayloadRequest } from 'payload'
import { allowRegistrationFrom, clientIp } from './rateLimit'
import { checkRegistration } from './rules'

// POST /api/events/:id/register with JSON {"name", "email", "phone"} — what the site's
// registration form calls (the "future POST /events/:id/register" in front/src/api/events.js).
//
// 201 {"status": "registered", "id"}      saved
// 422 {"errors": {field: message}}        invalid fields (same messages as the site's form)
// 409 {"error", "code": "past"|"full"|"duplicate"}   codes match front/src/utils/events.js
// 404 no such event, 415 body is not JSON, 429 too many requests from one IP
//
// The database guarantees the important parts even if two requests arrive together:
// see database/registrationGuards.ts (capacity trigger) and the unique index in Registrations.ts.

function reply(req: PayloadRequest, body: object, status: number) {
  return Response.json(body, { status, headers: headersWithCors({ headers: new Headers(), req }) })
}

// Database errors arrive wrapped (Payload -> Drizzle -> PostgreSQL); look through the whole chain.
function errorText(error: unknown): string {
  const parts: string[] = []
  let current: unknown = error
  for (let depth = 0; current && depth < 5; depth++) {
    const e = current as { message?: string; code?: string; data?: unknown; cause?: unknown }
    parts.push(String(e.message ?? ''), String(e.code ?? ''), JSON.stringify(e.data ?? ''))
    current = e.cause
  }
  return parts.join(' ')
}

export const registerEndpoint: Endpoint = {
  path: '/:id/register',
  method: 'post',
  handler: async (req) => {
    if (!allowRegistrationFrom(clientIp(req.headers))) {
      return reply(req, { error: 'Too many registrations from your network. Try again in a few minutes.' }, 429)
    }
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return reply(req, { error: 'Send the registration as JSON.' }, 415)
    }

    let body: unknown
    try {
      body = await req.json?.()
    } catch {
      return reply(req, { error: 'Send the registration as JSON.' }, 400)
    }
    const checked = checkRegistration(body)
    if (!checked.ok) return reply(req, { errors: checked.errors }, 422)
    const { input } = checked

    const eventId = Number(req.routeParams?.id)
    const event = Number.isInteger(eventId)
      ? await req.payload.findByID({ collection: 'events', id: eventId, depth: 0, overrideAccess: true, disableErrors: true })
      : null
    if (!event) return reply(req, { error: 'Event not found.' }, 404)

    // Friendly answers first; the database checks again when saving.
    if (new Date(event.startAt) <= new Date()) {
      return reply(req, { error: 'Registration is closed: this event has already started.', code: 'past' }, 409)
    }
    const already = await req.payload.count({
      collection: 'registrations',
      where: { event: { equals: eventId }, email: { equals: input.email } },
      overrideAccess: true,
    })
    if (already.totalDocs > 0) {
      return reply(req, { error: 'This email is already registered for this event.', code: 'duplicate' }, 409)
    }
    if ((event.registered ?? 0) >= event.capacity) {
      return reply(req, { error: 'This event is full.', code: 'full' }, 409)
    }

    try {
      const saved = await req.payload.create({
        collection: 'registrations',
        data: { event: eventId, ...input },
        overrideAccess: true,
        depth: 0,
      })
      return reply(req, { status: 'registered', id: saved.id }, 201)
    } catch (error) {
      const text = errorText(error)
      if (text.includes('EVENT_FULL')) return reply(req, { error: 'This event is full.', code: 'full' }, 409)
      if (/23505|unique/i.test(text)) {
        return reply(req, { error: 'This email is already registered for this event.', code: 'duplicate' }, 409)
      }
      req.payload.logger.error({ err: error, msg: 'Registration failed' })
      return reply(req, { error: 'Could not save the registration. Please try again.' }, 500)
    }
  },
}
