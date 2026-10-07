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

// Mock for the future POST /events/:id/register. The backend must enforce
// capacity, past events and duplicate emails itself.
export async function registerForEvent(id, data) {
    void id
    void data
    return { status: 'registered' }
}
