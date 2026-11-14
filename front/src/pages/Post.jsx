import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPost } from '../api/posts.js'
import styles from './Post.module.css'

function Post() {
    const { id } = useParams()
    const [loaded, setLoaded] = useState({ id: null, post: null })

    useEffect(() => {
        let ignore = false
        getPost(id).then(post => {
            if (!ignore) setLoaded({ id, post })
        })
        return () => { ignore = true }
    }, [id])

    if (loaded.id !== id) return <main className="page" />

    const post = loaded.post

    if (!post) {
        return (
            <main className="page">
                <Link to="/blog" className={styles.back}>← Back to blog</Link>
                <h1>Post not found</h1>
            </main>
        )
    }

    return (
        <main className="page">
            <Link to="/blog" className={styles.back}>← Back to blog</Link>
            <h1>{post.title}</h1>
            <span className={styles.date}>{post.card_date}</span>
            <img src={post.image} alt={post.title} className={styles.image} />
            {/* Formatted text from the admin editor; the backend builds this HTML and escapes it. */}
            <div className={styles.text} dangerouslySetInnerHTML={{ __html: post.html }} />
        </main>
    );
}

export default Post
