import events from '../assets/events.js'
import { isPast } from '../utils/events.js'

// Mock data layer. When the backend is ready, replace the bodies with fetch calls.

// Upcoming events soonest first, then past events most recent first.
export async function getEvents() {
    const byDate = (a, b) => new Date(a.startDate) - new Date(b.startDate)
    const upcoming = events.filter(event => !isPast(event)).sort(byDate)
    const past = events.filter(isPast).sort((a, b) => byDate(b, a))
    return [...upcoming, ...past]
}

// The soonest event that has not started yet, or null.
export async function getNextEvent() {
    const upcoming = await getEvents()
    return upcoming.find(event => !isPast(event)) ?? null
}

export async function getEvent(id) {
    return events.find(event => event.id === Number(id)) ?? null
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// POST /api/events/:id/register on the backend (back/), which checks capacity, past events
// and duplicate emails again. Resolves to { status: 'registered' } or
// { status: 'error', error, errors }, where errors has field messages like validate().
export async function registerForEvent(id, data) {
    try {
        const response = await fetch(`${API_URL}/api/events/${id}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        const body = await response.json()
        if (response.ok) return { status: 'registered' }
        return { status: 'error', error: body.error, errors: body.errors ?? {} }
    } catch {
        return { status: 'error', error: "Couldn't reach the server. Please try again.", errors: {} }
    }
}
