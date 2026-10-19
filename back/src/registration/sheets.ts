import type { CollectionAfterChangeHook, Payload } from 'payload'

// Sends a copy of each new registration to a Google Sheet through the Apps Script web app in
// back/google-sheets/registrations.gs. The database stays the real record: if Google is down,
// the registration is still saved and only the copy is missed (a warning is logged).

const astanaDate = new Intl.DateTimeFormat('ru-RU', {
  timeZone: 'Asia/Almaty',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})
const astanaDateTime = new Intl.DateTimeFormat('ru-RU', {
  timeZone: 'Asia/Almaty',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export const sheetsConnected = () =>
  Boolean(process.env.SHEETS_WEBHOOK_URL?.trim() && process.env.SHEETS_SECRET?.trim())

type RegistrationDoc = {
  id: number
  event: number | { id: number }
  name: string
  email: string
  phone: string
  createdAt: string
}

async function sendToSheet(payload: Payload, doc: RegistrationDoc): Promise<void> {
  const url = process.env.SHEETS_WEBHOOK_URL?.trim()
  const secret = process.env.SHEETS_SECRET?.trim()
  if (!url || !secret) return

  try {
    const eventId = typeof doc.event === 'object' ? doc.event.id : doc.event
    const event = await payload.findByID({ collection: 'events', id: eventId, depth: 0, overrideAccess: true })
    // Apps Script answers with a redirect to the result; fetch follows it.
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        id: doc.id,
        event: event.title,
        eventDate: astanaDate.format(new Date(event.startAt)),
        registeredAt: astanaDateTime.format(new Date(doc.createdAt)),
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
      }),
      signal: AbortSignal.timeout(30_000),
    })
    const text = await response.text()
    const ok = response.ok && (() => { try { return JSON.parse(text).ok === true } catch { return false } })()
    if (ok) payload.logger.info(`Google Sheets: copied registration ${doc.id}`)
    else payload.logger.warn(`Google Sheets: registration ${doc.id} not copied (HTTP ${response.status}): ${text.slice(0, 200)}`)
  } catch (error) {
    payload.logger.warn(`Google Sheets: registration ${doc.id} not copied: ${String(error)}`)
  }
}

// Runs after a registration is created; the copy is sent in the background so the visitor
// never waits for Google.
export const copyToGoogleSheets: CollectionAfterChangeHook = ({ doc, operation, req }) => {
  if (operation === 'create') void sendToSheet(req.payload, doc as RegistrationDoc)
  return doc
}
