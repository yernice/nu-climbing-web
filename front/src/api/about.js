import { getGlobal, imageUrl, paragraphs } from './client.js'

// The About page, edited under "About page" in the admin. Null if the backend is unreachable.
export async function getAbout() {
    const doc = await getGlobal('about')
    if (!doc) return null
    return {
        title: doc.title || 'About Us',
        image: doc.image ? imageUrl(doc.image) : null,
        text: paragraphs(doc.intro),
        facts: (doc.facts ?? []).map(fact => ({ id: fact.id, value: fact.value, label: fact.label })),
        motto: doc.motto ?? '',
        activities: (doc.activities ?? []).map(activity => ({
            id: activity.id,
            title: activity.title,
            text: activity.text,
        })),
        schedule: (doc.schedule ?? []).map(item => ({
            id: item.id,
            day: item.day,
            time: item.time,
            place: item.place ?? '',
        })),
        team: (doc.team ?? []).map(person => ({
            id: person.id,
            name: person.name,
            role: person.role ?? '',
            photo: person.photo ? imageUrl(person.photo) : null,
        })),
        links: {
            instagram: doc.links?.instagram ?? '',
            telegram: doc.links?.telegram ?? '',
            email: doc.links?.email ?? '',
        },
    }
}
