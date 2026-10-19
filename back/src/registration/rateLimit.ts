// At most 20 registration requests per IP in 10 minutes, against scripts filling events with fake
// sign-ups. Generous on purpose: many students on the campus network can share one IP address.
// Kept in memory, so it assumes one server process (a restart clears it).

const MAX_REQUESTS = 20
const WINDOW_MS = 10 * 60 * 1000

const windows = new Map<string, { startedAt: number; requests: number }>()

export function allowRegistrationFrom(ip: string): boolean {
  const now = Date.now()
  const current = windows.get(ip)
  if (!current || now - current.startedAt > WINDOW_MS) {
    windows.set(ip, { startedAt: now, requests: 1 })
    return true
  }
  current.requests += 1
  return current.requests <= MAX_REQUESTS
}

// The visitor's address. Next.js sets x-forwarded-for to the real address only when the request
// has no such header, and passes a visitor's own value through unchanged. So in production the
// server must sit behind a reverse proxy (nginx, Caddy, the hosting platform) that appends the
// real address: the last entry is then the one our own infrastructure added and can be trusted.
// Exposed directly, a visitor could send a fake header to get a fresh limit.
export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  return forwarded?.split(',').pop()?.trim() || 'unknown'
}
