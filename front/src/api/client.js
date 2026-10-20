import defaultImage from '../assets/default_image.jpg'

// Address of the backend (back/). On Vercel, set VITE_API_URL to the backend's address.
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// GET /api/<path> on the backend. Null if the backend is unreachable or answers with an error.
async function fetchJson(path) {
    try {
        const response = await fetch(`${API_URL}/api/${path}`)
        if (!response.ok) return null
        return await response.json()
    } catch (error) {
        console.warn(`Could not load ${path} from ${API_URL}. Is the backend running?`, error)
        return null
    }
}

// A list from a collection, e.g. listDocs('posts', { sort: '-publishedAt', limit: 4 })
export async function listDocs(collection, params = {}) {
    const query = new URLSearchParams({ depth: 1, limit: 1000, ...params })
    const result = await fetchJson(`${collection}?${query}`)
    return result?.docs ?? []
}

// One document by id, or null if it does not exist.
export async function getDoc(collection, id) {
    return fetchJson(`${collection}/${encodeURIComponent(id)}?depth=1`)
}

// The admin types paragraphs separated by an empty line; the pages expect an array of paragraphs.
export function paragraphs(text) {
    return (text ?? '').split(/\r?\n\s*\r?\n/).map(paragraph => paragraph.trim()).filter(Boolean)
}

// Uploaded image of a post, event, ... or the default picture if there is none.
export function imageUrl(image) {
    const url = image?.url
    if (!url) return defaultImage
    return url.startsWith('/') ? API_URL + url : url
}
