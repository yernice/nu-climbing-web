import { getDoc, imageUrl, listDocs, paragraphs } from './client.js'

const pad = n => String(n).padStart(2, '0')

// Backend document -> the shape the pages use. card_date: 29.08.2026
function toPost(doc) {
    const date = new Date(doc.publishedAt)
    return {
        id: doc.id,
        title: doc.title,
        image: imageUrl(doc.image),
        card_date: `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`,
        text: paragraphs(doc.body),
    }
}

// Newest first.
export async function getPosts() {
    return (await listDocs('posts', { sort: '-publishedAt' })).map(toPost)
}

export async function getLatestPost() {
    return (await getLatestPosts(1))[0] ?? null
}

export async function getLatestPosts(count) {
    return (await listDocs('posts', { sort: '-publishedAt', limit: count })).map(toPost)
}

export async function getPost(id) {
    const doc = await getDoc('posts', id)
    return doc ? toPost(doc) : null
}
