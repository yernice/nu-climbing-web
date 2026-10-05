import Card from '../Components/Card/Card.jsx'
import posts from '../assets/posts.js'
import styles from './Blog.module.css'

function Blog() {

    return (
        <>
            <h1 className={styles.title}>Our Blog</h1>
            <div className={styles.feed}>
                    {posts.map(post => (
                        <Card
                            key={post.id}
                            cardTitle={post.title}
                            cardImage={post.image}
                        />
                    ))}
            </div>
        </>
    );
}

export default Blog