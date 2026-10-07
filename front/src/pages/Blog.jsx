import { useEffect, useState } from 'react'
import Card from '../Components/Card/Card.jsx'
import { getPosts, getLatestPost } from '../api/posts.js'
import { makeIntro } from '../utils/excerpt.js'

function Blog() {
    const [posts, setPosts] = useState([])
    const [latest, setLatest] = useState(null)

    useEffect(() => {
        getPosts().then(setPosts)
        getLatestPost().then(setLatest)
    }, [])

    return (
        <>
            <main className="page">
                <h1>Our Blog</h1>
                <div className="card-grid">
                    {posts.map(post => (
                        <Card
                            key={post.id}
                            to={`/blog/${post.id}`}
                            cardTitle={post.title}
                            cardImage={post.image}
                            cardDate={post.card_date}
                            cardText={makeIntro(post.text)}
                        />
                    ))}
                </div>
            </main>
        </>
    );
}

export default Blog
