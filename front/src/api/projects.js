import { getDoc, imageUrl, listDocs, paragraphs } from './client.js'

// Backend document -> the shape the pages use.
function toProject(doc) {
    return {
        id: doc.id,
        title: doc.title,
        image: imageUrl(doc.image),
        text: paragraphs(doc.body),
    }
}

// Newest first.
export async function getProjects() {
    return (await listDocs('projects', { sort: '-createdAt' })).map(toProject)
}

export async function getLatestProject() {
    const [latest] = await listDocs('projects', { sort: '-createdAt', limit: 1 })
    return latest ? toProject(latest) : null
}

export async function getProject(id) {
    const doc = await getDoc('projects', id)
    return doc ? toProject(doc) : null
}
