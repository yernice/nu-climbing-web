import { getDoc, imageUrl, listDocs } from './client.js'

// Backend document -> the shape the pages use.
function toCourse(doc) {
    return {
        id: doc.id,
        title: doc.title,
        description: doc.description,
        image: imageUrl(doc.image),
        materials: (doc.materials ?? []).map(material => ({
            id: material.id,
            type: material.type,
            title: material.title,
            url: material.url,
        })),
    }
}

// Newest first.
export async function getCourses() {
    return (await listDocs('courses', { sort: '-createdAt' })).map(toCourse)
}

export async function getLatestCourses(count) {
    return (await listDocs('courses', { sort: '-createdAt', limit: count })).map(toCourse)
}

export async function getCourse(id) {
    const doc = await getDoc('courses', id)
    return doc ? toCourse(doc) : null
}
