export function isPast(event) {
    return new Date(event.startDate) < new Date()
}

export function isFull(event) {
    return event.registered >= event.capacity
}

// 'past' | 'full' | 'open': the single rule used by cards and event pages.
export function getRegistrationState(event) {
    if (isPast(event)) return 'past'
    if (isFull(event)) return 'full'
    return 'open'
}

export const registrationLabels = { past: "PAST", full: "FULL", open: "REGISTER" }

const pad = n => String(n).padStart(2, '0')

// 29.08.2026, 09:00
export function formatEventTime(event) {
    const date = new Date(event.startDate)
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}, ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function formatSlots(event) {
    return `${event.registered} / ${event.capacity}`
}
