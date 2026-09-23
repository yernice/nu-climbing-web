import Card from '../Components/Card/Card.jsx'
import Navigation from '../Components/Navigation/Navigation.jsx'
import posts from '../assets/posts.js'
import styles from './Blog.module.css'

function Blog() {

    return (
        <>
            <h1>Our Blog</h1>
            <div className={styles.layout}>
                <Navigation posts={posts}/>
                <div>
                    {posts.map(post => (
                        <Card
                            key={post.id}
                            cardTitle={post.title}
                            cardIntro={post.text}
                            cardImage={post.image}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Blog