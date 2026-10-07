import { useEffect, useState } from 'react'
import Card from '../Components/Card/Card.jsx'
import { getPosts } from '../api/posts.js'
import styles from './Blog.module.css'

function Blog() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        getPosts().then(setPosts)
    }, [])

    return (
        <main className="page">
            <h1>Our Blog</h1>
            <div className={styles.feed}>
                {posts.map(post => (
                    <Card
                        key={post.id}
                        to={`/blog/${post.id}`}
                        cardTitle={post.title}
                        cardImage={post.image}
                        cardDate={post.card_date}
                    />
                ))}
            </div>
        </main>
    );
}

export default Blog
