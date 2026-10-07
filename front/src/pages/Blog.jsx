import { useEffect, useState } from 'react'
import Card from '../Components/Card/Card.jsx'
import Hero from '../Components/Hero/Hero.jsx'
import { getPosts, getLatestPost } from '../api/posts.js'
import styles from './Blog.module.css'

const INTRO_LENGTH = 150

function makeIntro(paragraphs) {
    const text = paragraphs[0] ?? ""
    if (text.length <= INTRO_LENGTH) return text
    return text.slice(0, INTRO_LENGTH).replace(/\s+\S*$/, "") + "…"
}

function Blog() {
    const [posts, setPosts] = useState([])
    const [latest, setLatest] = useState(null)

    useEffect(() => {
        getPosts().then(setPosts)
        getLatestPost().then(setLatest)
    }, [])

    return (
        <>
            {latest && (
                <Hero
                    heroImage={latest.image}
                    heroTitle={latest.title}
                    heroText={makeIntro(latest.text)}
                    buttonText="READ MORE"
                    buttonLink={`/blog/${latest.id}`}
                />
            )}
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
        </>
    );
}

export default Blog
