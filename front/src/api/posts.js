import posts from '../assets/posts.js'

// Mock data layer. When the backend is ready, replace the bodies with fetch calls.
export async function getPosts() {
    return posts
}

export async function getPost(id) {
    return posts.find(post => post.id === Number(id)) ?? null
}
