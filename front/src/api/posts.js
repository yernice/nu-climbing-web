import posts from '../assets/posts.js'

// Mock data layer. When the backend is ready, replace the bodies with fetch calls.
export async function getPosts() {
    return posts
}

// Posts have no real timestamp yet, so the highest id counts as the latest.
export async function getLatestPost() {
    return posts.reduce((latest, post) => (!latest || post.id > latest.id ? post : latest), null)
}

export async function getLatestPosts(count) {
    return [...posts].sort((a, b) => b.id - a.id).slice(0, count)
}

export async function getPost(id) {
    return posts.find(post => post.id === Number(id)) ?? null
}
